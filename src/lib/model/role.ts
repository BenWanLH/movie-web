import type { Role } from '#lib/graphql/generated/graphql.ts';

export const ROLE_LABELS: Record<Role, string> = {
  ACTOR: 'Actor',
  DIRECTOR: 'Director',
  WRITER: 'Writer',
  CREATOR: 'Creator',
};

export function isRole(value: string | null): value is Role {
  return value !== null && value in ROLE_LABELS;
}