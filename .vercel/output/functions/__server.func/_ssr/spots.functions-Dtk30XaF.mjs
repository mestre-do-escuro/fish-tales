import { n as createServerFn } from "./ssr.mjs";
import { n as createSsrRpc, t as adminMiddleware } from "./admin-auth-CVMIW43N.mjs";
import { cn as _enum, gn as object, hn as number, yn as string } from "../_libs/@better-auth/core+[...].mjs";
import { a as SPOT_PROFILES, i as MAX_IMAGE_BYTES, r as IMAGE_TYPES } from "./spots-db-27yxgrrd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/spots.functions-Dtk30XaF.js
var name = string().trim().min(1, "O nome é obrigatório.").max(60, "O nome pode ter no máximo 60 caracteres.");
var id = number().int().positive();
var focus = number().int().min(0).max(100);
var image = object({
	data: string().max(Math.ceil(MAX_IMAGE_BYTES * 4 / 3) + 4, "A imagem é demasiado grande (máx. 2,5 MB).").regex(/^[A-Za-z0-9+/]+={0,2}$/, "Imagem inválida."),
	type: _enum(IMAGE_TYPES)
});
/** Check the decoded bytes really are the claimed JPEG/PNG/WebP. */
/** Turn unique-constraint violations into a readable message. */
var listRegions = createServerFn({ method: "GET" }).handler(createSsrRpc("09d2b0c14d4b272327a53298f3ea2ff6aba934d9d62a1b70e649823096de2b1d"));
var createRegion = createServerFn({ method: "POST" }).middleware([adminMiddleware]).validator(object({
	name,
	focus: focus.default(50),
	image: image.nullish()
})).handler(createSsrRpc("c697ae02b45f38a031c03ffdf716b0c78825c70f27735c31037534a7572d418b"));
var updateRegion = createServerFn({ method: "POST" }).middleware([adminMiddleware]).validator(object({
	id,
	name,
	focus,
	image: image.nullable().optional()
})).handler(createSsrRpc("5f0c38a840b8995c1de0fd0b1a8b61628c0b8814aa24a404913a37f99e936953"));
var deleteRegion = createServerFn({ method: "POST" }).middleware([adminMiddleware]).validator(object({ id })).handler(createSsrRpc("e72b2678f42001b54ab8009c05e416647e739321ffde254d94b0794bb919d5a7"));
var spotFields = {
	regionId: id,
	name,
	profile: number().int().min(0).max(SPOT_PROFILES.length - 1),
	focus
};
var createSpot = createServerFn({ method: "POST" }).middleware([adminMiddleware]).validator(object({
	...spotFields,
	image: image.nullish()
})).handler(createSsrRpc("862de7cafa5915e0a86e741116fb6fdc9349517a08c59b11a11d82fd32bb9000"));
var updateSpot = createServerFn({ method: "POST" }).middleware([adminMiddleware]).validator(object({
	id,
	...spotFields,
	image: image.nullable().optional()
})).handler(createSsrRpc("b1fbb56aec5b4fcfe96a9db4934028a249c34f84a7d687516bbd62f101092ace"));
var deleteSpot = createServerFn({ method: "POST" }).middleware([adminMiddleware]).validator(object({ id })).handler(createSsrRpc("08a651e6059cfa5e59ae04fddb4528a1df22a4ca18d2341199298df1ec18d396"));
//#endregion
export { listRegions as a, deleteSpot as i, createSpot as n, updateRegion as o, deleteRegion as r, updateSpot as s, createRegion as t };
