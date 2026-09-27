import type { ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ChevronRight,
  Crown,
  Fish,
  MapPinned,
  MessagesSquare,
  ShieldCheck,
  Store,
  Gamepad2,
  Users,
  type LucideIcon,
} from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { listRegions } from "@/lib/spots.functions";
import { getUsers } from "@/lib/users.functions";

export const Route = createFileRoute("/admin/")({
  loader: async () => {
    const [regions, users] = await Promise.all([listRegions(), getUsers()]);
    return { regions, users };
  },
  head: () => ({ meta: [{ title: "Backoffice · O Pescador" }] }),
  component: AdminHome,
});

const SOON: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Fish, title: "Espécies", text: "Fichas, épocas e tamanhos mínimos das espécies." },
  { icon: Store, title: "Lojas", text: "Lojas parceiras, produtos e promoções." },
  { icon: MessagesSquare, title: "Comunidade", text: "Moderação de capturas e comentários." },
  { icon: Crown, title: "Subscrições", text: "Pagamentos, faturação e preços dos planos." },
];

function AdminHome() {
  const { regions, users } = Route.useLoaderData();
  const spotCount = regions.reduce((n, r) => n + r.spots.length, 0);
  const paying = users.filter((u) => u.plan !== "free").length;
  const admins = users.filter((u) => u.role === "admin").length;
  return (
    <AdminShell title="Administração" subtitle="Gira os conteúdos e as contas da app O Pescador." back="app">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <HubCard
          to="/admin/users"
          icon={Users}
          title="Utilizadores"
          text="Crie, edite e apague contas, com perfil, plano e papel de cada pessoa."
          stats={
            <>
              <b className="font-semibold text-fg">{users.length}</b> {users.length === 1 ? "conta" : "contas"} · <b className="font-semibold text-fg">{paying}</b> pagantes ·{" "}
              <b className="font-semibold text-fg">{admins}</b> admin
            </>
          }
        />
        <HubCard
          to="/admin/access"
          icon={ShieldCheck}
          title="Perfis de acesso"
          text="Escolha que funcionalidades cada plano (Free, Standard, PRO) desbloqueia."
          stats={<>3 planos</>}
        />
        <HubCard
          to="/admin/pesca"
          icon={Gamepad2}
          title="Pesca Interativa"
          text="Aventura em 5 níveis e modo infinito, com loja de upgrades, coins, combos e bolhas de tempo."
          stats={<>5 níveis · modo infinito · loja</>}
        />
        <HubCard
          to="/admin/spots"
          icon={MapPinned}
          title="Spots e regiões"
          text="Adicione praias por região, com imagem de fundo para o painel da maré."
          stats={
            <>
              <b className="font-semibold text-fg">{regions.length}</b> regiões · <b className="font-semibold text-fg">{spotCount}</b> spots
            </>
          }
        />
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

function HubCard({
  to,
  icon: Icon,
  title,
  text,
  stats,
}: {
  to: "/admin/users" | "/admin/access" | "/admin/spots" | "/admin/pesca";
  icon: LucideIcon;
  title: string;
  text: string;
  stats: ReactNode;
}) {
  return (
    <Link
      to={to}
      className="group relative flex min-h-44 flex-col rounded-2xl border border-primary/45 bg-surface p-5 shadow-[0_0_28px_rgb(40_185_255/0.12)] transition-colors hover:border-primary"
    >
      <span className="grid size-11 place-items-center rounded-xl bg-primary/15 text-primary">
        <Icon className="size-5" aria-hidden />
      </span>
      <h2 className="mt-4 text-lg font-semibold">{title}</h2>
      <p className="mt-1 text-sm leading-relaxed text-muted">{text}</p>
      <div className="mt-auto flex items-center justify-between pt-4 text-sm">
        <span className="text-muted">{stats}</span>
        <ChevronRight className="size-5 text-primary transition-transform group-hover:translate-x-1" aria-hidden />
      </div>
    </Link>
  );
}
