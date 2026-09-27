import { b as useRouteContext, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as signOut } from "./client-CH2mWUg4.mjs";
import { B as ArrowLeft, D as LogOut } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-shell-GW20R2Dp.js
var import_jsx_runtime = require_jsx_runtime();
function WaveLogo() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 48 40",
		"aria-hidden": "true",
		className: "h-8 w-9 shrink-0 drop-shadow-[0_0_8px_rgb(60_200_255/0.45)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
			id: "adminWave",
			x1: "0",
			y1: "0",
			x2: "1",
			y2: "1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
				offset: "0",
				stopColor: "#7ff3ff"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
				offset: "1",
				stopColor: "#1aa6e0"
			})]
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
			fill: "none",
			stroke: "url(#adminWave)",
			strokeWidth: "3.6",
			strokeLinecap: "round",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M5 13c5-8 13-8 19-3s13 5 19-2" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M3 22c6-7 14-7 20-2s14 5 21-2" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M6 31c5-5 12-5 17-1s12 4 18-1" })
			]
		})]
	});
}
/** Page chrome shared by the backoffice pages. */
function AdminShell({ title, subtitle, back, actions, children }) {
	const { gate } = useRouteContext({ from: "/admin" });
	const admin = gate.status === "ok" ? gate.admin : null;
	const backClass = "inline-flex min-h-11 items-center gap-2 rounded-xl border border-line px-3 text-sm text-muted transition-colors hover:border-primary/50 hover:text-fg";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-[radial-gradient(90%_60%_at_50%_-10%,rgb(30_110_150/0.28),transparent_70%)] bg-bg font-sans text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mx-auto flex max-w-6xl items-center gap-3 px-4 pt-4 sm:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				href: "/peixe.html",
				className: "flex items-center gap-2",
				"aria-label": "O Pescador · voltar à app",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WaveLogo, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "leading-tight",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "block whitespace-nowrap text-lg font-semibold italic tracking-tight",
						children: "O Pescador"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-[0.65rem] font-medium tracking-[0.18em] text-primary/80",
						children: "BACKOFFICE"
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ml-auto flex items-center gap-2",
				children: [back === "app" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: "/peixe.html",
					className: backClass,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {
							className: "size-4",
							"aria-hidden": true
						}),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden sm:inline",
							children: "Voltar à"
						}),
						" app"
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/admin",
					className: backClass,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {
							className: "size-4",
							"aria-hidden": true
						}),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "sr-only sm:not-sr-only",
							children: "Administração"
						})
					]
				}), admin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => signOut("/login?redirect=%2Fadmin").catch(() => toast.error("Não foi possível terminar a sessão.")),
					className: "inline-flex min-h-11 items-center gap-2 rounded-xl border border-line px-3 text-sm text-muted transition-colors hover:border-danger/50 hover:text-fg",
					title: `Terminar sessão (${admin.email})`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden max-w-40 truncate md:inline",
							children: admin.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, {
							className: "size-4",
							"aria-hidden": true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "sr-only",
							children: "Terminar sessão"
						})
					]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-8 flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-semibold tracking-tight sm:text-3xl",
					children: title
				}), subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 max-w-xl text-sm leading-relaxed text-muted",
					children: subtitle
				})] }), actions]
			}), children]
		})]
	});
}
//#endregion
export { WaveLogo as n, AdminShell as t };
