// Server-only queries for users, profiles and plan features. Import only from
// server handlers / middleware (directly or via dynamic import).
import { getSql } from "@/lib/db";
import { buildMatrix, type Plan, type PlanMatrix, type Role, type Status, type UserRow } from "@/lib/access";

export interface Access {
  userId: string;
  name: string;
  email: string;
  role: Role;
  plan: Plan;
  status: Status;
}

/**
 * Make sure the user has a profile row. The very first profile ever created is
 * the admin (bootstrap); everyone after that starts as a Free "user".
 */
export async function ensureProfile(userId: string): Promise<Access | null> {
  const sql = await getSql();
  await sql`
    insert into profiles (user_id, role)
    select ${userId}, case when exists (select 1 from profiles where role = 'admin') then 'user' else 'admin' end
    where exists (select 1 from "user" where id = ${userId})
    on conflict (user_id) do nothing`;
  const rows = await sql<{ name: string; email: string; role: Role; plan: Plan; status: Status }>`
    select u.name, u.email, p.role, p.plan, p.status
    from "user" u join profiles p on p.user_id = u.id
    where u.id = ${userId}`;
  const row = rows[0];
  return row ? { userId, ...row } : null;
}

interface UserDbRow {
  id: string;
  name: string;
  email: string;
  role: Role;
  plan: Plan;
  status: Status;
  phone: string | null;
  location: string | null;
  bio: string | null;
  has_password: boolean;
  created_at: string | Date;
  last_seen_at: string | Date | null;
}

const iso = (v: string | Date | null) => (v == null ? null : new Date(v).toISOString());

export async function listUsers(): Promise<UserRow[]> {
  const sql = await getSql();
  const rows = await sql<UserDbRow>`
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
    order by u."createdAt" desc`;
  return rows.map((r) => ({
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
    createdAt: iso(r.created_at) as string,
    lastSeenAt: iso(r.last_seen_at),
  }));
}

export async function loadPlanMatrix(): Promise<PlanMatrix> {
  const sql = await getSql();
  const rows = await sql<{ plan: Plan; feature: string; enabled: boolean }>`
    select plan, feature, enabled from plan_features`;
  return buildMatrix(rows);
}

/** Feature keys enabled for a plan. */
export async function planFeatures(plan: Plan): Promise<string[]> {
  const matrix = await loadPlanMatrix();
  return Object.entries(matrix[plan])
    .filter(([, on]) => on)
    .map(([key]) => key);
}
