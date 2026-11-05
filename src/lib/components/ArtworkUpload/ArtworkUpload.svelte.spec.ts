import { page } from 'vitest/browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { MAX_ARTWORK_BYTES, uploadArtwork } from '#lib/api/artwork.ts';
import ArtworkUpload from './ArtworkUpload.svelte';

// keep the real validateArtwork and errors; only replace the network call
vi.mock('#lib/api/artwork.ts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('#lib/api/artwork.ts')>();
  return { ...actual, uploadArtwork: vi.fn() };
});

const upload = vi.mocked(uploadArtwork);

const uploadButton = () => page.getByRole('button', { name: 'Upload' });
const discardButton = () => page.getByRole('button', { name: 'Discard' });
const cancelButton = () => page.getByRole('button', { name: 'Cancel' });
const prompt = () => page.getByText('Drag an image here, or click to choose');

function makeFile(size: number, type: string, name = 'poster.png'): File {
  return new File([new Uint8Array(size)], name, { type });
}

function renderUpload(currentUrl: string | null = null) {
  const onUploaded = vi.fn();
  render(ArtworkUpload, { movieId: '1', currentUrl, onUploaded });
  return onUploaded;
}

// the file input is hidden, so find it directly instead of by role
async function choose(file: File) {
  const input = document.querySelector<HTMLInputElement>('input[type="file"]')!;
  await page.elementLocator(input).upload(file);
}

// an upload whose progress and outcome the test controls
function controlledUpload() {
  const { promise, resolve, reject } = Promise.withResolvers<void>();
  let reportProgress: (percent: number) => void = () => {};
  upload.mockImplementation((_movieId, _file, onProgress) => {
    reportProgress = onProgress;
    return { promise, cancel: vi.fn() };
  });
  return { resolve, reject, progress: (percent: number) => reportProgress(percent) };
}

describe('ArtworkUpload', () => {
  beforeEach(() => upload.mockReset());

  it('shows the prompt when there is no artwork', async () => {
    renderUpload();

    await expect.element(prompt()).toBeInTheDocument();
  });

  it('shows the current artwork with a change badge', async () => {
    renderUpload('/movies/1/artwork');

    await expect.element(page.getByRole('img', { name: 'Artwork preview' })).toHaveAttribute(
      'src',
      '/movies/1/artwork',
    );
    await expect.element(page.getByText('✎ Change')).toBeInTheDocument();
  });

  it('rejects a file of the wrong type', async () => {
    renderUpload();

    await choose(makeFile(1024, 'image/gif', 'poster.gif'));

    await expect
      .element(page.getByRole('alert'))
      .toHaveTextContent('Only JPEG, PNG or WebP images are allowed');
    await expect.element(uploadButton()).not.toBeInTheDocument();
  });

  it('rejects a file over 5 MB', async () => {
    renderUpload();

    await choose(makeFile(MAX_ARTWORK_BYTES + 1, 'image/png'));

    await expect.element(page.getByRole('alert')).toHaveTextContent('Image must be 5 MB or smaller');
    await expect.element(uploadButton()).not.toBeInTheDocument();
  });

  it('previews a valid file with Upload and Discard buttons', async () => {
    renderUpload();

    await choose(makeFile(1024, 'image/png'));

    await expect.element(page.getByRole('img', { name: 'Artwork preview' })).toBeInTheDocument();
    await expect.element(uploadButton()).toBeInTheDocument();
    await expect.element(discardButton()).toBeInTheDocument();
    expect(upload).not.toHaveBeenCalled();
  });

  it('goes back to the prompt on Discard', async () => {
    renderUpload();

    await choose(makeFile(1024, 'image/png'));
    await discardButton().click();

    await expect.element(prompt()).toBeInTheDocument();
    await expect.element(uploadButton()).not.toBeInTheDocument();
  });

  it('shows progress and Cancel while uploading, then calls onUploaded', async () => {
    const onUploaded = renderUpload();
    const pending = controlledUpload();

    await choose(makeFile(1024, 'image/png'));
    await uploadButton().click();

    expect(upload).toHaveBeenCalledWith('1', expect.any(File), expect.any(Function));
    await expect.element(cancelButton()).toBeInTheDocument();

    pending.progress(50);
    await expect.element(page.getByText('50%')).toBeInTheDocument();

    pending.resolve();
    await vi.waitFor(() => expect(onUploaded).toHaveBeenCalledOnce());
    await expect.element(cancelButton()).not.toBeInTheDocument();
    await expect.element(uploadButton()).not.toBeInTheDocument();
  });

  it('shows the error and keeps the file when the upload fails', async () => {
    const onUploaded = renderUpload();
    const pending = controlledUpload();

    await choose(makeFile(1024, 'image/png'));
    await uploadButton().click();
    pending.reject(new Error('Movie not found.'));

    await expect.element(page.getByRole('alert')).toHaveTextContent('Movie not found.');
    await expect.element(uploadButton()).toBeInTheDocument();
    expect(onUploaded).not.toHaveBeenCalled();
  });
});
