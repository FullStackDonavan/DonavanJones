---
title: "Deploying an App on the Rack"
description: "How I deploy a full-stack Node.js application to a bare-metal ARM64 machine using Gitea Actions, SSH, and systemd — without Docker, without Kubernetes, and without pm2."
date: 2026-07-18
lastUpdated: "2026-06-19"
category: "infrastructure-engineering"
tags:
  - gitea
  - ci-cd
  - arm64
  - raspberry-pi
  - deployment
  - nodejs
  - ssh
draft: true
cluster: "infrastructure-engineering"
slug: deploying-an-app-on-the-rack
author: Donavan Jones
---

Not every workload belongs in Kubernetes. Sometimes you have a Node.js app, a bare-metal machine on your rack, and you just need the thing to run and stay running. This article documents the full deployment pipeline I use to ship a Nuxt 3 app to a bare ARM64 machine — covering secrets management, SSH-based build and migrate, systemd process management, and the specific failure modes that only appear when you're actually doing this on real hardware (including a glibc malloc corruption bug on ARM64 that took several hours to diagnose).

# Deploying an App on the Rack

A practical guide to CI/CD deployment over SSH to a bare-metal ARM64 machine using Gitea Actions.

*Part of the [Infrastructure Engineering series](/categories/infrastructure-engineering).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every infrastructure engineering breakdown in this series."
destinationUrl: "/categories/infrastructure-engineering"
---
::

---

## Why Not Kubernetes for This?

Most of my workloads run in K3s, but some apps have reasons to sit outside the cluster:

- **Database URL complexity** — apps with direct PostgreSQL connections are easier to manage when you control the environment directly
- **Build size** — a Nuxt app with a full `node_modules` tree doesn't need to be containerized to be deployed
- **Iteration speed** — SSH deploy is faster to debug than a container build + push + rolling update cycle
- **ARM64 quirks** — some npm packages and Prisma's query engine have known issues with the ARM64 container environment that disappear on bare metal

The rack machine in question is an ARM64 node that sits outside the K3s cluster. It handles a single app: a Bible verse reference application built on Nuxt 3, Prisma, and PostgreSQL.

---

## Pre-Deploy: Provisioning with Kingdom Tools

Before the pipeline touches the rack, the app needs its own isolated data resources — a dedicated PostgreSQL database, a MinIO bucket for file storage, and optionally a Redis database slot and a Weaviate collection for vector search. Rather than SSH-ing into the cluster and running `CREATE DATABASE` and `mc mb` by hand, I use Kingdom Tools — a management dashboard that runs inside the K3s cluster at `http://192.168.1.219:30800`.

### Quick Provision

Navigate to the **Provision** page in Kingdom Tools and enter the service name. For a service called `bibleverse`, checking all four boxes creates:

| Resource | Name Created | Connection |
|---|---|---|
| PostgreSQL database | `bibleverse` | `postgresql://dev:devpass@postgres.postgres.svc.cluster.local:5432/bibleverse` |
| MinIO bucket | `bibleverse` | `minio-service.minio.svc.cluster.local:9000` |
| Redis database | Next available slot (db1–15) | `redis://redis.redis.svc.cluster.local:6379/1` |
| Weaviate collection | `Bibleverse` | `http://weaviate.weaviate.svc.cluster.local:8080` |

One click, four isolated resources. Each new service gets its own database, its own bucket, its own Redis keyspace, and its own vector collection — no data leaks between services.

### Managing Resources After Provisioning

Kingdom Tools also lets you manage these resources after creation:

- **Databases** page — view all PostgreSQL databases, their sizes, create new ones, or drop ones you no longer need (core databases like `devdb` and `postgres` are protected)
- **Storage** page — browse MinIO buckets, see object counts and sizes, create or delete buckets, and browse individual objects inside a bucket
- **Redis** page — view all 16 Redis database slots with key counts, browse keys in any slot, and flush non-primary databases
- **Weaviate** page — list collections with property schemas and object counts, create or delete collections, and browse stored objects

For bare-metal deploys like this one, the app connects to these resources via the cluster's NodePorts from outside K3s. The `DATABASE_URL` in the pipeline secrets points to `192.168.1.219:30432`, MinIO is reachable at `192.168.1.219:30900`, and Redis at `192.168.1.219:32379`.

---

## Pipeline Overview

The deploy pipeline has five stages, all defined in a single Gitea Actions workflow:

```
Push to main
    │
    ├── Validate secrets
    ├── Package source (tar)
    ├── Upload package via SCP
    ├── Build + migrate on rack (SSH)
    └── Restart app on rack (SSH)
```

Every stage runs on a `linux-arm64` Gitea runner inside the cluster. The runner connects to the rack machine over SSH.

---

## Stage 1: Validate Secrets

Before doing any work, the pipeline confirms that every required secret is present:

```yaml
- name: Validate deploy secrets
  env:
    DEPLOY_SSH_KEY: ${{ secrets.DEPLOY_SSH_KEY }}
    DEPLOY_HOST: ${{ secrets.DEPLOY_HOST }}
    DEPLOY_USER: ${{ secrets.DEPLOY_USER }}
    DEPLOY_PATH: ${{ secrets.DEPLOY_PATH }}
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
  run: |
    set -eu
    test -n "$DEPLOY_SSH_KEY" || { echo "Missing secret: DEPLOY_SSH_KEY"; exit 1; }
    test -n "$DEPLOY_HOST"    || { echo "Missing secret: DEPLOY_HOST"; exit 1; }
    test -n "$DEPLOY_USER"    || { echo "Missing secret: DEPLOY_USER"; exit 1; }
    test -n "$DEPLOY_PATH"    || { echo "Missing secret: DEPLOY_PATH"; exit 1; }
    test -n "$DATABASE_URL"   || { echo "Missing secret: DATABASE_URL"; exit 1; }
```

Failing early on missing secrets saves time — without this, the pipeline would SSH into the machine and silently use empty environment variables, producing confusing errors deep in the build.

---

## Stage 2: Package Source

The entire repository is packed into a tarball, excluding things the rack doesn't need:

```yaml
- name: Package source
  run: |
    tar \
      --exclude='.git' \
      --exclude='node_modules' \
      --exclude='.nuxt' \
      --exclude='.output' \
      -czf deploy.tar.gz .
```

Excluding `node_modules` and `.output` keeps the tarball small. The rack installs its own dependencies and runs its own build, which is necessary anyway because Prisma generates ARM64-specific binaries.

---

## Stage 3: Configure SSH and Upload

The SSH private key is written from the Gitea secret, then `scp` transfers the tarball:

```yaml
- name: Configure SSH key
  run: |
    /sbin/apk add --no-cache openssh-client
    mkdir -p ~/.ssh
    printf '%s\n' "$DEPLOY_SSH_KEY" > ~/.ssh/id_rsa
    chmod 600 ~/.ssh/id_rsa
    printf 'StrictHostKeyChecking no\nUserKnownHostsFile /dev/null\n' > ~/.ssh/config
    chmod 600 ~/.ssh/config

- name: Upload package to rack
  run: |
    set -eu
    DEPLOY_PORT="${DEPLOY_PORT:-22}"
    /usr/bin/scp -P "$DEPLOY_PORT" deploy.tar.gz \
      "$DEPLOY_USER@$DEPLOY_HOST:/tmp/bibleverse-deploy.tar.gz"
```

`StrictHostKeyChecking no` is acceptable here because the rack is on the private LAN and the SSH key itself is the authentication factor.

---

## Stage 4: Build and Migrate on Rack

This is the heaviest stage. The pipeline SSHes into the rack and runs the full build:

```yaml
- name: Build and migrate on rack
  run: |
    set -eu
    DEPLOY_PORT="${DEPLOY_PORT:-22}"
    DB_URL_B64=$(printf '%s' "$DATABASE_URL" | tr -d '\r\n' | \
      sed 's/^"//;s/"$//' | base64 | tr -d '\n')

    /usr/bin/ssh -p "$DEPLOY_PORT" "$DEPLOY_USER@$DEPLOY_HOST" "
    set -eu
    DB_URL=\$(printf '%s' '$DB_URL_B64' | base64 -d)

    echo '==> extracting source'
    mkdir -p '$DEPLOY_PATH'
    tar -xzf /tmp/bibleverse-deploy.tar.gz -C '$DEPLOY_PATH' --strip-components=1
    rm -f /tmp/bibleverse-deploy.tar.gz

    echo '==> installing dependencies'
    cd '$DEPLOY_PATH/app'
    npm install --no-audit --no-fund

    echo '==> building'
    export HOST=0.0.0.0
    export PORT=3001
    export NODE_ENV=production
    export DISABLE_REDIS=true
    export DATABASE_URL=\"\$DB_URL\"
    npm run build

    echo '==> migrating'
    npx prisma migrate deploy || echo 'WARN: prisma exited non-zero - ARM64 engine exit bug, migrations were applied'
    echo '==> build and migrate complete'
    "
```

### The DATABASE_URL Encoding Problem

`DATABASE_URL` contains special characters (`:`, `@`, `/`, `?`, `=`) that break shell quoting when embedded directly in an SSH command string. The fix is base64:

1. **Runner side**: encode the URL to base64 before injecting it into the SSH string
2. **Remote side**: decode it with `base64 -d` before using it

```bash
# Runner — encode once
DB_URL_B64=$(printf '%s' "$DATABASE_URL" | tr -d '\r\n' | base64 | tr -d '\n')

# Remote — decode and use
DB_URL=$(printf '%s' 'BASE64VALUE' | base64 -d)
export DATABASE_URL="$DB_URL"
```

The `tr -d '\r\n'` strips any carriage returns or newlines that Gitea might inject into secrets stored on Windows-adjacent systems.

### The Prisma ARM64 Exit 255 Bug

Prisma's query engine binary for ARM64 has a known behavior where `prisma migrate deploy` exits with code 255 even when migrations applied successfully. The pipeline tolerates this explicitly:

```bash
npx prisma migrate deploy || echo 'WARN: prisma exited non-zero - ARM64 engine exit bug, migrations were applied'
```

This was the first in a series of `exit 255` surprises this deployment surfaced.

---

## Stage 5: Restart App on Rack

Once the build is in place, the pipeline generates a systemd unit file and restarts the service:

```yaml
- name: Restart app on rack
  run: |
    set -eu
    DEPLOY_PORT="${DEPLOY_PORT:-22}"
    DB_URL_B64=$(printf '%s' "$DATABASE_URL" | tr -d '\r\n' | \
      sed 's/^"//;s/"$//' | base64 | tr -d '\n')

    # Build the systemd service file on the runner
    SVC_B64=$(printf '%s\n' \
      '[Unit]' \
      'Description=BibleVerse App' \
      'After=network.target' \
      '' \
      '[Service]' \
      'Type=simple' \
      "User=${DEPLOY_USER}" \
      "WorkingDirectory=${DEPLOY_PATH}/app" \
      "EnvironmentFile=${DEPLOY_PATH}/.env.production" \
      'Environment=HOST=0.0.0.0' \
      'Environment=PORT=3001' \
      'Environment=NODE_ENV=production' \
      'Environment=REDIS_HOST=192.168.1.104' \
      'Environment=REDIS_PORT=32379' \
      'Environment=LD_PRELOAD=/usr/lib/aarch64-linux-gnu/libjemalloc.so.2' \
      'Environment=MALLOC_CHECK_=0' \
      'ExecStart=__NODEPATH__ .output/server/index.mjs' \
      'Restart=always' \
      'RestartSec=5' \
      "StandardOutput=append:${DEPLOY_PATH}/bibleverse.log" \
      "StandardError=append:${DEPLOY_PATH}/bibleverse.log" \
      '' \
      '[Install]' \
      'WantedBy=multi-user.target' \
      | base64 | tr -d '\n')

    /usr/bin/ssh -p "$DEPLOY_PORT" "$DEPLOY_USER@$DEPLOY_HOST" "
    DB_URL=\$(printf '%s' '$DB_URL_B64' | base64 -d)

    echo '==> writing env file'
    printf 'DATABASE_URL=%s\n...' \"\$DB_URL\" > '$DEPLOY_PATH/.env.production'
    chmod 600 '$DEPLOY_PATH/.env.production'

    echo '==> writing systemd service'
    NODE_BIN=\$(which node)
    printf '%s' '$SVC_B64' | base64 -d | \
      sed \"s|__NODEPATH__|\$NODE_BIN|\" | \
      sudo tee /etc/systemd/system/bibleverse.service > /dev/null

    echo '==> enabling and restarting service'
    sudo systemctl daemon-reload
    sudo systemctl enable bibleverse
    sudo systemctl restart bibleverse
    sudo systemctl status bibleverse --no-pager || true
    echo '==> restart complete'
    " || echo 'WARN: restart SSH step exited non-zero'
```

### Why systemd Instead of nohup or pm2

Earlier versions of this pipeline used `nohup` with `disown`, which had several problems:

- **No automatic restart** — if the process crashed, it stayed down until the next deploy
- **The pkill self-kill bug** — `pkill -f '.output/server/index.mjs'` would match the bash SSH session itself, killing the deploy mid-script (the fix was anchoring to `^node .output`, but the fragility remained)
- **Signal race condition** — without `disown`, the SSH session's SIGHUP could kill the backgrounded process before nohup set up signal handling

systemd solves all of these:

- `Restart=always` with `RestartSec=5` restarts the app automatically on any crash
- No `pkill` gymnastics — `systemctl restart` handles the process lifecycle cleanly
- Logs go to a file via `StandardOutput=append:` and are also available through `journalctl -u bibleverse`
- The service persists across reboots via `systemctl enable`

### The Node Binary Path Problem

The systemd unit file needs the absolute path to `node` in `ExecStart`. This varies between machines (`/usr/bin/node`, `/usr/local/bin/node`, etc.), so the pipeline uses a placeholder:

```
ExecStart=__NODEPATH__ .output/server/index.mjs
```

On the remote machine, `which node` resolves the actual path, and `sed` substitutes it in before writing the service file.

### The EnvironmentFile Pattern

Secrets like `DATABASE_URL` go into `.env.production` rather than being hardcoded in the service file. This keeps credentials out of the systemd unit (which is world-readable under `/etc/systemd/system/`) and into a `chmod 600` file owned by the deploy user.

---

## The ARM64 glibc Malloc Crash

After upgrading the rack machine to Debian Trixie (Debian 13), the app started crashing after every request with errors like:

```
malloc(): unaligned tcache chunk detected
free(): double free detected in tcache 2
malloc(): corrupted unsorted chunks 2
```

The app would serve the request successfully — chat responses streamed, messages saved to the database — and then the Node.js process would abort during cleanup. systemd would restart it in 5 seconds, but any request hitting the server during that window got a 502 from Cloudflare.

### Why It Happens

Debian Trixie ships glibc 2.38+, which introduced stricter malloc alignment checks. Native Node.js addons compiled against older glibc versions (particularly Prisma's query engine, which is a prebuilt Rust binary) trigger these checks and cause the process to abort.

The crash is not a bug in application code. It's a compatibility issue between prebuilt ARM64 binaries and the newer glibc's stricter heap corruption detection.

### What Didn't Work

- **`npm rebuild --build-from-source`** — rebuilt bcrypt and other native modules, but Prisma's query engine is a prebuilt binary that can't be recompiled from source via npm
- **`GLIBC_TUNABLES=glibc.malloc.tcache_count=0`** — disabled tcache but the crashes shifted to other allocator paths (`double free or corruption (fasttop)`)
- **`LD_PRELOAD=libjemalloc.so.2`** — jemalloc loaded successfully and handled most allocations, but Prisma's Rust engine has glibc statically linked internally, so jemalloc couldn't intercept its malloc calls

### What Fixed It

The combination of jemalloc (to handle the majority of allocations safely) and `MALLOC_CHECK_=0` (to tell glibc to silently ignore corruption in the remaining allocations from statically-linked native modules):

```ini
[Service]
Environment=LD_PRELOAD=/usr/lib/aarch64-linux-gnu/libjemalloc.so.2
Environment=MALLOC_CHECK_=0
```

Install jemalloc on the rack machine:

```bash
sudo apt-get install -y libjemalloc2
```

These environment variables are baked into the systemd service file that the deploy pipeline generates, so they persist across deploys.

### The Proper Fix

Upgrading to Node.js 22 LTS and updating Prisma to the latest version should resolve the underlying binary compatibility issue, making the jemalloc workaround unnecessary. This is planned but not yet deployed.

---

## Checking the App

Once the deploy completes, the app listens on port 3001. From any machine on the LAN:

```
http://<DEPLOY_HOST>:3001
```

To confirm it's running from the rack itself:

```bash
ss -tlnp | grep 3001
```

Logs are written to `$DEPLOY_PATH/bibleverse.log` and can be tailed over SSH:

```bash
ssh user@host "tail -f /path/to/bibleverse.log"
```

::CtaSystemArchitecture
---
buttonText: "See The Full System"
supportingCopy: "See how this fits into the production infrastructure it was built for."
destinationUrl: "/systems/infrastructure"
---
::

---

## Failure Modes Reference

| Symptom | Cause | Fix |
|---|---|---|
| Step fails immediately, no SSH output | Missing secret, SSH key invalid | Check Gitea secrets; verify key format |
| Build succeeds, migrate exits 255 | Prisma ARM64 engine bug | Tolerate with `\|\| echo WARN` |
| `malloc(): unaligned tcache chunk detected` after every request | Debian Trixie glibc 2.38+ vs prebuilt ARM64 native modules | `LD_PRELOAD=libjemalloc.so.2` + `MALLOC_CHECK_=0` in systemd |
| App crashes but data is saved | malloc abort happens during cleanup, after response sent | systemd `Restart=always` masks it; jemalloc fix prevents it |
| 502 from Cloudflare intermittently | App process restarting (5s window) | Fix the crash; or reduce `RestartSec` to `1` |
| CI runner fails with "Cannot find: node in PATH" | Runner image missing Node.js; `apk add` failed at startup | Bake Node.js into a custom runner image |
| `ExecStart` fails with "node: not found" | Hardcoded node path doesn't match target machine | Use `which node` + `sed` placeholder substitution |

::CtaContactWork
---
buttonText: "Let's Talk About Your Deployment Pipeline"
supportingCopy: "Shipping an app to bare metal without Docker or Kubernetes? Let's talk through the SSH-based pipeline."
destinationUrl: "/hire-me"
---
::

---

## Conclusion

Deploying a Node.js app to a bare-metal ARM64 machine over SSH is achievable with nothing but standard shell tools — no Docker, no Kubernetes, no external CI services. The main challenges are shell quoting across SSH boundaries, Prisma's ARM64 engine quirks, and the glibc compatibility issues that surface when running prebuilt native binaries on newer Debian releases. systemd handles process supervision cleanly, and the jemalloc + `MALLOC_CHECK_=0` workaround keeps the app stable until the underlying binary compatibility is resolved upstream. Once those are understood, the pipeline is simple, fast, and fully observable from Gitea's built-in CI log view.

::CtaCardRow
  :::CtaDownloadGuide
  ---
  buttonText: "Get The Pi Cluster Blueprint"
  supportingCopy: "Get the Raspberry Pi AI Cluster Blueprint — hardware list, network diagram, node roles, folder structures, Kubernetes manifests, and a troubleshooting checklist ($19)."
  destinationUrl: "/products/raspberry-pi-ai-cluster-blueprint"
  ---
  :::

  :::CtaRelatedArticle
  ---
  buttonText: "Read: How One Node Label Broke Every LoadBalancer Service in My K3s Cluster"
  supportingCopy: "Continue with this incident report to see how a single node label took down every LoadBalancer service in the same cluster."
  destinationUrl: "/blog/infrastructureengineering/46-servicelb-node-label-broke-loadbalancers"
  ---
  :::

  :::CtaNewsletter
  ---
  buttonText: "Get New Posts By Email"
  supportingCopy: "Get new infrastructure engineering breakdowns delivered before they're public."
  ---
  :::
::

---

## Further Reading

::AuthoritativeLinks
---
title: "Sources"
links:
  - label: "Nohup — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Nohup"
    type: "wikipedia"
    description: "Overview of nohup, the Unix utility used here to keep the Node.js server running after the SSH session that started it closes."
  - label: "Secure Shell — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Secure_Shell"
    type: "wikipedia"
    description: "Overview of SSH, the protocol used throughout this pipeline for remote command execution, file transfer via SCP, and secure secret delivery."
  - label: "Continuous Delivery — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Continuous_delivery"
    type: "wikipedia"
    description: "Overview of continuous delivery — the practice this pipeline implements, enabling every push to main to automatically build, migrate, and restart the production app."
  - label: "CI/CD — Wikipedia"
    url: "https://en.wikipedia.org/wiki/CI/CD"
    type: "wikipedia"
    description: "Overview of CI/CD automation — the workflow pattern behind the Gitea Actions pipeline described in this article."
---
::

---

*[← Back to Infrastructure Engineering series](/categories/infrastructure-engineering)*
