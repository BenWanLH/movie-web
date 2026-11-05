<script lang="ts">
  import { untrack } from "svelte";
  import { getContextClient, queryStore } from "@urql/svelte";
  import { toast } from "#lib/state/toast/toast.svelte.ts";
  import { goto } from "$app/navigation";
  import {
    DeletePersonMutation,
    PersonQuery,
    UpdatePersonMutation,
  } from "#lib/graphql/people.ts";
  import ConfirmDialog from "#lib/components/ConfirmDialog/ConfirmDialog.svelte";
  import PersonForm from "#lib/components/PersonForm/PersonForm.svelte";
  import ErrorState from "#lib/components/ErrorState/ErrorState.svelte";
  import type { PageProps } from "./$types";

  let { params }: PageProps = $props();

  let shouldDisplayDeleteDialog = $state(false);
  let deleting = $state(false);

  let redirecting = false;
  const client = getContextClient();

  const personQuery = $derived(
    queryStore({
      client,
      query: PersonQuery,
      variables: { id: params.id },
      requestPolicy: "network-only",
    }),
  );

  $effect(() => {
    if (
      !redirecting &&
      !$personQuery.fetching &&
      !$personQuery.error &&
      $personQuery.data &&
      !$personQuery.data.person
    ) {
      redirecting = true;
      untrack(() => toast.error("Person not found"));
      goto("/people", { replaceState: true });
    }
  });
</script>

<svelte:head><title>Edit person · MovieDB</title></svelte:head>

<a
  href={`/people`}
  class="mb-4 inline-block text-sm text-gray-500 hover:text-gray-900">← Back</a
>

{#if $personQuery.fetching && !$personQuery.data}
  <div
    class="animate-pulse space-y-6 rounded-lg border bg-white p-6 shadow-sm"
    aria-hidden="true"
  >
    <!-- Name -->
    <div class="space-y-2">
      <div class="h-4 w-16 rounded bg-gray-200"></div>
      <div class="h-10 rounded-md bg-gray-200"></div>
    </div>

    <!-- Bio -->
    <div class="space-y-2">
      <div class="h-4 w-12 rounded bg-gray-200"></div>
      <div class="h-24 rounded-md bg-gray-200"></div>
    </div>

    <!-- Birth date + Photo URL (side by side from sm:) -->
    <div class="grid gap-6 sm:grid-cols-2">
      <div class="space-y-2">
        <div class="h-4 w-20 rounded bg-gray-200"></div>
        <div class="h-10 rounded-md bg-gray-200"></div>
      </div>
      <div class="space-y-2">
        <div class="h-4 w-20 rounded bg-gray-200"></div>
        <div class="h-10 rounded-md bg-gray-200"></div>
      </div>
    </div>

    <!-- Roles -->
    <div class="space-y-2">
      <div class="h-4 w-12 rounded bg-gray-200"></div>
      <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {#each { length: 4 }, i (i)}
          <div class="h-5 w-24 rounded bg-gray-200"></div>
        {/each}
      </div>
    </div>

    <!-- Save button -->
    <div class="flex justify-end">
      <div class="h-9 w-32 rounded-md bg-gray-200"></div>
    </div>
  </div>
  <p class="sr-only" role="status">Loading person…</p>
{:else if $personQuery.error && !$personQuery.data}
  <ErrorState
    message={$personQuery.error.message}
    onRetry={() => personQuery.reexecute({ requestPolicy: "network-only" })}
  />
{:else if !$personQuery.data?.person}
  <!-- redirecting -->
{:else}
  {@const person = $personQuery.data.person}

  <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
    <h1 class="text-2xl font-semibold">Edit {person.name}</h1>
    <button
      type="button"
      onclick={() => (shouldDisplayDeleteDialog = true)}
      class="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
    >
      Delete
    </button>
  </div>
  <PersonForm
    personDetail={{
      name: person.name,
      bio: person.bio,
      birthDate: person.birthDate,
      roles: person.roles,
      photoUrl: person.photoUrl,
    }}
    submitLabel="Save changes"
    onSubmit={async (personDetail) => {
      const result = await client.mutation(UpdatePersonMutation, {
        id: params.id,
        personDetail,
      });
      if (result.error) throw result.error;
      toast.success(`${personDetail.name} has been updated`);
      await goto(`/people`, {
        replaceState: true,
      });
    }}
  />

  <ConfirmDialog
    bind:open={shouldDisplayDeleteDialog}
    title="Delete {person.name}?"
    message="This permanently deletes {person.name} and removes them from every movie's cast & crew."
    busy={deleting}
    onConfirm={async () => {
      redirecting = true;
      deleting = true;

      const result = await client.mutation(
        DeletePersonMutation,
        { id: params.id },
        { additionalTypenames: ["Person", "Credit"] },
      );

      if (result.error) {
        redirecting = false;
        deleting = false;
        toast.error("Could not delete this person. Please try again.");
        return;
      }

      toast.success("Person deleted");
      await goto("/people", { replaceState: true });
    }}
  />
{/if}
