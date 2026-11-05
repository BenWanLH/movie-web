<script lang="ts">
  import EmptyState from "#lib/components/EmptyState/EmptyState.svelte";
  import ErrorState from "#lib/components/ErrorState/ErrorState.svelte";
  import PersonCard from "#lib/components/PersonCard/PersonCard.svelte";
  import SearchInput from "#lib/components/SearchInput/SearchInput.svelte";
  import type { Role } from "#lib/graphql/generated/graphql.ts";
  import { PeopleQuery } from "#lib/graphql/people.ts";
  import { isRole, ROLE_LABELS } from "#lib/model/role.ts";
  import { page } from "$app/state";
  import { getContextClient, queryStore } from "@urql/svelte";

  const client = getContextClient();

  const role = $derived.by(() => {
    const value = page.url.searchParams.get("role");
    return isRole(value) ? value : null;
  });

  let name = $state("");

  const emptyTitle = $derived(
    name
      ? `No movie personel name matches "${name}"`
      : role
        ? `No ${ROLE_LABELS[role].toLowerCase()}s yet`
        : "No movie personnel yet",
  );

  const peopleQuery = $derived(
    queryStore({
      client,
      query: PeopleQuery,
      variables: { roles: role ? [role] : undefined, name },
      requestPolicy: "cache-and-network",
      context: { additionalTypenames: ["Person"] },
    }),
  );

  const tabs = $derived([
    { href: "/people", label: "All", active: role === null },
    ...(Object.entries(ROLE_LABELS) as [Role, string][]).map(
      ([value, label]) => ({
        href: `/people?role=${value}`,
        label: `${label}s`,
        active: role === value,
      }),
    ),
  ]);
</script>

<svelte:head><title>People · MovieDB</title></svelte:head>
<div class="flex items-center justify-between">
  <h1 class="text-2xl font-semibold">People</h1>
  <a
    href="/people/new"
    class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
    >Add person</a
  >
</div>

<div class="mt-6">
  <SearchInput
    value={name}
    onSearch={(term) => (name = term)}
    loading={$peopleQuery.fetching}
  />
</div>

<nav aria-label="Filter by role" class="mt-6 mb-6 flex gap-2 overflow-x-auto">
  {#each tabs as tab (tab.href)}
    <a
      href={tab.href}
      aria-current={tab.active ? "page" : undefined}
      class="whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium
        {tab.active
        ? 'bg-blue-600 text-white'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
    >
      {tab.label}
    </a>
  {/each}
</nav>

{#if $peopleQuery.fetching}
  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {#each { length: 6 }, i (i)}
      <div
        class="flex animate-pulse items-center gap-4 rounded-lg border bg-white p-4"
        aria-hidden="true"
      >
        <div class="h-14 w-14 shrink-0 rounded-full bg-gray-200"></div>
        <div class="flex-1 space-y-2">
          <div class="h-4 w-2/3 rounded bg-gray-200"></div>
          <div class="h-3 w-1/3 rounded bg-gray-200"></div>
        </div>
      </div>
    {/each}
  </div>
{:else if $peopleQuery.error}
  <ErrorState
    message={$peopleQuery.error.message}
    onRetry={() => peopleQuery.reexecute({ requestPolicy: "network-only" })}
  />
{:else if $peopleQuery.data?.people.length === 0}
  <EmptyState title={emptyTitle}>
    <a
      class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      href="/people/new"
    >
      Add one now !
    </a>
  </EmptyState>
{:else}
  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {#each $peopleQuery.data?.people ?? [] as person (person.id)}
      <PersonCard {person} />
    {/each}
  </div>
{/if}
