<script lang="ts">
  import type { MovieCardFieldsFragment } from "#lib/graphql/generated/graphql.ts";

  let { movie }: { movie: MovieCardFieldsFragment } = $props();

  const formatGenre = (g: string) =>
    g
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
</script>

<a
  href="/movies/{movie.id}"
  class="group block overflow-hidden rounded-lg border bg-white shadow-sm transition hover:shadow-md"
>
  <div class="aspect-[2/3] bg-gray-100">
    {#if movie.artworkUrl}
      <img
        src={movie.artworkUrl}
        alt="{movie.title} poster"
        loading="lazy"
        class="h-full w-full object-cover"
      />
    {:else}
      <div
        class="flex h-full items-center justify-center text-4xl text-gray-300"
      >
        🎬
      </div>
    {/if}
  </div>
  <div class="p-3">
    <h2 class="truncate font-semibold group-hover:text-blue-600">
      {movie.title}
    </h2>
    <p class="text-sm text-gray-500">{movie.releaseYear ?? "—"}</p>
    {#if movie.genres.length}
      <p class="mt-1 truncate text-xs text-gray-400">
        {movie.genres.map(formatGenre).join(" · ")}
      </p>
    {/if}
  </div>
</a>
