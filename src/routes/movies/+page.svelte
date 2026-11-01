<script lang="ts">
  import { queryStore, getContextClient } from "@urql/svelte";
  import { MoviesQuery } from "#lib/graphql/movies.ts";

  const movies = queryStore({ client: getContextClient(), query: MoviesQuery });
</script>

{#if $movies.fetching}
  <p>Loading…</p>
{:else if $movies.error}
  <p class="text-red-600">{$movies.error.message}</p>
{:else if $movies.data?.movies.length === 0}
  <p>No movies yet.</p>
{:else}
  <ul>
    {#each $movies.data?.movies ?? [] as m (m.id)}<li>
        {m.title} ({m.releaseYear ?? "—"})
      </li>{/each}
  </ul>
{/if}
