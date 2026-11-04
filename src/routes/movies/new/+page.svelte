<script lang="ts">
  import MovieForm from "#lib/components/MovieForm/MovieForm.svelte";
  import { goto } from "$app/navigation";
  import { CreateMovieMutation } from "#lib/graphql/movies.ts";
  import { getContextClient } from "@urql/svelte";
  import { toast } from "#lib/state/toast/toast.svelte.ts";

  const client = getContextClient();
</script>

<svelte:head><title>Add Movie · MovieDB</title></svelte:head>

<a
  href={`/movies`}
  class="mb-4 inline-block text-sm text-gray-500 hover:text-gray-900">← Back</a
>

<h1 class="mb-6 text-2xl font-semibold">Add Movie</h1>
<MovieForm
  submitLabel="Add movie"
  onSubmit={async (movieDetail) => {
    const result = await client.mutation(CreateMovieMutation, { movieDetail });
    if (result.error) throw result.error;
    toast.success(`${movieDetail.title} has been added`);
    await goto(`/movies/${result.data?.createMovie.id}`, {
      replaceState: true,
    });
  }}
/>
