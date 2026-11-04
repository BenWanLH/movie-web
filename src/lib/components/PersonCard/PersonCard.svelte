<script lang="ts">
  import type { PersonCardFieldsFragment } from "#lib/graphql/generated/graphql.ts";
  import { ROLE_LABELS } from "#lib/model/role.ts";

  let { person }: { person: PersonCardFieldsFragment } = $props();

  const initials = $derived(
    person.name
      .split(/\s+/)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase(),
  );
</script>

<a
  href="/people/{person.id}/edit"
  class="group flex items-center gap-4 rounded-lg border bg-white p-4 shadow-sm transition hover:shadow-md"
>
  {#if person.photoUrl}
    <img
      src={person.photoUrl}
      alt=""
      class="h-14 w-14 shrink-0 rounded-full object-cover"
    />
  {:else}
    <div
      aria-hidden="true"
      class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gray-200 text-lg font-semibold text-gray-600"
    >
      {initials}
    </div>
  {/if}
  <div class="min-w-0">
    <h2 class="truncate font-semibold group-hover:text-blue-600">
      {person.name}
    </h2>
    <ul class="mt-1 flex flex-wrap gap-1">
      {#each person.roles as role (role)}
        <li class="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
          {ROLE_LABELS[role]}
        </li>
      {/each}
    </ul>
  </div>
</a>
