<script lang="ts">
  import type { Genre, MovieDetail } from "#lib/graphql/generated/graphql.ts";
  import { GENRE_LABELS } from "#lib/model/genre.ts";

  let {
    movieDetail,
    submitLabel = "Save",
    onSubmit,
  }: {
    movieDetail?: MovieDetail;
    submitLabel?: string;
    onSubmit: (detail: MovieDetail) => Promise<void>;
  } = $props();

  const genreOptions = Object.entries(GENRE_LABELS) as [Genre, string][];

  // svelte-ignore state_referenced_locally
  let title = $state(movieDetail?.title ?? "");
  // svelte-ignore state_referenced_locally
  let synopsis = $state(movieDetail?.synopsis ?? "");
  // svelte-ignore state_referenced_locally
  let releaseYear = $state<number | null>(movieDetail?.releaseYear ?? null);
  // svelte-ignore state_referenced_locally
  let runtimeMinutes = $state<number | null>(
    movieDetail?.runtimeMinutes ?? null,
  );
  // svelte-ignore state_referenced_locally
  let genres = $state<Genre[]>(movieDetail?.genres ?? []);

  let submitted = $state(false);
  let submitting = $state(false);
  let serverError = $state<string | null>(null);

  const errors = $derived({
    title: title.trim() ? null : "Title is required",
    releaseYear:
      releaseYear == null ||
      (Number.isInteger(releaseYear) &&
        releaseYear >= 1888 &&
        releaseYear <= 2100)
        ? null
        : "Enter a year between 1888 and 2100",
    runtimeMinutes:
      runtimeMinutes == null ||
      (Number.isInteger(runtimeMinutes) && runtimeMinutes > 0)
        ? null
        : "Runtime must be a positive whole number of minutes",
  });
  const isValid = $derived(Object.values(errors).every((e) => e === null));

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    submitted = true;
    if (!isValid) return;

    submitting = true;
    serverError = null;
    try {
      await onSubmit({
        title: title.trim(),
        synopsis: synopsis.trim() || null,
        releaseYear,
        runtimeMinutes,
        genres,
      });
    } catch (err) {
      serverError = err instanceof Error ? err.message : "Something went wrong";
    } finally {
      submitting = false;
    }
  }
</script>

<form
  onsubmit={handleSubmit}
  novalidate
  class="space-y-6 rounded-lg border bg-white p-6 shadow-sm"
>
  {#if serverError}
    <p role="alert" class="rounded-md bg-red-50 p-3 text-sm text-red-700">
      {serverError}
    </p>
  {/if}

  <div>
    <label for="title" class="block text-sm font-medium"
      >Title <span class="text-red-600">*</span></label
    >
    <input
      id="title"
      bind:value={title}
      maxlength="255"
      aria-invalid={submitted && !!errors.title}
      class="mt-1 block w-full rounded-md border-gray-300"
    />
    {#if submitted && errors.title}<p class="mt-1 text-sm text-red-600">
        {errors.title}
      </p>{/if}
  </div>

  <div>
    <label for="synopsis" class="block text-sm font-medium">Synopsis</label>
    <textarea
      id="synopsis"
      rows="4"
      bind:value={synopsis}
      maxlength="4000"
      class="mt-1 block w-full rounded-md border-gray-300"></textarea>
  </div>

  <div class="grid gap-6 sm:grid-cols-2">
    <div>
      <label for="releaseYear" class="block text-sm font-medium"
        >Release year</label
      >
      <input
        id="releaseYear"
        type="number"
        bind:value={releaseYear}
        aria-invalid={submitted && !!errors.releaseYear}
        class="mt-1 block w-full rounded-md border-gray-300"
      />
      {#if submitted && errors.releaseYear}<p class="mt-1 text-sm text-red-600">
          {errors.releaseYear}
        </p>{/if}
    </div>
    <div>
      <label for="runtime" class="block text-sm font-medium"
        >Runtime (minutes)</label
      >
      <input
        id="runtime"
        type="number"
        bind:value={runtimeMinutes}
        aria-invalid={submitted && !!errors.runtimeMinutes}
        class="mt-1 block w-full rounded-md border-gray-300"
      />
      {#if submitted && errors.runtimeMinutes}<p
          class="mt-1 text-sm text-red-600"
        >
          {errors.runtimeMinutes}
        </p>{/if}
    </div>
  </div>

  <fieldset>
    <legend class="text-sm font-medium">Genres</legend>
    <div class="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
      {#each genreOptions as [value, label] (value)}
        <label class="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            {value}
            bind:group={genres}
            class="rounded border-gray-300"
          />
          {label}
        </label>
      {/each}
    </div>
  </fieldset>

  <div class="flex justify-end">
    <button
      type="submit"
      disabled={submitting}
      class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
    >
      {submitting ? "Saving…" : submitLabel}
    </button>
  </div>
</form>
