// Session + role checks for the backoffice and the sign-in flow.
// Dual client/server module: server-only code is imported dynamically inside
// `.server()` / handlers (same pattern as @/lib/auth/middleware).
import { createMiddleware, createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import type { Access } from "@/lib/users-db";

/** Resolves the caller's profile (creating it on first sign-in), or null when signed out. */
const sessionMiddleware = createMiddleware({ type: "function" })
  .client(async ({ next }) => {
    // Live preview only: forward the bearer token (no-op with cookie sessions).
    const { getBearerToken } = await import("@/lib/auth/client");
    return next({ sendContext: { bearerToken: getBearerToken() ?? undefined } });
  })
  .server(async ({ next, context }) => {
    const { assertSameSiteRequest } = await import("@/lib/auth/isolation.server");
    const { getSessionUser } = await import("@/lib/auth/verify.server");
    const { ensureProfile } = await import("@/lib/users-db");
    assertSameSiteRequest();
    const user = await getSessionUser(context.bearerToken);
    const access = user ? await ensureProfile(user.id) : null;
    return next({ context: { access } });
  });

/** Every backoffice mutation: signed in, active, and admin. */
export const adminMiddleware = createMiddleware({ type: "function" })
  .middleware([authMiddleware])
  .server(async ({ next, context }) => {
    const { ensureProfile } = await import("@/lib/users-db");
    const access = await ensureProfile(context.userId);
    if (!access || access.status !== "active" || access.role !== "admin") {
      throw new Error("Sem permissão para esta operação.");
    }
    return next({ context: { admin: access } });
  });

export type AdminGate =
  | { status: "ok"; admin: Access }
  | { status: "signed-out" }
  | { status: "forbidden"; email: string };

/** Route guard for /admin/*. */
export const getAdminGate = createServerFn({ method: "GET" })
  .middleware([sessionMiddleware])
  .handler(({ context }): AdminGate => {
    const { access } = context;
    if (!access) return { status: "signed-out" };
    if (access.role !== "admin" || access.status !== "active") return { status: "forbidden", email: access.email };
    return { status: "ok", admin: access };
  });

/** Called right after sign-in / sign-up: creates the profile and reports suspension. */
export const getMyAccess = createServerFn({ method: "GET" })
  .middleware([sessionMiddleware])
  .handler(({ context }) => context.access);
