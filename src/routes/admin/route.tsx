import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { getAdminGate } from "@/lib/admin-auth";

// Guards every /admin/* page before any child loader runs: signed out -> /login,
// signed in without an active admin role -> /login explaining the lack of access.
// Server functions re-check the role on every call.
export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ location }) => {
    const gate = await getAdminGate();
    if (gate.status !== "ok") {
      throw redirect({
        to: "/login",
        search: { redirect: location.href, denied: gate.status === "forbidden" ? 1 : undefined },
      });
    }
    return { gate };
  },
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <>
      <Toaster theme="dark" position="top-center" richColors />
      <Outlet />
    </>
  );
}
