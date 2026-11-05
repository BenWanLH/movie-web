import type { ComponentProps } from 'svelte';
import { page } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import PersonForm from './PersonForm.svelte';

const nameInput = () => page.getByLabelText('Name');
const bioInput = () => page.getByLabelText('Bio');
const birthDateInput = () => page.getByLabelText('Birth Date');
const photoUrlInput = () => page.getByLabelText('Photo Url');
const submitButton = () => page.getByRole('button', { name: 'Create person' });

const PHOTO_URL_ERROR =
  'Invalid Photo url. Url should have less than 1000 characters and should start with either http:// or https://';

function localDate(daysFromToday: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);
  return date.toLocaleDateString('en-CA');
}

function renderForm(props: Partial<ComponentProps<typeof PersonForm>> = {}) {
  const onSubmit = vi.fn().mockResolvedValue(undefined);
  render(PersonForm, { onSubmit, submitLabel: 'Create person', ...props });
  return onSubmit;
}

async function fillValid() {
  await nameInput().fill('Keanu Reeves');
  await page.getByLabelText('Actor').click();
}

describe('PersonForm', () => {
  it('requires a name and does not submit', async () => {
    const onSubmit = renderForm();

    await page.getByLabelText('Actor').click();
    await submitButton().click();

    await expect.element(page.getByText('Name is required')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('treats a name of only spaces as missing', async () => {
    const onSubmit = renderForm();

    await nameInput().fill('   ');
    await page.getByLabelText('Actor').click();
    await submitButton().click();

    await expect.element(page.getByText('Name is required')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('requires at least one role', async () => {
    const onSubmit = renderForm();

    await nameInput().fill('Keanu Reeves');
    await submitButton().click();

    await expect.element(page.getByText('Person must have at least 1 role')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it.each([
    ['today', 0],
    ['tomorrow', 1],
  ])('rejects a birth date of %s', async (_, days) => {
    const onSubmit = renderForm();

    await fillValid();
    await birthDateInput().fill(localDate(days));
    await submitButton().click();

    await expect.element(page.getByText('Enter a date before today')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('accepts a birth date of yesterday', async () => {
    const onSubmit = renderForm();

    await fillValid();
    await birthDateInput().fill(localDate(-1));
    await submitButton().click();

    await vi.waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ birthDate: localDate(-1) })),
    );
  });

  it.each(['example.com/keanu.jpg', 'ftp://example.com/keanu.jpg'])(
    'rejects photo URL %s',
    async (url) => {
      const onSubmit = renderForm();

      await fillValid();
      await photoUrlInput().fill(url);
      await submitButton().click();

      await expect.element(page.getByText(PHOTO_URL_ERROR)).toBeInTheDocument();
      expect(onSubmit).not.toHaveBeenCalled();
    },
  );

  it('rejects a photo URL over 1000 characters', async () => {
    const onSubmit = renderForm({
      personDetail: {
        name: 'Keanu Reeves',
        roles: ['ACTOR'],
        photoUrl: `https://example.com/${'a'.repeat(1000)}`,
      },
    });

    await submitButton().click();

    await expect.element(page.getByText(PHOTO_URL_ERROR)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('rejects a bio over 2000 characters', async () => {
    // maxlength stops typing past 2000, so the long bio comes in through the prop
    const onSubmit = renderForm({
      personDetail: { name: 'Keanu Reeves', roles: ['ACTOR'], bio: 'a'.repeat(2001) },
    });

    await submitButton().click();

    await expect
      .element(page.getByText('Bio cannot be more than 2000 characters'))
      .toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits trimmed values, with blank optional fields as null', async () => {
    const onSubmit = renderForm();

    await nameInput().fill('  Keanu Reeves  ');
    await bioInput().fill('   ');
    await page.getByLabelText('Actor').click();
    await page.getByLabelText('Director').click();
    await submitButton().click();

    await vi.waitFor(() =>
      expect(onSubmit).toHaveBeenCalledExactlyOnceWith({
        name: 'Keanu Reeves',
        birthDate: null,
        bio: null,
        roles: ['ACTOR', 'DIRECTOR'],
        photoUrl: null,
      }),
    );
  });

  it('shows the error message when onSubmit fails', async () => {
    renderForm({ onSubmit: vi.fn().mockRejectedValue(new Error('Boom')) });

    await fillValid();
    await submitButton().click();

    await expect.element(page.getByRole('alert')).toHaveTextContent('Boom');
    await expect.element(submitButton()).toBeEnabled();
  });

  it('pre-fills the fields from personDetail', async () => {
    renderForm({
      personDetail: {
        name: 'Keanu Reeves',
        bio: 'Actor known for The Matrix.',
        birthDate: '1964-09-02',
        roles: ['ACTOR', 'DIRECTOR'],
        photoUrl: 'https://example.com/keanu.jpg',
      },
    });

    await expect.element(nameInput()).toHaveValue('Keanu Reeves');
    await expect.element(bioInput()).toHaveValue('Actor known for The Matrix.');
    await expect.element(birthDateInput()).toHaveValue('1964-09-02');
    await expect.element(photoUrlInput()).toHaveValue('https://example.com/keanu.jpg');
    await expect.element(page.getByLabelText('Actor')).toBeChecked();
    await expect.element(page.getByLabelText('Director')).toBeChecked();
    await expect.element(page.getByLabelText('Writer')).not.toBeChecked();
  });
});
