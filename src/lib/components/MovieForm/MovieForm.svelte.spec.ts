import type { ComponentProps } from 'svelte';
import { page } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import MovieForm from './MovieForm.svelte';

const titleInput = () => page.getByLabelText('Title');
const synopsisInput = () => page.getByLabelText('Synopsis');
const yearInput = () => page.getByLabelText('Release year');
const runtimeInput = () => page.getByLabelText('Runtime (minutes)');
const submitButton = () => page.getByRole('button', { name: 'Create movie' });

function renderForm(props: Partial<ComponentProps<typeof MovieForm>> = {}) {
  const onSubmit = vi.fn().mockResolvedValue(undefined);
  render(MovieForm, { onSubmit, submitLabel: 'Create movie', ...props });
  return onSubmit;
}

describe('MovieForm', () => {

  it('requires a title and does not submit', async () => {
    const onSubmit = renderForm();

    await submitButton().click();

    await expect.element(page.getByText('Title is required')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('treats a title of only spaces as missing', async () => {
    const onSubmit = renderForm();

    await titleInput().fill('   ');
    await submitButton().click();

    await expect.element(page.getByText('Title is required')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it.each(['1887', '2101', '1999.5'])('rejects release year %s', async (year) => {
    const onSubmit = renderForm();

    await titleInput().fill('The Matrix');
    await yearInput().fill(year);
    await submitButton().click();

    await expect.element(page.getByText('Enter a year between 1888 and 2100')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it.each(['1888', '2100'])('accepts boundary release year %s', async (year) => {
    const onSubmit = renderForm();

    await titleInput().fill('The Matrix');
    await yearInput().fill(year);
    await submitButton().click();

    await vi.waitFor(() => expect(onSubmit).toHaveBeenCalledOnce());
  });

  it.each(['0', '-5', '90.5'])('rejects runtime %s', async (runtime) => {
    const onSubmit = renderForm();

    await titleInput().fill('The Matrix');
    await runtimeInput().fill(runtime);
    await submitButton().click();

    await expect
      .element(page.getByText('Runtime must be a positive whole number of minutes'))
      .toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits trimmed values, with blank optional fields as null', async () => {
    const onSubmit = renderForm();

    await titleInput().fill('  The Matrix  ');
    await synopsisInput().fill('   ');
    await page.getByLabelText('Action').click();
    await page.getByLabelText('Science Fiction').click();
    await submitButton().click();

    await vi.waitFor(() =>
      expect(onSubmit).toHaveBeenCalledExactlyOnceWith({
        title: 'The Matrix',
        synopsis: null,
        releaseYear: null,
        runtimeMinutes: null,
        genres: ['ACTION', 'SCIENCE_FICTION'],
      }),
    );
  });

  it('shows the error message when onSubmit fails', async () => {
    renderForm({ onSubmit: vi.fn().mockRejectedValue(new Error('Boom')) });

    await titleInput().fill('The Matrix');
    await submitButton().click();

    await expect.element(page.getByRole('alert')).toHaveTextContent('Boom');
    await expect.element(submitButton()).toBeEnabled();
  });

  it('pre-fills the fields from movieDetail', async () => {
    renderForm({
      movieDetail: {
        title: 'The Matrix',
        synopsis: 'A hacker learns the truth.',
        releaseYear: 1999,
        runtimeMinutes: 136,
        genres: ['ACTION'],
      },
    });

    await expect.element(titleInput()).toHaveValue('The Matrix');
    await expect.element(synopsisInput()).toHaveValue('A hacker learns the truth.');
    await expect.element(yearInput()).toHaveValue(1999);
    await expect.element(runtimeInput()).toHaveValue(136);
    await expect.element(page.getByLabelText('Action')).toBeChecked();
    await expect.element(page.getByLabelText('Drama')).not.toBeChecked();
  });
});
