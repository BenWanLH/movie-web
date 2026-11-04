<script lang="ts">
  import {
    DeleteMovieMutation,
    DeleteCreditMutation,
  } from "#lib/graphql/movies.ts";
  import { getContextClient } from "@urql/svelte";
  import { toast } from "#lib/state/toast/toast.svelte.ts";
  import { goto } from "$app/navigation";
  import { GENRE_LABELS } from "#lib/model/genre.ts";
  import ConfirmDialog from "#lib/components/ConfirmDialog/ConfirmDialog.svelte";
  import { getMovieContext } from "./movie-context";
  import ArtworkUpload from "#lib/components/ArtworkUpload/ArtworkUpload.svelte";
  import AddCreditForm from "#lib/components/AddCreditForm/AddCreditForm.svelte";
  import { ROLE_LABELS } from "#lib/model/role.ts";

  let shouldDisplayDeleteDialog = $state(false);
  let deleting = $state(false);
  let removingId = $state<string | null>(null);
  const client = getContextClient();

  const ctx = getMovieContext();

  async function removeCredit(creditId: string, name: string) {
    removingId = creditId;
    const result = await client.mutation(
      DeleteCreditMutation,
      { id: creditId },
      { additionalTypenames: ["Credit"] },
    );
    removingId = null;

    if (result.error) {
      toast.error(`Could not remove ${name}. Please try again.`);
      return;
    }
    toast.success(`${name} removed from cast & crew`);
  }
</script>

<svelte:head>
  <title>{ctx.movie.title ?? "Movie"} · MovieDB</title>
</svelte:head>

<a
  href="/movies"
  class="mb-4 inline-block text-sm text-gray-500 hover:text-gray-900"
  >← Back to movies</a
>
<article class="md:flex md:gap-8">
  <div class="w-full max-w-xs shrink-0">
    <ArtworkUpload
      movieId={ctx.movie.id}
      currentUrl={ctx.movie.artworkUrl}
      onUploaded={() => {
        ctx.refetch();
        toast.success("Artwork updated");
      }}
    />
  </div>

  <div class="mt-6 flex-1 md:mt-0">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <h1 class="text-3xl font-bold">{ctx.movie.title}</h1>
      <div class="flex gap-2">
        <a
          href="/movies/{ctx.movie.id}/edit"
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
        ctx.movie.releaseYear,
        ctx.movie.runtimeMinutes && `${ctx.movie.runtimeMinutes} min`,
      ]
        .filter(Boolean)
        .join(" · ") || "—"}
    </p>

    {#if ctx.movie.genres.length}
      <ul class="mt-3 flex flex-wrap gap-2">
        {#each ctx.movie.genres as g (g)}
          <li
            class="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
          >
            {GENRE_LABELS[g]}
          </li>
        {/each}
      </ul>
    {/if}

    <p class="mt-6 whitespace-pre-line text-gray-700">
      {ctx.movie.synopsis ?? "No synopsis yet."}
    </p>

    <section class="mt-8">
      <h2 class="text-lg font-semibold">Cast & crew</h2>
      {#if ctx.movie.credits.length}
        <ul class="mt-3 divide-y rounded-lg border bg-white">
          {#each ctx.movie.credits as credit (credit.id)}
            <li class="flex items-center justify-between px-4 py-3 text-sm">
              <span>
                <span class="font-medium"
                  >{credit.person?.name ?? "Unknown person"}</span
                >
                {#if credit.characterName}<span class="text-gray-500">
                    as {credit.characterName}</span
                  >{/if}
              </span>
              <span class="flex items-center gap-3">
                <span class="text-gray-500">{ROLE_LABELS[credit.role]}</span>
                <button
                  type="button"
                  onclick={() =>
                    removeCredit(
                      credit.id,
                      credit.person?.name ?? "Unknown person",
                    )}
                  disabled={removingId === credit.id}
                  aria-label="Remove {credit.person?.name ??
                    'unknown person'} ({ROLE_LABELS[credit.role]})"
                  class="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                >
                  {removingId === credit.id ? "…" : "✕"}
                </button>
              </span>
            </li>
          {/each}
        </ul>
      {:else}
        <p class="mt-2 text-sm text-gray-500">No credits yet.</p>
      {/if}
      <AddCreditForm movieId={ctx.movie.id} />
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
      { id: ctx.movie.id },
      { additionalTypenames: ["Movie"] },
    );

    if (result.error) {
      deleting = false;
      toast.error("Error deleting movie, Please try again.");
    } else {
      toast.success(`Movie has been deleted`);
      ctx.setRedirecting(true);
      goto("/movies", { replaceState: true });
    }
  }}
/>
