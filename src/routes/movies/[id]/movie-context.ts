import { createContext } from 'svelte';
import type { MovieQuery } from '#lib/graphql/generated/graphql.ts';

type Movie = NonNullable<MovieQuery['movie']>;

export const [getMovieContext, setMovieContext] = createContext<{
  readonly movie: Movie;
  refetch: () => void;
  setRedirecting: (redirecting: boolean) => void;
}>();