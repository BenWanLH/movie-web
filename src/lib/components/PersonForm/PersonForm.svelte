<script lang="ts">
  import type { Role, PersonDetail } from "#lib/graphql/generated/graphql.ts";
  import { ROLE_LABELS } from "#lib/model/role.ts";

  let {
    personDetail,
    submitLabel = "Save",
    onSubmit,
  }: {
    personDetail?: PersonDetail;
    submitLabel?: string;
    onSubmit: (detail: PersonDetail) => Promise<void>;
  } = $props();

  const roleOptions = Object.entries(ROLE_LABELS) as [Role, string][];

  let name = $state(personDetail?.name ?? "");
  let birthDate = $state(personDetail?.birthDate ?? "");
  let bio = $state(personDetail?.bio ?? "");
  let roles = $state<Role[]>(personDetail?.roles ?? []);
  let photoUrl = $state(personDetail?.photoUrl ?? "");

  let submitted = $state(false);
  let submitting = $state(false);
  let serverError = $state<string | null>(null);

  const today = new Date().toLocaleDateString("en-CA");

  const errors = $derived({
    name: name.trim() ? null : "Name is required",
    birthDate:
      birthDate == "" || birthDate < today ? null : "Enter a date before today",
    bio: bio.length <= 2000 ? null : "Bio cannot be more than 2000 characters",
    roles: roles.length >= 1 ? null : "Person must have at least 1 role",
    photoUrl:
      photoUrl == "" ||
      (photoUrl.length <= 1000 &&
        (photoUrl.startsWith("http://") || photoUrl.startsWith("https://")))
        ? null
        : "Invalid Photo url. Url should have less than 1000 characters and should start with either http:// or https://",
  });
  const isValid = $derived(Object.values(errors).every((e) => e === null));

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    submitted = true;
    if (!isValid) return;

    submitting = true;
    serverError = null;
    try {
      await onSubmit({
        name: name.trim(),
        birthDate: birthDate || null,
        bio: bio?.trim() || null,
        roles,
        photoUrl: photoUrl?.trim() || null,
      });
    } catch (err) {
      serverError = err instanceof Error ? err.message : "Something went wrong";
    } finally {
      submitting = false;
    }
  }
</script>

<form
  onsubmit={handleSubmit}
  novalidate
  class="space-y-6 rounded-lg border bg-white p-6 shadow-sm"
>
  {#if serverError}
    <p role="alert" class="rounded-md bg-red-50 p-3 text-sm text-red-700">
      {serverError}
    </p>
  {/if}

  <div>
    <label for="name" class="block text-sm font-medium"
      >Name <span class="text-red-600">*</span></label
    >
    <input
      id="name"
      bind:value={name}
      maxlength="255"
      aria-invalid={submitted && !!errors.name}
      class="mt-1 block w-full rounded-md border-gray-300"
    />
    {#if submitted && errors.name}<p class="mt-1 text-sm text-red-600">
        {errors.name}
      </p>{/if}
  </div>

  <div>
    <label for="bio" class="block text-sm font-medium">Bio</label>
    <textarea
      id="bio"
      rows="4"
      bind:value={bio}
      maxlength="2000"
      class="mt-1 block w-full rounded-md border-gray-300"></textarea>
    {#if submitted && errors.bio}<p class="mt-1 text-sm text-red-600">
        {errors.bio}
      </p>{/if}
  </div>

  <div class="grid gap-6 sm:grid-cols-2">
    <div>
      <label for="birthDate" class="block text-sm font-medium">Birth Date</label
      >
      <input
        id="birthDate"
        type="date"
        bind:value={birthDate}
        max={today}
        aria-invalid={submitted && !!errors.birthDate}
        class="mt-1 block w-full rounded-md border-gray-300"
      />
      {#if submitted && errors.birthDate}<p class="mt-1 text-sm text-red-600">
          {errors.birthDate}
        </p>{/if}
    </div>
    <div>
      <label for="photoUrl" class="block text-sm font-medium">Photo Url</label>
      <input
        type="url"
        id="photoUrl"
        bind:value={photoUrl}
        maxlength="1000"
        aria-invalid={submitted && !!errors.photoUrl}
        class="mt-1 block w-full rounded-md border-gray-300"
      />
      {#if submitted && errors.photoUrl}<p class="mt-1 text-sm text-red-600">
          {errors.photoUrl}
        </p>{/if}
    </div>
  </div>

  <fieldset>
    <legend class="text-sm font-medium">Roles</legend>
    <div class="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
      {#each roleOptions as [value, label] (value)}
        <label class="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            {value}
            bind:group={roles}
            class="rounded border-gray-300"
          />
          {label}
        </label>
      {/each}
    </div>
    {#if submitted && errors.roles}<p class="mt-1 text-sm text-red-600">
        {errors.roles}
      </p>{/if}
  </fieldset>

  <div class="flex justify-end">
    <button
      type="submit"
      disabled={submitting}
      class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
    >
      {submitting ? "Saving…" : submitLabel}
    </button>
  </div>
</form>
