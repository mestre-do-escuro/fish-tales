import { n as createServerFn, t as createMiddleware } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CN-evIEF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-auth-C0Z7AcCJ.js
/** Resolves the caller's profile (creating it on first sign-in), or null when signed out. */
var sessionMiddleware = createMiddleware({ type: "function" }).client(async ({ next }) => {
	const { getBearerToken } = await import("./client-CH2mWUg4.mjs").then((n) => n.n).then((n) => n.n);
	return next({ sendContext: { bearerToken: getBearerToken() ?? void 0 } });
}).server(async ({ next, context }) => {
	const { assertSameSiteRequest } = await import("./isolation.server-DdaYS3Bg.mjs");
	const { getSessionUser } = await import("./verify.server-BTtmfo53.mjs");
	const { ensureProfile } = await import("./users-db-D2jObJPI.mjs");
	assertSameSiteRequest();
	const user = await getSessionUser(context.bearerToken);
	return next({ context: { access: user ? await ensureProfile(user.id) : null } });
});
/** Every backoffice mutation: signed in, active, and admin. */
var getAdminGate_createServerFn_handler = createServerRpc({
	id: "2fad70560422e6a446fa7fe8fe48fa32c727621b3738619749b04b94a5afd324",
	name: "getAdminGate",
	filename: "src/lib/admin-auth.ts"
}, (opts) => getAdminGate.__executeServer(opts));
var getAdminGate = createServerFn({ method: "GET" }).middleware([sessionMiddleware]).handler(getAdminGate_createServerFn_handler, ({ context }) => {
	const { access } = context;
	if (!access) return { status: "signed-out" };
	if (access.role !== "admin" || access.status !== "active") return {
		status: "forbidden",
		email: access.email
	};
	return {
		status: "ok",
		admin: access
	};
});
var getMyAccess_createServerFn_handler = createServerRpc({
	id: "f42cbc19cf0a2023921a2ad2e93b75a159e00a5c70f38e718e0a8bc63490266b",
	name: "getMyAccess",
	filename: "src/lib/admin-auth.ts"
}, (opts) => getMyAccess.__executeServer(opts));
var getMyAccess = createServerFn({ method: "GET" }).middleware([sessionMiddleware]).handler(getMyAccess_createServerFn_handler, ({ context }) => context.access);
//#endregion
export { getAdminGate_createServerFn_handler, getMyAccess_createServerFn_handler };
