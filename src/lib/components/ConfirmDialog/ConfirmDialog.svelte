<script lang="ts">
  let {
    open = $bindable(false),
    title,
    message,
    confirmLabel = 'Delete',
    busy = false,
    onConfirm,
  }: {
    open?: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    busy?: boolean;
    onConfirm: () => void;
  } = $props();

  let dialog: HTMLDialogElement;

  $effect(() => {
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  });
</script>

<dialog bind:this={dialog} onclose={() => (open = false)}
  class="m-auto rounded-lg p-0 shadow-xl backdrop:bg-black/40">
  <div class="w-[min(90vw,24rem)] p-6">
    <h2 class="text-lg font-semibold">{title}</h2>
    <p class="mt-2 text-sm text-gray-600">{message}</p>
    <div class="mt-6 flex justify-end gap-2">
      <button type="button" onclick={() => (open = false)} disabled={busy}
        class="rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50">
        Cancel
      </button>
      <button type="button" onclick={onConfirm} disabled={busy}
        class="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50">
        {busy ? 'Deleting…' : confirmLabel}
      </button>
    </div>
  </div>
</dialog>