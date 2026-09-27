import { i as getSql, n as MAX_IMAGE_BYTES, r as SPOT_PROFILES, s as loadRegions, t as IMAGE_TYPES } from "./spots-CGM4tP9h.mjs";
import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { a as string, i as object, r as number, t as _enum } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/spots.functions-CDfxsVpe.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var name = string().trim().min(1, "O nome é obrigatório.").max(60, "O nome pode ter no máximo 60 caracteres.");
var id = number().int().positive();
var focus = number().int().min(0).max(100);
var image = object({
	data: string().max(Math.ceil(MAX_IMAGE_BYTES * 4 / 3) + 4, "A imagem é demasiado grande (máx. 2,5 MB).").regex(/^[A-Za-z0-9+/]+={0,2}$/, "Imagem inválida."),
	type: _enum(IMAGE_TYPES)
});
/** Check the decoded bytes really are the claimed JPEG/PNG/WebP. */
function assertImage(img) {
	const head = Buffer.from(img.data.slice(0, 24), "base64");
	if (!(img.type === "image/jpeg" ? head[0] === 255 && head[1] === 216 && head[2] === 255 : img.type === "image/png" ? head.subarray(0, 4).toString("latin1") === "PNG" : head.subarray(0, 4).toString("latin1") === "RIFF" && head.subarray(8, 12).toString("latin1") === "WEBP")) throw new Error("O ficheiro não é uma imagem JPEG, PNG ou WebP válida.");
}
/** Turn unique-constraint violations into a readable message. */
async function friendly(what, run) {
	try {
		return await run();
	} catch (err) {
		const code = err.code;
		if (code === "23505") throw new Error(`Já existe ${what} com esse nome.`);
		if (code === "23503") throw new Error("Esta região ainda tem spots; apague-os ou mova-os primeiro.");
		throw err;
	}
}
var rand = (min, max) => min + Math.random() * (max - min);
var randInt = (min, max) => Math.floor(rand(min, max + 1));
var listRegions_createServerFn_handler = createServerRpc({
	id: "09d2b0c14d4b272327a53298f3ea2ff6aba934d9d62a1b70e649823096de2b1d",
	name: "listRegions",
	filename: "src/lib/spots.functions.ts"
}, (opts) => listRegions.__executeServer(opts));
var listRegions = createServerFn({ method: "GET" }).handler(listRegions_createServerFn_handler, () => loadRegions());
var createRegion_createServerFn_handler = createServerRpc({
	id: "c697ae02b45f38a031c03ffdf716b0c78825c70f27735c31037534a7572d418b",
	name: "createRegion",
	filename: "src/lib/spots.functions.ts"
}, (opts) => createRegion.__executeServer(opts));
var createRegion = createServerFn({ method: "POST" }).validator(object({
	name,
	focus: focus.default(50),
	image: image.nullish()
})).handler(createRegion_createServerFn_handler, async ({ data }) => {
	if (data.image) assertImage(data.image);
	const sql = await getSql();
	await friendly("uma região", () => sql`
      insert into regions (name, sort, image_data, image_type, image_focus, image_version)
      values (
        ${data.name},
        (select coalesce(max(sort), 0) + 1 from regions),
        ${data.image?.data ?? null},
        ${data.image?.type ?? null},
        ${data.focus},
        ${data.image ? 1 : 0}
      )`);
	return loadRegions();
});
var updateRegion_createServerFn_handler = createServerRpc({
	id: "5f0c38a840b8995c1de0fd0b1a8b61628c0b8814aa24a404913a37f99e936953",
	name: "updateRegion",
	filename: "src/lib/spots.functions.ts"
}, (opts) => updateRegion.__executeServer(opts));
var updateRegion = createServerFn({ method: "POST" }).validator(object({
	id,
	name,
	focus,
	image: image.nullable().optional()
})).handler(updateRegion_createServerFn_handler, async ({ data }) => {
	if (data.image) assertImage(data.image);
	const sql = await getSql();
	if (!(await friendly("uma região", () => sql`
      update regions set name = ${data.name}, image_focus = ${data.focus}
      where id = ${data.id} returning id`)).length) throw new Error("Região não encontrada.");
	if (data.image !== void 0) await sql`
        update regions set
          image_data = ${data.image?.data ?? null},
          image_type = ${data.image?.type ?? null},
          image_version = image_version + 1
        where id = ${data.id}`;
	return loadRegions();
});
var deleteRegion_createServerFn_handler = createServerRpc({
	id: "e72b2678f42001b54ab8009c05e416647e739321ffde254d94b0794bb919d5a7",
	name: "deleteRegion",
	filename: "src/lib/spots.functions.ts"
}, (opts) => deleteRegion.__executeServer(opts));
var deleteRegion = createServerFn({ method: "POST" }).validator(object({ id })).handler(deleteRegion_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const [{ n }] = await sql`
      select count(*) as n from spots where region_id = ${data.id}`;
	if (n > 0) throw new Error("Só é possível apagar uma região sem spots.");
	await friendly("uma região", () => sql`delete from regions where id = ${data.id}`);
	return loadRegions();
});
var spotFields = {
	regionId: id,
	name,
	profile: number().int().min(0).max(SPOT_PROFILES.length - 1),
	focus
};
var createSpot_createServerFn_handler = createServerRpc({
	id: "862de7cafa5915e0a86e741116fb6fdc9349517a08c59b11a11d82fd32bb9000",
	name: "createSpot",
	filename: "src/lib/spots.functions.ts"
}, (opts) => createSpot.__executeServer(opts));
var createSpot = createServerFn({ method: "POST" }).validator(object({
	...spotFields,
	image: image.nullish()
})).handler(createSpot_createServerFn_handler, async ({ data }) => {
	if (data.image) assertImage(data.image);
	const sql = await getSql();
	const seed = Math.round(rand(.05, .95) * 100) / 100;
	const wind = Math.round(rand(.9, 1.3) * 100) / 100;
	await friendly("um spot nesta região", () => sql`
      insert into spots (region_id, name, profile, seed, temp, wind, rain, coef, score, sort,
                         image_data, image_type, image_focus, image_version)
      values (
        ${data.regionId}, ${data.name}, ${data.profile},
        ${seed}, ${randInt(-1, 1)}, ${wind}, ${randInt(-3, 4)}, ${randInt(-2, 2)}, ${randInt(-1, 1)},
        (select coalesce(max(sort), 0) + 1 from spots where region_id = ${data.regionId}),
        ${data.image?.data ?? null}, ${data.image?.type ?? null}, ${data.focus},
        ${data.image ? 1 : 0}
      )`);
	return loadRegions();
});
var updateSpot_createServerFn_handler = createServerRpc({
	id: "b1fbb56aec5b4fcfe96a9db4934028a249c34f84a7d687516bbd62f101092ace",
	name: "updateSpot",
	filename: "src/lib/spots.functions.ts"
}, (opts) => updateSpot.__executeServer(opts));
var updateSpot = createServerFn({ method: "POST" }).validator(object({
	id,
	...spotFields,
	image: image.nullable().optional()
})).handler(updateSpot_createServerFn_handler, async ({ data }) => {
	if (data.image) assertImage(data.image);
	const sql = await getSql();
	if (!(await friendly("um spot nesta região", () => sql`
      update spots set
        name = ${data.name},
        profile = ${data.profile},
        image_focus = ${data.focus},
        sort = case when region_id = ${data.regionId} then sort
                    else (select coalesce(max(sort), 0) + 1 from spots where region_id = ${data.regionId}) end,
        region_id = ${data.regionId}
      where id = ${data.id} returning id`)).length) throw new Error("Spot não encontrado.");
	if (data.image !== void 0) await sql`
        update spots set
          image_data = ${data.image?.data ?? null},
          image_type = ${data.image?.type ?? null},
          image_version = image_version + 1
        where id = ${data.id}`;
	return loadRegions();
});
var deleteSpot_createServerFn_handler = createServerRpc({
	id: "08a651e6059cfa5e59ae04fddb4528a1df22a4ca18d2341199298df1ec18d396",
	name: "deleteSpot",
	filename: "src/lib/spots.functions.ts"
}, (opts) => deleteSpot.__executeServer(opts));
var deleteSpot = createServerFn({ method: "POST" }).validator(object({ id })).handler(deleteSpot_createServerFn_handler, async ({ data }) => {
	await (await getSql())`delete from spots where id = ${data.id}`;
	return loadRegions();
});
//#endregion
export { createRegion_createServerFn_handler, createSpot_createServerFn_handler, deleteRegion_createServerFn_handler, deleteSpot_createServerFn_handler, listRegions_createServerFn_handler, updateRegion_createServerFn_handler, updateSpot_createServerFn_handler };
