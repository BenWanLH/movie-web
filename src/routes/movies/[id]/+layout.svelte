<script lang="ts">
  import { MovieQuery } from "#lib/graphql/movies.ts";
  import { getContextClient, queryStore } from "@urql/svelte";
  import type { LayoutProps } from "./$types";
  import { setMovieContext } from "./movie-context";
  import { untrack } from "svelte";
  import { toast } from "#lib/state/toast/toast.svelte.ts";
  import { goto } from "$app/navigation";
  import ErrorState from "#lib/components/ErrorState/ErrorState.svelte";
  let { params, children }: LayoutProps = $props();

  let redirecting = false;
  const client = getContextClient();

  const movieQuery = $derived(
    queryStore({ client, query: MovieQuery, variables: { id: params.id } }),
  );

  setMovieContext({
    get movie() {
      return $movieQuery.data!.movie!;
    },
    refetch: () => movieQuery.reexecute({ requestPolicy: "network-only" }),
    setRedirecting: (value: boolean) => {
      redirecting = value;
    },
  });

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

{#if $movieQuery.fetching && !$movieQuery.data}
  <div class="animate-pulse md:flex md:gap-8" aria-hidden="true">
    <div class="aspect-[2/3] w-full max-w-xs rounded-lg bg-gray-200"></div>
    <div class="mt-6 flex-1 space-y-3 md:mt-0">
      <div class="h-8 w-2/3 rounded bg-gray-200"></div>
      <div class="h-4 w-1/3 rounded bg-gray-200"></div>
      <div class="h-20 rounded bg-gray-200"></div>
    </div>
  </div>
  <p class="sr-only" role="status">Loading movie…</p>
{:else if $movieQuery.error && !$movieQuery.data}
  <ErrorState
    message={$movieQuery.error.message}
    onRetry={() => movieQuery.reexecute({ requestPolicy: "network-only" })}
  />
{:else if !$movieQuery.data?.movie}
  <!-- redirecting -->
{:else}
  {@render children()}
{/if}
