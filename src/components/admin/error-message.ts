/** User-facing text for a failed backoffice server call. */
export function errorMessage(err: unknown) {
  if (err instanceof Error && err.message === "Unauthorized") return "A sessão expirou. Entre novamente.";
  return err instanceof Error ? err.message : "Ocorreu um erro. Tente novamente.";
}
