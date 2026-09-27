import { createFileRoute } from "@tanstack/react-router";
import { loadRegions } from "@/lib/spots-db";

// Plain JSON for public/peixe.html (vanilla JS can't call server functions).
export const Route = createFileRoute("/api/spots")({
  server: {
    handlers: {
      GET: async () => {
        const regions = await loadRegions();
        return Response.json(
          { regions },
          { headers: { "Cache-Control": "no-store" } },
        );
      },
    },
  },
});
