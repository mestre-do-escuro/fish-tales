import { createFileRoute } from "@tanstack/react-router";

// Plain JSON for public/peixe.html: who is signed in, their plan, and the
// features that plan unlocks (guests get the Free plan's features).
export const Route = createFileRoute("/api/me")({
  server: {
    handlers: {
      GET: async () => {
        const { getSessionUser } = await import("@/lib/auth/verify.server");
        const { ensureProfile, planFeatures } = await import("@/lib/users-db");
        const { getSql } = await import("@/lib/db");
        const session = await getSessionUser();
        const access = session ? await ensureProfile(session.id) : null;
        const active = access?.status === "active" ? access : null;
        let profile = null;
        if (active) {
          const sql = await getSql();
          const [row] = await sql<{ phone: string | null; location: string | null; bio: string | null }>`
            select phone, location, bio from profiles where user_id = ${active.userId}`;
          profile = row ?? null;
        }
        const features = await planFeatures(active?.plan ?? "free");
        return Response.json(
          {
            user: active
              ? { name: active.name, email: active.email, plan: active.plan, role: active.role, ...profile }
              : null,
            suspended: access?.status === "suspended",
            features,
          },
          { headers: { "Cache-Control": "no-store" } },
        );
      },
    },
  },
});
