<script lang="ts">
  import { DeleteMovieMutation, MovieQuery } from "#lib/graphql/movies.ts";
  import { getContextClient, queryStore } from "@urql/svelte";
  import type { PageProps } from "./$types";
  import ErrorState from "#lib/components/ErrorState/ErrorState.svelte";
  import { toast } from "#lib/state/toast/toast.svelte.ts";
  import { goto } from "$app/navigation";
  import { GENRE_LABELS } from "#lib/model/genre.ts";
  import { untrack } from "svelte";
  import ConfirmDialog from "#lib/components/ConfirmDialog/ConfirmDialog.svelte";

  let { params }: PageProps = $props();
  let shouldDisplayDeleteDialog = $state(false);
  let redirecting = false;
  let deleting = $state(false);

  const client = getContextClient();
  const movieQuery = $derived(
    queryStore({ client, query: MovieQuery, variables: { id: params.id } }),
  );

  $effect(() => {
    if (
      !redirecting &&
      !$movieQuery.fetching &&
      !$movieQuery.error &&
      $movieQuery.data &&
      !$movieQuery.data.movie
    ) {
      redirecting = true;
      untrack(() => toast.error("Movie not found"));
      goto("/movies", { replaceState: true });
    }
  });
</script>

<svelte:head>
  <title>{$movieQuery.data?.movie?.title ?? "Movie"} · MovieDB</title>
</svelte:head>

<a
  href="/movies"
  class="mb-4 inline-block text-sm text-gray-500 hover:text-gray-900"
  >← Back to movies</a
>

{#if $movieQuery.fetching}
  <div class="animate-pulse md:flex md:gap-8" aria-hidden="true">
    <div class="aspect-[2/3] w-full max-w-xs rounded-lg bg-gray-200"></div>
    <div class="mt-6 flex-1 space-y-3 md:mt-0">
      <div class="h-8 w-2/3 rounded bg-gray-200"></div>
      <div class="h-4 w-1/3 rounded bg-gray-200"></div>
      <div class="h-20 rounded bg-gray-200"></div>
    </div>
  </div>
  <p class="sr-only" role="status">Loading movie…</p>
{:else if $movieQuery.error}
  <ErrorState
    message={$movieQuery.error.message}
    onRetry={() => movieQuery.reexecute({ requestPolicy: "network-only" })}
  />
{:else if !$movieQuery.data?.movie}
  <!-- redirecting -->
{:else}
  {@const movie = $movieQuery.data!.movie!}
  <article class="md:flex md:gap-8">
    <div
      class="aspect-[2/3] w-full max-w-xs shrink-0 overflow-hidden rounded-lg bg-gray-100 shadow-sm"
    >
      {#if movie.artworkUrl}
        <img
          src={movie.artworkUrl}
          alt="{movie.title} poster"
          class="h-full w-full object-cover"
        />
      {:else}
        <div
          class="flex h-full items-center justify-center text-6xl text-gray-300"
        >
          🎬
        </div>
      {/if}
    </div>

    <div class="mt-6 flex-1 md:mt-0">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <h1 class="text-3xl font-bold">{movie.title}</h1>
        <div class="flex gap-2">
          <a
            href="/movies/{movie.id}/edit"
            class="rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50"
            >Edit</a
          >
          <button
            type="button"
            class="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
            onclick={() => (shouldDisplayDeleteDialog = true)}
          >
            Delete
          </button>
        </div>
      </div>

      <p class="mt-1 text-gray-500">
        {[
          movie.releaseYear,
          movie.runtimeMinutes && `${movie.runtimeMinutes} min`,
        ]
          .filter(Boolean)
          .join(" · ") || "—"}
      </p>

      {#if movie.genres.length}
        <ul class="mt-3 flex flex-wrap gap-2">
          {#each movie.genres as g (g)}
            <li
              class="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
            >
              {GENRE_LABELS[g]}
            </li>
          {/each}
        </ul>
      {/if}

      <p class="mt-6 whitespace-pre-line text-gray-700">
        {movie.synopsis ?? "No synopsis yet."}
      </p>

      <section class="mt-8">
        <h2 class="text-lg font-semibold">Cast & crew</h2>
        {#if movie.credits.length}
          <ul class="mt-3 divide-y rounded-lg border bg-white">
            {#each movie.credits as credit (credit.id)}
              <li class="flex items-center justify-between px-4 py-3 text-sm">
                <span>
                  <span class="font-medium"
                    >{credit.person?.name ?? "Unknown person"}</span
                  >
                  {#if credit.characterName}<span class="text-gray-500">
                      as {credit.characterName}</span
                    >{/if}
                </span>
                <span class="text-gray-500">{credit.role}</span>
              </li>
            {/each}
          </ul>
        {:else}
          <p class="mt-2 text-sm text-gray-500">No credits yet.</p>
        {/if}
      </section>
    </div>
  </article>

  <ConfirmDialog
    bind:open={shouldDisplayDeleteDialog}
    title="Are you sure you want to delete?"
    message="You cannot view this movie again once you delete it."
    confirmLabel="Delete"
    busy={deleting}
    onConfirm={async () => {
      deleting = true;
      const result = await client.mutation(
        DeleteMovieMutation,
        { id: movie.id },
        { additionalTypenames: ["Movie"] },
      );

      if (result.error) {
        deleting = false;
        toast.error("Error deleting movie, Please try again.");
      } else {
        toast.success(`Movie has been deleted`);
        redirecting = true;
        goto("/movies", { replaceState: true });
      }
    }}
  />
{/if}
