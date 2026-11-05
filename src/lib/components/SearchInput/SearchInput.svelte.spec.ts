import { page, userEvent } from 'vitest/browser';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import SearchInput from './SearchInput.svelte';

const input = () => page.getByRole('textbox', { name: 'Search' });
const clearButton = () => page.getByRole('button', { name: 'Clear search' });

describe('SearchInput', () => {
  beforeEach(() => vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] }));
  afterEach(() => vi.useRealTimers());

  it('calls onSearch only after the debounce delay', async () => {
    const onSearch = vi.fn();
    render(SearchInput, { onSearch, delay: 300 });

    await input().fill('matrix');
    vi.advanceTimersByTime(299);
    expect(onSearch).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(onSearch).toHaveBeenCalledExactlyOnceWith('matrix');
  });

  it('restarts the timer while typing and searches once with the latest term', async () => {
    const onSearch = vi.fn();
    render(SearchInput, { onSearch, delay: 300 });

    await input().fill('mat');
    vi.advanceTimersByTime(200);
    await input().fill('matrix');
    vi.advanceTimersByTime(200);
    expect(onSearch).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(onSearch).toHaveBeenCalledExactlyOnceWith('matrix');
  });

  it('trims surrounding spaces', async () => {
    const onSearch = vi.fn();
    render(SearchInput, { onSearch, delay: 300 });

    await input().fill('  matrix  ');
    vi.advanceTimersByTime(300);

    expect(onSearch).toHaveBeenCalledExactlyOnceWith('matrix');
  });

  it('searches immediately on Enter and cancels the pending debounce', async () => {
    const onSearch = vi.fn();
    render(SearchInput, { onSearch, delay: 300 });

    await input().fill('matrix');
    await userEvent.keyboard('{Enter}');
    expect(onSearch).toHaveBeenCalledExactlyOnceWith('matrix');

    vi.advanceTimersByTime(300);
    expect(onSearch).toHaveBeenCalledTimes(1);
  });

  it('shows a clear button only when there is text, and clearing searches for ""', async () => {
    const onSearch = vi.fn();
    render(SearchInput, { onSearch, delay: 300 });

    await expect.element(clearButton()).not.toBeInTheDocument();

    await input().fill('matrix');
    await clearButton().click();

    await expect.element(input()).toHaveValue('');
    expect(onSearch).toHaveBeenCalledExactlyOnceWith('');
    await expect.element(clearButton()).not.toBeInTheDocument();
  });

  it('shows the spinner instead of the clear button while loading', async () => {
    render(SearchInput, { onSearch: vi.fn(), value: 'matrix', loading: true });

    await expect.element(page.getByRole('status', { name: 'Searching' })).toBeInTheDocument();
    await expect.element(clearButton()).not.toBeInTheDocument();
  });

  it('pre-fills the input from the value prop', async () => {
    render(SearchInput, { onSearch: vi.fn(), value: 'matrix' });

    await expect.element(input()).toHaveValue('matrix');
  });
});