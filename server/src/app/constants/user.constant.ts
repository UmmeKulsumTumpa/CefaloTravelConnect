export const ROLES = {
  TRAVELER: 'traveler',
  EXPLORER: 'explorer',
  ADMIN: 'admin',
} as const; // type assertion

export type Role = typeof ROLES[keyof typeof ROLES];
