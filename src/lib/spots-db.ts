// Server-only queries for regions/spots. Import only from server handlers.
import { getSql } from "@/lib/db";
import type { RegionRow, SpotRow } from "@/lib/spots";

interface RegionDbRow {
  id: number;
  name: string;
  has_image: boolean;
  image_version: number;
  image_focus: number;
}

interface SpotDbRow {
  id: number;
  region_id: number;
  name: string;
  profile: number;
  seed: number;
  temp: number;
  wind: number;
  rain: number;
  coef: number;
  score: number;
  has_image: boolean;
  image_version: number;
  image_focus: number;
}

/** All regions (sorted) with their spots; never selects image bytes. */
export async function loadRegions(): Promise<RegionRow[]> {
  const sql = await getSql();
  const [regions, spots] = await Promise.all([
    sql<RegionDbRow>`
      select id, name, image_data is not null as has_image, image_version, image_focus
      from regions order by sort, id`,
    sql<SpotDbRow>`
      select id, region_id, name, profile, seed, temp, wind, rain, coef, score,
             image_data is not null as has_image, image_version, image_focus
      from spots order by sort, id`,
  ]);
  const byRegion = new Map<number, SpotRow[]>();
  for (const s of spots) {
    const list = byRegion.get(s.region_id) ?? [];
    list.push({
      id: s.id,
      regionId: s.region_id,
      name: s.name,
      profile: s.profile,
      seed: Math.round(Number(s.seed) * 100) / 100,
      temp: s.temp,
      wind: Math.round(Number(s.wind) * 100) / 100,
      rain: s.rain,
      coef: s.coef,
      score: s.score,
      hasImage: s.has_image,
      imageVersion: s.image_version,
      imageFocus: s.image_focus,
    });
    byRegion.set(s.region_id, list);
  }
  return regions.map((r) => ({
    id: r.id,
    name: r.name,
    hasImage: r.has_image,
    imageVersion: r.image_version,
    imageFocus: r.image_focus,
    spots: byRegion.get(r.id) ?? [],
  }));
}

export async function loadImage(
  kind: "region" | "spot",
  id: number,
): Promise<{ data: string; type: string } | null> {
  const sql = await getSql();
  const rows =
    kind === "region"
      ? await sql<{ image_data: string | null; image_type: string | null }>`
          select image_data, image_type from regions where id = ${id}`
      : await sql<{ image_data: string | null; image_type: string | null }>`
          select image_data, image_type from spots where id = ${id}`;
  const row = rows[0];
  if (!row?.image_data || !row.image_type) return null;
  return { data: row.image_data, type: row.image_type };
}
