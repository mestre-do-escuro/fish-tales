import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { C as MessagesSquare, F as Crown, P as Fish, i as Users, j as Gamepad2, m as ShieldCheck, u as Store, w as MapPinned, z as ChevronRight } from "../_libs/lucide-react.mjs";
import { t as AdminShell } from "./admin-shell-GW20R2Dp.mjs";
import { a as Route } from "./router-DVNUHGON.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-C5Mkmgxo.js
var import_jsx_runtime = require_jsx_runtime();
var SOON = [
	{
		icon: Fish,
		title: "Espécies",
		text: "Fichas, épocas e tamanhos mínimos das espécies."
	},
	{
		icon: Store,
		title: "Lojas",
		text: "Lojas parceiras, produtos e promoções."
	},
	{
		icon: MessagesSquare,
		title: "Comunidade",
		text: "Moderação de capturas e comentários."
	},
	{
		icon: Crown,
		title: "Subscrições",
		text: "Pagamentos, faturação e preços dos planos."
	}
];
function AdminHome() {
	const { regions, users } = Route.useLoaderData();
	const spotCount = regions.reduce((n, r) => n + r.spots.length, 0);
	const paying = users.filter((u) => u.plan !== "free").length;
	const admins = users.filter((u) => u.role === "admin").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, {
		title: "Administração",
		subtitle: "Gira os conteúdos e as contas da app O Pescador.",
		back: "app",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HubCard, {
					to: "/admin/users",
					icon: Users,
					title: "Utilizadores",
					text: "Crie, edite e apague contas, com perfil, plano e papel de cada pessoa.",
					stats: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
							className: "font-semibold text-fg",
							children: users.length
						}),
						" ",
						users.length === 1 ? "conta" : "contas",
						" · ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
							className: "font-semibold text-fg",
							children: paying
						}),
						" pagantes ·",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
							className: "font-semibold text-fg",
							children: admins
						}),
						" admin"
					] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HubCard, {
					to: "/admin/access",
					icon: ShieldCheck,
					title: "Perfis de acesso",
					text: "Escolha que funcionalidades cada plano (Free, Standard, PRO) desbloqueia.",
					stats: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "3 planos" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HubCard, {
					to: "/admin/pesca",
					icon: Gamepad2,
					title: "Pesca Interativa",
					text: "Aventura em 5 níveis e modo infinito, com loja de upgrades, coins, combos e bolhas de tempo.",
					stats: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "5 níveis · modo infinito · loja" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HubCard, {
					to: "/admin/spots",
					icon: MapPinned,
					title: "Spots e regiões",
					text: "Adicione praias por região, com imagem de fundo para o painel da maré.",
					stats: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
							className: "font-semibold text-fg",
							children: regions.length
						}),
						" regiões · ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
							className: "font-semibold text-fg",
							children: spotCount
						}),
						" spots"
					] })
				}),
				SOON.map(({ icon: Icon, title, text }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					"aria-disabled": "true",
					className: "flex min-h-44 flex-col rounded-2xl border border-dashed border-line bg-surface/50 p-5 text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-11 place-items-center rounded-xl bg-surface-2 text-faint",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
									className: "size-5",
									"aria-hidden": true
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full border border-line px-2.5 py-1 text-xs font-medium",
								children: "Em breve"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-4 text-lg font-semibold text-fg/70",
							children: title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm leading-relaxed",
							children: text
						})
					]
				}, title))
			]
		})
	});
}
function HubCard({ to, icon: Icon, title, text, stats }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		className: "group relative flex min-h-44 flex-col rounded-2xl border border-primary/45 bg-surface p-5 shadow-[0_0_28px_rgb(40_185_255/0.12)] transition-colors hover:border-primary",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid size-11 place-items-center rounded-xl bg-primary/15 text-primary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
					className: "size-5",
					"aria-hidden": true
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-4 text-lg font-semibold",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm leading-relaxed text-muted",
				children: text
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-auto flex items-center justify-between pt-4 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted",
					children: stats
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
					className: "size-5 text-primary transition-transform group-hover:translate-x-1",
					"aria-hidden": true
				})]
			})
		]
	});
}
//#endregion
export { AdminHome as component };
