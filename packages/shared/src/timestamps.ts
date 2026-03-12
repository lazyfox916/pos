/**
 * Timestamp policy (v0):
 * - Store timestamps as ISO-8601 strings (UTC) e.g. "2026-03-12T02:10:00.000Z"
 * - In early offline-first phases, the client will set these.
 * - Once server persistence is added, the server becomes authoritative for createdAt/updatedAt.
 */
export type IsoDateTime = string;

export type Timestamps = {
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
};

