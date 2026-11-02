import { graphql } from './generated/index.ts';


export const MovieCardFields = graphql(`
  fragment MovieCardFields on Movie {
    id title releaseYear genres artworkUrl
  }
`);

export const MoviesQuery = graphql(`
  query Movies {
    movies { ...MovieCardFields }
  }
`);


export const CreateMovieMutation = graphql(`
  mutation CreateMovie($movieDetail: MovieDetail!) {
    createMovie(movieDetail: $movieDetail) {
      id
    }
  }
`);