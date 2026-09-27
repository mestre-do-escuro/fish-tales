import { i as getSql } from "./db-DYGAv2qZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/spots-D5sUSP2Z.js
/** Reference forecast profiles; index matches `SPOTS` in public/peixe.html. */
var SPOT_PROFILES = [
	"Oeiras",
	"Guincho",
	"Cascais",
	"Carcavelos",
	"Costa da Caparica",
	"Sesimbra"
];
var IMAGE_TYPES = [
	"image/jpeg",
	"image/png",
	"image/webp"
];
/** Max decoded image size accepted by the server (bytes). */
var MAX_IMAGE_BYTES = 2621440;
function imageUrl(kind, id, version) {
	return `/api/images/${kind}/${id}?v=${version}`;
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/spots-db-27yxgrrd.js
/** All regions (sorted) with their spots; never selects image bytes. */
async function loadRegions() {
	const sql = await getSql();
	const [regions, spots] = await Promise.all([sql`
      select id, name, image_data is not null as has_image, image_version, image_focus
      from regions order by sort, id`, sql`
      select id, region_id, name, profile, seed, temp, wind, rain, coef, score,
             image_data is not null as has_image, image_version, image_focus
      from spots order by sort, id`]);
	const byRegion = /* @__PURE__ */ new Map();
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
			imageFocus: s.image_focus
		});
		byRegion.set(s.region_id, list);
	}
	return regions.map((r) => ({
		id: r.id,
		name: r.name,
		hasImage: r.has_image,
		imageVersion: r.image_version,
		imageFocus: r.image_focus,
		spots: byRegion.get(r.id) ?? []
	}));
}
async function loadImage(kind, id) {
	const sql = await getSql();
	const row = (kind === "region" ? await sql`
          select image_data, image_type from regions where id = ${id}` : await sql`
          select image_data, image_type from spots where id = ${id}`)[0];
	if (!row?.image_data || !row.image_type) return null;
	return {
		data: row.image_data,
		type: row.image_type
	};
}
//#endregion
export { SPOT_PROFILES as a, MAX_IMAGE_BYTES as i, loadRegions as n, imageUrl as o, IMAGE_TYPES as r, loadImage as t };
