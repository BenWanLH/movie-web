<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    title,
    message,
    children,
  }: { title: string; message?: string; children?: Snippet } = $props();
</script>

<div
  class="flex flex-col items-center rounded-lg border border-dashed bg-white px-6 py-16 text-center"
>
  <div class="text-5xl" aria-hidden="true">🎞️</div>
  <h2 class="mt-4 text-lg font-semibold">{title}</h2>
  {#if message}<p class="mt-1 text-sm text-gray-500">{message}</p>{/if}
  {#if children}<div class="mt-6">{@render children()}</div>{/if}
</div>
