import { a as ROLES, n as FEATURE_KEYS, r as PLANS, s as STATUSES } from "./access-B-_gt6kv.mjs";
import { n as createServerFn } from "./ssr.mjs";
import { t as adminMiddleware } from "./admin-auth-CVMIW43N.mjs";
import { cn as _enum, dn as boolean, gn as object, yn as string } from "../_libs/@better-auth/core+[...].mjs";
import { t as createServerRpc } from "./createServerRpc-CN-evIEF.mjs";
import { i as getSql } from "./db-DYGAv2qZ.mjs";
import { listUsers, loadPlanMatrix } from "./users-db-D2jObJPI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/users.functions-DCxkKjDE.js
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
async function friendly(run) {
	try {
		return await run();
	} catch (err) {
		if (err.code === "23505") throw new Error("Já existe uma conta com esse email.");
		throw err;
	}
}
/** Hash with Better Auth's own scheme so the account can sign in normally. */
async function hash(pw) {
	const { hashPassword } = await import("./crypto-QVkT-fgq.mjs").then((n) => n.t).then((n) => n.t);
	return hashPassword(pw);
}
/** Refuse changes that would leave the backoffice without an active admin. */
async function assertOtherActiveAdmin(userId) {
	const [{ n }] = await (await getSql())`
    select count(*) as n from profiles
    where role = 'admin' and status = 'active' and user_id <> ${userId}`;
	if (n === 0) throw new Error("Tem de existir pelo menos um administrador ativo.");
}
var getUsers_createServerFn_handler = createServerRpc({
	id: "7f8859960fe22cec1b48d0e6633ef552e07f8516f2ec63609fa7e486ef84e20c",
	name: "getUsers",
	filename: "src/lib/users.functions.ts"
}, (opts) => getUsers.__executeServer(opts));
var getUsers = createServerFn({ method: "GET" }).middleware([adminMiddleware]).handler(getUsers_createServerFn_handler, () => listUsers());
var createUser_createServerFn_handler = createServerRpc({
	id: "39d053ca3c166648240f19533479adb240c32f2d28b6e9dda4814e0fad8105f2",
	name: "createUser",
	filename: "src/lib/users.functions.ts"
}, (opts) => createUser.__executeServer(opts));
var createUser = createServerFn({ method: "POST" }).middleware([adminMiddleware]).validator(object({
	...profileFields,
	password
})).handler(createUser_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const id = crypto.randomUUID();
	const hashed = await hash(data.password);
	await friendly(() => sql`
      with u as (
        insert into "user" (id, name, email, "emailVerified", "createdAt", "updatedAt")
        values (${id}, ${data.name}, ${data.email}, false, now(), now())
        returning id
      ), a as (
        insert into account (id, "accountId", "providerId", "userId", password, "createdAt", "updatedAt")
        select ${crypto.randomUUID()}, u.id, 'credential', u.id, ${hashed}, now(), now() from u
      )
      insert into profiles (user_id, role, plan, status, phone, location, bio)
      select u.id, ${data.role}, ${data.plan}, ${data.status}, ${data.phone}, ${data.location}, ${data.bio} from u`);
	return listUsers();
});
var updateUser_createServerFn_handler = createServerRpc({
	id: "3b8dca06958b3aa702766171b9df41a3bcd5601672814841b3d9b50eec9c1825",
	name: "updateUser",
	filename: "src/lib/users.functions.ts"
}, (opts) => updateUser.__executeServer(opts));
var updateUser = createServerFn({ method: "POST" }).middleware([adminMiddleware]).validator(object({
	id: string().min(1),
	...profileFields,
	password: password.optional()
})).handler(updateUser_createServerFn_handler, async ({ data, context }) => {
	const sql = await getSql();
	const self = data.id === context.admin.userId;
	const [current] = await sql`
      select coalesce(p.role, 'user') as role, coalesce(p.status, 'active') as status
      from "user" u left join profiles p on p.user_id = u.id where u.id = ${data.id}`;
	if (!current) throw new Error("Utilizador não encontrado.");
	if (self && (data.role !== "admin" || data.status !== "active")) throw new Error("Não pode retirar o seu próprio acesso de administrador.");
	if (current.role === "admin" && current.status === "active" && (data.role !== "admin" || data.status !== "active")) await assertOtherActiveAdmin(data.id);
	await friendly(() => sql`
      update "user" set name = ${data.name}, email = ${data.email}, "updatedAt" = now() where id = ${data.id}`);
	await sql`
      insert into profiles (user_id, role, plan, status, phone, location, bio)
      values (${data.id}, ${data.role}, ${data.plan}, ${data.status}, ${data.phone}, ${data.location}, ${data.bio})
      on conflict (user_id) do update set
        role = excluded.role, plan = excluded.plan, status = excluded.status,
        phone = excluded.phone, location = excluded.location, bio = excluded.bio, updated_at = now()`;
	if (data.password) {
		const hashed = await hash(data.password);
		if (!(await sql`
        update account set password = ${hashed}, "updatedAt" = now()
        where "userId" = ${data.id} and "providerId" = 'credential' returning id`).length) await sql`
          insert into account (id, "accountId", "providerId", "userId", password, "createdAt", "updatedAt")
          values (${crypto.randomUUID()}, ${data.id}, 'credential', ${data.id}, ${hashed}, now(), now())`;
	}
	if (data.status === "suspended" && current.status !== "suspended" || data.password && !self) await sql`delete from session where "userId" = ${data.id}`;
	return listUsers();
});
var deleteUser_createServerFn_handler = createServerRpc({
	id: "1b36e79fb17473cbea5838cc48bfefe7de129ef1bef3a743aa78716aa93765db",
	name: "deleteUser",
	filename: "src/lib/users.functions.ts"
}, (opts) => deleteUser.__executeServer(opts));
var deleteUser = createServerFn({ method: "POST" }).middleware([adminMiddleware]).validator(object({ id: string().min(1) })).handler(deleteUser_createServerFn_handler, async ({ data, context }) => {
	if (data.id === context.admin.userId) throw new Error("Não pode apagar a sua própria conta aqui.");
	const sql = await getSql();
	const [target] = await sql`
      select role, status from profiles where user_id = ${data.id}`;
	if (target?.role === "admin" && target.status === "active") await assertOtherActiveAdmin(data.id);
	await sql`delete from "user" where id = ${data.id}`;
	return listUsers();
});
var getPlanMatrix_createServerFn_handler = createServerRpc({
	id: "7ebaf7d79b19da9faf93c3f97d57aaddc772115446615aced4028c0dcb9a66b4",
	name: "getPlanMatrix",
	filename: "src/lib/users.functions.ts"
}, (opts) => getPlanMatrix.__executeServer(opts));
var getPlanMatrix = createServerFn({ method: "GET" }).middleware([adminMiddleware]).handler(getPlanMatrix_createServerFn_handler, () => loadPlanMatrix());
var setPlanFeature_createServerFn_handler = createServerRpc({
	id: "cd2a3e636a05c5de7cb84224b5b05111eefed34cb70f62bf60dd70a63381bbaa",
	name: "setPlanFeature",
	filename: "src/lib/users.functions.ts"
}, (opts) => setPlanFeature.__executeServer(opts));
var setPlanFeature = createServerFn({ method: "POST" }).middleware([adminMiddleware]).validator(object({
	plan: _enum(PLANS),
	feature: string().refine((f) => FEATURE_KEYS.has(f), "Funcionalidade desconhecida."),
	enabled: boolean()
})).handler(setPlanFeature_createServerFn_handler, async ({ data }) => {
	await (await getSql())`
      insert into plan_features (plan, feature, enabled) values (${data.plan}, ${data.feature}, ${data.enabled})
      on conflict (plan, feature) do update set enabled = excluded.enabled, updated_at = now()`;
	return loadPlanMatrix();
});
//#endregion
export { createUser_createServerFn_handler, deleteUser_createServerFn_handler, getPlanMatrix_createServerFn_handler, getUsers_createServerFn_handler, setPlanFeature_createServerFn_handler, updateUser_createServerFn_handler };
