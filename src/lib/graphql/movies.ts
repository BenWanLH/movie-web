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

export const MovieQuery = graphql(`
  query Movie($id: ID!) {
    movie(id: $id) {
      id title synopsis releaseYear runtimeMinutes genres artworkUrl
      credits { id role characterName person { id name } }
    }
  }
`);

export const CreateMovieMutation = graphql(`
  mutation CreateMovie($movieDetail: MovieDetail!) {
    createMovie(movieDetail: $movieDetail) {
      id
    }
  }
`);

export const DeleteMovieMutation = graphql(`
  mutation DeleteMovie($id: ID!) {
    deleteMovie(id: $id)
  }
`);