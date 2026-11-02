<script lang="ts">
  import { fly } from "svelte/transition";
  import { toasts, dismiss } from "#lib/state/toast/toast.svelte.ts";
</script>

<div
  aria-live="polite"
  class="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-4 sm:items-end"
>
  {#each toasts as t (t.id)}
    <div
      transition:fly={{ y: 20, duration: 200 }}
      role="status"
      class="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-lg px-4 py-3 text-sm text-white shadow-lg
        {t.kind === 'success' ? 'bg-green-600' : 'bg-red-600'}"
    >
      <span class="flex-1">{t.message}</span>
      <button
        type="button"
        onclick={() => dismiss(t.id)}
        aria-label="Dismiss"
        class="opacity-80 hover:opacity-100">✕</button
      >
    </div>
  {/each}
</div>
