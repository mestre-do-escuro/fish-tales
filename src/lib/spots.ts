// Shared (client-safe) types and constants for regions/spots.

/** Reference forecast profiles; index matches `SPOTS` in public/peixe.html. */
export const SPOT_PROFILES = [
  "Oeiras",
  "Guincho",
  "Cascais",
  "Carcavelos",
  "Costa da Caparica",
  "Sesimbra",
] as const;

export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export type ImageType = (typeof IMAGE_TYPES)[number];

/** Max decoded image size accepted by the server (bytes). */
export const MAX_IMAGE_BYTES = 2.5 * 1024 * 1024;

export interface SpotRow {
  id: number;
  regionId: number;
  name: string;
  profile: number;
  seed: number;
  temp: number;
  wind: number;
  rain: number;
  coef: number;
  score: number;
  hasImage: boolean;
  imageVersion: number;
  imageFocus: number;
}

export interface RegionRow {
  id: number;
  name: string;
  hasImage: boolean;
  imageVersion: number;
  imageFocus: number;
  spots: SpotRow[];
}

export function imageUrl(kind: "region" | "spot", id: number, version: number) {
  return `/api/images/${kind}/${id}?v=${version}`;
}
