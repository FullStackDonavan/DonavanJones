<template>
  <PatternSection>
    <div class="min-h-screen bg-white dark:bg-slate-950">

      <!-- Sticky breadcrumb -->
      <div class="sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-sm">
        <div class="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <nav class="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <NuxtLink to="/products/overview" class="hover:text-sky-400 transition-colors">Products</NuxtLink>
            <Icon name="mdi:chevron-right" class="text-slate-300 dark:text-slate-600" />
            <NuxtLink to="/products/raspberry-pi-ai-cluster-blueprint" class="hover:text-sky-400 transition-colors">Blueprint</NuxtLink>
            <Icon name="mdi:chevron-right" class="text-slate-300 dark:text-slate-600" />
            <span class="text-slate-700 dark:text-slate-300 font-medium">Guide</span>
          </nav>
          <span class="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-500">
            <Icon name="mdi:server-network" class="text-sm" />
            Infrastructure Engineering
          </span>
        </div>
      </div>

      <!-- Body: sidebar + content -->
      <div class="max-w-7xl mx-auto px-6 py-12 lg:flex lg:gap-14">

        <!-- TOC sidebar -->
        <aside class="hidden lg:block w-52 flex-shrink-0">
          <div class="sticky top-16 pt-2">
            <p class="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Contents</p>
            <nav class="space-y-0.5">
              <a v-for="s in toc" :key="s.id" :href="`#${s.id}`"
                class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-sky-400 dark:hover:text-sky-400 py-1.5 px-2 rounded-lg hover:bg-sky-500/5 transition-colors">
                <Icon :name="s.icon" class="text-base flex-shrink-0" />
                {{ s.title }}
              </a>
            </nav>
          </div>
        </aside>

        <!-- Main content -->
        <div class="flex-1 min-w-0 max-w-3xl">

          <!-- Intro -->
          <div class="mb-14">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-500 text-xs font-medium mb-5">
              <Icon name="mdi:server-network" />
              Raspberry Pi AI Cluster Blueprint
            </div>
            <h1 class="text-3xl font-bold text-slate-900 dark:text-white leading-tight">
              The Complete Build Guide
            </h1>
            <p class="mt-3 text-slate-500 dark:text-slate-400 leading-relaxed">
              Hardware list, network diagram, node roles, folder structures, Kubernetes manifests, and troubleshooting checklist — everything behind a real 4-node Raspberry Pi K3s cluster.
            </p>
          </div>

          <!-- ── 1. Hardware List ──────────────────────────────────── -->
          <section id="hardware-list" class="mb-16">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center">
                <Icon name="mdi:format-list-checkbox" class="text-sky-400 text-base" />
              </div>
              <h2 class="text-xl font-bold text-slate-900 dark:text-white">Hardware List</h2>
            </div>
            <p class="text-sm text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
              Every part used in the rack. Prices fluctuate — use these as a baseline. Buy the Pi 4 8GB for the control plane; 4GB workers are fine for running workloads.
            </p>
            <div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700/50">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60">
                    <th class="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Part</th>
                    <th class="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Model</th>
                    <th class="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Est. Cost</th>
                    <th class="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in hardware" :key="i" class="border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <td class="py-3 px-4 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">{{ item.part }}</td>
                    <td class="py-3 px-4 text-slate-600 dark:text-slate-400 font-mono text-xs">{{ item.model }}</td>
                    <td class="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-semibold whitespace-nowrap">{{ item.cost }}</td>
                    <td class="py-3 px-4 text-slate-500 dark:text-slate-500 text-xs">{{ item.notes }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p class="mt-3 text-xs text-slate-400 dark:text-slate-500">
              Total build cost: ~$630–$700 depending on availability. The PoE switch + HATs remove the need for individual power supplies.
            </p>
          </section>

          <!-- ── 2. Network Diagram ─────────────────────────────────── -->
          <section id="network-diagram" class="mb-16">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Icon name="mdi:lan" class="text-purple-400 text-base" />
              </div>
              <h2 class="text-xl font-bold text-slate-900 dark:text-white">Network Diagram</h2>
            </div>
            <p class="text-sm text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
              Assign static IPs via DHCP reservation on your router (by MAC address), not on the Pi itself. This keeps the nodes discoverable even after a reflash.
            </p>
            <pre class="bg-slate-900 rounded-xl overflow-x-auto mb-5"><code class="block p-5 text-sm text-slate-300 font-mono leading-loose">{{ networkDiagram }}</code></pre>
            <div class="rounded-xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60">
                    <th class="text-left py-2.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Hostname</th>
                    <th class="text-left py-2.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Static IP</th>
                    <th class="text-left py-2.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Role</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="node in nodes" :key="node.host" class="border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <td class="py-2.5 px-4 font-mono text-sky-500 dark:text-sky-400 text-xs">{{ node.host }}</td>
                    <td class="py-2.5 px-4 font-mono text-slate-600 dark:text-slate-400 text-xs">{{ node.ip }}</td>
                    <td class="py-2.5 px-4 text-slate-600 dark:text-slate-400 text-xs">{{ node.role }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p class="mt-3 text-xs text-slate-400 dark:text-slate-500">
              K3s internal networks: Pod CIDR <code class="font-mono">10.42.0.0/16</code>, Service CIDR <code class="font-mono">10.43.0.0/16</code>, CoreDNS at <code class="font-mono">10.43.0.10</code>.
            </p>
          </section>

          <!-- ── 3. Node Roles ──────────────────────────────────────── -->
          <section id="node-roles" class="mb-16">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Icon name="mdi:server-network" class="text-emerald-400 text-base" />
              </div>
              <h2 class="text-xl font-bold text-slate-900 dark:text-white">Node Roles</h2>
            </div>
            <p class="text-sm text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
              The control plane runs on its own node and nothing else. Dedicating pi-worker-3 to monitoring keeps Prometheus and Grafana off the nodes that run actual workloads.
            </p>
            <div class="space-y-4 mb-6">
              <div v-for="role in roles" :key="role.host" class="rounded-xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 p-5">
                <div class="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <span class="font-mono text-sm text-sky-500 dark:text-sky-400">{{ role.host }}</span>
                    <span class="ml-3 text-xs font-medium px-2 py-0.5 rounded-full" :class="role.badgeClass">{{ role.badge }}</span>
                  </div>
                  <span class="font-mono text-xs text-slate-400">{{ role.ip }}</span>
                </div>
                <p class="text-sm text-slate-500 dark:text-slate-400 mb-3">{{ role.description }}</p>
                <div class="flex flex-wrap gap-2">
                  <span v-for="svc in role.services" :key="svc" class="text-xs font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">{{ svc }}</span>
                </div>
              </div>
            </div>
            <p class="text-xs text-slate-400 dark:text-slate-500 mb-2">Taint and label the monitoring node after the cluster is up:</p>
            <pre class="bg-slate-900 rounded-xl overflow-x-auto"><code class="block p-5 text-sm text-slate-300 font-mono leading-loose">{{ taintCommands }}</code></pre>
          </section>

          <!-- ── 4. Folder Structures ───────────────────────────────── -->
          <section id="folder-structures" class="mb-16">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Icon name="mdi:folder-multiple-outline" class="text-amber-400 text-base" />
              </div>
              <h2 class="text-xl font-bold text-slate-900 dark:text-white">Folder Structures</h2>
            </div>
            <p class="text-sm text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
              Keep manifests in a repo, not scattered across the Pi. The numbered prefix on monitoring subdirectories enforces apply order — core first, then monitoring, then apps.
            </p>
            <pre class="bg-slate-900 rounded-xl overflow-x-auto mb-4"><code class="block p-5 text-sm text-slate-300 font-mono leading-relaxed">{{ folderTree }}</code></pre>
            <ul class="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li class="flex items-start gap-2"><Icon name="mdi:arrow-right" class="text-sky-400 mt-0.5 flex-shrink-0" /><span><code class="font-mono text-xs">manifests/core/</code> — namespaces and storage class; apply first</span></li>
              <li class="flex items-start gap-2"><Icon name="mdi:arrow-right" class="text-sky-400 mt-0.5 flex-shrink-0" /><span><code class="font-mono text-xs">manifests/monitoring/</code> — numbered files enforce Prometheus → Grafana → Loki order</span></li>
              <li class="flex items-start gap-2"><Icon name="mdi:arrow-right" class="text-sky-400 mt-0.5 flex-shrink-0" /><span><code class="font-mono text-xs">manifests/apps/</code> — one subdirectory per deployed application</span></li>
              <li class="flex items-start gap-2"><Icon name="mdi:arrow-right" class="text-sky-400 mt-0.5 flex-shrink-0" /><span><code class="font-mono text-xs">configs/k3s/</code> — <code class="font-mono text-xs">server.env</code> and <code class="font-mono text-xs">agent.env</code> store K3S_TOKEN so it's never in a shell history</span></li>
              <li class="flex items-start gap-2"><Icon name="mdi:arrow-right" class="text-sky-400 mt-0.5 flex-shrink-0" /><span><code class="font-mono text-xs">scripts/</code> — idempotent bootstrap scripts, safe to re-run</span></li>
            </ul>
          </section>

          <!-- ── 5. Kubernetes Manifests ────────────────────────────── -->
          <section id="kubernetes-manifests" class="mb-16">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center">
                <Icon name="mdi:kubernetes" class="text-sky-400 text-base" />
              </div>
              <h2 class="text-xl font-bold text-slate-900 dark:text-white">Kubernetes Manifests</h2>
            </div>

            <h3 class="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">Install K3s on the control plane</h3>
            <pre class="bg-slate-900 rounded-xl overflow-x-auto mb-6"><code class="block p-5 text-sm text-slate-300 font-mono leading-loose">{{ k3sServer }}</code></pre>

            <h3 class="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">Join workers (repeat for each node with correct hostname and IP)</h3>
            <pre class="bg-slate-900 rounded-xl overflow-x-auto mb-6"><code class="block p-5 text-sm text-slate-300 font-mono leading-loose">{{ k3sAgent }}</code></pre>

            <h3 class="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">Prometheus deployment</h3>
            <pre class="bg-slate-900 rounded-xl overflow-x-auto mb-6"><code class="block p-5 text-sm text-slate-300 font-mono leading-loose">{{ prometheusManifest }}</code></pre>

            <h3 class="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">Grafana deployment</h3>
            <pre class="bg-slate-900 rounded-xl overflow-x-auto"><code class="block p-5 text-sm text-slate-300 font-mono leading-loose">{{ grafanaManifest }}</code></pre>
          </section>

          <!-- ── 6. Troubleshooting Checklist ───────────────────────── -->
          <section id="troubleshooting" class="mb-16">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Icon name="mdi:clipboard-check-outline" class="text-purple-400 text-base" />
              </div>
              <h2 class="text-xl font-bold text-slate-900 dark:text-white">Troubleshooting Checklist</h2>
            </div>
            <div class="space-y-4">
              <div v-for="(issue, i) in troubleshooting" :key="i" class="rounded-xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 p-5">
                <div class="flex items-start gap-3 mb-3">
                  <span class="w-6 h-6 rounded-full bg-rose-500/10 text-rose-500 text-xs font-bold flex items-center justify-center flex-shrink-0">{{ i + 1 }}</span>
                  <h3 class="text-sm font-semibold text-slate-800 dark:text-slate-200">{{ issue.problem }}</h3>
                </div>
                <div class="ml-9 space-y-2 text-sm">
                  <p class="text-slate-500 dark:text-slate-400"><span class="font-medium text-slate-600 dark:text-slate-300">Check: </span>{{ issue.check }}</p>
                  <p class="text-slate-500 dark:text-slate-400"><span class="font-medium text-slate-600 dark:text-slate-300">Fix: </span>{{ issue.fix }}</p>
                  <pre v-if="issue.command" class="bg-slate-900 rounded-lg overflow-x-auto mt-2"><code class="block px-4 py-2.5 text-xs text-slate-300 font-mono">{{ issue.command }}</code></pre>
                </div>
              </div>
            </div>
          </section>

          <!-- More Products -->
          <div class="border-t border-slate-200 dark:border-slate-800 pt-12">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-base font-bold text-slate-900 dark:text-white">More Products</h2>
              <NuxtLink to="/products/overview" class="text-sm text-sky-500 hover:text-sky-400 flex items-center gap-1 transition-colors">
                All Products <Icon name="mdi:arrow-right" class="text-base" />
              </NuxtLink>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <NuxtLink v-for="p in otherProducts" :key="p.slug" :to="`/products/${p.slug}`"
                class="group flex items-start gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 hover:border-sky-500/40 transition-all duration-200">
                <div class="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                  <Icon :name="p.icon" class="text-xl text-slate-400 dark:text-slate-500" />
                </div>
                <div>
                  <p class="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-sky-400 transition-colors">{{ p.title }}</p>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{{ p.tagline }}</p>
                </div>
              </NuxtLink>
            </div>
          </div>

        </div>
      </div>
    </div>
  </PatternSection>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const SITE = (config.public.appDomain as string) || 'https://donavanjones.com'

useSeoMeta({
  title: 'Raspberry Pi AI Cluster Blueprint — Guide',
  description: 'Hardware list, network diagram, node roles, folder structures, K3s manifests, and troubleshooting checklist for a real Raspberry Pi cluster.',
  robots: 'noindex, nofollow',
})

const toc = [
  { id: 'hardware-list',       title: 'Hardware List',       icon: 'mdi:format-list-checkbox' },
  { id: 'network-diagram',     title: 'Network Diagram',     icon: 'mdi:lan' },
  { id: 'node-roles',          title: 'Node Roles',          icon: 'mdi:server-network' },
  { id: 'folder-structures',   title: 'Folder Structures',   icon: 'mdi:folder-multiple-outline' },
  { id: 'kubernetes-manifests',title: 'K8s Manifests',       icon: 'mdi:kubernetes' },
  { id: 'troubleshooting',     title: 'Troubleshooting',     icon: 'mdi:clipboard-check-outline' },
]

const hardware = [
  { part: 'Control plane node',     model: 'Raspberry Pi 4 Model B 8GB',        cost: '$75',        notes: 'Runs K3s server + etcd' },
  { part: 'Worker nodes (×3)',       model: 'Raspberry Pi 4 Model B 4GB',        cost: '$55 each',   notes: 'Runs K3s agent and workloads' },
  { part: 'MicroSD cards (×4)',      model: 'Samsung PRO Endurance 32GB',         cost: '$10 each',   notes: 'Boot only — OS lives here' },
  { part: 'USB-SATA adapters (×4)', model: 'UGREEN USB 3.0 to SATA III',         cost: '$12 each',   notes: 'Connects SSD to Pi USB 3.0 port' },
  { part: 'SSDs (×4)',               model: 'Kingston A400 240GB SATA',           cost: '$28 each',   notes: 'Data, container images, etcd store' },
  { part: 'PoE HATs (×4)',           model: 'Waveshare PoE HAT (Type B)',         cost: '$18 each',   notes: 'Powers Pi via switch — no power bricks' },
  { part: 'PoE switch',             model: 'TP-Link TL-SG108PE 8-port',          cost: '$55',        notes: 'Powers and connects all 4 nodes' },
  { part: 'Cluster case',           model: 'GeeekPi 4-layer Pi cluster case',    cost: '$40',        notes: 'Rack-style mount with cooling fans' },
  { part: 'Patch cables (×5)',       model: 'Cat6 0.5m short runs',              cost: '$12 (pack)', notes: 'Short runs from switch to nodes' },
]

const networkDiagram = `[Router / Gateway]  192.168.1.1
        |
        |  1 Gbps uplink (Cat6, switch port 8)
        |
[TP-Link TL-SG108PE 8-Port PoE Switch]
  p1         p2         p3         p4
  |          |          |          |
pi-control  pi-worker-1 pi-worker-2 pi-worker-3
192.168.1.100  .101       .102       .103
  (K3s srv)  (workloads) (workloads) (monitoring)`

const nodes = [
  { host: 'pi-control',  ip: '192.168.1.100', role: 'K3s control plane — API server, etcd, scheduler' },
  { host: 'pi-worker-1', ip: '192.168.1.101', role: 'K3s agent — general workloads and apps' },
  { host: 'pi-worker-2', ip: '192.168.1.102', role: 'K3s agent — general workloads and apps' },
  { host: 'pi-worker-3', ip: '192.168.1.103', role: 'K3s agent — monitoring only (tainted)' },
]

const roles = [
  {
    host: 'pi-control', ip: '192.168.1.100', badge: 'Control Plane',
    badgeClass: 'bg-sky-500/10 text-sky-500 border border-sky-500/20',
    description: 'Runs the K3s server process. Hosts etcd, the API server, scheduler, and controller manager. Nothing else runs here — keep this node dedicated to cluster control.',
    services: ['k3s server', 'etcd', 'kube-apiserver', 'kube-scheduler', 'kube-controller-manager', 'coredns'],
  },
  {
    host: 'pi-worker-1 / pi-worker-2', ip: '192.168.1.101 / .102', badge: 'Worker',
    badgeClass: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',
    description: 'Run K3s agent. General-purpose workload nodes — apps, APIs, background jobs. No special taints, so any pod without a node selector can land here.',
    services: ['k3s agent', 'containerd', 'kube-proxy', 'your apps'],
  },
  {
    host: 'pi-worker-3', ip: '192.168.1.103', badge: 'Monitoring',
    badgeClass: 'bg-purple-500/10 text-purple-500 border border-purple-500/20',
    description: 'Tainted with dedicated=monitoring:NoSchedule. Only monitoring pods (Prometheus, Grafana, Loki) that tolerate the taint can schedule here, keeping monitoring off the workload nodes.',
    services: ['k3s agent', 'prometheus', 'grafana', 'loki', 'promtail'],
  },
]

const taintCommands = `# Run after cluster is fully up and all nodes show Ready
kubectl taint nodes pi-worker-3 dedicated=monitoring:NoSchedule
kubectl label nodes pi-worker-3 role=monitoring

# Verify
kubectl get nodes --show-labels | grep monitoring`

const folderTree = `~/cluster/
├── manifests/
│   ├── core/
│   │   ├── namespaces.yaml        # Create all namespaces first
│   │   └── local-path-storage.yaml
│   ├── monitoring/
│   │   ├── prometheus/
│   │   │   ├── 01-namespace.yaml
│   │   │   ├── 02-rbac.yaml
│   │   │   ├── 03-configmap.yaml  # scrape config
│   │   │   └── 04-deployment.yaml
│   │   ├── grafana/
│   │   │   ├── 01-namespace.yaml
│   │   │   ├── 02-deployment.yaml
│   │   │   └── 03-dashboards-configmap.yaml
│   │   └── loki/
│   │       ├── 01-namespace.yaml
│   │       └── 02-deployment.yaml
│   └── apps/
│       └── [your-app]/
│           ├── deployment.yaml
│           ├── service.yaml
│           └── ingress.yaml
├── configs/
│   └── k3s/
│       ├── server.env             # K3S_TOKEN, flags for server
│       └── agent.env              # K3S_URL, K3S_TOKEN for agents
└── scripts/
    ├── bootstrap-control.sh       # Idempotent — safe to re-run
    ├── bootstrap-worker.sh        # Run on each worker with NODE_NAME set
    └── teardown.sh                # Removes K3s from all nodes`

const k3sServer = `# On pi-control (192.168.1.100)
curl -sfL https://get.k3s.io | sh -s - server \\
  --write-kubeconfig-mode 644 \\
  --disable traefik \\
  --node-name pi-control \\
  --advertise-address 192.168.1.100 \\
  --node-ip 192.168.1.100

# Confirm the node is Ready (takes ~30s)
kubectl get nodes

# Get the cluster join token — save this for worker installs
sudo cat /var/lib/rancher/k3s/server/node-token`

const k3sAgent = `# On pi-worker-1 — repeat with correct NODE_NAME and NODE_IP for each worker
export NODE_NAME="pi-worker-1"
export NODE_IP="192.168.1.101"
export K3S_TOKEN="<TOKEN_FROM_CONTROL_PLANE>"

curl -sfL https://get.k3s.io | \\
  K3S_URL=https://192.168.1.100:6443 \\
  K3S_TOKEN=$K3S_TOKEN \\
  sh -s - agent \\
  --node-name $NODE_NAME \\
  --node-ip $NODE_IP

# Back on pi-control — confirm all nodes joined
kubectl get nodes -o wide`

const prometheusManifest = `# manifests/monitoring/prometheus/04-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: prometheus
  namespace: monitoring
spec:
  replicas: 1
  selector:
    matchLabels:
      app: prometheus
  template:
    metadata:
      labels:
        app: prometheus
    spec:
      tolerations:
        - key: dedicated
          operator: Equal
          value: monitoring
          effect: NoSchedule
      nodeSelector:
        role: monitoring
      containers:
        - name: prometheus
          image: prom/prometheus:v2.47.0
          args:
            - '--config.file=/etc/prometheus/prometheus.yml'
            - '--storage.tsdb.retention.time=15d'
          ports:
            - containerPort: 9090
          volumeMounts:
            - name: config
              mountPath: /etc/prometheus
            - name: data
              mountPath: /prometheus
      volumes:
        - name: config
          configMap:
            name: prometheus-config
        - name: data
          emptyDir: {}
---
apiVersion: v1
kind: Service
metadata:
  name: prometheus
  namespace: monitoring
spec:
  selector:
    app: prometheus
  ports:
    - port: 9090
      targetPort: 9090
  type: LoadBalancer`

const grafanaManifest = `# manifests/monitoring/grafana/02-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: grafana
  namespace: monitoring
spec:
  replicas: 1
  selector:
    matchLabels:
      app: grafana
  template:
    metadata:
      labels:
        app: grafana
    spec:
      tolerations:
        - key: dedicated
          operator: Equal
          value: monitoring
          effect: NoSchedule
      nodeSelector:
        role: monitoring
      containers:
        - name: grafana
          image: grafana/grafana:10.1.0
          ports:
            - containerPort: 3000
          env:
            - name: GF_SECURITY_ADMIN_PASSWORD
              value: "changeme"
            - name: GF_SERVER_ROOT_URL
              value: "http://192.168.1.103:3000"
---
apiVersion: v1
kind: Service
metadata:
  name: grafana
  namespace: monitoring
spec:
  selector:
    app: grafana
  ports:
    - port: 3000
      targetPort: 3000
  type: LoadBalancer`

const troubleshooting = [
  {
    problem: 'Node shows NotReady',
    check: 'Run systemctl status k3s (control) or k3s-agent (workers). Look for failed service or timeout errors.',
    fix: 'Restart the service. Check journalctl -u k3s -f for the specific error before restarting.',
    command: 'sudo systemctl restart k3s          # on control plane\nsudo systemctl restart k3s-agent     # on workers\njournalctl -u k3s -f --no-pager | tail -50',
  },
  {
    problem: 'Pods stuck in Pending',
    check: 'kubectl describe pod <pod-name> -n <namespace> — look at the Events section at the bottom.',
    fix: 'Usually a taint mismatch or node selector that doesn\'t match any node. Verify node labels.',
    command: 'kubectl get nodes --show-labels\nkubectl describe pod <pod-name> -n <namespace>',
  },
  {
    problem: 'LoadBalancer stuck in <Pending> — no external IP assigned',
    check: 'Check if ServiceLB is enabled on the nodes that should receive load balancer traffic.',
    fix: 'Label the worker nodes to enable ServiceLB. This is the most common gotcha on K3s.',
    command: 'kubectl label node pi-worker-1 svccontroller.k3s.cattle.io/enablelb=true\nkubectl label node pi-worker-2 svccontroller.k3s.cattle.io/enablelb=true',
  },
  {
    problem: 'etcd disk pressure — control plane slows down',
    check: 'df -h /var/lib/rancher/k3s/server/db — if usage is above 70%, clean up.',
    fix: 'Save a snapshot first, then prune old ones.',
    command: 'k3s etcd-snapshot save\nk3s etcd-snapshot prune --snapshot-retention 3',
  },
  {
    problem: 'ARM64 image pull error / ImagePullBackOff',
    check: 'kubectl describe pod <pod-name> to see the exact image error. The image may not have an arm64 variant.',
    fix: 'Inspect the image manifest before deploying. Find an arm64-compatible alternative if missing.',
    command: 'docker manifest inspect <image>:<tag> | grep -A3 arm64\n# Look for "linux/arm64" in the manifest list',
  },
  {
    problem: 'Service-to-service DNS not resolving',
    check: 'kubectl get pods -n kube-system | grep coredns — confirm CoreDNS is Running.',
    fix: 'Restart CoreDNS. Debug from inside a pod with busybox nslookup.',
    command: 'kubectl rollout restart deployment/coredns -n kube-system\n# Debug from inside a pod:\nkubectl run debug --rm -it --image=busybox --restart=Never -- nslookup kubernetes',
  },
]

const otherProducts = [
  { slug: 'self-hosted-ai-starter-kit', title: 'Self-Hosted AI Starter Kit', tagline: "Run your own models without renting someone else's API.", icon: 'mdi:brain' },
  { slug: 'production-ai-api-boilerplate', title: 'Production AI API Boilerplate', tagline: 'Skip the scaffolding, ship the feature.', icon: 'mdi:api' },
]
</script>
