import type { Genre } from '#lib/graphql/generated/graphql.ts';

export const GENRE_LABELS: Record<Genre, string> = {
  ACTION: 'Action',
  ADVENTURE: 'Adventure',
  ANIMATION: 'Animation',
  COMEDY: 'Comedy',
  CRIME: 'Crime',
  DOCUMENTARY: 'Documentary',
  DRAMA: 'Drama',
  FAMILY: 'Family',
  FANTASY: 'Fantasy',
  HORROR: 'Horror',
  MYSTERY: 'Mystery',
  ROMANCE: 'Romance',
  SCIENCE_FICTION: 'Science Fiction',
  THRILLER: 'Thriller',
  WAR: 'War',
  WESTERN: 'Western',
};