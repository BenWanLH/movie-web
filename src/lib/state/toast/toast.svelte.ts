export type Toast = { id: number; kind: 'success' | 'error'; message: string };

export const toasts = $state<Toast[]>([]);
let nextId = 0;

export function dismiss(id: number) {
  const i = toasts.findIndex((t) => t.id === id);
  if (i !== -1) toasts.splice(i, 1);
}

function push(kind: Toast['kind'], message: string, ms: number) {
  const id = nextId++;
  toasts.push({ id, kind, message });
  setTimeout(() => dismiss(id), ms);
}

export const toast = {
  success: (message: string) => push('success', message, 4000),
  error: (message: string) => push('error', message, 6000),
};