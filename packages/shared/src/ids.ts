/**
 * ID policy (v0):
 * - Use ULID strings (sortable, URL-safe) generated client-side.
 * - Server may generate if missing, but should accept client-generated IDs.
 *
 * Format: 26-char Crockford Base32 ULID, stored as plain string.
 */
export type Id = string;

