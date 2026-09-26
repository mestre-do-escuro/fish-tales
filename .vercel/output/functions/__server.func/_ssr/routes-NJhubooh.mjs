import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-NJhubooh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	(0, import_react.useEffect)(() => {
		window.location.replace("/peixe.html");
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "peixe-boot",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "PeixeLisboa" })
	});
}
//#endregion
export { Home as component };
