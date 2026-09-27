import { l as buildMatrix } from "./access-B-_gt6kv.mjs";
import { i as getSql } from "./db-DYGAv2qZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/users-db-D2jObJPI.js
/**
* Make sure the user has a profile row. The very first profile ever created is
* the admin (bootstrap); everyone after that starts as a Free "user".
*/
async function ensureProfile(userId) {
	const sql = await getSql();
	await sql`
    insert into profiles (user_id, role)
    select ${userId}, case when exists (select 1 from profiles where role = 'admin') then 'user' else 'admin' end
    where exists (select 1 from "user" where id = ${userId})
    on conflict (user_id) do nothing`;
	const row = (await sql`
    select u.name, u.email, p.role, p.plan, p.status
    from "user" u join profiles p on p.user_id = u.id
    where u.id = ${userId}`)[0];
	return row ? {
		userId,
		...row
	} : null;
}
var iso = (v) => v == null ? null : new Date(v).toISOString();
async function listUsers() {
	return (await (await getSql())`
    select u.id, u.name, u.email,
           coalesce(p.role, 'user') as role,
           coalesce(p.plan, 'free') as plan,
           coalesce(p.status, 'active') as status,
           p.phone, p.location, p.bio,
           exists (select 1 from account a where a."userId" = u.id and a."providerId" = 'credential') as has_password,
           u."createdAt" as created_at,
           (select max(s."updatedAt") from session s where s."userId" = u.id) as last_seen_at
    from "user" u
    left join profiles p on p.user_id = u.id
    order by u."createdAt" desc`).map((r) => ({
		id: r.id,
		name: r.name,
		email: r.email,
		role: r.role,
		plan: r.plan,
		status: r.status,
		phone: r.phone,
		location: r.location,
		bio: r.bio,
		hasPassword: r.has_password,
		createdAt: iso(r.created_at),
		lastSeenAt: iso(r.last_seen_at)
	}));
}
async function loadPlanMatrix() {
	const rows = await (await getSql())`
    select plan, feature, enabled from plan_features`;
	return buildMatrix(rows);
}
/** Feature keys enabled for a plan. */
async function planFeatures(plan) {
	const matrix = await loadPlanMatrix();
	return Object.entries(matrix[plan]).filter(([, on]) => on).map(([key]) => key);
}
//#endregion
export { ensureProfile, listUsers, loadPlanMatrix, planFeatures };
