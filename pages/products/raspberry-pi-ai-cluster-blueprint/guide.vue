<template>
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

    <!-- Hero -->
    <div class="bg-slate-900 border-b border-slate-800">
      <div class="max-w-7xl mx-auto px-6 py-16 sm:py-20">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-medium mb-6">
          <Icon name="mdi:server-network" class="text-sm" />
          Raspberry Pi AI Cluster Blueprint
        </div>
        <h1 class="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4">
          The Complete Build Guide
        </h1>
        <p class="text-slate-400 leading-relaxed max-w-2xl text-base">
          Hardware list, network diagram, node roles, folder structures, Kubernetes manifests, and troubleshooting checklist — everything behind a real 4-node Raspberry Pi K3s cluster.
        </p>
      </div>
    </div>

    <!-- What's Inside cards -->
    <div class="bg-slate-50 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800">
      <div class="max-w-7xl mx-auto px-6 py-10">
        <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-6">What's Inside</p>
        <div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <a
            v-for="(s, i) in toc"
            :key="s.id"
            :href="`#${s.id}`"
            class="group block p-5 rounded-2xl border border-slate-200 dark:border-slate-700/50
                   bg-white dark:bg-slate-900/60
                   hover:border-sky-500/40 dark:hover:border-sky-500/30
                   hover:shadow-lg hover:shadow-sky-500/5
                   transition-all duration-200"
          >
            <div
              class="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
              :class="{
                'bg-sky-500/10':     i % 4 === 0,
                'bg-purple-500/10':  i % 4 === 1,
                'bg-emerald-500/10': i % 4 === 2,
                'bg-amber-500/10':   i % 4 === 3,
              }"
            >
              <Icon
                :name="s.icon"
                class="text-base"
                :class="{
                  'text-sky-400':     i % 4 === 0,
                  'text-purple-400':  i % 4 === 1,
                  'text-emerald-400': i % 4 === 2,
                  'text-amber-400':   i % 4 === 3,
                }"
              />
            </div>
            <p class="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-sky-400 transition-colors leading-snug mb-1">
              {{ s.title }}
            </p>
            <p class="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">{{ s.description }}</p>
          </a>
        </div>
      </div>
    </div>

    <!-- Body: sidebar + content -->
    <div class="max-w-7xl mx-auto px-6 py-14 lg:flex lg:gap-14">

      <!-- TOC sidebar -->
      <aside class="hidden lg:block w-52 flex-shrink-0">
        <div class="sticky top-16 pt-2">
          <p class="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Sections</p>
          <nav class="space-y-0.5">
            <a
              v-for="s in toc"
              :key="s.id"
              :href="`#${s.id}`"
              class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-sky-400 py-1.5 px-2 rounded-lg hover:bg-sky-500/5 transition-colors"
            >
              <Icon :name="s.icon" class="text-base flex-shrink-0 opacity-60" />
              {{ s.title }}
            </a>
          </nav>
        </div>
      </aside>

      <!-- Main content -->
      <div class="flex-1 min-w-0 max-w-3xl space-y-20">

        <!-- ── 1. Hardware List ──────────────────────────────────── -->
        <section id="hardware-list">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-9 h-9 rounded-xl bg-sky-500/10 flex items-center justify-center flex-shrink-0">
              <Icon name="mdi:format-list-checkbox" class="text-sky-400" />
            </div>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white">Hardware List</h2>
          </div>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed pl-12">
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
                  <td class="py-3 px-4 text-slate-500 dark:text-slate-400 font-mono text-xs">{{ item.model }}</td>
                  <td class="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-semibold whitespace-nowrap">{{ item.cost }}</td>
                  <td class="py-3 px-4 text-slate-500 dark:text-slate-500 text-xs">{{ item.notes }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p class="mt-3 text-xs text-slate-400 dark:text-slate-500">
            Total build cost: ~$630–$700. The PoE switch + HATs replace individual power supplies and keep cable count low.
          </p>
        </section>

        <!-- ── 2. Network Diagram ─────────────────────────────────── -->
        <section id="network-diagram">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
              <Icon name="mdi:lan" class="text-purple-400" />
            </div>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white">Network Diagram</h2>
          </div>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed pl-12">
            Assign static IPs via DHCP reservation on your router (by MAC address), not on the Pi itself. This keeps nodes discoverable even after a reflash.
          </p>
          <pre class="bg-slate-900 rounded-xl overflow-x-auto mb-6"><code class="block p-5 text-sm text-slate-300 font-mono leading-loose">{{ networkDiagram }}</code></pre>
          <div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700/50">
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
                  <td class="py-2.5 px-4 font-mono text-slate-500 dark:text-slate-400 text-xs">{{ node.ip }}</td>
                  <td class="py-2.5 px-4 text-slate-500 dark:text-slate-400 text-xs">{{ node.role }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p class="mt-3 text-xs text-slate-400 dark:text-slate-500">
            K3s internal: Pod CIDR <code class="font-mono">10.42.0.0/16</code> · Service CIDR <code class="font-mono">10.43.0.0/16</code> · CoreDNS <code class="font-mono">10.43.0.10</code>
          </p>
        </section>

        <!-- ── 3. Node Roles ──────────────────────────────────────── -->
        <section id="node-roles">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
              <Icon name="mdi:server-network" class="text-emerald-400" />
            </div>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white">Node Roles</h2>
          </div>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed pl-12">
            The control plane runs on its own node and nothing else. Dedicating pi-worker-3 to monitoring keeps Prometheus and Grafana off the nodes running actual workloads.
          </p>
          <div class="space-y-4 mb-6">
            <div v-for="role in roles" :key="role.host" class="rounded-xl border border-slate-200 dark:border-slate-700/50 p-5">
              <div class="flex items-start justify-between gap-4 mb-3">
                <div class="flex items-center gap-3">
                  <span class="font-mono text-sm text-sky-500 dark:text-sky-400">{{ role.host }}</span>
                  <span class="text-xs font-medium px-2 py-0.5 rounded-full" :class="role.badgeClass">{{ role.badge }}</span>
                </div>
                <span class="font-mono text-xs text-slate-400 flex-shrink-0">{{ role.ip }}</span>
              </div>
              <p class="text-sm text-slate-500 dark:text-slate-400 mb-3">{{ role.description }}</p>
              <div class="flex flex-wrap gap-2">
                <span v-for="svc in role.services" :key="svc" class="text-xs font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">{{ svc }}</span>
              </div>
            </div>
          </div>
          <p class="text-xs text-slate-400 dark:text-slate-500 mb-2">Apply after the cluster is up and all nodes are Ready:</p>
          <pre class="bg-slate-900 rounded-xl overflow-x-auto"><code class="block p-5 text-sm text-slate-300 font-mono leading-loose">{{ taintCommands }}</code></pre>
        </section>

        <!-- ── 4. Folder Structures ───────────────────────────────── -->
        <section id="folder-structures">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
              <Icon name="mdi:folder-multiple-outline" class="text-amber-400" />
            </div>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white">Folder Structures</h2>
          </div>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed pl-12">
            Keep manifests in a repo, not scattered across the Pi. The numbered prefix on monitoring files enforces apply order — core first, then monitoring, then apps.
          </p>
          <pre class="bg-slate-900 rounded-xl overflow-x-auto mb-6"><code class="block p-5 text-sm text-slate-300 font-mono leading-relaxed">{{ folderTree }}</code></pre>
          <ul class="space-y-2.5">
            <li v-for="note in folderNotes" :key="note" class="flex items-start gap-2.5 text-sm text-slate-500 dark:text-slate-400">
              <Icon name="mdi:arrow-right" class="text-sky-400 mt-0.5 flex-shrink-0 text-base" />
              <span v-html="note" />
            </li>
          </ul>
        </section>

        <!-- ── 5. Kubernetes Manifests ────────────────────────────── -->
        <section id="kubernetes-manifests">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-9 h-9 rounded-xl bg-sky-500/10 flex items-center justify-center flex-shrink-0">
              <Icon name="mdi:kubernetes" class="text-sky-400" />
            </div>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white">Kubernetes Manifests</h2>
          </div>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed pl-12">
            Working K3s, Prometheus, and Grafana configs you can apply directly. Substitute your own node IPs and hostnames where marked.
          </p>

          <div class="space-y-6">
            <div>
              <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Install K3s — control plane</p>
              <pre class="bg-slate-900 rounded-xl overflow-x-auto"><code class="block p-5 text-sm text-slate-300 font-mono leading-loose">{{ k3sServer }}</code></pre>
            </div>
            <div>
              <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Join workers (repeat per node)</p>
              <pre class="bg-slate-900 rounded-xl overflow-x-auto"><code class="block p-5 text-sm text-slate-300 font-mono leading-loose">{{ k3sAgent }}</code></pre>
            </div>
            <div>
              <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Prometheus deployment</p>
              <pre class="bg-slate-900 rounded-xl overflow-x-auto"><code class="block p-5 text-sm text-slate-300 font-mono leading-loose">{{ prometheusManifest }}</code></pre>
            </div>
            <div>
              <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Grafana deployment</p>
              <pre class="bg-slate-900 rounded-xl overflow-x-auto"><code class="block p-5 text-sm text-slate-300 font-mono leading-loose">{{ grafanaManifest }}</code></pre>
            </div>
          </div>
        </section>

        <!-- ── 6. Troubleshooting ─────────────────────────────────── -->
        <section id="troubleshooting">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
              <Icon name="mdi:clipboard-check-outline" class="text-purple-400" />
            </div>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white">Troubleshooting Checklist</h2>
          </div>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed pl-12">
            The failure modes that actually show up on ARM64 hardware, and how to diagnose them fast.
          </p>
          <div class="space-y-4">
            <div v-for="(issue, i) in troubleshooting" :key="i" class="rounded-xl border border-slate-200 dark:border-slate-700/50 p-5">
              <div class="flex items-start gap-3 mb-4">
                <span class="w-6 h-6 rounded-full bg-rose-500/10 text-rose-500 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{{ i + 1 }}</span>
                <h3 class="text-sm font-semibold text-slate-800 dark:text-slate-200">{{ issue.problem }}</h3>
              </div>
              <div class="ml-9 space-y-1.5 text-sm mb-3">
                <p class="text-slate-500 dark:text-slate-400"><span class="font-medium text-slate-700 dark:text-slate-300">Check: </span>{{ issue.check }}</p>
                <p class="text-slate-500 dark:text-slate-400"><span class="font-medium text-slate-700 dark:text-slate-300">Fix: </span>{{ issue.fix }}</p>
              </div>
              <pre v-if="issue.command" class="bg-slate-900 rounded-lg overflow-x-auto ml-9"><code class="block px-4 py-3 text-xs text-slate-300 font-mono leading-loose">{{ issue.command }}</code></pre>
            </div>
          </div>
        </section>

        <!-- More Products -->
        <div class="border-t border-slate-200 dark:border-slate-800 pt-12">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-base font-bold text-slate-900 dark:text-white">More Products</h2>
            <NuxtLink to="/products/overview" class="text-sm text-sky-500 hover:text-sky-400 flex items-center gap-1 transition-colors">
              All Products <Icon name="mdi:arrow-right" />
            </NuxtLink>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <NuxtLink
              v-for="p in otherProducts"
              :key="p.slug"
              :to="`/products/${p.slug}`"
              class="group flex items-start gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50
                     bg-slate-50 dark:bg-slate-900/60 hover:border-sky-500/40 transition-all duration-200"
            >
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
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Raspberry Pi AI Cluster Blueprint — Guide',
  description: 'Hardware list, network diagram, node roles, folder structures, K3s manifests, and troubleshooting checklist for a real Raspberry Pi cluster.',
  robots: 'noindex, nofollow',
})

const toc = [
  { id: 'hardware-list',        title: 'Hardware List',        icon: 'mdi:format-list-checkbox',    description: 'Exact parts, costs, and why each was chosen.' },
  { id: 'network-diagram',      title: 'Network Diagram',      icon: 'mdi:lan',                     description: 'Full topology from router to worker node.' },
  { id: 'node-roles',           title: 'Node Roles',           icon: 'mdi:server-network',          description: 'Control plane vs workers, what runs where.' },
  { id: 'folder-structures',    title: 'Folder Structures',    icon: 'mdi:folder-multiple-outline', description: 'Repo layout that stays navigable as the cluster grows.' },
  { id: 'kubernetes-manifests', title: 'Kubernetes Manifests', icon: 'mdi:kubernetes',              description: 'Working K3s, Prometheus, and Grafana YAML.' },
  { id: 'troubleshooting',      title: 'Troubleshooting',      icon: 'mdi:clipboard-check-outline', description: 'Common ARM64 failure modes and how to fix them fast.' },
]

const hardware = [
  { part: 'Control plane node',     model: 'Raspberry Pi 4 Model B 8GB',      cost: '$75',        notes: 'Runs K3s server + etcd' },
  { part: 'Worker nodes (×3)',       model: 'Raspberry Pi 4 Model B 4GB',      cost: '$55 each',   notes: 'Runs K3s agent and workloads' },
  { part: 'MicroSD cards (×4)',      model: 'Samsung PRO Endurance 32GB',       cost: '$10 each',   notes: 'Boot only — OS lives here' },
  { part: 'USB-SATA adapters (×4)', model: 'UGREEN USB 3.0 to SATA III',       cost: '$12 each',   notes: 'Connects SSD to Pi USB 3.0' },
  { part: 'SSDs (×4)',               model: 'Kingston A400 240GB SATA',         cost: '$28 each',   notes: 'Data, images, etcd store' },
  { part: 'PoE HATs (×4)',           model: 'Waveshare PoE HAT (Type B)',       cost: '$18 each',   notes: 'Powers Pi via switch' },
  { part: 'PoE switch',             model: 'TP-Link TL-SG108PE 8-port',        cost: '$55',        notes: 'Powers and connects all nodes' },
  { part: 'Cluster case',           model: 'GeeekPi 4-layer Pi cluster case',  cost: '$40',        notes: 'Rack-style with cooling fans' },
  { part: 'Patch cables (×5)',       model: 'Cat6 0.5m short runs',            cost: '$12 (pack)', notes: 'Switch to nodes' },
]

const networkDiagram = `[Router / Gateway]  192.168.1.1
        |
        |  1 Gbps uplink (Cat6, switch port 8)
        |
[TP-Link TL-SG108PE 8-Port PoE Switch]
  p1           p2          p3          p4
  |            |           |           |
pi-control  pi-worker-1  pi-worker-2  pi-worker-3
 .100          .101        .102         .103
(K3s server) (workloads) (workloads)  (monitoring)`

const nodes = [
  { host: 'pi-control',  ip: '192.168.1.100', role: 'K3s server — API server, etcd, scheduler' },
  { host: 'pi-worker-1', ip: '192.168.1.101', role: 'K3s agent — general workloads' },
  { host: 'pi-worker-2', ip: '192.168.1.102', role: 'K3s agent — general workloads' },
  { host: 'pi-worker-3', ip: '192.168.1.103', role: 'K3s agent — monitoring only (tainted)' },
]

const roles = [
  {
    host: 'pi-control', ip: '192.168.1.100', badge: 'Control Plane',
    badgeClass: 'bg-sky-500/10 text-sky-500 border border-sky-500/20',
    description: 'Runs the K3s server process. Hosts etcd, the API server, scheduler, and controller manager. Nothing else runs here.',
    services: ['k3s server', 'etcd', 'kube-apiserver', 'kube-scheduler', 'coredns'],
  },
  {
    host: 'pi-worker-1 / pi-worker-2', ip: '192.168.1.101 / .102', badge: 'Worker',
    badgeClass: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',
    description: 'General-purpose workload nodes. No taints — any pod without a node selector can land here.',
    services: ['k3s agent', 'containerd', 'your apps'],
  },
  {
    host: 'pi-worker-3', ip: '192.168.1.103', badge: 'Monitoring',
    badgeClass: 'bg-purple-500/10 text-purple-500 border border-purple-500/20',
    description: 'Tainted with dedicated=monitoring:NoSchedule. Only monitoring pods that tolerate the taint schedule here.',
    services: ['k3s agent', 'prometheus', 'grafana', 'loki', 'promtail'],
  },
]

const taintCommands = `kubectl taint nodes pi-worker-3 dedicated=monitoring:NoSchedule
kubectl label nodes pi-worker-3 role=monitoring

# Verify
kubectl get nodes --show-labels | grep monitoring`

const folderTree = `~/cluster/
├── manifests/
│   ├── core/
│   │   ├── namespaces.yaml
│   │   └── local-path-storage.yaml
│   ├── monitoring/
│   │   ├── prometheus/
│   │   │   ├── 01-namespace.yaml
│   │   │   ├── 02-rbac.yaml
│   │   │   ├── 03-configmap.yaml
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
├── configs/k3s/
│   ├── server.env
│   └── agent.env
└── scripts/
    ├── bootstrap-control.sh
    ├── bootstrap-worker.sh
    └── teardown.sh`

const folderNotes = [
  '<code class="font-mono text-xs">manifests/core/</code> — namespaces and storage class; apply first',
  '<code class="font-mono text-xs">monitoring/</code> — numbered files enforce Prometheus → Grafana → Loki apply order',
  '<code class="font-mono text-xs">apps/</code> — one subdirectory per deployed application',
  '<code class="font-mono text-xs">configs/k3s/</code> — <code class="font-mono text-xs">server.env</code> and <code class="font-mono text-xs">agent.env</code> keep the token out of shell history',
]

const k3sServer = `# On pi-control
curl -sfL https://get.k3s.io | sh -s - server \\
  --write-kubeconfig-mode 644 \\
  --disable traefik \\
  --node-name pi-control \\
  --advertise-address 192.168.1.100 \\
  --node-ip 192.168.1.100

kubectl get nodes   # wait for Ready

sudo cat /var/lib/rancher/k3s/server/node-token   # save this`

const k3sAgent = `# On each worker — set NODE_NAME and NODE_IP per node
curl -sfL https://get.k3s.io | \\
  K3S_URL=https://192.168.1.100:6443 \\
  K3S_TOKEN=<TOKEN> \\
  sh -s - agent \\
  --node-name pi-worker-1 \\
  --node-ip 192.168.1.101`

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
      volumes:
        - name: config
          configMap:
            name: prometheus-config
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
    fix: 'Restart the service. Read journalctl first to understand the cause.',
    command: 'sudo systemctl restart k3s          # control plane\nsudo systemctl restart k3s-agent     # workers\njournalctl -u k3s -f | tail -50',
  },
  {
    problem: 'Pods stuck in Pending',
    check: 'kubectl describe pod <name> -n <namespace> — check the Events section.',
    fix: 'Usually a taint mismatch or node selector with no matching node.',
    command: 'kubectl get nodes --show-labels\nkubectl describe pod <pod-name> -n <namespace>',
  },
  {
    problem: 'LoadBalancer stuck in <Pending> — no external IP',
    check: 'ServiceLB needs to be enabled on the nodes that should receive traffic.',
    fix: 'Label the worker nodes. This is the most common K3s gotcha.',
    command: 'kubectl label node pi-worker-1 svccontroller.k3s.cattle.io/enablelb=true\nkubectl label node pi-worker-2 svccontroller.k3s.cattle.io/enablelb=true',
  },
  {
    problem: 'etcd disk pressure — control plane slows down',
    check: 'df -h /var/lib/rancher/k3s/server/db — clean up if above 70%.',
    fix: 'Snapshot first, then prune old ones.',
    command: 'k3s etcd-snapshot save\nk3s etcd-snapshot prune --snapshot-retention 3',
  },
  {
    problem: 'ImagePullBackOff — ARM64 image missing',
    check: 'kubectl describe pod <name> for the exact error. The image may not have an arm64 variant.',
    fix: 'Inspect the manifest before deploying.',
    command: 'docker manifest inspect <image>:<tag> | grep -A3 arm64',
  },
  {
    problem: 'Service DNS not resolving between pods',
    check: 'kubectl get pods -n kube-system | grep coredns',
    fix: 'Restart CoreDNS. Debug from inside a pod with nslookup.',
    command: 'kubectl rollout restart deployment/coredns -n kube-system\nkubectl run debug --rm -it --image=busybox --restart=Never -- nslookup kubernetes',
  },
]

const otherProducts = [
  { slug: 'self-hosted-ai-starter-kit',    title: 'Self-Hosted AI Starter Kit',    tagline: "Run your own models without renting someone else's API.", icon: 'mdi:brain' },
  { slug: 'production-ai-api-boilerplate', title: 'Production AI API Boilerplate', tagline: 'Skip the scaffolding, ship the feature.',                 icon: 'mdi:api' },
  { slug: 'local-vibe-coding-blueprint',   title: 'Local Vibe Coding Blueprint',   tagline: 'Run your own AI coding assistant on hardware you own.',   icon: 'mdi:code-braces' },
]
</script>
