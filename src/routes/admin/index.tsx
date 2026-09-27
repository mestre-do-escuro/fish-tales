import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Fish, MapPinned, MessagesSquare, Store, Crown, type LucideIcon } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { listRegions } from "@/lib/spots.functions";

export const Route = createFileRoute("/admin/")({
  loader: () => listRegions(),
  head: () => ({ meta: [{ title: "Backoffice · O Pescador" }] }),
  component: AdminHome,
});

const SOON: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Fish, title: "Espécies", text: "Fichas, épocas e tamanhos mínimos das espécies." },
  { icon: Store, title: "Lojas", text: "Lojas parceiras, produtos e promoções." },
  { icon: MessagesSquare, title: "Comunidade", text: "Moderação de capturas e comentários." },
  { icon: Crown, title: "Subscrições", text: "Planos, preços e benefícios." },
];

function AdminHome() {
  const regions = Route.useLoaderData();
  const spotCount = regions.reduce((n, r) => n + r.spots.length, 0);
  return (
    <AdminShell
      title="Administração"
      subtitle="Gira os conteúdos da app O Pescador."
      back="app"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          to="/admin/spots"
          className="group relative flex min-h-44 flex-col rounded-2xl border border-primary/45 bg-surface p-5 shadow-[0_0_28px_rgb(40_185_255/0.12)] transition-colors hover:border-primary"
        >
          <span className="grid size-11 place-items-center rounded-xl bg-primary/15 text-primary">
            <MapPinned className="size-5" aria-hidden />
          </span>
          <h2 className="mt-4 text-lg font-semibold">Spots e regiões</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            Adicione praias por região, com imagem de fundo para o painel da maré.
          </p>
          <div className="mt-auto flex items-center justify-between pt-4 text-sm">
            <span className="text-muted">
              <b className="font-semibold text-fg">{regions.length}</b> regiões ·{" "}
              <b className="font-semibold text-fg">{spotCount}</b> spots
            </span>
            <ChevronRight className="size-5 text-primary transition-transform group-hover:translate-x-1" aria-hidden />
          </div>
        </Link>
        {SOON.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            aria-disabled="true"
            className="flex min-h-44 flex-col rounded-2xl border border-dashed border-line bg-surface/50 p-5 text-muted"
          >
            <div className="flex items-start justify-between">
              <span className="grid size-11 place-items-center rounded-xl bg-surface-2 text-faint">
                <Icon className="size-5" aria-hidden />
              </span>
              <span className="rounded-full border border-line px-2.5 py-1 text-xs font-medium">Em breve</span>
            </div>
            <h2 className="mt-4 text-lg font-semibold text-fg/70">{title}</h2>
            <p className="mt-1 text-sm leading-relaxed">{text}</p>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
