/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Genre =
  | 'ACTION'
  | 'ADVENTURE'
  | 'ANIMATION'
  | 'COMEDY'
  | 'CRIME'
  | 'DOCUMENTARY'
  | 'DRAMA'
  | 'FAMILY'
  | 'FANTASY'
  | 'HORROR'
  | 'MYSTERY'
  | 'ROMANCE'
  | 'SCIENCE_FICTION'
  | 'THRILLER'
  | 'WAR'
  | 'WESTERN';

export type MovieDetail = {
  genres: Array<Genre>;
  releaseYear?: number | null | undefined;
  runtimeMinutes?: number | null | undefined;
  synopsis?: string | null | undefined;
  title: string;
};

export type MovieCardFieldsFragment = { id: string, title: string, releaseYear: number | null, genres: Array<Genre>, artworkUrl: string | null };

export type MoviesQueryVariables = Exact<{ [key: string]: never; }>;


export type MoviesQuery = { movies: Array<{ id: string, title: string, releaseYear: number | null, genres: Array<Genre>, artworkUrl: string | null }> };

export type CreateMovieMutationVariables = Exact<{
  movieDetail: MovieDetail;
}>;


export type CreateMovieMutation = { createMovie: { id: string } };

export const MovieCardFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MovieCardFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Movie"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"releaseYear"}},{"kind":"Field","name":{"kind":"Name","value":"genres"}},{"kind":"Field","name":{"kind":"Name","value":"artworkUrl"}}]}}]} as unknown as DocumentNode<MovieCardFieldsFragment, unknown>;
export const MoviesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Movies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"movies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MovieCardFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MovieCardFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Movie"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"releaseYear"}},{"kind":"Field","name":{"kind":"Name","value":"genres"}},{"kind":"Field","name":{"kind":"Name","value":"artworkUrl"}}]}}]} as unknown as DocumentNode<MoviesQuery, MoviesQueryVariables>;
export const CreateMovieDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateMovie"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"movieDetail"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MovieDetail"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createMovie"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"movieDetail"},"value":{"kind":"Variable","name":{"kind":"Name","value":"movieDetail"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateMovieMutation, CreateMovieMutationVariables>;