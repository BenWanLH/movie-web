<script lang="ts">
  import { getContextClient, queryStore } from "@urql/svelte";
  import type { Role } from "#lib/graphql/generated/graphql.ts";
  import { PeopleQuery } from "#lib/graphql/people.ts";
  import { AddCreditMutation } from "#lib/graphql/movies.ts";
  import { ROLE_LABELS } from "#lib/model/role.ts";
  import { toast } from "#lib/state/toast/toast.svelte.ts";

  let { movieId }: { movieId: string } = $props();

  const client = getContextClient();
  const peopleQuery = queryStore({ client, query: PeopleQuery, variables: {} });

  let personId = $state("");
  let role = $state<Role | "">("");
  let characterName = $state("");
  let submitting = $state(false);
  let error = $state<string | null>(null);

  const people = $derived($peopleQuery.data?.people ?? []);
  const selectedPerson = $derived(people.find((p) => p.id === personId));
  const roleOptions = $derived(selectedPerson?.roles ?? []);

  function onPersonChange() {
    role = roleOptions.length === 1 ? roleOptions[0] : "";
    error = null;
  }

  async function addCredit(event: SubmitEvent) {
    event.preventDefault();
    if (!personId || !role) return;

    submitting = true;
    error = null;
    const result = await client.mutation(AddCreditMutation, {
      creditDetail: {
        movieId,
        personId,
        role,
        characterName: role === "ACTOR" ? characterName.trim() || null : null,
      },
    });
    submitting = false;

    if (result.error) {
      error =
        "Could not add this credit. They may already be credited in this role.";
      return;
    }
    toast.success(
      `${selectedPerson?.name} added as ${ROLE_LABELS[role].toLowerCase()}`,
    );
    personId = "";
    role = "";
    characterName = "";
  }
</script>

<form
  onsubmit={addCredit}
  class="mt-4 space-y-3 rounded-lg border bg-white p-4"
>
  <h3 class="text-sm font-semibold">Add cast or crew</h3>

  {#if $peopleQuery.fetching && !$peopleQuery.data}
    <p class="text-sm text-gray-500">Loading people…</p>
  {:else if people.length === 0}
    <p class="text-sm text-gray-500">
      No people yet. <a href="/people/new" class="text-blue-600 hover:underline"
        >Add someone first.</a
      >
    </p>
  {:else}
    <div class="grid gap-3 sm:grid-cols-3">
      <select
        bind:value={personId}
        onchange={onPersonChange}
        aria-label="Person"
        class="rounded-md border-gray-300 text-sm"
      >
        <option value="" disabled>Choose a person…</option>
        {#each people as p (p.id)}
          <option value={p.id}>{p.name}</option>
        {/each}
      </select>

      <select
        bind:value={role}
        disabled={!selectedPerson}
        aria-label="Role"
        class="rounded-md border-gray-300 text-sm disabled:bg-gray-100"
      >
        <option value="" disabled>Role…</option>
        {#each roleOptions as r (r)}
          <option value={r}>{ROLE_LABELS[r]}</option>
        {/each}
      </select>

      {#if role === "ACTOR"}
        <input
          bind:value={characterName}
          placeholder="Character (optional)"
          maxlength="255"
          aria-label="Character name"
          class="rounded-md border-gray-300 text-sm"
        />
      {/if}
    </div>

    {#if error}<p role="alert" class="text-sm text-red-600">{error}</p>{/if}

    <div class="flex justify-end">
      <button
        type="submit"
        disabled={!personId || !role || submitting}
        class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {submitting ? "Adding…" : "Add credit"}
      </button>
    </div>
  {/if}
</form>
