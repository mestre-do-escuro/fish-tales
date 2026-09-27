import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { h as ChevronRight, i as Store, l as MessagesSquare, m as Crown, p as Fish, u as MapPinned } from "../_libs/lucide-react.mjs";
import { r as Route$3 } from "./router-BEVyCXtN.mjs";
import { t as AdminShell } from "./admin-shell-B_X1ihmR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-Bnf0D16M.js
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
		text: "Planos, preços e benefícios."
	}
];
function AdminHome() {
	const regions = Route$3.useLoaderData();
	const spotCount = regions.reduce((n, r) => n + r.spots.length, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, {
		title: "Administração",
		subtitle: "Gira os conteúdos da app O Pescador.",
		back: "app",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/admin/spots",
				className: "group relative flex min-h-44 flex-col rounded-2xl border border-primary/45 bg-surface p-5 shadow-[0_0_28px_rgb(40_185_255/0.12)] transition-colors hover:border-primary",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid size-11 place-items-center rounded-xl bg-primary/15 text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPinned, {
							className: "size-5",
							"aria-hidden": true
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-4 text-lg font-semibold",
						children: "Spots e regiões"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm leading-relaxed text-muted",
						children: "Adicione praias por região, com imagem de fundo para o painel da maré."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-auto flex items-center justify-between pt-4 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
									className: "font-semibold text-fg",
									children: regions.length
								}),
								" regiões ·",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
									className: "font-semibold text-fg",
									children: spotCount
								}),
								" spots"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
							className: "size-5 text-primary transition-transform group-hover:translate-x-1",
							"aria-hidden": true
						})]
					})
				]
			}), SOON.map(({ icon: Icon, title, text }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
			}, title))]
		})
	});
}
//#endregion
export { AdminHome as component };
