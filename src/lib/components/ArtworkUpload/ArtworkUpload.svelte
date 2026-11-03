<script lang="ts">
  import { onDestroy } from "svelte";
  import {
    ALLOWED_ARTWORK_TYPES,
    UploadCancelledError,
    uploadArtwork,
    validateArtwork,
    type UploadHandle,
  } from "#lib/api/artwork.ts";

  let {
    movieId,
    currentUrl,
    onUploaded,
  }: {
    movieId: string;
    currentUrl: string | null;
    onUploaded: () => void;
  } = $props();

  let file = $state<File | null>(null);
  let previewUrl = $state<string | null>(null);
  let progress = $state(0);
  let uploading = $state(false);
  let error = $state<string | null>(null);
  let dragging = $state(false);

  let handle: UploadHandle | null = null;
  let input: HTMLInputElement;

  function choose(selected: File | undefined) {
    if (!selected) return;
    error = validateArtwork(selected);
    if (error) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    file = selected;
    previewUrl = URL.createObjectURL(selected);
  }

  function discard() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    file = null;
    previewUrl = null;
    progress = 0;
    input.value = "";
  }

  async function upload() {
    if (!file) return;
    uploading = true;
    error = null;
    progress = 0;
    handle = uploadArtwork(movieId, file, (p) => (progress = p));
    try {
      await handle.promise;
      discard();
      onUploaded();
    } catch (e) {
      if (!(e instanceof UploadCancelledError)) error = (e as Error).message;
    } finally {
      uploading = false;
      handle = null;
    }
  }

  onDestroy(() => {
    handle?.cancel();
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  });
</script>

<div class="space-y-3">
  <div
    role="button"
    tabindex="0"
    aria-label="Change artwork"
    onclick={() => !uploading && input.click()}
    onkeydown={(e) =>
      (e.key === "Enter" || e.key === " ") && !uploading && input.click()}
    ondragover={(e) => {
      e.preventDefault();
      dragging = true;
    }}
    ondragleave={() => (dragging = false)}
    ondrop={(e) => {
      e.preventDefault();
      dragging = false;
      if (!uploading) choose(e.dataTransfer?.files[0]);
    }}
    class="group relative flex aspect-[2/3] w-full max-w-xs cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed
      focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
      {dragging
      ? 'border-blue-500 bg-blue-50'
      : 'border-gray-300 bg-gray-50 hover:border-gray-400'}"
  >
    {#if previewUrl ?? currentUrl}
      <img
        src={previewUrl ?? currentUrl}
        alt="Artwork preview"
        class="h-full w-full object-cover"
      />

      <div
        class="absolute inset-0 flex items-center justify-center bg-black/50 text-sm font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        {uploading ? "Uploading…" : "Click or drop to change"}
      </div>

      <span
        class="absolute right-2 bottom-2 rounded-full bg-black/60 px-2 py-1 text-xs text-white group-hover:hidden"
      >
        ✎ Change
      </span>
    {:else}
      <p class="px-4 text-center text-sm text-gray-500">
        Drag an image here, or click to choose<br />
        <span class="text-xs">JPEG, PNG or WebP · max 5 MB</span>
      </p>
    {/if}
  </div>

  <input
    bind:this={input}
    type="file"
    accept={ALLOWED_ARTWORK_TYPES.join(",")}
    class="hidden"
    onchange={(e) => choose(e.currentTarget.files?.[0])}
  />

  {#if uploading}
    <div class="flex max-w-xs items-center gap-3">
      <progress value={progress} max="100" class="h-2 flex-1"></progress>
      <span class="w-10 text-right text-sm tabular-nums">{progress}%</span>
      <button
        type="button"
        onclick={() => handle?.cancel()}
        class="text-sm text-gray-600 hover:text-gray-900">Cancel</button
      >
    </div>
  {:else if file}
    <div class="flex gap-2">
      <button
        type="button"
        onclick={upload}
        class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >Upload</button
      >
      <button
        type="button"
        onclick={discard}
        class="rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50"
        >Discard</button
      >
    </div>
  {/if}

  {#if error}<p role="alert" class="text-sm text-red-600">{error}</p>{/if}
</div>
