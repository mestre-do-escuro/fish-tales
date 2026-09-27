// Admin server functions for regions/spots. Reads are public (the app shows
// them); every change requires an active admin. There is no bulk delete.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql } from "@/lib/db";
import { loadRegions } from "@/lib/spots-db";
import { IMAGE_TYPES, MAX_IMAGE_BYTES, SPOT_PROFILES } from "@/lib/spots";
import { adminMiddleware } from "@/lib/admin-auth";

const name = z
  .string()
  .trim()
  .min(1, "O nome é obrigatório.")
  .max(60, "O nome pode ter no máximo 60 caracteres.");
const id = z.number().int().positive();
const focus = z.number().int().min(0).max(100);

const image = z.object({
  data: z
    .string()
    .max(Math.ceil((MAX_IMAGE_BYTES * 4) / 3) + 4, "A imagem é demasiado grande (máx. 2,5 MB).")
    .regex(/^[A-Za-z0-9+/]+={0,2}$/, "Imagem inválida."),
  type: z.enum(IMAGE_TYPES),
});
type ImageInput = z.infer<typeof image>;

/** Check the decoded bytes really are the claimed JPEG/PNG/WebP. */
function assertImage(img: ImageInput) {
  const head = Buffer.from(img.data.slice(0, 24), "base64");
  const ok =
    img.type === "image/jpeg"
      ? head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff
      : img.type === "image/png"
        ? head.subarray(0, 4).toString("latin1") === "\x89PNG"
        : head.subarray(0, 4).toString("latin1") === "RIFF" &&
          head.subarray(8, 12).toString("latin1") === "WEBP";
  if (!ok) throw new Error("O ficheiro não é uma imagem JPEG, PNG ou WebP válida.");
}

/** Turn unique-constraint violations into a readable message. */
async function friendly<T>(what: string, run: () => Promise<T>): Promise<T> {
  try {
    return await run();
  } catch (err) {
    const code = (err as { code?: string }).code;
    if (code === "23505") throw new Error(`Já existe ${what} com esse nome.`);
    if (code === "23503") throw new Error("Esta região ainda tem spots; apague-os ou mova-os primeiro.");
    throw err;
  }
}

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const randInt = (min: number, max: number) => Math.floor(rand(min, max + 1));

export const listRegions = createServerFn({ method: "GET" }).handler(() => loadRegions());

export const createRegion = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(z.object({ name, focus: focus.default(50), image: image.nullish() }))
  .handler(async ({ data }) => {
    if (data.image) assertImage(data.image);
    const sql = await getSql();
    await friendly("uma região", () => sql`
      insert into regions (name, sort, image_data, image_type, image_focus, image_version)
      values (
        ${data.name},
        (select coalesce(max(sort), 0) + 1 from regions),
        ${data.image?.data ?? null},
        ${data.image?.type ?? null},
        ${data.focus},
        ${data.image ? 1 : 0}
      )`);
    return loadRegions();
  });

export const updateRegion = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  // image: undefined = keep, null = remove, object = replace.
  .validator(z.object({ id, name, focus, image: image.nullable().optional() }))
  .handler(async ({ data }) => {
    if (data.image) assertImage(data.image);
    const sql = await getSql();
    const rows = await friendly("uma região", () => sql`
      update regions set name = ${data.name}, image_focus = ${data.focus}
      where id = ${data.id} returning id`);
    if (!rows.length) throw new Error("Região não encontrada.");
    if (data.image !== undefined) {
      await sql`
        update regions set
          image_data = ${data.image?.data ?? null},
          image_type = ${data.image?.type ?? null},
          image_version = image_version + 1
        where id = ${data.id}`;
    }
    return loadRegions();
  });

export const deleteRegion = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(z.object({ id }))
  .handler(async ({ data }) => {
    const sql = await getSql();
    const [{ n }] = await sql<{ n: number }>`
      select count(*) as n from spots where region_id = ${data.id}`;
    if (n > 0) throw new Error("Só é possível apagar uma região sem spots.");
    await friendly("uma região", () => sql`delete from regions where id = ${data.id}`);
    return loadRegions();
  });

const spotFields = {
  regionId: id,
  name,
  profile: z.number().int().min(0).max(SPOT_PROFILES.length - 1),
  focus,
};

export const createSpot = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(z.object({ ...spotFields, image: image.nullish() }))
  .handler(async ({ data }) => {
    if (data.image) assertImage(data.image);
    const sql = await getSql();
    // Copy the reference profile with small variations, like the seed beaches.
    const seed = Math.round(rand(0.05, 0.95) * 100) / 100;
    const wind = Math.round(rand(0.9, 1.3) * 100) / 100;
    await friendly("um spot nesta região", () => sql`
      insert into spots (region_id, name, profile, seed, temp, wind, rain, coef, score, sort,
                         image_data, image_type, image_focus, image_version)
      values (
        ${data.regionId}, ${data.name}, ${data.profile},
        ${seed}, ${randInt(-1, 1)}, ${wind}, ${randInt(-3, 4)}, ${randInt(-2, 2)}, ${randInt(-1, 1)},
        (select coalesce(max(sort), 0) + 1 from spots where region_id = ${data.regionId}),
        ${data.image?.data ?? null}, ${data.image?.type ?? null}, ${data.focus},
        ${data.image ? 1 : 0}
      )`);
    return loadRegions();
  });

export const updateSpot = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(z.object({ id, ...spotFields, image: image.nullable().optional() }))
  .handler(async ({ data }) => {
    if (data.image) assertImage(data.image);
    const sql = await getSql();
    const rows = await friendly("um spot nesta região", () => sql`
      update spots set
        name = ${data.name},
        profile = ${data.profile},
        image_focus = ${data.focus},
        sort = case when region_id = ${data.regionId} then sort
                    else (select coalesce(max(sort), 0) + 1 from spots where region_id = ${data.regionId}) end,
        region_id = ${data.regionId}
      where id = ${data.id} returning id`);
    if (!rows.length) throw new Error("Spot não encontrado.");
    if (data.image !== undefined) {
      await sql`
        update spots set
          image_data = ${data.image?.data ?? null},
          image_type = ${data.image?.type ?? null},
          image_version = image_version + 1
        where id = ${data.id}`;
    }
    return loadRegions();
  });

export const deleteSpot = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .validator(z.object({ id }))
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql`delete from spots where id = ${data.id}`;
    return loadRegions();
  });
