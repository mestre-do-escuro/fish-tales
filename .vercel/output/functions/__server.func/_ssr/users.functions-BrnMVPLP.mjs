import { a as ROLES, n as FEATURE_KEYS, r as PLANS, s as STATUSES } from "./access-B-_gt6kv.mjs";
import { n as createServerFn } from "./ssr.mjs";
import { n as createSsrRpc, t as adminMiddleware } from "./admin-auth-CVMIW43N.mjs";
import { cn as _enum, dn as boolean, gn as object, yn as string } from "../_libs/@better-auth/core+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/users.functions-BrnMVPLP.js
var optionalText = (max) => string().trim().max(max).transform((v) => v === "" ? null : v).nullable();
var profileFields = {
	name: string().trim().min(1, "O nome é obrigatório.").max(80),
	email: string().trim().toLowerCase().email("Email inválido."),
	role: _enum(ROLES),
	plan: _enum(PLANS),
	status: _enum(STATUSES),
	phone: optionalText(30),
	location: optionalText(80),
	bio: optionalText(500)
};
var password = string().min(8, "A palavra-passe precisa de pelo menos 8 caracteres.").max(128);
/** Hash with Better Auth's own scheme so the account can sign in normally. */
/** Refuse changes that would leave the backoffice without an active admin. */
var getUsers = createServerFn({ method: "GET" }).middleware([adminMiddleware]).handler(createSsrRpc("7f8859960fe22cec1b48d0e6633ef552e07f8516f2ec63609fa7e486ef84e20c"));
var createUser = createServerFn({ method: "POST" }).middleware([adminMiddleware]).validator(object({
	...profileFields,
	password
})).handler(createSsrRpc("39d053ca3c166648240f19533479adb240c32f2d28b6e9dda4814e0fad8105f2"));
var updateUser = createServerFn({ method: "POST" }).middleware([adminMiddleware]).validator(object({
	id: string().min(1),
	...profileFields,
	password: password.optional()
})).handler(createSsrRpc("3b8dca06958b3aa702766171b9df41a3bcd5601672814841b3d9b50eec9c1825"));
var deleteUser = createServerFn({ method: "POST" }).middleware([adminMiddleware]).validator(object({ id: string().min(1) })).handler(createSsrRpc("1b36e79fb17473cbea5838cc48bfefe7de129ef1bef3a743aa78716aa93765db"));
var getPlanMatrix = createServerFn({ method: "GET" }).middleware([adminMiddleware]).handler(createSsrRpc("7ebaf7d79b19da9faf93c3f97d57aaddc772115446615aced4028c0dcb9a66b4"));
var setPlanFeature = createServerFn({ method: "POST" }).middleware([adminMiddleware]).validator(object({
	plan: _enum(PLANS),
	feature: string().refine((f) => FEATURE_KEYS.has(f), "Funcionalidade desconhecida."),
	enabled: boolean()
})).handler(createSsrRpc("cd2a3e636a05c5de7cb84224b5b05111eefed34cb70f62bf60dd70a63381bbaa"));
//#endregion
export { setPlanFeature as a, getUsers as i, deleteUser as n, updateUser as o, getPlanMatrix as r, createUser as t };
