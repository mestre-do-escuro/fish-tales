import { o as __toESM } from "../_runtime.mjs";
import { a as ROLES, c as STATUS_LABEL, i as PLAN_LABEL, o as ROLE_LABEL, r as PLANS, s as STATUSES } from "./access-B-_gt6kv.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as DialogOverlay, i as DialogDescription, n as DialogClose, o as DialogPortal, r as DialogContent, s as DialogTitle, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { n as deleteUser, o as updateUser, t as createUser } from "./users.functions-BrnMVPLP.mjs";
import { E as Mail, T as MapPin, _ as Plus, a as UserPlus, b as Pencil, c as Trash2, h as Search, n as X, y as Phone } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as AdminShell } from "./admin-shell-GW20R2Dp.mjs";
import { t as errorMessage } from "./error-message-B5clhFZ8.mjs";
import { n as Route } from "./router-DVNUHGON.mjs";
import { i as PrimaryButton, n as Field, r as GhostButton, t as ConfirmBar } from "./ui-DGhKQTyw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/users-ruZpklKz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PLAN_TONE = {
	free: "border-line text-muted",
	standard: "border-primary/50 text-primary",
	pro: "border-amber-400/60 text-amber-300"
};
var dateFmt = new Intl.DateTimeFormat("pt-PT", {
	day: "2-digit",
	month: "short",
	year: "numeric"
});
var fmt = (iso) => iso ? dateFmt.format(new Date(iso)) : "—";
function initials(name) {
	return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");
}
function UsersAdmin() {
	const [users, setUsers] = (0, import_react.useState)(Route.useLoaderData());
	const { gate } = Route.useRouteContext();
	const selfId = gate.status === "ok" ? gate.admin.userId : "";
	const [query, setQuery] = (0, import_react.useState)("");
	const [planFilter, setPlanFilter] = (0, import_react.useState)("all");
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [confirming, setConfirming] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const shown = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		return users.filter((u) => (planFilter === "all" || u.plan === planFilter) && (!q || [
			u.name,
			u.email,
			u.location ?? "",
			u.phone ?? ""
		].some((v) => v.toLowerCase().includes(q))));
	}, [
		users,
		query,
		planFilter
	]);
	async function run(action, done) {
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
	const control = "min-h-11 rounded-xl border border-line bg-bg px-3 text-base text-fg outline-none transition-colors focus:border-primary/70";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminShell, {
		title: "Utilizadores",
		subtitle: "Todas as contas da app: perfil, plano, papel e estado. Suspender ou mudar a palavra-passe termina as sessões dessa pessoa.",
		back: "admin",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PrimaryButton, {
			onClick: () => setEditing("new"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, {
				className: "size-4",
				"aria-hidden": true
			}), " Novo utilizador"]
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-5 flex flex-col gap-3 sm:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "relative flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "sr-only",
							children: "Pesquisar"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
							className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-faint",
							"aria-hidden": true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: `${control} w-full pl-9`,
							placeholder: "Pesquisar por nome, email, local…",
							value: query,
							onChange: (e) => setQuery(e.target.value)
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "sr-only",
					children: "Plano"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: `${control} w-full sm:w-44`,
					value: planFilter,
					onChange: (e) => setPlanFilter(e.target.value),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "all",
						children: "Todos os planos"
					}), PLANS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: p,
						children: PLAN_LABEL[p]
					}, p))]
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mb-3 text-sm text-muted",
				children: [
					shown.length,
					" de ",
					users.length,
					" ",
					users.length === 1 ? "conta" : "contas"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "grid gap-3",
				children: [shown.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-2xl border border-line bg-surface p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-4 md:flex-row md:items-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex min-w-0 flex-1 items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid size-11 shrink-0 place-items-center rounded-full bg-primary/15 text-sm font-semibold text-primary",
									children: initials(u.name) || "?"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "truncate font-semibold",
											children: [u.name, u.id === selfId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "ml-2 text-xs font-normal text-muted",
												children: "(você)"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "flex items-center gap-1 truncate text-sm text-muted",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, {
													className: "size-3.5 shrink-0",
													"aria-hidden": true
												}),
												" ",
												u.email
											]
										}),
										(u.phone || u.location) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-0.5 flex flex-wrap gap-x-3 text-xs text-faint",
											children: [u.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center gap-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, {
														className: "size-3",
														"aria-hidden": true
													}),
													" ",
													u.phone
												]
											}), u.location && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center gap-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
														className: "size-3",
														"aria-hidden": true
													}),
													" ",
													u.location
												]
											})]
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2 text-xs font-medium",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `rounded-full border px-2.5 py-1 ${PLAN_TONE[u.plan]}`,
										children: PLAN_LABEL[u.plan]
									}),
									u.role === "admin" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full border border-primary/50 bg-primary/10 px-2.5 py-1 text-primary",
										children: ROLE_LABEL.admin
									}),
									u.status === "suspended" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full border border-danger/50 bg-danger/10 px-2.5 py-1 text-danger",
										children: STATUS_LABEL.suspended
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
								className: "grid grid-cols-2 gap-x-4 text-xs text-muted md:w-48",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Criada" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "text-fg/80",
										children: fmt(u.createdAt)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Última sessão" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "text-fg/80",
										children: fmt(u.lastSeenAt)
									})
								]
							}),
							confirming !== u.id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GhostButton, {
									onClick: () => setEditing(u),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, {
										className: "size-4",
										"aria-hidden": true
									}), " Editar"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GhostButton, {
									tone: "danger",
									disabled: u.id === selfId,
									title: u.id === selfId ? "Não pode apagar a sua própria conta." : void 0,
									onClick: () => setConfirming(u.id),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
										className: "size-4",
										"aria-hidden": true
									}), " Apagar"]
								})]
							})
						]
					}), confirming === u.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmBar, {
							text: `Apagar a conta de ${u.name}? Esta ação não pode ser desfeita.`,
							busy,
							onCancel: () => setConfirming(null),
							onConfirm: async () => {
								if (await run(() => deleteUser({ data: { id: u.id } }), "Conta apagada.")) setConfirming(null);
							}
						})
					})]
				}, u.id)), shown.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "rounded-2xl border border-dashed border-line p-8 text-center text-muted",
					children: users.length ? "Nenhuma conta corresponde à pesquisa." : "Ainda não há contas."
				})]
			}),
			editing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserDialog, {
				user: editing === "new" ? null : editing,
				isSelf: editing !== "new" && editing.id === selfId,
				busy,
				onClose: () => setEditing(null),
				onSubmit: async (action, done) => {
					if (await run(action, done)) setEditing(null);
				}
			}, editing === "new" ? "new" : editing.id)
		]
	});
}
function UserDialog({ user, isSelf, busy, onClose, onSubmit }) {
	const ids = (0, import_react.useId)();
	const [form, setForm] = (0, import_react.useState)({
		name: user?.name ?? "",
		email: user?.email ?? "",
		password: "",
		phone: user?.phone ?? "",
		location: user?.location ?? "",
		bio: user?.bio ?? "",
		plan: user?.plan ?? "free",
		role: user?.role ?? "user",
		status: user?.status ?? "active"
	});
	const set = (key, value) => setForm((f) => ({
		...f,
		[key]: value
	}));
	function submit(e) {
		e.preventDefault();
		const fields = {
			name: form.name,
			email: form.email,
			phone: form.phone,
			location: form.location,
			bio: form.bio,
			plan: form.plan,
			role: form.role,
			status: form.status
		};
		if (user) onSubmit(() => updateUser({ data: {
			id: user.id,
			...fields,
			password: form.password || void 0
		} }), "Conta guardada.");
		else onSubmit(() => createUser({ data: {
			...fields,
			password: form.password
		} }), "Conta criada.");
	}
	const input = "min-h-11 w-full rounded-xl border border-line bg-bg px-3 text-base text-fg outline-none transition-colors focus:border-primary/70 disabled:opacity-50";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: true,
		onOpenChange: (open) => !open && !busy && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-40 bg-bg/75 backdrop-blur-sm" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "fixed inset-x-0 bottom-0 z-50 max-h-[92vh] overflow-y-auto rounded-t-2xl border border-line bg-surface p-5 font-sans text-fg shadow-2xl sm:inset-auto sm:left-1/2 sm:top-1/2 sm:w-[min(40rem,calc(100vw-2rem))] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl sm:p-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-5 flex items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
					className: "text-xl font-semibold",
					children: user ? "Editar utilizador" : "Novo utilizador"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
					className: "mt-1 text-sm text-muted",
					children: user ? `Conta criada em ${fmt(user.createdAt)}.` : "A pessoa entra com este email e palavra-passe."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogClose, {
					className: "grid size-11 shrink-0 place-items-center rounded-xl text-muted hover:bg-surface-2 hover:text-fg",
					"aria-label": "Fechar",
					disabled: busy,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: submit,
				className: "space-y-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
								className: "mb-3 text-sm font-semibold text-primary",
								children: "Perfil"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Nome",
								htmlFor: `${ids}-name`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: `${ids}-name`,
									className: input,
									value: form.name,
									maxLength: 80,
									required: true,
									autoFocus: true,
									onChange: (e) => set("name", e.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Email",
								htmlFor: `${ids}-email`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: `${ids}-email`,
									type: "email",
									className: input,
									value: form.email,
									required: true,
									onChange: (e) => set("email", e.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Telefone",
								htmlFor: `${ids}-phone`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: `${ids}-phone`,
									type: "tel",
									className: input,
									value: form.phone,
									maxLength: 30,
									onChange: (e) => set("phone", e.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Localidade",
								htmlFor: `${ids}-location`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: `${ids}-location`,
									className: input,
									value: form.location,
									maxLength: 80,
									placeholder: "ex.: Cascais",
									onChange: (e) => set("location", e.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "sm:col-span-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Sobre",
									htmlFor: `${ids}-bio`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										id: `${ids}-bio`,
										className: `${input} min-h-20 py-2`,
										value: form.bio,
										maxLength: 500,
										onChange: (e) => set("bio", e.target.value),
										placeholder: "Estilo de pesca, spots favoritos…"
									})
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
						className: "grid gap-4 sm:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
								className: "mb-3 text-sm font-semibold text-primary",
								children: "Acesso"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Plano",
								htmlFor: `${ids}-plan`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									id: `${ids}-plan`,
									className: input,
									value: form.plan,
									onChange: (e) => set("plan", e.target.value),
									children: PLANS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: p,
										children: PLAN_LABEL[p]
									}, p))
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Papel",
								htmlFor: `${ids}-role`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									id: `${ids}-role`,
									className: input,
									value: form.role,
									disabled: isSelf,
									onChange: (e) => set("role", e.target.value),
									children: ROLES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: r,
										children: ROLE_LABEL[r]
									}, r))
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Estado",
								htmlFor: `${ids}-status`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									id: `${ids}-status`,
									className: input,
									value: form.status,
									disabled: isSelf,
									onChange: (e) => set("status", e.target.value),
									children: STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: s,
										children: STATUS_LABEL[s]
									}, s))
								})
							}),
							isSelf && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted sm:col-span-3",
								children: "Não pode alterar o seu próprio papel nem estado."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: user ? "Nova palavra-passe" : "Palavra-passe",
						htmlFor: `${ids}-password`,
						hint: user ? user.hasPassword ? "Deixe em branco para manter a atual. Mínimo 8 caracteres." : "Esta conta ainda não tem palavra-passe. Mínimo 8 caracteres." : "Mínimo 8 caracteres. Partilhe-a com a pessoa por um canal seguro.",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: `${ids}-password`,
							type: "password",
							className: input,
							value: form.password,
							minLength: 8,
							maxLength: 128,
							required: !user,
							autoComplete: "new-password",
							onChange: (e) => set("password", e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col-reverse gap-2 border-t border-line pt-5 sm:flex-row sm:justify-end",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogClose, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GhostButton, {
								disabled: busy,
								children: "Cancelar"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "submit",
							disabled: busy,
							className: "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-fg transition-opacity hover:opacity-90 disabled:opacity-60",
							children: [user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, {
								className: "size-4",
								"aria-hidden": true
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
								className: "size-4",
								"aria-hidden": true
							}), busy ? "A guardar…" : user ? "Guardar" : "Criar conta"]
						})]
					})
				]
			})]
		})] })
	});
}
//#endregion
export { UsersAdmin as component };
