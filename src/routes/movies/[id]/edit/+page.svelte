<script lang="ts">
  import { UpdateMovieMutation } from "#lib/graphql/movies.ts";
  import { getContextClient } from "@urql/svelte";
  import MovieForm from "#lib/components/MovieForm/MovieForm.svelte";
  import { toast } from "#lib/state/toast/toast.svelte.ts";
  import { goto } from "$app/navigation";
  import { getMovieContext } from "../movie-context";

  const client = getContextClient();
  const context = getMovieContext();
</script>

<a
  href={`/movies/${context.movie.id}`}
  class="mb-4 inline-block text-sm text-gray-500 hover:text-gray-900">← Back</a
>

<MovieForm
  movieDetail={{
    title: context.movie.title,
    synopsis: context.movie.synopsis,
    releaseYear: context.movie.releaseYear,
    runtimeMinutes: context.movie.runtimeMinutes,
    genres: context.movie.genres,
  }}
  submitLabel="Save changes"
  onSubmit={async (movieDetail) => {
    const result = await client.mutation(UpdateMovieMutation, {
      id: context.movie.id,
      movieDetail,
    });
    if (result.error) throw result.error;
    toast.success(`${movieDetail.title} has been updated`);
    await goto(`/movies/${context.movie.id}`, {
      replaceState: true,
    });
  }}
/>
