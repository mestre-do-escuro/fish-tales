import { MAX_IMAGE_BYTES } from "@/lib/spots";

export interface ResizedImage {
  /** Base64 without the data: prefix. */
  data: string;
  type: "image/jpeg";
  /** data: URL for previews. */
  url: string;
}

const MAX_SIDE = 1920;

/** Downscale an uploaded photo in the browser and re-encode it as JPEG. */
export async function resizeImage(file: File): Promise<ResizedImage> {
  if (!file.type.startsWith("image/")) throw new Error("Escolha um ficheiro de imagem.");
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error("Não foi possível ler esta imagem. Use JPEG, PNG ou WebP.");
  }
  const scale = Math.min(1, MAX_SIDE / bitmap.width, MAX_SIDE / bitmap.height);
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("O navegador não conseguiu processar a imagem.");
  ctx.fillStyle = "#06151d"; // transparent PNGs get the app background, not black
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  for (const quality of [0.85, 0.75, 0.6]) {
    const url = canvas.toDataURL("image/jpeg", quality);
    const data = url.slice(url.indexOf(",") + 1);
    if ((data.length * 3) / 4 <= MAX_IMAGE_BYTES) return { data, type: "image/jpeg", url };
  }
  throw new Error("A imagem é demasiado grande, mesmo depois de comprimida.");
}
