import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as getMyAccess } from "./admin-auth-CVMIW43N.mjs";
import { r as signOut, t as authClient } from "./client-CH2mWUg4.mjs";
import { O as LogIn, a as UserPlus } from "../_libs/lucide-react.mjs";
import { n as WaveLogo } from "./admin-shell-GW20R2Dp.mjs";
import { i as Route } from "./router-DVNUHGON.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-DtfWYZl4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	const { data, isPending } = authClient.useSession();
	const user = data?.user;
	return {
		user: user ? {
			id: user.id,
			displayName: user.name ?? null,
			primaryEmail: user.email ?? null,
			profileImageUrl: user.image ?? null,
			isDevFallback: false
		} : null,
		isPending
	};
}
/** Only same-site paths, so ?redirect= can't bounce people to another site. */
function safeTarget(redirect) {
	if (redirect && redirect.startsWith("/") && !redirect.startsWith("//") && !redirect.startsWith("/\\")) return redirect;
	return "/peixe.html";
}
function Login() {
	const search = Route.useSearch();
	const target = search.denied ? "/peixe.html" : safeTarget(search.redirect);
	const { user, isPending } = useCurrentUserState();
	const [mode, setMode] = (0, import_react.useState)(search.mode ?? "signin");
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(search.suspended ? "Esta conta está suspensa. Contacte o suporte." : null);
	async function finish() {
		const access = await getMyAccess();
		if (!access) throw new Error("Não foi possível iniciar sessão. Tente novamente.");
		if (access.status !== "active") {
			await signOut(`/login?suspended=1&redirect=${encodeURIComponent(target)}`);
			return;
		}
		window.location.assign(target);
	}
	async function submit(e) {
		e.preventDefault();
		setBusy(true);
		setError(null);
		try {
			const { error: authError } = mode === "signin" ? await authClient.signIn.email({
				email: email.trim(),
				password
			}) : await authClient.signUp.email({
				name: name.trim(),
				email: email.trim(),
				password
			});
			if (authError) throw new Error(translate(authError.code, authError.message));
			await finish();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Ocorreu um erro. Tente novamente.");
			setBusy(false);
		}
	}
	const input = "min-h-11 w-full rounded-xl border border-line bg-bg px-3 text-base text-fg outline-none transition-colors focus:border-primary/70";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-screen place-items-center bg-[radial-gradient(90%_60%_at_50%_-10%,rgb(30_110_150/0.28),transparent_70%)] bg-bg px-4 py-10 font-sans text-fg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: "/peixe.html",
					className: "mb-8 flex items-center justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WaveLogo, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "text-2xl font-semibold italic tracking-tight",
						children: "O Pescador"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-2xl border border-line bg-surface p-6 shadow-2xl",
					children: !isPending && user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: "Sessão iniciada como"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold",
								children: user.primaryEmail
							}),
							search.denied && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								role: "alert",
								className: "rounded-xl border border-danger/40 bg-danger/10 p-3 text-sm",
								children: "Esta conta não tem permissões de administrador. Entre com outra conta para aceder ao backoffice."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => finish().catch((err) => setError(String(err?.message ?? err))),
								className: "inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-fg",
								children: search.denied ? "Voltar à app" : "Continuar"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => signOut(search.denied && search.redirect ? `/login?redirect=${encodeURIComponent(safeTarget(search.redirect))}` : "/login").catch(() => setError("Não foi possível terminar a sessão.")),
								className: "inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-line px-4 text-sm font-medium text-muted hover:text-fg",
								children: "Terminar sessão"
							}),
							error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								role: "alert",
								className: "text-sm text-danger",
								children: error
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						role: "tablist",
						className: "mb-6 grid grid-cols-2 rounded-xl bg-bg p-1 text-sm font-medium",
						children: ["signin", "signup"].map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							role: "tab",
							"aria-selected": mode === m,
							onClick: () => {
								setMode(m);
								setError(null);
							},
							className: `min-h-10 rounded-lg transition-colors ${mode === m ? "bg-surface-2 text-fg" : "text-muted hover:text-fg"}`,
							children: m === "signin" ? "Entrar" : "Criar conta"
						}, m))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: submit,
						className: "space-y-4",
						children: [
							mode === "signup" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mb-1.5 block text-sm font-medium",
									children: "Nome"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: input,
									value: name,
									onChange: (e) => setName(e.target.value),
									required: true,
									autoComplete: "name"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mb-1.5 block text-sm font-medium",
									children: "Email"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: input,
									type: "email",
									value: email,
									onChange: (e) => setEmail(e.target.value),
									required: true,
									autoComplete: "email"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mb-1.5 block text-sm font-medium",
										children: "Palavra-passe"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										className: input,
										type: "password",
										value: password,
										onChange: (e) => setPassword(e.target.value),
										required: true,
										minLength: 8,
										autoComplete: mode === "signin" ? "current-password" : "new-password"
									}),
									mode === "signup" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-1.5 block text-xs text-muted",
										children: "Pelo menos 8 caracteres."
									})
								]
							}),
							error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								role: "alert",
								className: "text-sm text-danger",
								children: error
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "submit",
								disabled: busy || isPending,
								className: "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-fg shadow-[0_0_20px_rgb(40_185_255/0.3)] disabled:opacity-60",
								children: [mode === "signin" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, {
									className: "size-4",
									"aria-hidden": true
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, {
									className: "size-4",
									"aria-hidden": true
								}), busy ? "A aguardar…" : mode === "signin" ? "Entrar" : "Criar conta"]
							})
						]
					})] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-center text-sm text-muted",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/peixe.html",
						className: "hover:text-fg",
						children: "Continuar sem conta"
					})
				})
			]
		})
	});
}
function translate(code, fallback) {
	switch (code) {
		case "INVALID_EMAIL_OR_PASSWORD": return "Email ou palavra-passe incorretos.";
		case "USER_ALREADY_EXISTS":
		case "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL": return "Já existe uma conta com esse email.";
		case "PASSWORD_TOO_SHORT": return "A palavra-passe precisa de pelo menos 8 caracteres.";
		case "INVALID_EMAIL": return "Email inválido.";
		default: return fallback || "Não foi possível iniciar sessão.";
	}
}
//#endregion
export { Login as component };
