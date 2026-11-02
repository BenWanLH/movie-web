<script lang="ts">
  let { message, onRetry }: { message: string; onRetry?: () => void } =
    $props();
</script>

<div
  role="alert"
  class="flex flex-col items-center rounded-lg border border-red-200 bg-red-50 px-6 py-16 text-center"
>
  <div class="text-5xl" aria-hidden="true">⚠️</div>
  <h2 class="mt-4 text-lg font-semibold text-red-800">Something went wrong</h2>
  <p class="mt-1 text-sm text-red-700">{message}</p>
  {#if onRetry}
    <button
      type="button"
      onclick={onRetry}
      class="mt-6 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
    >
      Try again
    </button>
  {/if}
</div>
