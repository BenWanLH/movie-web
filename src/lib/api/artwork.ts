import axios from 'axios';

export const MAX_ARTWORK_BYTES = 5 * 1024 * 1024;
export const ALLOWED_ARTWORK_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function validateArtwork(file: File): string | null {
  if (!ALLOWED_ARTWORK_TYPES.includes(file.type)) return 'Only JPEG, PNG or WebP images are allowed';
  if (file.size === 0) return 'The file is empty';
  if (file.size > MAX_ARTWORK_BYTES) return 'Image must be 5 MB or smaller';
  return null;
}


export class UploadCancelledError extends Error {
  constructor() {
    super('Upload cancelled');
    this.name = 'UploadCancelledError';
  }
}

export type UploadHandle = {
  promise: Promise<void>;
  cancel: () => void;
};

export function uploadArtwork(
  movieId: string,
  file: File,
  onProgress: (percent: number) => void,
): UploadHandle {
  const controller = new AbortController();

  const body = new FormData();
  body.append('file', file);

  const promise = axios
    .post(`/movies/${movieId}/artwork`, body, {
      signal: controller.signal,
      onUploadProgress: (event) => {
        if (event.total) onProgress(Math.round((event.loaded / event.total) * 100));
      },
    })
    .then(() => undefined)
    .catch((error) => {
      if (axios.isCancel(error)) throw new UploadCancelledError();
      if (axios.isAxiosError(error) && error.response) throw new Error(messageForStatus(error.response.status));
      throw new Error('Network error. Check your connection and try again.');
    });

  return { promise, cancel: () => controller.abort() };
}

function messageForStatus(status: number): string {
  switch (status) {
    case 400: return 'That file is not a valid image.';
    case 404: return 'Movie not found.';
    case 413: return 'Image is too large (max 5 MB).';
    default: return `Upload failed (HTTP ${status}).`;
  }
}