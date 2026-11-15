<script setup lang="ts">
// Methodology shown under every calculator. Server-rendered, so it is also the
// indexable explanation of how the numbers are produced.
defineProps<{ focus?: 'vram' | 'kv' | 'gpu' }>()
</script>

<template>
  <section class="ds-container py-12" aria-labelledby="method-h">
    <div class="grid gap-8 lg:grid-cols-3">
      <div>
        <p class="ds-eyebrow mb-2">Methodology</p>
        <h2 id="method-h" class="ds-h2">How these numbers are calculated</h2>
        <p class="mt-3 ds-body">
          These are estimates for planning. Actual memory use depends on the inference engine (llama.cpp, Ollama, vLLM,
          TensorRT-LLM, ExLlamaV2), its version and flags, the model architecture, and the workload.
        </p>
      </div>
      <div class="lg:col-span-2 grid gap-4 sm:grid-cols-2">
        <div class="ds-subtle p-4">
          <h3 class="ds-h3 mb-2">Weights</h3>
          <p class="ds-body"><code class="text-xs">params × bits-per-weight ÷ 8</code>. Effective bits are used, not nominal: GGUF Q4_K_M is ~4.85 bpw and Q2_K ~3.35 bpw because block scales are stored and some tensors stay at higher precision.</p>
        </div>
        <div class="ds-subtle p-4">
          <h3 class="ds-h3 mb-2">KV cache</h3>
          <p class="ds-body"><code class="text-xs">2 × layers × KV heads × head dim × bytes × tokens × sequences</code>. Using KV heads (not attention heads) is what makes GQA and MQA models cheap: Llama 3.1 8B needs 128 KB per token at FP16, not 512 KB.</p>
        </div>
        <div class="ds-subtle p-4">
          <h3 class="ds-h3 mb-2">Overhead</h3>
          <p class="ds-body">A percentage of weight memory for activations and compute buffers (default 10 %), plus a fixed runtime context for CUDA, cuBLAS and the allocator (default 0.5 GB). Raise both for vLLM, which pre-allocates.</p>
        </div>
        <div class="ds-subtle p-4">
          <h3 class="ds-h3 mb-2">Fit</h3>
          <p class="ds-body">Usable memory is VRAM minus what the driver, display or OS already holds. Under 90 % of usable memory is a fit; 90–100 % is tight; above that, layers must run on the CPU (much slower).</p>
        </div>
        <div v-if="focus === 'gpu'" class="ds-subtle p-4 sm:col-span-2">
          <h3 class="ds-h3 mb-2">Decode ceiling</h3>
          <p class="ds-body">Generating one token reads every weight once, so single-stream speed can’t exceed <code class="text-xs">memory bandwidth ÷ weight bytes</code>. Real speeds are usually 50–80 % of this ceiling. Multi-GPU setups are assumed to use layer split (the llama.cpp and Ollama default), where cards run in sequence, so the ceiling uses one card’s bandwidth; tensor parallelism (vLLM) can do better.</p>
        </div>
        <div class="ds-subtle p-4 sm:col-span-2">
          <h3 class="ds-h3 mb-2">Not modelled</h3>
          <p class="ds-body">Sliding-window layers (Gemma 2/3, Mistral’s older models), DeepSeek-style latent attention (MLA), vLLM paged-attention block rounding, prefix caching, mixture-of-experts expert offload, vision encoders and LoRA adapters. These can move real usage noticeably in either direction.</p>
        </div>
      </div>
    </div>
  </section>
</template>
