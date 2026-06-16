---
title: "How One Node Label Broke Every LoadBalancer Service in My K3s Cluster"
description: "A single node label, meant to exclude one desktop from load-balancer duty, flipped K3s's ServiceLB selector cluster-wide — silently killing the external IP for every LoadBalancer service and taking down audio and image generation on the live site."
date: 2026-07-28
lastUpdated: "2026-07-28"
category: "infrastructure-engineering"
tags:
  - k3s
  - kubernetes
  - servicelb
  - networking
  - troubleshooting
  - raspberry-pi
  - arm64
draft: true
cluster: "infrastructure-engineering"
slug: servicelb-node-label-broke-loadbalancers
author: Donavan Jones
---

A cluster can look completely healthy — every pod Running, zero restarts, CPU and memory nominal — and still be unreachable from the outside world. This article documents an incident where exactly that happened: a routine attempt to keep one desktop node out of load-balancer rotation quietly reconfigured K3s's ServiceLB controller for the *entire* cluster, deleting every `svclb-*` pod and taking the external IP out from under nine LoadBalancer services at once.

# How One Node Label Broke Every LoadBalancer Service in My K3s Cluster

A diagnosis of K3s's ServiceLB (klipper-lb) selector behavior, and why an "exclude this node" label can become an "include only this node" requirement.

*Part of the [Infrastructure Engineering series](/categories/infrastructure-engineering).*

---

## The Setup

This started as ordinary cluster maintenance. A handful of proxy services — `theologian`, `dreamer`, `voice-proxy`, and `scholar` — sit in front of AI models hosted on a separate RTX 3090 machine, and they had been restarting far too often. The root cause turned out to be a liveness probe design problem: each proxy's `/health` endpoint made a live network call to the GPU machine, and the liveness probe was hitting `/health` directly. Any time the backend was slow, the liveness probe itself would time out, Kubernetes would SIGTERM the pod, and a perfectly healthy proxy process would restart for no reason other than a slow upstream.

The fix was to add a dedicated `/live` endpoint to each service that does nothing but return `{"status": "ok"}` — no backend call, no dependency:

```python
@app.get("/live")
async def liveness():
    return {"status": "ok"}
```

Liveness probes were repointed at `/live`, and readiness probes (which *should* check backend health) got more realistic timeouts. After rebuilding the ARM64 images, importing them onto every candidate node (these deployments use `imagePullPolicy: Never`, so a `kubectl apply` alone never updates the running image), and rolling the four deployments, restart counts dropped to zero. The cluster looked healthy.

Then the live site's audio and image generation started failing with `503` and `fetch failed` errors — features that had just been confirmed working minutes earlier.

---

## The Misdirection

The natural first guess was that this was the *correct* new behavior: the proxies now return a clean `503` when the RTX 3090 backend is unreachable, instead of crash-looping. But the GPU machine was confirmed on, with its model containers expected to be running, which ruled that out.

Next came a layer-by-layer connectivity check:

```bash
# Raw TCP from the control plane to the GPU machine — succeeded
nc -zv 192.168.1.125 8014
nc -zv 192.168.1.125 8880

# Application-layer check from inside the actual pod
kubectl exec -n default deploy/voice-proxy -- \
  python3 -c "import httpx; r = httpx.get('http://192.168.1.125:8880/health', timeout=5); print(r.status_code, r.text)"
# 200 {"status":"healthy"}
```

`curl` wasn't installed in the proxy's image, so the Python/httpx one-liner stood in for it. Both checks passed: the pod could reach its backend just fine. That ruled out everything on the *egress* side — pod-to-GPU connectivity was never the problem.

The actual error from the browser console was the giveaway, once read carefully:

```
Error: TTS service is unavailable. Tried: http://192.168.1.219:8021/tts.
Please verify TTS_SERVICE_URL and restart the Nuxt server.
```

That message is synthesized by the Nuxt server itself when it cannot open a connection *at all* — not a `503` from the proxy, a connection refusal at `192.168.1.219:8021`. That's the cluster's external IP, not the pod's internal address. The failure was on the *ingress* side: something between the outside world and the proxy pod, not between the proxy pod and the GPU machine. Two completely different layers, and the one we'd verified was the wrong one.

---

## Finding the Real Failure

`192.168.1.219:8021` is served by K3s's ServiceLB (`klipper-lb`), which works by running a small `svclb-*` DaemonSet pod per LoadBalancer-type Service on every eligible node. Those pods listen on the Service's port and forward traffic into the cluster. Checking for them directly:

```bash
kubectl get pods -n kube-system | grep svclb
```

Returned nothing. Not "fewer than expected" — zero. Across the entire cluster, every `svclb-*` pod for every LoadBalancer service was gone, including ones that had nothing to do with the proxy redeploy:

```bash
kubectl get svc -A | grep LoadBalancer
```

```
default       dreamer              LoadBalancer   10.43.134.120   <pending>
default       librarian            LoadBalancer   10.43.230.49    192.168.1.104,192.168.1.219,192.168.1.250,192.168.1.55
default       logos-orchestrator   LoadBalancer   10.43.210.245   192.168.1.104,192.168.1.219,192.168.1.250,192.168.1.55
default       scholar              LoadBalancer   10.43.251.31    <pending>
default       scribe               LoadBalancer   10.43.26.89     192.168.1.104,192.168.1.219,192.168.1.250,192.168.1.55
default       theologian           LoadBalancer   10.43.80.2      <pending>
default       scribe               LoadBalancer   10.43.26.89     192.168.1.104,192.168.1.219,192.168.1.250,192.168.1.55
default       voice-service        LoadBalancer   10.43.149.110   <pending>
default       watchman             LoadBalancer   10.43.23.138    192.168.1.219,192.168.1.250,192.168.1.55
kube-system   traefik              LoadBalancer   10.43.240.150   192.168.1.104,192.168.1.219,192.168.1.250,192.168.1.55
```

Exactly the four services we had just redeployed (`dreamer`, `scholar`, `theologian`, `voice-service`) showed `<pending>` — no external IP at all. The five we hadn't touched still *displayed* IPs, but with zero svclb pods running anywhere, those were stale status left over from before the controller stopped provisioning anything. None of the nine were actually reachable; the four we'd touched were just honest about it.

The DaemonSets told the real story:

```bash
kubectl get daemonset -n kube-system
```

```
NAME                                DESIRED   CURRENT   READY   NODE SELECTOR
svclb-dreamer-84dc4511              0         0         0       svccontroller.k3s.cattle.io/enablelb=true
svclb-librarian-62d7aba5            0         0         0       svccontroller.k3s.cattle.io/enablelb=true
svclb-logos-orchestrator-a6e3f478   0         0         0       svccontroller.k3s.cattle.io/enablelb=true
svclb-scholar-87e48c51              0         0         0       svccontroller.k3s.cattle.io/enablelb=true
svclb-scribe-881d9fea               0         0         0       svccontroller.k3s.cattle.io/enablelb=true
svclb-theologian-5df61ec2           0         0         0       svccontroller.k3s.cattle.io/enablelb=true
svclb-traefik-6f83a4ac              0         0         0       svccontroller.k3s.cattle.io/enablelb=true
svclb-voice-service-a033eded        0         0         0       svccontroller.k3s.cattle.io/enablelb=true
svclb-watchman-9d8f531a             0         0         0       svccontroller.k3s.cattle.io/enablelb=true
```

`DESIRED: 0` on every single DaemonSet. k3s itself was healthy — `systemctl status k3s` showed it active and running for nearly two weeks straight, no crash, no restart. This wasn't k3s being broken. It was K3s's node selector matching nothing.

---

## The Root Cause

A few days earlier, during an unrelated cleanup, one desktop machine (`charlie-desktop`) had been excluded from load-balancer duty with:

```bash
kubectl label node charlie-desktop svccontroller.k3s.cattle.io/enablelb=false
```

The intent was narrow: stop K3s from scheduling `svclb-*` pods onto that one machine. By default, K3s's ServiceLB controller treats every node as LB-eligible *unless* it's explicitly labeled `enablelb=false` — it's an exclusion list, not an allow list.

But once a node carried that label at all, the controller's generated DaemonSets stopped using an exclusion-style selector and started requiring the label to be explicitly present and set to `true`:

```
svccontroller.k3s.cattle.io/enablelb=true
```

No node in the cluster had ever been labeled `true` — there had never been a reason to, since the default behavior covered every node automatically. The moment that selector flipped from "not false" to "is true," it stopped matching anything. Every `svclb-*` DaemonSet dropped to zero desired pods, on every node, for every LoadBalancer service in the cluster — not just the one node we'd meant to exclude.

The four services that showed `<pending>` rather than a stale IP were simply the ones whose Service object had been re-applied recently enough for the controller to notice the DaemonSet had nothing to back it and clear the status. The other five were running on borrowed time; their listed IPs hadn't been live for days.

---

## The Fix

Once the mechanism was clear, the fix was a single label change per node — explicitly opting the desired nodes in, rather than relying on the implicit default:

```bash
kubectl label node pi-node1 svccontroller.k3s.cattle.io/enablelb=true
kubectl label node pi-node-redis svccontroller.k3s.cattle.io/enablelb=true
kubectl label node pi-worker-3 svccontroller.k3s.cattle.io/enablelb=true
kubectl label node raspberrypi svccontroller.k3s.cattle.io/enablelb=true
```

`charlie-desktop` keeps its existing `enablelb=false` label and stays excluded, exactly as originally intended. Within seconds, every `svclb-*` DaemonSet picked back up:

```bash
kubectl get daemonset -n kube-system
```

```
NAME                                DESIRED   CURRENT   READY
svclb-dreamer-84dc4511              4         4         4
svclb-librarian-62d7aba5            4         4         4
svclb-logos-orchestrator-a6e3f478   4         4         4
svclb-scholar-87e48c51              4         4         4
svclb-scribe-881d9fea               4         4         4
svclb-theologian-5df61ec2           4         4         4
svclb-traefik-6f83a4ac              4         4         4
svclb-voice-service-a033eded        4         4         4
svclb-watchman-9d8f531a             4         4         4
```

Four nodes, four ready pods per service, across the board. External IPs reassigned themselves automatically, `192.168.1.219:8021` started accepting connections again, and audio and image generation on the live site recovered without touching a single application deployment.

---

## Key Lessons

**K3s's ServiceLB selector is not a stable exclusion list — it's reactive.** Labeling a single node `enablelb=false` can change how the controller selects nodes *cluster-wide*, not just for that node. The moment any node carries the label, treat the default behavior as gone, and label every node you actually want included.

**A LoadBalancer Service showing an `EXTERNAL-IP` is not proof it's reachable.** That field is status the controller wrote at some point in the past. If the backing `svclb-*` DaemonSet has since dropped to zero pods, the IP is a fossil. Always cross-check `kubectl get daemonset -n kube-system` alongside `kubectl get svc -A`.

**`DESIRED: 0` on a DaemonSet means "matches no nodes," not "broken."** It's tempting to assume a DaemonSet problem means a crashing container or a resource constraint. Zero desired replicas is a scheduling/selector problem, and the fix lives in node labels, not pod logs.

**Ingress and egress are different failure domains.** Confirming the proxy pod can reach its backend (egress) tells you nothing about whether external traffic can reach the proxy pod (ingress). The error message from the calling service — in this case Nuxt's own "service unavailable, tried http://X" text — was the actual signal that the failure was upstream of the application code entirely.

**An unrelated, days-old change can be the cause of today's incident.** The node label that broke this was applied during a completely separate cleanup task, several steps removed from the proxy redeploy that surfaced the symptom. The fresh deploy didn't break anything — it just happened to be the first Service re-application to expose a problem that had been dormant since the label was set.

---

## Verifying Recovery

```bash
# Every svclb DaemonSet should show DESIRED == READY == node count
kubectl get daemonset -n kube-system | grep svclb

# No LoadBalancer service should show <pending>
kubectl get svc -A | grep LoadBalancer

# Confirm the port is actually being served externally
nc -zv 192.168.1.219 8021
```

---

## Conclusion

The cluster never stopped being "healthy" by the metrics that usually matter — pods Running, restarts at zero, CPU and memory nominal. The failure lived one layer further out, in a controller-managed DaemonSet selector that a single, well-intentioned node label had quietly rewritten for every LoadBalancer service in the cluster. The lesson isn't to avoid `enablelb=false` — it's to remember that in K3s, opting one node *out* of ServiceLB means everything else now needs to be opted *in* explicitly, and to check the DaemonSets, not just the pods, when a Service that used to work suddenly doesn't.

---

## Further Reading

::AuthoritativeLinks
---
title: "Sources"
links:
  - label: "K3s — Wikipedia"
    url: "https://en.wikipedia.org/wiki/K3s"
    type: "wikipedia"
    description: "Overview of K3s as a lightweight Kubernetes distribution, including its bundled ServiceLB component that provided the LoadBalancer functionality affected in this incident."
  - label: "Kubernetes DaemonSet — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Kubernetes"
    type: "wikipedia"
    description: "Background on Kubernetes workload controllers, including DaemonSets, the object type ServiceLB uses to run one load-balancer pod per eligible node."
  - label: "Load balancing (computing) — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Load_balancing_(computing)"
    type: "wikipedia"
    description: "Overview of load balancing concepts relevant to understanding what a Kubernetes Service of type LoadBalancer is meant to provide, and why losing its backing pods breaks external connectivity."
  - label: "ARM architecture family — Wikipedia"
    url: "https://en.wikipedia.org/wiki/ARM_architecture_family"
    type: "wikipedia"
    description: "Overview of the ARM64 hardware platform running this cluster, relevant to the imagePullPolicy: Never constraint mentioned as background context for the proxy redeploy that surfaced this incident."
---
::

---

*[← Back to Infrastructure Engineering series](/categories/infrastructure-engineering)*
