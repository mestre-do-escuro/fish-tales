import { createFileRoute } from "@tanstack/react-router";
import { loadImage } from "@/lib/spots-db";

// Serves region/spot images. URLs carry ?v=<image_version>, so a changed image
// gets a new URL and the old one can be cached forever.
export const Route = createFileRoute("/api/images/$kind/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const kind = params.kind;
        const id = Number(params.id);
        if ((kind !== "region" && kind !== "spot") || !Number.isInteger(id) || id < 1) {
          return new Response("Not found", { status: 404 });
        }
        const image = await loadImage(kind, id);
        if (!image) return new Response("Not found", { status: 404 });
        return new Response(Buffer.from(image.data, "base64"), {
          headers: {
            "Content-Type": image.type,
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      },
    },
  },
});
