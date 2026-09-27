import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { c as Trash2 } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ui-DGhKQTyw.js
var import_jsx_runtime = require_jsx_runtime();
function ConfirmBar({ text, busy, onCancel, onConfirm }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		role: "alert",
		className: "flex flex-wrap items-center gap-2 rounded-xl border border-danger/40 bg-danger/10 p-2 pl-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mr-auto text-sm font-medium",
				children: text
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GhostButton, {
				onClick: onCancel,
				disabled: busy,
				children: "Cancelar"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: onConfirm,
				disabled: busy,
				className: "inline-flex min-h-11 items-center gap-2 rounded-xl bg-danger px-4 text-sm font-semibold text-primary-fg disabled:opacity-60",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
					className: "size-4",
					"aria-hidden": true
				}), " Apagar"]
			})
		]
	});
}
function PrimaryButton({ children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		...props,
		className: "inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-fg shadow-[0_0_20px_rgb(40_185_255/0.3)] transition-opacity hover:opacity-90 disabled:opacity-60",
		children
	});
}
function GhostButton({ children, tone, ...props }) {
	const toneClass = tone === "danger" ? "hover:border-danger/60 hover:text-danger" : "hover:border-primary/60 hover:text-primary";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		...props,
		className: `inline-flex min-h-11 items-center gap-2 rounded-xl border border-line bg-bg/60 px-3.5 text-sm font-medium text-fg backdrop-blur transition-colors disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-line disabled:hover:text-fg ${toneClass}`,
		children
	});
}
function Field({ label, htmlFor, hint, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
			htmlFor,
			className: "mb-1.5 block text-sm font-medium",
			children: label
		}),
		children,
		hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1.5 text-xs leading-relaxed text-muted",
			children: hint
		})
	] });
}
//#endregion
export { PrimaryButton as i, Field as n, GhostButton as r, ConfirmBar as t };
