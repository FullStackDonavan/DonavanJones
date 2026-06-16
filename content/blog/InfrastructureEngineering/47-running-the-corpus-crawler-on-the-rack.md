---
title: "Running the Corpus Crawler on the Pi Rack: Jobs, Folder Flags, and Finding the Output"
description: "How a one-shot Kubernetes Job crawls reference URLs out of a text corpus on ARM64 hardware — the folder-flag system, the problems that come from treating a Job like a Deployment, and how to actually get the output files back."
date: 2026-08-11
lastUpdated: "2026-08-11"
category: "infrastructure-engineering"
tags:
  - k3s
  - kubernetes
  - batch-jobs
  - raspberry-pi
  - arm64
  - python
  - troubleshooting
draft: true
cluster: "infrastructure-engineering"
slug: running-the-corpus-crawler-on-the-rack
author: Donavan Jones
---

Not every workload on the rack is a long-running service. The corpus crawler is the opposite: a script that runs once, walks a directory tree of reference text files, follows every URL it finds out to two link-hops deep, writes what it learns to a JSONL file, and exits. This article covers how that crawler is packaged as a Kubernetes Job, the folder-flag system that controls what it crawls, the problems that come from treating a Job like a long-running Deployment, and the two ways to actually get the output back off the cluster.

# Running the Corpus Crawler on the Pi Rack

A practical guide to the corpus-crawl Kubernetes Job — folder selection, monitoring a one-shot batch task, and retrieving output from a PVC.

*Part of the [Infrastructure Engineering series](/categories/infrastructure-engineering).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every infrastructure engineering breakdown in this series."
destinationUrl: "/categories/infrastructure-engineering"
---
::

---

## What the Crawler Does

The corpus is a tree of plain-text and markdown reference material — Bible dictionaries, early Christian writings, historical sources, manuscript data, and more — organized into top-level folders:

```
corpus/
├── BibleDictionariesEncyclopedias/
├── ComparativeReligion/
├── EarlyChristianWritings/
├── HistoricalSources/
├── ManuscriptData/
├── MapsArchaeologyGeography/
├── OriginalLanguageResources/
├── PublicDomainCommentaries/
├── ScholarlySources/
└── _Crawler/
```

`crawl_corpus_urls.py` scans those folders for URLs, crawls each one up to a configurable depth, and writes every page it visits to a JSONL file alongside a JSON summary of what happened — counts of discovered, queued, visited, written, and skipped records. It's a single Python process, not a service: it has a defined start and a defined end.

That makes it a poor fit for a Deployment (which Kubernetes will restart forever to keep "always running") and a good fit for a Job (which runs to completion exactly once and stops).

---

## The Job Manifest

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: corpus-crawl
  namespace: bible-logic-ai
spec:
  backoffLimit: 0
  ttlSecondsAfterFinished: 86400
  template:
    spec:
      restartPolicy: Never
      nodeSelector:
        kubernetes.io/arch: arm64
      containers:
        - name: crawler
          image: bible-logic-ai/crawler-worker:arm64
          imagePullPolicy: IfNotPresent
          command:
            - python
            - crawl_corpus_urls.py
            - --scan-root
            - /app/corpus
            - --output-jsonl
            - /outputs/corpus_urls_crawl.jsonl
            - --output-summary-json
            - /outputs/corpus_urls_crawl_summary.json
            - --max-depth
            - "2"
            - --workers
            - "8"
            - --page-cap
            - "10000"
            - --request-delay
            - "0.4"
            - --BibleDictionariesEncyclopedias
            - --overwrite
          volumeMounts:
            - name: outputs
              mountPath: /outputs
      volumes:
        - name: outputs
          persistentVolumeClaim:
            claimName: corpus-crawl-output
```

Three settings matter more than they look:

- **`backoffLimit: 0`** — if the crawl fails, don't retry it. A half-written JSONL combined with `--overwrite` on the next attempt is worse than just looking at the failure and re-running deliberately.
- **`restartPolicy: Never`** — same intent at the pod level. A crashed crawler pod stays crashed and visible, instead of Kubernetes quietly cycling it.
- **`ttlSecondsAfterFinished: 86400`** — the Job object (and its pod) is automatically deleted 24 hours after it finishes, success or failure. This one caused the first real point of confusion.

Output goes to a 10Gi PVC (`corpus-crawl-output`) so the JSONL and summary survive after the pod that wrote them is gone.

---

## The Folder-Flag System

The script doesn't hardcode which folders are selectable. At startup it scans `--scan-root` for top-level directories and generates a `--<FolderName>` boolean flag for each one it finds:

```python
available_folders = list_top_level_folders(bootstrap.scan_root)
folder_flags = build_folder_flags(available_folders)

for flag in folder_flags:
    parser.add_argument(
        f"--{flag.option_name}",
        action="store_true",
        dest=flag.dest_name,
        help=f"Include only URLs discovered from folder '{flag.folder_name}'.",
    )
```

That means the available flags are whatever folders currently exist under `corpus/` — `--BibleDictionariesEncyclopedias`, `--HistoricalSources`, `--EarlyChristianWritings`, `--ScholarlySources`, and so on — and you can pass more than one to crawl several folders in a single run. Passing none crawls everything. There's also a `--list-folders` flag that prints the current set and exits, which is the fastest way to confirm what's selectable before editing the manifest.

Selecting a different folder means editing the `command` list directly in `corpus-crawl-job.yaml`, then redeploying:

```yaml
# before
- --EarlyChristianWritings
- --overwrite

# after
- --BibleDictionariesEncyclopedias
- --overwrite
```

---

## Problems We Hit

### "Job not found" didn't mean the crawl failed

Checking on the crawler a day after starting it returned:

```bash
$ sudo k3s kubectl get job -n bible-logic-ai corpus-crawl
Error from server (NotFound): jobs.batch "corpus-crawl" not found
$ sudo k3s kubectl get pods -n bible-logic-ai -l app=corpus-crawl -o wide
No resources found in bible-logic-ai namespace.
```

The instinctive read is "something deleted it" or "it crashed and got cleaned up." Neither was true — `ttlSecondsAfterFinished: 86400` means any Job that finished (success *or* failure) more than 24 hours ago is garbage-collected automatically, pod and all. The Job object disappearing is the *expected* outcome of a successful run that nobody checked on in time, not a failure signal.

The lesson: for a Job with a TTL, "not found" is ambiguous between "never ran," "still running but in a different namespace," and "finished successfully a while ago." The only way to tell those apart after the fact is to check whether the **output** exists on the PVC — the Job's own status won't tell you anymore.

### A stale IP from an earlier incident, baked into copy-paste commands

The runbook's `scp`/`ssh` examples pointed at `192.168.1.229` — the control plane's old IP from before [a prior IP change incident](/blog/recovering-after-control-plane-ip-change). The crawler's own `.env.example` had the same stale address in `REDIS_URL`. Both were silent failures waiting to happen: copy-pasting the documented command would simply hang or refuse a connection, with no indication that the fix was "the IP in the doc is wrong," because nothing about the symptom points at documentation.

Both were corrected to `192.168.1.219`. The broader takeaway: any runbook with a hardcoded node IP needs to be on the list of files to check whenever that IP changes — it won't surface itself as a cluster error, it'll surface as a confused human three weeks later wondering why `scp` won't connect.

### Re-targeting the crawl is a four-step manual loop

There's no way to swap which folder gets crawled without round-tripping through a local edit, an `scp`, and a remote `delete` + `apply`:

```bash
# 1. Edit corpus-crawl-job.yaml locally — change the folder flag
# 2. Copy it to the control plane
scp corpus-crawl-job.yaml donavan@192.168.1.219:~/corpus-crawl-job.yaml
# 3. Delete the previous Job (a Job's pod template is immutable — apply alone won't pick up a new command)
sudo k3s kubectl delete job -n bible-logic-ai corpus-crawl --ignore-not-found
# 4. Apply the new one
sudo k3s kubectl apply -f ~/corpus-crawl-job.yaml
```

Step 3 isn't optional. Unlike a Deployment, a Job's pod template can't be patched in place — `kubectl apply` on a Job whose spec changed will be rejected unless the old Job is deleted first. Forgetting the delete step is the most likely way to silently re-run the *previous* folder selection instead of the new one.

---

## Monitoring a One-Shot Job

A Job doesn't expose progress the way a long-running service's metrics might. There are three usable signals:

**Live logs**, while the pod still exists:

```bash
sudo k3s kubectl logs -n bible-logic-ai -f corpus-crawl-7ckf2
```

**Line count growth** in the output file, as a rough progress proxy:

```bash
sudo k3s kubectl exec -n bible-logic-ai corpus-crawl-7ckf2 -- wc -l /outputs/corpus_urls_crawl.jsonl
```

**Completion ratio**, the authoritative "is it done" check:

```bash
sudo k3s kubectl get job -n bible-logic-ai corpus-crawl -o jsonpath='{.status.succeeded}/{.spec.completions}'; echo
```

The pod name changes every time the Job is re-applied, so it has to be re-fetched after each redeploy:

```bash
sudo k3s kubectl get pod -n bible-logic-ai -l app=corpus-crawl -o jsonpath='{.items[0].metadata.name}'
```

---

## Getting the Output Back

Two paths exist, with different reliability tradeoffs.

### `kubectl cp`, while the pod is still alive

```bash
sudo k3s kubectl cp -n bible-logic-ai <POD_NAME>:/outputs/corpus_urls_crawl.jsonl /tmp/corpus_urls_crawl.jsonl
```

Simple, but it depends on `exec`/`tar` inside the pod, and the pod has to still exist. Once the Job's TTL expires and the pod is garbage-collected, this path is gone — which is exactly the scenario the "Job not found" problem above leads into if nobody copies the output in time.

### Reading the PVC's host path directly (preferred)

`local-path` PVCs are backed by an actual directory on a specific node's disk. Find it:

```bash
sudo k3s kubectl get pvc -n bible-logic-ai corpus-crawl-output -o jsonpath='{.spec.volumeName}'; echo
sudo k3s kubectl get pv <PV_NAME> -o yaml   # read spec.local.path and node affinity
```

The path follows a predictable pattern:

```
/var/lib/rancher/k3s/storage/pvc-<id>_bible-logic-ai_corpus-crawl-output
```

Once you have it, the files are just files — no running pod required, no TTL race:

```bash
sudo ls -lah /var/lib/rancher/k3s/storage/pvc-<id>_bible-logic-ai_corpus-crawl-output
sudo cp .../corpus_urls_crawl.jsonl /tmp/
sudo cp .../corpus_urls_crawl_summary.json /tmp/
sudo chown $USER:$USER /tmp/corpus_urls_crawl.jsonl /tmp/corpus_urls_crawl_summary.json
scp user@<worker-ip>:/tmp/corpus_urls_crawl.jsonl <local-destination>
```

This is the more durable path precisely because it survives the Job's lifecycle entirely — the PVC outlives the pod, and the pod is the only part of this with a 24-hour clock on it.

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
| `Job not found` / `No resources found` a day after starting it | `ttlSecondsAfterFinished` garbage-collected a finished Job | Check the PVC for output files instead of the Job status |
| `kubectl apply` rejected after editing folder flags | Job pod template is immutable once created | `kubectl delete job` before `kubectl apply` |
| `scp`/`ssh` to control plane hangs or refuses | Runbook or `.env.example` has a stale node IP from a past network change | Update the hardcoded IP in both docs and `.env.example` |
| `kubectl cp` fails on a finished pod | Pod already garbage-collected by the Job's TTL | Use the PVC host path instead |
| Summary JSON missing | Job still running — summary is only written on completion | Wait for `1/1` completions, then re-check |

::CtaContactWork
---
buttonText: "Let's Talk About Your Batch Workloads"
supportingCopy: "Running one-shot Jobs alongside long-running services on your own cluster? Let's talk through the gotchas."
destinationUrl: "/hire-me"
---
::

---

## Conclusion

A Kubernetes Job is the right shape for a script with a beginning and an end, but it behaves differently enough from a Deployment that the usual mental model — "if `kubectl get` doesn't find it, something's wrong" — actively misleads. The TTL that cleans up a finished Job is a feature, not a bug, but it means the output PVC, not the Job object, is the durable source of truth about whether a crawl happened and what it found. Combined with an immutable pod template that demands a delete-before-reapply dance for every folder change, the crawler is simple to run and easy to misread the status of — which is exactly why the output, not the Job, is what to check first.

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
  buttonText: "Read: K3s on Raspberry Pis"
  supportingCopy: "Start back at \"K3s on Raspberry Pis\" to revisit how this whole cluster — the one running this crawler — was built from the ground up."
  destinationUrl: "/blog/infrastructureengineering/01-k3s-on-raspberry-pis"
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
  - label: "Kubernetes Jobs — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Kubernetes"
    type: "wikipedia"
    description: "Overview of Kubernetes workload types, including the batch Job controller used here to run the crawler to completion exactly once rather than as an always-on Deployment."
  - label: "Web crawler — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Web_crawler"
    type: "wikipedia"
    description: "Overview of web crawling concepts — depth-limited traversal, URL discovery, and page caps — all directly reflected in this script's --max-depth and --page-cap arguments."
  - label: "Persistent storage — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Persistent_storage"
    type: "wikipedia"
    description: "Overview of persistent storage concepts — relevant to why the crawl output is written to a PVC rather than the pod's own filesystem, so it survives the Job's pod being garbage-collected."
  - label: "JSON Lines — Wikipedia"
    url: "https://en.wikipedia.org/wiki/JSON_streaming"
    type: "wikipedia"
    description: "Overview of JSON Lines (JSONL) streaming formats, the line-delimited output format the crawler writes one record per visited page to."
---
::

---

*[← Back to Infrastructure Engineering series](/categories/infrastructure-engineering)*
