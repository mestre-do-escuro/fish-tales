import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { LogIn, UserPlus } from "lucide-react";
import { WaveLogo } from "@/components/admin/admin-shell";
import { authClient, signOut } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getMyAccess } from "@/lib/admin-auth";

export const Route = createFileRoute("/login")({
  validateSearch: z.object({
    redirect: z.string().optional(),
    mode: z.enum(["signin", "signup"]).optional(),
    suspended: z.literal(1).optional(),
    denied: z.literal(1).optional(),
  }),
  head: () => ({ meta: [{ title: "Entrar · O Pescador" }] }),
  component: Login,
});

/** Only same-site paths, so ?redirect= can't bounce people to another site. */
function safeTarget(redirect: string | undefined) {
  if (redirect && redirect.startsWith("/") && !redirect.startsWith("//") && !redirect.startsWith("/\\")) {
    return redirect;
  }
  return "/peixe.html";
}

function Login() {
  const search = Route.useSearch();
  // Signed in but not an admin: continuing to /admin would just bounce back here.
  const target = search.denied ? "/peixe.html" : safeTarget(search.redirect);
  const { user, isPending } = useCurrentUserState();
  const [mode, setMode] = useState<"signin" | "signup">(search.mode ?? "signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(
    search.suspended ? "Esta conta está suspensa. Contacte o suporte." : null,
  );

  async function finish() {
    const access = await getMyAccess();
    if (!access) throw new Error("Não foi possível iniciar sessão. Tente novamente.");
    if (access.status !== "active") {
      await signOut(`/login?suspended=1&redirect=${encodeURIComponent(target)}`);
      return;
    }
    window.location.assign(target);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const { error: authError } =
        mode === "signin"
          ? await authClient.signIn.email({ email: email.trim(), password })
          : await authClient.signUp.email({ name: name.trim(), email: email.trim(), password });
      if (authError) throw new Error(translate(authError.code, authError.message));
      await finish();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro. Tente novamente.");
      setBusy(false);
    }
  }

  const input =
    "min-h-11 w-full rounded-xl border border-line bg-bg px-3 text-base text-fg outline-none transition-colors focus:border-primary/70";

  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(90%_60%_at_50%_-10%,rgb(30_110_150/0.28),transparent_70%)] bg-bg px-4 py-10 font-sans text-fg">
      <div className="w-full max-w-sm">
        <a href="/peixe.html" className="mb-8 flex items-center justify-center gap-2">
          <WaveLogo />
          <strong className="text-2xl font-semibold italic tracking-tight">O Pescador</strong>
        </a>
        <div className="rounded-2xl border border-line bg-surface p-6 shadow-2xl">
          {!isPending && user ? (
            <div className="space-y-4 text-center">
              <p className="text-sm text-muted">Sessão iniciada como</p>
              <p className="font-semibold">{user.primaryEmail}</p>
              {search.denied && (
                <p role="alert" className="rounded-xl border border-danger/40 bg-danger/10 p-3 text-sm">
                  Esta conta não tem permissões de administrador. Entre com outra conta para aceder ao backoffice.
                </p>
              )}
              <button
                type="button"
                onClick={() => finish().catch((err) => setError(String(err?.message ?? err)))}
                className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-fg"
              >
                {search.denied ? "Voltar à app" : "Continuar"}
              </button>
              <button
                type="button"
                onClick={() => signOut(search.denied && search.redirect ? `/login?redirect=${encodeURIComponent(safeTarget(search.redirect))}` : "/login").catch(() => setError("Não foi possível terminar a sessão."))}
                className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-line px-4 text-sm font-medium text-muted hover:text-fg"
              >
                Terminar sessão
              </button>
              {error && <p role="alert" className="text-sm text-danger">{error}</p>}
            </div>
          ) : (
            <>
              <div role="tablist" className="mb-6 grid grid-cols-2 rounded-xl bg-bg p-1 text-sm font-medium">
                {(["signin", "signup"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    role="tab"
                    aria-selected={mode === m}
                    onClick={() => {
                      setMode(m);
                      setError(null);
                    }}
                    className={`min-h-10 rounded-lg transition-colors ${mode === m ? "bg-surface-2 text-fg" : "text-muted hover:text-fg"}`}
                  >
                    {m === "signin" ? "Entrar" : "Criar conta"}
                  </button>
                ))}
              </div>
              <form onSubmit={submit} className="space-y-4">
                {mode === "signup" && (
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium">Nome</span>
                    <input className={input} value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
                  </label>
                )}
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium">Email</span>
                  <input className={input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium">Palavra-passe</span>
                  <input
                    className={input}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  />
                  {mode === "signup" && <span className="mt-1.5 block text-xs text-muted">Pelo menos 8 caracteres.</span>}
                </label>
                {error && <p role="alert" className="text-sm text-danger">{error}</p>}
                <button
                  type="submit"
                  disabled={busy || isPending}
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-fg shadow-[0_0_20px_rgb(40_185_255/0.3)] disabled:opacity-60"
                >
                  {mode === "signin" ? <LogIn className="size-4" aria-hidden /> : <UserPlus className="size-4" aria-hidden />}
                  {busy ? "A aguardar…" : mode === "signin" ? "Entrar" : "Criar conta"}
                </button>
              </form>
            </>
          )}
        </div>
        <p className="mt-6 text-center text-sm text-muted">
          <a href="/peixe.html" className="hover:text-fg">Continuar sem conta</a>
        </p>
      </div>
    </main>
  );
}

function translate(code: string | undefined, fallback: string | undefined) {
  switch (code) {
    case "INVALID_EMAIL_OR_PASSWORD":
      return "Email ou palavra-passe incorretos.";
    case "USER_ALREADY_EXISTS":
    case "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL":
      return "Já existe uma conta com esse email.";
    case "PASSWORD_TOO_SHORT":
      return "A palavra-passe precisa de pelo menos 8 caracteres.";
    case "INVALID_EMAIL":
      return "Email inválido.";
    default:
      return fallback || "Não foi possível iniciar sessão.";
  }
}
