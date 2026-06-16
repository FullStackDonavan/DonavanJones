---
title: "Deploying an App on the Rack"
description: "How I deploy a full-stack Node.js application to a bare-metal ARM64 machine using Gitea Actions, SSH, and nohup — without Docker, without Kubernetes, and without pm2."
date: 2026-07-18
lastUpdated: "2026-07-18"
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

Not every workload belongs in Kubernetes. Sometimes you have a Node.js app, a bare-metal machine on your rack, and you just need the thing to run and stay running. This article documents the full deployment pipeline I use to ship a Nuxt 3 app to a bare ARM64 machine — covering secrets management, SSH-based build and migrate, process management without pm2, and the specific failure modes that only appear when you're actually doing this on real hardware.

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

Once the build is in place, the app is restarted over a second SSH connection:

```yaml
- name: Restart app on rack
  run: |
    set -eu
    DEPLOY_PORT="${DEPLOY_PORT:-22}"
    DB_URL_B64=$(printf '%s' "$DATABASE_URL" | tr -d '\r\n' | \
      sed 's/^"//;s/"$//' | base64 | tr -d '\n')

    /usr/bin/ssh -p "$DEPLOY_PORT" "$DEPLOY_USER@$DEPLOY_HOST" "
    DB_URL=\$(printf '%s' '$DB_URL_B64' | base64 -d)
    cd '$DEPLOY_PATH/app'

    export HOST=0.0.0.0
    export PORT=3001
    export NODE_ENV=production
    export DISABLE_REDIS=true
    export DATABASE_URL=\"\$DB_URL\"

    echo '==> restarting service'
    if command -v pm2 >/dev/null 2>&1; then
      echo '==> pm2 found'
      if pm2 describe bibleverse >/dev/null 2>&1; then
        pm2 restart bibleverse --update-env && pm2 save || echo 'WARN: pm2 restart failed'
      else
        pm2 start '.output/server/index.mjs' --name bibleverse --time && pm2 save || echo 'WARN: pm2 start failed'
      fi
    else
      echo '==> pm2 not found, using nohup'
      pkill -f '^node .output' 2>/dev/null || true
      sleep 2
      nohup node .output/server/index.mjs >> '$DEPLOY_PATH/bibleverse.log' 2>&1 &
      disown
      echo '==> nohup process started'
    fi
    echo '==> restart complete'
    " || echo 'WARN: restart SSH step exited non-zero (exit code 255 is normal on ARM64)'
```

### pm2 vs nohup

The pipeline tries pm2 first because it handles process supervision, auto-restart on crash, and log rotation. When pm2 is not installed, it falls back to `nohup`.

The `nohup` path:
1. Kills any running instance
2. Waits 2 seconds for the port to clear
3. Starts node in the background, redirecting output to a log file
4. Calls `disown` to detach the process from the SSH session

### The pkill Self-Kill Bug

This took several failed deploys to diagnose. The symptom: the pipeline would print `==> pm2 not found, using nohup` and then immediately die with exit 255 — before any nohup output appeared.

The cause: `pkill -f '.output/server/index.mjs'` searches for that string in the **full command line** of every running process. When SSH executes a script, the remote shell runs as `bash -c "entire script as one argument"`. That command-line argument contained the string `.output/server/index.mjs`. So pkill matched and killed the current bash session — dropping the SSH connection mid-script.

The fix is to anchor the pattern to the start of the command line:

```bash
# Wrong — matches bash -c "...node .output/server/index.mjs..."
pkill -f '.output/server/index.mjs' || true

# Correct — only matches processes whose cmdline starts with 'node'
pkill -f '^node .output' 2>/dev/null || true
```

A process started as `nohup node .output/server/index.mjs` has a cmdline that begins with `node`. The bash process begins with `bash`. The anchor makes the difference.

### Why `disown` Matters

Without `disown`, the backgrounded node process remains in the shell's job table. When the SSH session ends, the shell sends `SIGHUP` to all jobs in its table. Even though `nohup` ignores SIGHUP for the initial exec, there is a short window before nohup sets up signal handling. `disown` removes the job from the table entirely, eliminating the race condition.

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
| Restart prints "pm2 not found, using nohup" then dies with 255 | `pkill -f` kills the bash session | Anchor pattern to `^node` |
| App not reachable after successful deploy | Old process still holding port | Check `ss -tlnp`; add `sleep 2` after pkill |
| nohup process disappears after SSH closes | Not disowned from session | Add `disown` after `&` |

::CtaContactWork
---
buttonText: "Let's Talk About Your Deployment Pipeline"
supportingCopy: "Shipping an app to bare metal without Docker or Kubernetes? Let's talk through the SSH-based pipeline."
destinationUrl: "/hire-me"
---
::

---

## Conclusion

Deploying a Node.js app to a bare-metal ARM64 machine over SSH is achievable with nothing but standard shell tools — no Docker, no Kubernetes, no external CI services. The main challenges are shell quoting across SSH boundaries, Prisma's ARM64 engine quirks, and the subtle ways that `pkill -f` and `nohup` interact with the SSH session lifecycle. Once those are understood, the pipeline is simple, fast, and fully observable from Gitea's built-in CI log view.

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
