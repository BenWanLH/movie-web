<script lang="ts">
  import MovieForm from "#lib/components/MovieForm/MovieForm.svelte";
  import { goto } from "$app/navigation";
  import { CreateMovieMutation } from "#lib/graphql/movies.ts";
  import { getContextClient } from "@urql/svelte";
  import { toast } from "#lib/state/toast/toast.svelte.ts";

  const client = getContextClient();
</script>

<MovieForm
  submitLabel="Create movie"
  onSubmit={async (movieDetail) => {
    const result = await client.mutation(CreateMovieMutation, { movieDetail });
    if (result.error) throw result.error;
    toast.success(`${movieDetail.title} has been added`);
    await goto(`/movies/${result.data?.createMovie.id}`, {
      replaceState: true,
    });
  }}
/>
