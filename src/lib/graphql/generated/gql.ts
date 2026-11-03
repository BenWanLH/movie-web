/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  fragment MovieCardFields on Movie {\n    id title releaseYear genres artworkUrl\n  }\n": typeof types.MovieCardFieldsFragmentDoc,
    "\n  query Movies {\n    movies { ...MovieCardFields }\n  }\n": typeof types.MoviesDocument,
    "\n  query Movie($id: ID!) {\n    movie(id: $id) {\n      id title synopsis releaseYear runtimeMinutes genres artworkUrl\n      credits { id role characterName person { id name } }\n    }\n  }\n": typeof types.MovieDocument,
    "\n  mutation CreateMovie($movieDetail: MovieDetail!) {\n    createMovie(movieDetail: $movieDetail) {\n      id\n    }\n  }\n": typeof types.CreateMovieDocument,
    "\n  mutation DeleteMovie($id: ID!) {\n    deleteMovie(id: $id)\n  }\n": typeof types.DeleteMovieDocument,
    "\n  mutation UpdateMovie($id: ID!, $movieDetail: MovieDetail!) {\n    updateMovie(id: $id, movieDetail: $movieDetail) {\n      id\n    }\n  }\n": typeof types.UpdateMovieDocument,
    "\n  fragment PersonCardFields on Person {\n    id name roles photoUrl\n  }\n": typeof types.PersonCardFieldsFragmentDoc,
    "\n  query People($roles: [Role!], $name: String) {\n     people(roles: $roles, name: $name) {\n      ...PersonCardFields\n    }\n  }\n": typeof types.PeopleDocument,
    "\n  query Person($id: ID!) {\n     person(id: $id) {\n       id name roles birthDate bio photoUrl\n    }\n  }\n": typeof types.PersonDocument,
    "\n  mutation CreatePerson($personDetail: PersonDetail!) {\n     createPerson(personDetail: $personDetail) {\n       id\n    }\n  }\n": typeof types.CreatePersonDocument,
    "\n  mutation UpdatePerson($id: ID!, $personDetail: PersonDetail!) {\n     updatePerson(id: $id, personDetail: $personDetail) {\n       id\n    }\n  }\n": typeof types.UpdatePersonDocument,
    "\n  mutation DeletePerson($id: ID!) {\n     deletePerson(id: $id)\n  }\n": typeof types.DeletePersonDocument,
};
const documents: Documents = {
    "\n  fragment MovieCardFields on Movie {\n    id title releaseYear genres artworkUrl\n  }\n": types.MovieCardFieldsFragmentDoc,
    "\n  query Movies {\n    movies { ...MovieCardFields }\n  }\n": types.MoviesDocument,
    "\n  query Movie($id: ID!) {\n    movie(id: $id) {\n      id title synopsis releaseYear runtimeMinutes genres artworkUrl\n      credits { id role characterName person { id name } }\n    }\n  }\n": types.MovieDocument,
    "\n  mutation CreateMovie($movieDetail: MovieDetail!) {\n    createMovie(movieDetail: $movieDetail) {\n      id\n    }\n  }\n": types.CreateMovieDocument,
    "\n  mutation DeleteMovie($id: ID!) {\n    deleteMovie(id: $id)\n  }\n": types.DeleteMovieDocument,
    "\n  mutation UpdateMovie($id: ID!, $movieDetail: MovieDetail!) {\n    updateMovie(id: $id, movieDetail: $movieDetail) {\n      id\n    }\n  }\n": types.UpdateMovieDocument,
    "\n  fragment PersonCardFields on Person {\n    id name roles photoUrl\n  }\n": types.PersonCardFieldsFragmentDoc,
    "\n  query People($roles: [Role!], $name: String) {\n     people(roles: $roles, name: $name) {\n      ...PersonCardFields\n    }\n  }\n": types.PeopleDocument,
    "\n  query Person($id: ID!) {\n     person(id: $id) {\n       id name roles birthDate bio photoUrl\n    }\n  }\n": types.PersonDocument,
    "\n  mutation CreatePerson($personDetail: PersonDetail!) {\n     createPerson(personDetail: $personDetail) {\n       id\n    }\n  }\n": types.CreatePersonDocument,
    "\n  mutation UpdatePerson($id: ID!, $personDetail: PersonDetail!) {\n     updatePerson(id: $id, personDetail: $personDetail) {\n       id\n    }\n  }\n": types.UpdatePersonDocument,
    "\n  mutation DeletePerson($id: ID!) {\n     deletePerson(id: $id)\n  }\n": types.DeletePersonDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment MovieCardFields on Movie {\n    id title releaseYear genres artworkUrl\n  }\n"): (typeof documents)["\n  fragment MovieCardFields on Movie {\n    id title releaseYear genres artworkUrl\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Movies {\n    movies { ...MovieCardFields }\n  }\n"): (typeof documents)["\n  query Movies {\n    movies { ...MovieCardFields }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Movie($id: ID!) {\n    movie(id: $id) {\n      id title synopsis releaseYear runtimeMinutes genres artworkUrl\n      credits { id role characterName person { id name } }\n    }\n  }\n"): (typeof documents)["\n  query Movie($id: ID!) {\n    movie(id: $id) {\n      id title synopsis releaseYear runtimeMinutes genres artworkUrl\n      credits { id role characterName person { id name } }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateMovie($movieDetail: MovieDetail!) {\n    createMovie(movieDetail: $movieDetail) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation CreateMovie($movieDetail: MovieDetail!) {\n    createMovie(movieDetail: $movieDetail) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteMovie($id: ID!) {\n    deleteMovie(id: $id)\n  }\n"): (typeof documents)["\n  mutation DeleteMovie($id: ID!) {\n    deleteMovie(id: $id)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateMovie($id: ID!, $movieDetail: MovieDetail!) {\n    updateMovie(id: $id, movieDetail: $movieDetail) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateMovie($id: ID!, $movieDetail: MovieDetail!) {\n    updateMovie(id: $id, movieDetail: $movieDetail) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment PersonCardFields on Person {\n    id name roles photoUrl\n  }\n"): (typeof documents)["\n  fragment PersonCardFields on Person {\n    id name roles photoUrl\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query People($roles: [Role!], $name: String) {\n     people(roles: $roles, name: $name) {\n      ...PersonCardFields\n    }\n  }\n"): (typeof documents)["\n  query People($roles: [Role!], $name: String) {\n     people(roles: $roles, name: $name) {\n      ...PersonCardFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Person($id: ID!) {\n     person(id: $id) {\n       id name roles birthDate bio photoUrl\n    }\n  }\n"): (typeof documents)["\n  query Person($id: ID!) {\n     person(id: $id) {\n       id name roles birthDate bio photoUrl\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreatePerson($personDetail: PersonDetail!) {\n     createPerson(personDetail: $personDetail) {\n       id\n    }\n  }\n"): (typeof documents)["\n  mutation CreatePerson($personDetail: PersonDetail!) {\n     createPerson(personDetail: $personDetail) {\n       id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdatePerson($id: ID!, $personDetail: PersonDetail!) {\n     updatePerson(id: $id, personDetail: $personDetail) {\n       id\n    }\n  }\n"): (typeof documents)["\n  mutation UpdatePerson($id: ID!, $personDetail: PersonDetail!) {\n     updatePerson(id: $id, personDetail: $personDetail) {\n       id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeletePerson($id: ID!) {\n     deletePerson(id: $id)\n  }\n"): (typeof documents)["\n  mutation DeletePerson($id: ID!) {\n     deletePerson(id: $id)\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;