//#region node_modules/.nitro/vite/services/ssr/assets/error-message-B5clhFZ8.js
/** User-facing text for a failed backoffice server call. */
function errorMessage(err) {
	if (err instanceof Error && err.message === "Unauthorized") return "A sessão expirou. Entre novamente.";
	return err instanceof Error ? err.message : "Ocorreu um erro. Tente novamente.";
}
//#endregion
export { errorMessage as t };
