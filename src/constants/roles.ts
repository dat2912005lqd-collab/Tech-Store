export const ROLES = ["admin", "moderator", "user"] as const;
export type Role = typeof ROLES[number];