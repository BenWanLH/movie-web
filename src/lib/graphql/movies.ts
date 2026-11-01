import { graphql } from './generated/index.ts';

export const MoviesQuery = graphql(`
  query Movies {
    movies { id title releaseYear }
  }
`);