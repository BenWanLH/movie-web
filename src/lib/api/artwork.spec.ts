import axios, { AxiosError, CanceledError } from 'axios';
import { vi, beforeEach, afterAll } from 'vitest';
import { describe, expect, it } from 'vitest';
import { MAX_ARTWORK_BYTES, validateArtwork, uploadArtwork, UploadCancelledError } from './artwork.ts';

vi.mock('axios', async (importOriginal) => {
  const actual = await importOriginal<typeof import('axios')>();
  return { ...actual, default: { ...actual.default, post: vi.fn() } };
});

const post = vi.mocked(axios.post);

beforeEach(() => post.mockReset());

afterAll(() => vi.restoreAllMocks());

function httpError(status: number) {
  return new AxiosError('fail', undefined, undefined, undefined, { status } as any);
}

it('maps error to a friendly message', async () => {
  post.mockRejectedValueOnce(httpError(413));
  let response1 = uploadArtwork('1', makeFile(10, 'image/png'), vi.fn());
  await expect(response1.promise).rejects.toThrow('Image is too large (max 5 MB).');

  post.mockRejectedValueOnce(httpError(404));
  let response2 = uploadArtwork('1', makeFile(10, 'image/png'), vi.fn());
  await expect(response2.promise).rejects.toThrow('Movie not found.');

  post.mockRejectedValueOnce(httpError(400));
  let response3 = uploadArtwork('1', makeFile(10, 'image/png'), vi.fn());
  await expect(response3.promise).rejects.toThrow('That file is not a valid image.');
});


function makeFile(size: number, type: string, name = 'poster'): File {
  return new File([new Uint8Array(size)], name, { type });
}

describe('validateArtwork', () => {
  it.each(['image/jpeg', 'image/png', 'image/webp'])('accepts %s', (type) => {
    expect(validateArtwork(makeFile(1024, type))).toBeNull();
  });

  it.each(['image/gif', 'text/plain', 'application/pdf', ''])('rejects type "%s"', (type) => {
    expect(validateArtwork(makeFile(1024, type))).toBe('Only JPEG, PNG or WebP images are allowed');
  });

  it('rejects an empty file', () => {
    expect(validateArtwork(makeFile(0, 'image/png'))).toBe('The file is empty');
  });

  it('accepts a file of exactly 5 MB', () => {
    expect(validateArtwork(makeFile(MAX_ARTWORK_BYTES, 'image/jpeg'))).toBeNull();
  });

  it('rejects a file one byte over 5 MB', () => {
    expect(validateArtwork(makeFile(MAX_ARTWORK_BYTES + 1, 'image/jpeg'))).toBe(
      'Image must be 5 MB or smaller',
    );
  });
});