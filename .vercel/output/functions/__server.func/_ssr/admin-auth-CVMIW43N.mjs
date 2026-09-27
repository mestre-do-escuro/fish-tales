import { i as getServerFnById, n as createServerFn, r as TSS_SERVER_FUNCTION, t as createMiddleware } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-auth-CVMIW43N.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
/**
* Auth middleware for server functions — the standard way to get the caller's
* verified user id. When deployed the session cookie is same-origin and rides
* along automatically. In the live preview the client also forwards the bearer
* token (partitioned cookies) via the `.client` hook below — call sites do not
* thread it themselves.
*
*   import { createServerFn } from "@tanstack/react-start";
*   import { getSql } from "@/lib/db";
*   import { authMiddleware } from "@/lib/auth/middleware";
*
*   export const listTodos = createServerFn({ method: "GET" })
*     .middleware([authMiddleware])
*     .handler(async ({ context }) => {
*       const sql = await getSql();
*       return sql`select * from todos where user_id = ${context.userId}`;
*     });
*
* Signed out with auth on (live preview included) -> throws `UnauthorizedError`
* (see `verify.server.ts`). With auth disabled (`VITE_AUTH_ENABLED=false`, the
* shipped default) it resolves the shared dev user — but throws instead when a
* `DATABASE_URL` is also set, so an app without sign-in must not use this at
* all. On the auth-on path, use it on every server function that touches
* per-user data and scope every query by `context.userId`.
*/
var authMiddleware = createMiddleware({ type: "function" }).client(async ({ next }) => {
	const { getBearerToken } = await import("./client-CH2mWUg4.mjs").then((n) => n.n).then((n) => n.n);
	return next({ sendContext: { bearerToken: getBearerToken() ?? void 0 } });
}).server(async ({ next, context }) => {
	const { assertSameSiteRequest } = await import("./isolation.server-DdaYS3Bg.mjs");
	const { requireUserId } = await import("./verify.server-BTtmfo53.mjs");
	assertSameSiteRequest();
	return next({ context: { userId: await requireUserId(context.bearerToken) } });
});
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
var adminMiddleware = createMiddleware({ type: "function" }).middleware([authMiddleware]).server(async ({ next, context }) => {
	const { ensureProfile } = await import("./users-db-D2jObJPI.mjs");
	const access = await ensureProfile(context.userId);
	if (!access || access.status !== "active" || access.role !== "admin") throw new Error("Sem permissão para esta operação.");
	return next({ context: { admin: access } });
});
/** Route guard for /admin/*. */
var getAdminGate = createServerFn({ method: "GET" }).middleware([sessionMiddleware]).handler(createSsrRpc("2fad70560422e6a446fa7fe8fe48fa32c727621b3738619749b04b94a5afd324"));
/** Called right after sign-in / sign-up: creates the profile and reports suspension. */
var getMyAccess = createServerFn({ method: "GET" }).middleware([sessionMiddleware]).handler(createSsrRpc("f42cbc19cf0a2023921a2ad2e93b75a159e00a5c70f38e718e0a8bc63490266b"));
//#endregion
export { getMyAccess as i, createSsrRpc as n, getAdminGate as r, adminMiddleware as t };
