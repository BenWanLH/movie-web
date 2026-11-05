<script lang="ts">
  import { onDestroy } from "svelte";

  let {
    value = "",
    placeholder = "Search…",
    label = "Search",
    loading = false,
    delay = 300,
    onSearch,
  }: {
    value?: string;
    placeholder?: string;
    label?: string;
    loading?: boolean;
    delay?: number;
    onSearch: (term: string) => void;
  } = $props();

  // svelte-ignore state_referenced_locally
  let term = $state(value);
  let timer: ReturnType<typeof setTimeout> | undefined;

  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(() => onSearch(term.trim()), delay);
  }

  function searchNow() {
    clearTimeout(timer);
    onSearch(term.trim());
  }

  function clear() {
    clearTimeout(timer);
    term = "";
    onSearch("");
  }

  onDestroy(() => clearTimeout(timer));
</script>

<div class="relative w-full">
  <svg
    class="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fill-rule="evenodd"
      d="M9 3.5a5.5 5.5 0 1 0 3.47 9.77l3.63 3.63a.75.75 0 1 0 1.06-1.06l-3.63-3.63A5.5 5.5 0 0 0 9 3.5ZM5 9a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z"
      clip-rule="evenodd"
    />
  </svg>

  <input
    type="text"
    enterkeyhint="search"
    bind:value={term}
    oninput={schedule}
    onkeydown={(e) => {
      if (e.key === "Enter") searchNow();
    }}
    {placeholder}
    aria-label={label}
    class="w-full rounded-md border-gray-300 py-2 pr-9 pl-9 text-sm"
  />

  <div class="absolute inset-y-0 right-2 flex items-center">
    {#if loading}
      <span
        role="status"
        aria-label="Searching"
        class="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"
      ></span>
    {:else if term}
      <button
        type="button"
        onclick={clear}
        aria-label="Clear search"
        class="rounded p-1 text-gray-400 hover:text-gray-600">✕</button
      >
    {/if}
  </div>
</div>
