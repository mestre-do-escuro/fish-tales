import { o as __toESM } from "../_runtime.mjs";
import { i as PLAN_LABEL, r as PLANS, t as FEATURES, u as defaultEnabled } from "./access-B-_gt6kv.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as setPlanFeature } from "./users.functions-BrnMVPLP.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as AdminShell } from "./admin-shell-GW20R2Dp.mjs";
import { t as errorMessage } from "./error-message-B5clhFZ8.mjs";
import { n as SwitchThumb, t as Switch } from "../_libs/@radix-ui/react-switch+[...].mjs";
import { o as Route } from "./router-DVNUHGON.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/access-xNUz1I8f.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var GROUP_TITLE = {
	free: "Base (Free)",
	standard: "Pacote Standard",
	pro: "Pacote PRO"
};
function AccessAdmin() {
	const [matrix, setMatrix] = (0, import_react.useState)(Route.useLoaderData());
	const [saving, setSaving] = (0, import_react.useState)(null);
	async function toggle(plan, feature, enabled) {
		const key = `${plan}:${feature}`;
		const previous = matrix;
		setSaving(key);
		setMatrix((m) => ({
			...m,
			[plan]: {
				...m[plan],
				[feature]: enabled
			}
		}));
		try {
			setMatrix(await setPlanFeature({ data: {
				plan,
				feature,
				enabled
			} }));
		} catch (err) {
			setMatrix(previous);
			toast.error(errorMessage(err));
		} finally {
			setSaving(null);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminShell, {
		title: "Perfis de acesso",
		subtitle: "Escolha que funcionalidades cada plano desbloqueia na app. As alterações ficam ativas de imediato para todas as contas desse plano.",
		back: "admin",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-hidden rounded-2xl border border-line bg-surface",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full border-collapse text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-line bg-surface-2/60 text-left",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						scope: "col",
						className: "px-4 py-3 font-medium text-muted",
						children: "Funcionalidade"
					}), PLANS.map((plan) => {
						const on = FEATURES.filter((f) => matrix[plan][f.key]).length;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("th", {
							scope: "col",
							className: "w-14 px-1 py-3 text-center sm:w-32 sm:px-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-semibold text-fg",
								children: PLAN_LABEL[plan]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "block text-xs font-normal text-muted",
								children: [
									on,
									"/",
									FEATURES.length
								]
							})]
						}, plan);
					})]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: PLANS.map((tier) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					colSpan: 4,
					scope: "colgroup",
					className: "bg-bg/40 px-4 pb-2 pt-5 text-left text-xs font-semibold uppercase tracking-wider text-primary",
					children: GROUP_TITLE[tier]
				}) }), FEATURES.filter((f) => f.tier === tier).map((feature) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-line/60",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						scope: "row",
						className: "py-3 pl-3 pr-1 text-left font-normal leading-snug sm:px-4",
						children: feature.label
					}), PLANS.map((plan) => {
						const on = matrix[plan][feature.key];
						const changed = on !== defaultEnabled(plan, feature);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-1 py-2 text-center sm:px-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative inline-flex",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
									checked: on,
									disabled: saving === `${plan}:${feature.key}`,
									onCheckedChange: (v) => toggle(plan, feature.key, v),
									"aria-label": `${feature.label} no plano ${PLAN_LABEL[plan]}`,
									className: "relative h-6 w-10 rounded-full border sm:h-7 sm:w-12 border-line bg-bg transition-colors data-[state=checked]:border-primary/60 data-[state=checked]:bg-primary/80 disabled:opacity-60",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: "block size-4 translate-x-1 rounded-full bg-muted shadow transition-transform data-[state=checked]:translate-x-4.5 data-[state=checked]:bg-white sm:size-5 sm:data-[state=checked]:translate-x-6" })
								}), changed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute -right-1.5 -top-1 size-2 rounded-full bg-amber-300",
									title: "Diferente da predefinição do plano"
								})]
							})
						}, plan);
					})]
				}, feature.key))] }, tier)) })]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-4 flex items-center gap-2 text-xs text-muted",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "size-2 rounded-full bg-amber-300",
				"aria-hidden": true
			}), " Diferente da predefinição (cada plano inclui tudo o dos planos abaixo)."]
		})]
	});
}
//#endregion
export { AccessAdmin as component };
