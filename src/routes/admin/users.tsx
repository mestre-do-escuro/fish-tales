import { useId, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import * as Dialog from "@radix-ui/react-dialog";
import { Mail, MapPin, Pencil, Phone, Plus, Search, Trash2, UserPlus, X } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/admin-shell";
import { errorMessage } from "@/components/admin/error-message";
import { ConfirmBar, Field, GhostButton, PrimaryButton } from "@/components/admin/ui";
import {
  PLANS,
  PLAN_LABEL,
  ROLES,
  ROLE_LABEL,
  STATUSES,
  STATUS_LABEL,
  type Plan,
  type Role,
  type Status,
  type UserRow,
} from "@/lib/access";
import { createUser, deleteUser, getUsers, updateUser } from "@/lib/users.functions";

export const Route = createFileRoute("/admin/users")({
  loader: () => getUsers(),
  head: () => ({ meta: [{ title: "Utilizadores · O Pescador" }] }),
  component: UsersAdmin,
});

const PLAN_TONE: Record<Plan, string> = {
  free: "border-line text-muted",
  standard: "border-primary/50 text-primary",
  pro: "border-amber-400/60 text-amber-300",
};

const dateFmt = new Intl.DateTimeFormat("pt-PT", { day: "2-digit", month: "short", year: "numeric" });
const fmt = (iso: string | null) => (iso ? dateFmt.format(new Date(iso)) : "—");

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

function UsersAdmin() {
  const [users, setUsers] = useState<UserRow[]>(Route.useLoaderData());
  const { gate } = Route.useRouteContext();
  const selfId = gate.status === "ok" ? gate.admin.userId : "";
  const [query, setQuery] = useState("");
  const [planFilter, setPlanFilter] = useState<Plan | "all">("all");
  const [editing, setEditing] = useState<UserRow | "new" | null>(null);
  const [confirming, setConfirming] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter(
      (u) =>
        (planFilter === "all" || u.plan === planFilter) &&
        (!q || [u.name, u.email, u.location ?? "", u.phone ?? ""].some((v) => v.toLowerCase().includes(q))),
    );
  }, [users, query, planFilter]);

  async function run(action: () => Promise<UserRow[]>, done: string) {
    setBusy(true);
    try {
      setUsers(await action());
      toast.success(done);
      return true;
    } catch (err) {
      toast.error(errorMessage(err));
      return false;
    } finally {
      setBusy(false);
    }
  }

  const control =
    "min-h-11 rounded-xl border border-line bg-bg px-3 text-base text-fg outline-none transition-colors focus:border-primary/70";

  return (
    <AdminShell
      title="Utilizadores"
      subtitle="Todas as contas da app: perfil, plano, papel e estado. Suspender ou mudar a palavra-passe termina as sessões dessa pessoa."
      back="admin"
      actions={
        <PrimaryButton onClick={() => setEditing("new")}>
          <UserPlus className="size-4" aria-hidden /> Novo utilizador
        </PrimaryButton>
      }
    >
      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Pesquisar</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-faint" aria-hidden />
          <input
            className={`${control} w-full pl-9`}
            placeholder="Pesquisar por nome, email, local…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <label>
          <span className="sr-only">Plano</span>
          <select className={`${control} w-full sm:w-44`} value={planFilter} onChange={(e) => setPlanFilter(e.target.value as Plan | "all")}>
            <option value="all">Todos os planos</option>
            {PLANS.map((p) => (
              <option key={p} value={p}>
                {PLAN_LABEL[p]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="mb-3 text-sm text-muted">
        {shown.length} de {users.length} {users.length === 1 ? "conta" : "contas"}
      </p>

      <ul className="grid gap-3">
        {shown.map((u) => (
          <li key={u.id} className="rounded-2xl border border-line bg-surface p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
                  {initials(u.name) || "?"}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-semibold">
                    {u.name}
                    {u.id === selfId && <span className="ml-2 text-xs font-normal text-muted">(você)</span>}
                  </p>
                  <p className="flex items-center gap-1 truncate text-sm text-muted">
                    <Mail className="size-3.5 shrink-0" aria-hidden /> {u.email}
                  </p>
                  {(u.phone || u.location) && (
                    <p className="mt-0.5 flex flex-wrap gap-x-3 text-xs text-faint">
                      {u.phone && (
                        <span className="inline-flex items-center gap-1">
                          <Phone className="size-3" aria-hidden /> {u.phone}
                        </span>
                      )}
                      {u.location && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="size-3" aria-hidden /> {u.location}
                        </span>
                      )}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
                <span className={`rounded-full border px-2.5 py-1 ${PLAN_TONE[u.plan]}`}>{PLAN_LABEL[u.plan]}</span>
                {u.role === "admin" && (
                  <span className="rounded-full border border-primary/50 bg-primary/10 px-2.5 py-1 text-primary">{ROLE_LABEL.admin}</span>
                )}
                {u.status === "suspended" && (
                  <span className="rounded-full border border-danger/50 bg-danger/10 px-2.5 py-1 text-danger">{STATUS_LABEL.suspended}</span>
                )}
              </div>
              <dl className="grid grid-cols-2 gap-x-4 text-xs text-muted md:w-48">
                <dt>Criada</dt>
                <dd className="text-fg/80">{fmt(u.createdAt)}</dd>
                <dt>Última sessão</dt>
                <dd className="text-fg/80">{fmt(u.lastSeenAt)}</dd>
              </dl>
              {confirming !== u.id && (
                <div className="flex gap-2">
                  <GhostButton onClick={() => setEditing(u)}>
                    <Pencil className="size-4" aria-hidden /> Editar
                  </GhostButton>
                  <GhostButton
                    tone="danger"
                    disabled={u.id === selfId}
                    title={u.id === selfId ? "Não pode apagar a sua própria conta." : undefined}
                    onClick={() => setConfirming(u.id)}
                  >
                    <Trash2 className="size-4" aria-hidden /> Apagar
                  </GhostButton>
                </div>
              )}
            </div>
            {confirming === u.id && (
              <div className="mt-4">
                <ConfirmBar
                  text={`Apagar a conta de ${u.name}? Esta ação não pode ser desfeita.`}
                  busy={busy}
                  onCancel={() => setConfirming(null)}
                  onConfirm={async () => {
                    if (await run(() => deleteUser({ data: { id: u.id } }), "Conta apagada.")) setConfirming(null);
                  }}
                />
              </div>
            )}
          </li>
        ))}
        {shown.length === 0 && (
          <li className="rounded-2xl border border-dashed border-line p-8 text-center text-muted">
            {users.length ? "Nenhuma conta corresponde à pesquisa." : "Ainda não há contas."}
          </li>
        )}
      </ul>

      {editing && (
        <UserDialog
          key={editing === "new" ? "new" : editing.id}
          user={editing === "new" ? null : editing}
          isSelf={editing !== "new" && editing.id === selfId}
          busy={busy}
          onClose={() => setEditing(null)}
          onSubmit={async (action, done) => {
            if (await run(action, done)) setEditing(null);
          }}
        />
      )}
    </AdminShell>
  );
}

function UserDialog({
  user,
  isSelf,
  busy,
  onClose,
  onSubmit,
}: {
  user: UserRow | null;
  isSelf: boolean;
  busy: boolean;
  onClose: () => void;
  onSubmit: (action: () => Promise<UserRow[]>, done: string) => void;
}) {
  const ids = useId();
  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    password: "",
    phone: user?.phone ?? "",
    location: user?.location ?? "",
    bio: user?.bio ?? "",
    plan: user?.plan ?? ("free" as Plan),
    role: user?.role ?? ("user" as Role),
    status: user?.status ?? ("active" as Status),
  });
  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => setForm((f) => ({ ...f, [key]: value }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const fields = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      location: form.location,
      bio: form.bio,
      plan: form.plan,
      role: form.role,
      status: form.status,
    };
    if (user) {
      onSubmit(
        () => updateUser({ data: { id: user.id, ...fields, password: form.password || undefined } }),
        "Conta guardada.",
      );
    } else {
      onSubmit(() => createUser({ data: { ...fields, password: form.password } }), "Conta criada.");
    }
  }

  const input =
    "min-h-11 w-full rounded-xl border border-line bg-bg px-3 text-base text-fg outline-none transition-colors focus:border-primary/70 disabled:opacity-50";

  return (
    <Dialog.Root open onOpenChange={(open) => !open && !busy && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-bg/75 backdrop-blur-sm" />
        <Dialog.Content className="fixed inset-x-0 bottom-0 z-50 max-h-[92vh] overflow-y-auto rounded-t-2xl border border-line bg-surface p-5 font-sans text-fg shadow-2xl sm:inset-auto sm:left-1/2 sm:top-1/2 sm:w-[min(40rem,calc(100vw-2rem))] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl sm:p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="text-xl font-semibold">{user ? "Editar utilizador" : "Novo utilizador"}</Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-muted">
                {user ? `Conta criada em ${fmt(user.createdAt)}.` : "A pessoa entra com este email e palavra-passe."}
              </Dialog.Description>
            </div>
            <Dialog.Close
              className="grid size-11 shrink-0 place-items-center rounded-xl text-muted hover:bg-surface-2 hover:text-fg"
              aria-label="Fechar"
              disabled={busy}
            >
              <X className="size-5" />
            </Dialog.Close>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <fieldset className="grid gap-4 sm:grid-cols-2">
              <legend className="mb-3 text-sm font-semibold text-primary">Perfil</legend>
              <Field label="Nome" htmlFor={`${ids}-name`}>
                <input id={`${ids}-name`} className={input} value={form.name} maxLength={80} required autoFocus onChange={(e) => set("name", e.target.value)} />
              </Field>
              <Field label="Email" htmlFor={`${ids}-email`}>
                <input id={`${ids}-email`} type="email" className={input} value={form.email} required onChange={(e) => set("email", e.target.value)} />
              </Field>
              <Field label="Telefone" htmlFor={`${ids}-phone`}>
                <input id={`${ids}-phone`} type="tel" className={input} value={form.phone} maxLength={30} onChange={(e) => set("phone", e.target.value)} />
              </Field>
              <Field label="Localidade" htmlFor={`${ids}-location`}>
                <input id={`${ids}-location`} className={input} value={form.location} maxLength={80} placeholder="ex.: Cascais" onChange={(e) => set("location", e.target.value)} />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Sobre" htmlFor={`${ids}-bio`}>
                  <textarea
                    id={`${ids}-bio`}
                    className={`${input} min-h-20 py-2`}
                    value={form.bio}
                    maxLength={500}
                    onChange={(e) => set("bio", e.target.value)}
                    placeholder="Estilo de pesca, spots favoritos…"
                  />
                </Field>
              </div>
            </fieldset>

            <fieldset className="grid gap-4 sm:grid-cols-3">
              <legend className="mb-3 text-sm font-semibold text-primary">Acesso</legend>
              <Field label="Plano" htmlFor={`${ids}-plan`}>
                <select id={`${ids}-plan`} className={input} value={form.plan} onChange={(e) => set("plan", e.target.value as Plan)}>
                  {PLANS.map((p) => (
                    <option key={p} value={p}>
                      {PLAN_LABEL[p]}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Papel" htmlFor={`${ids}-role`}>
                <select id={`${ids}-role`} className={input} value={form.role} disabled={isSelf} onChange={(e) => set("role", e.target.value as Role)}>
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {ROLE_LABEL[r]}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Estado" htmlFor={`${ids}-status`}>
                <select id={`${ids}-status`} className={input} value={form.status} disabled={isSelf} onChange={(e) => set("status", e.target.value as Status)}>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABEL[s]}
                    </option>
                  ))}
                </select>
              </Field>
              {isSelf && <p className="text-xs text-muted sm:col-span-3">Não pode alterar o seu próprio papel nem estado.</p>}
            </fieldset>

            <Field
              label={user ? "Nova palavra-passe" : "Palavra-passe"}
              htmlFor={`${ids}-password`}
              hint={
                user
                  ? user.hasPassword
                    ? "Deixe em branco para manter a atual. Mínimo 8 caracteres."
                    : "Esta conta ainda não tem palavra-passe. Mínimo 8 caracteres."
                  : "Mínimo 8 caracteres. Partilhe-a com a pessoa por um canal seguro."
              }
            >
              <input
                id={`${ids}-password`}
                type="password"
                className={input}
                value={form.password}
                minLength={8}
                maxLength={128}
                required={!user}
                autoComplete="new-password"
                onChange={(e) => set("password", e.target.value)}
              />
            </Field>

            <div className="flex flex-col-reverse gap-2 border-t border-line pt-5 sm:flex-row sm:justify-end">
              <Dialog.Close asChild>
                <GhostButton disabled={busy}>Cancelar</GhostButton>
              </Dialog.Close>
              <button
                type="submit"
                disabled={busy}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-fg transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {user ? <Pencil className="size-4" aria-hidden /> : <Plus className="size-4" aria-hidden />}
                {busy ? "A guardar…" : user ? "Guardar" : "Criar conta"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
