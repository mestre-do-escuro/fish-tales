// Backoffice user management + plan feature toggles. Every function requires an
// active admin (adminMiddleware).
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql } from "@/lib/db";
import { adminMiddleware } from "@/lib/admin-auth";
import { listUsers, loadPlanMatrix } from "@/lib/users-db";
import { FEATURE_KEYS, PLANS, ROLES, STATUSES } from "@/lib/access";

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => (v === "" ? null : v))
    .nullable();

const profileFields = {
  name: z.string().trim().min(1, "O nome é obrigatório.").max(80),
  email: z.string().trim().toLowerCase().email("Email inválido."),
  role: z.enum(ROLES),
  plan: z.enum(PLANS),
  status: z.enum(STATUSES),
  phone: optionalText(30),
  location: optionalText(80),
  bio: optionalText(500),
};
const password = z
  .string()
  .min(8, "A palavra-passe precisa de pelo menos 8 caracteres.")
  .max(128);

async function friendly<T>(run: () => Promise<T>): Promise<T> {
  try {
    return await run();
  } catch (err) {
    if ((err as { code?: string }).code === "23505") throw new Error("Já existe uma conta com esse email.");
    throw err;
  }
}

/** Hash with Better Auth's own scheme so the account can sign in normally. */
async function hash(pw: string) {
  const { hashPassword } = await import("better-auth/crypto");
  return hashPassword(pw);
}

/** Refuse changes that would leave the backoffice without an active admin. */
async function assertOtherActiveAdmin(userId: string) {
  const sql = await getSql();
  const [{ n }] = await sql<{ n: number }>`
    select count(*) as n from profiles
    where role = 'admin' and status = 'active' and user_id <> ${userId}`;
  if (n === 0) throw new Error("Tem de existir pelo menos um administrador ativo.");
}

export const getUsers = createServerFn({ method: "GET" })
  .middleware([adminMiddleware])
  .handler(() => listUsers());

export const createUser = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(z.object({ ...profileFields, password }))
  .handler(async ({ data }) => {
    const sql = await getSql();
    const id = crypto.randomUUID();
    const hashed = await hash(data.password);
    // One statement, so the user, its password account and profile land together.
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

export const updateUser = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(z.object({ id: z.string().min(1), ...profileFields, password: password.optional() }))
  .handler(async ({ data, context }) => {
    const sql = await getSql();
    const self = data.id === context.admin.userId;
    const [current] = await sql<{ role: string; status: string }>`
      select coalesce(p.role, 'user') as role, coalesce(p.status, 'active') as status
      from "user" u left join profiles p on p.user_id = u.id where u.id = ${data.id}`;
    if (!current) throw new Error("Utilizador não encontrado.");
    if (self && (data.role !== "admin" || data.status !== "active")) {
      throw new Error("Não pode retirar o seu próprio acesso de administrador.");
    }
    const losesAdmin = current.role === "admin" && current.status === "active" && (data.role !== "admin" || data.status !== "active");
    if (losesAdmin) await assertOtherActiveAdmin(data.id);

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
      const updated = await sql`
        update account set password = ${hashed}, "updatedAt" = now()
        where "userId" = ${data.id} and "providerId" = 'credential' returning id`;
      if (!updated.length) {
        await sql`
          insert into account (id, "accountId", "providerId", "userId", password, "createdAt", "updatedAt")
          values (${crypto.randomUUID()}, ${data.id}, 'credential', ${data.id}, ${hashed}, now(), now())`;
      }
    }
    // Suspending or resetting the password signs the user out everywhere.
    if ((data.status === "suspended" && current.status !== "suspended") || (data.password && !self)) {
      await sql`delete from session where "userId" = ${data.id}`;
    }
    return listUsers();
  });

export const deleteUser = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(z.object({ id: z.string().min(1) }))
  .handler(async ({ data, context }) => {
    if (data.id === context.admin.userId) throw new Error("Não pode apagar a sua própria conta aqui.");
    const sql = await getSql();
    const [target] = await sql<{ role: string; status: string }>`
      select role, status from profiles where user_id = ${data.id}`;
    if (target?.role === "admin" && target.status === "active") await assertOtherActiveAdmin(data.id);
    // Sessions, accounts and the profile cascade from "user".
    await sql`delete from "user" where id = ${data.id}`;
    return listUsers();
  });

export const getPlanMatrix = createServerFn({ method: "GET" })
  .middleware([adminMiddleware])
  .handler(() => loadPlanMatrix());

export const setPlanFeature = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(
    z.object({
      plan: z.enum(PLANS),
      feature: z.string().refine((f) => FEATURE_KEYS.has(f), "Funcionalidade desconhecida."),
      enabled: z.boolean(),
    }),
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql`
      insert into plan_features (plan, feature, enabled) values (${data.plan}, ${data.feature}, ${data.enabled})
      on conflict (plan, feature) do update set enabled = excluded.enabled, updated_at = now()`;
    return loadPlanMatrix();
  });
