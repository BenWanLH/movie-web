<script lang="ts">
  import { goto } from "$app/navigation";
  import { getContextClient } from "@urql/svelte";
  import { toast } from "#lib/state/toast/toast.svelte.ts";
  import PersonForm from "#lib/components/PersonForm/PersonForm.svelte";
  import { CreatePersonMutation } from "#lib/graphql/people.ts";

  const client = getContextClient();
</script>

<svelte:head><title>Add Person · MovieDB</title></svelte:head>

<a
  href={`/people`}
  class="mb-4 inline-block text-sm text-gray-500 hover:text-gray-900">← Back</a
>

<h1 class="mb-6 text-2xl font-semibold">Add person</h1>

<PersonForm
  submitLabel="Add Person"
  onSubmit={async (personDetail) => {
    const result = await client.mutation(CreatePersonMutation, {
      personDetail,
    });
    if (result.error) throw result.error;
    toast.success(`${personDetail.name} has been added`);
    await goto(`/people`, {
      replaceState: true,
    });
  }}
/>
