import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/admin-shell";
import { FishingGamePanel } from "@/components/pesca/fishing-game-panel";

export const Route = createFileRoute("/admin/pesca")({
  head: () => ({ meta: [{ title: "Pesca Interativa · O Pescador" }] }),
  component: PescaPage,
});

function PescaPage() {
  return (
    <AdminShell
      title="Pesca Interativa"
      subtitle="Aventura em 5 níveis, das Águas Calmas à tempestade, seguida do Modo Infinito. Ganha coins, melhora a vara e os anzóis e apanha bolhas de tempo."
      back="admin"
    >
      <FishingGamePanel />
    </AdminShell>
  );
}
