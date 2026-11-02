<script lang="ts">
  import { queryStore, getContextClient } from "@urql/svelte";
  import { MoviesQuery } from "#lib/graphql/movies.ts";
  import Loader from "#lib/components/Loader/Loader.svelte";
  import MovieCard from "#lib/components/MovieCard/MovieCard.svelte";
  import EmptyState from "#lib/components/EmptyState/EmptyState.svelte";
  import ErrorState from "#lib/components/ErrorState/ErrorState.svelte";

  const movies = queryStore({ client: getContextClient(), query: MoviesQuery });
</script>

<svelte:head><title>Movies · MovieDB</title></svelte:head>

<div class="mb-6 flex items-center justify-between">
  <h1 class="text-2xl font-semibold">Movies</h1>
  <a
    href="/movies/new"
    class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
  >
    Add movie
  </a>
</div>

{#if $movies.fetching}
  <div
    class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
  >
    {#each { length: 10 }, i (i)}
      <Loader />
    {/each}
  </div>
{:else if $movies.error}
  <ErrorState
    message={$movies.error.message}
    onRetry={() => movies.reexecute({ requestPolicy: "network-only" })}
  />
{:else if $movies.data?.movies.length === 0}
  <EmptyState title="No movies yet">
    <a
      class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      href="/movies/new"
    >
      Create one now!
    </a>
  </EmptyState>
{:else}
  <div
    class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
  >
    {#each $movies.data?.movies ?? [] as movie (movie.id)}
      <MovieCard {movie} />
    {/each}
  </div>
{/if}
