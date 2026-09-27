import { useId, useRef, useState, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import * as Dialog from "@radix-ui/react-dialog";
import { ImagePlus, MapPin, Monitor, Pencil, Plus, Smartphone, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/admin-shell";
import { errorMessage } from "@/components/admin/error-message";
import { ConfirmBar, Field, GhostButton, PrimaryButton } from "@/components/admin/ui";
import { resizeImage, type ResizedImage } from "@/lib/resize-image";
import { SPOT_PROFILES, imageUrl, type RegionRow, type SpotRow } from "@/lib/spots";
import {
  createRegion,
  createSpot,
  deleteRegion,
  deleteSpot,
  listRegions,
  updateRegion,
  updateSpot,
} from "@/lib/spots.functions";

export const Route = createFileRoute("/admin/spots")({
  loader: () => listRegions(),
  head: () => ({ meta: [{ title: "Spots e regiões · O Pescador" }] }),
  component: SpotsAdmin,
});

const DEFAULT_IMAGE = "/scene-cascais.jpg";
const DEFAULT_FOCUS = 62;

type Editor =
  | { kind: "region"; region?: RegionRow }
  | { kind: "spot"; regionId: number; spot?: SpotRow };

interface ShownImage {
  url: string;
  focus: number;
  source: "own" | "region" | "default";
}

function regionImage(region: RegionRow): ShownImage {
  return region.hasImage
    ? { url: imageUrl("region", region.id, region.imageVersion), focus: region.imageFocus, source: "own" }
    : { url: DEFAULT_IMAGE, focus: DEFAULT_FOCUS, source: "default" };
}

function spotImage(spot: SpotRow, region: RegionRow | undefined): ShownImage {
  if (spot.hasImage) {
    return { url: imageUrl("spot", spot.id, spot.imageVersion), focus: spot.imageFocus, source: "own" };
  }
  const fallback = region ? regionImage(region) : { url: DEFAULT_IMAGE, focus: DEFAULT_FOCUS, source: "default" as const };
  return { ...fallback, source: fallback.source === "own" ? "region" : "default" };
}

const SOURCE_LABEL: Record<ShownImage["source"], string> = {
  own: "Imagem própria",
  region: "Imagem da região",
  default: "Imagem padrão",
};

function SpotsAdmin() {
  const [regions, setRegions] = useState<RegionRow[]>(Route.useLoaderData());
  const [editor, setEditor] = useState<Editor | null>(null);
  const [confirming, setConfirming] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function run(action: () => Promise<RegionRow[]>, done: string) {
    setBusy(true);
    try {
      setRegions(await action());
      toast.success(done);
      return true;
    } catch (err) {
      toast.error(errorMessage(err));
      return false;
    } finally {
      setBusy(false);
    }
  }

  return (
    <AdminShell
      title="Spots e regiões"
      subtitle="Cada spot aparece no seletor de praias da app. A imagem é o fundo do painel da maré; sem imagem própria, é usada a da região e, depois, a imagem padrão."
      back="admin"
      actions={
        <PrimaryButton onClick={() => setEditor({ kind: "region" })}>
          <Plus className="size-4" aria-hidden /> Nova região
        </PrimaryButton>
      }
    >
      <div className="space-y-10">
        {regions.length === 0 && (
          <p className="rounded-2xl border border-dashed border-line p-8 text-center text-muted">
            Ainda não há regiões. Crie a primeira para começar a adicionar spots.
          </p>
        )}
        {regions.map((region) => {
          const shown = regionImage(region);
          const confirmKey = `region-${region.id}`;
          return (
            <section key={region.id} aria-labelledby={`region-${region.id}-title`}>
              <div className="relative overflow-hidden rounded-2xl border border-line">
                <ScenePreview image={shown} className="aspect-[5/2] sm:aspect-[5/1]" />
                <div className="absolute inset-0 flex flex-col justify-end gap-3 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent p-4 sm:flex-row sm:items-end sm:justify-between sm:p-5">
                  <div>
                    <h2 id={`region-${region.id}-title`} className="text-xl font-semibold sm:text-2xl">
                      {region.name}
                    </h2>
                    <p className="text-sm text-muted">
                      {region.spots.length} {region.spots.length === 1 ? "spot" : "spots"} ·{" "}
                      {region.hasImage ? "com imagem da região" : "sem imagem (usa a padrão)"}
                    </p>
                  </div>
                  {confirming === confirmKey ? (
                    <ConfirmBar
                      text={`Apagar a região “${region.name}”?`}
                      busy={busy}
                      onCancel={() => setConfirming(null)}
                      onConfirm={async () => {
                        if (await run(() => deleteRegion({ data: { id: region.id } }), "Região apagada.")) {
                          setConfirming(null);
                        }
                      }}
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      <GhostButton onClick={() => setEditor({ kind: "region", region })}>
                        <Pencil className="size-4" aria-hidden /> Editar região
                      </GhostButton>
                      <GhostButton
                        tone="danger"
                        disabled={region.spots.length > 0}
                        title={region.spots.length > 0 ? "Só é possível apagar uma região sem spots." : undefined}
                        onClick={() => setConfirming(confirmKey)}
                      >
                        <Trash2 className="size-4" aria-hidden /> Apagar
                      </GhostButton>
                    </div>
                  )}
                </div>
              </div>

              <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {region.spots.map((spot) => {
                  const img = spotImage(spot, region);
                  const key = `spot-${spot.id}`;
                  return (
                    <li key={spot.id} className="flex flex-col overflow-hidden rounded-2xl border border-line bg-surface">
                      <div className="relative">
                        <ScenePreview image={img} className="aspect-[5/2]" />
                        <span className="absolute left-3 top-3 rounded-full bg-bg/75 px-2.5 py-1 text-xs font-medium text-muted backdrop-blur">
                          {SOURCE_LABEL[img.source]}
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col gap-3 p-4">
                        <div>
                          <h3 className="flex items-center gap-1.5 font-semibold">
                            <MapPin className="size-4 text-primary" aria-hidden /> {spot.name}
                          </h3>
                          <p className="mt-0.5 text-sm text-muted">Previsão baseada em {SPOT_PROFILES[spot.profile]}</p>
                        </div>
                        {confirming === key ? (
                          <ConfirmBar
                            text={`Apagar “${spot.name}”?`}
                            busy={busy}
                            onCancel={() => setConfirming(null)}
                            onConfirm={async () => {
                              if (await run(() => deleteSpot({ data: { id: spot.id } }), "Spot apagado.")) {
                                setConfirming(null);
                              }
                            }}
                          />
                        ) : (
                          <div className="mt-auto flex gap-2">
                            <GhostButton onClick={() => setEditor({ kind: "spot", regionId: region.id, spot })}>
                              <Pencil className="size-4" aria-hidden /> Editar
                            </GhostButton>
                            <GhostButton tone="danger" onClick={() => setConfirming(key)}>
                              <Trash2 className="size-4" aria-hidden /> Apagar
                            </GhostButton>
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
                <li>
                  <button
                    type="button"
                    onClick={() => setEditor({ kind: "spot", regionId: region.id })}
                    className="flex h-full min-h-40 w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-line text-muted transition-colors hover:border-primary/60 hover:text-primary"
                  >
                    <Plus className="size-6" aria-hidden />
                    <span className="text-sm font-medium">Novo spot em {region.name}</span>
                  </button>
                </li>
              </ul>
            </section>
          );
        })}
      </div>

      {editor && (
        <EditorDialog
          key={editor.kind === "region" ? `r${editor.region?.id ?? "new"}` : `s${editor.spot?.id ?? "new"}`}
          editor={editor}
          regions={regions}
          busy={busy}
          onClose={() => setEditor(null)}
          onSubmit={async (action, done) => {
            if (await run(action, done)) setEditor(null);
          }}
        />
      )}
    </AdminShell>
  );
}

/** The image cropped the way the dashboard's wide scene band shows it. */
function ScenePreview({ image, className = "" }: { image: ShownImage; className?: string }) {
  return (
    <div
      className={`relative w-full bg-surface-2 bg-cover bg-no-repeat ${className}`}
      style={{ backgroundImage: `url("${image.url}")`, backgroundPosition: `center ${image.focus}%` }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(4_16_34/0.7)_0%,rgb(8_26_48/0.35)_45%,rgb(10_40_60/0.15)_100%)]" />
    </div>
  );
}

// Image edit state: keep what's stored, remove it, or replace it with an upload.
type ImageEdit = { kind: "keep" } | { kind: "clear" } | { kind: "new"; image: ResizedImage };

function EditorDialog({
  editor,
  regions,
  busy,
  onClose,
  onSubmit,
}: {
  editor: Editor;
  regions: RegionRow[];
  busy: boolean;
  onClose: () => void;
  onSubmit: (action: () => Promise<RegionRow[]>, done: string) => void;
}) {
  const isSpot = editor.kind === "spot";
  const existing = editor.kind === "spot" ? editor.spot : editor.region;
  const [name, setName] = useState(existing?.name ?? "");
  const [regionId, setRegionId] = useState(editor.kind === "spot" ? editor.regionId : 0);
  const [profile, setProfile] = useState(editor.kind === "spot" ? (editor.spot?.profile ?? 0) : 0);
  const [focus, setFocus] = useState(existing?.imageFocus ?? 50);
  const [imageEdit, setImageEdit] = useState<ImageEdit>({ kind: "keep" });
  const [processing, setProcessing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const ids = useId();

  const hasOwn = imageEdit.kind === "new" || (imageEdit.kind === "keep" && !!existing?.hasImage);
  const region = regions.find((r) => r.id === regionId);
  let preview: ShownImage;
  if (imageEdit.kind === "new") {
    preview = { url: imageEdit.image.url, focus, source: "own" };
  } else if (hasOwn && existing) {
    preview = { url: imageUrl(isSpot ? "spot" : "region", existing.id, existing.imageVersion), focus, source: "own" };
  } else if (isSpot && region?.hasImage) {
    preview = { ...regionImage(region), source: "region" };
  } else {
    preview = { url: DEFAULT_IMAGE, focus: DEFAULT_FOCUS, source: "default" };
  }

  async function pick(file: File | undefined) {
    if (!file) return;
    setProcessing(true);
    try {
      const image = await resizeImage(file);
      setImageEdit({ kind: "new", image });
      if (!hasOwn) setFocus(50);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setProcessing(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const image =
      imageEdit.kind === "new"
        ? { data: imageEdit.image.data, type: imageEdit.image.type }
        : imageEdit.kind === "clear"
          ? null
          : undefined;
    if (editor.kind === "region") {
      const id = editor.region?.id;
      onSubmit(
        () =>
          id
            ? updateRegion({ data: { id, name, focus, image } })
            : createRegion({ data: { name, focus, image } }),
        id ? "Região guardada." : "Região criada.",
      );
    } else {
      const id = editor.spot?.id;
      const fields = { regionId, name, profile, focus };
      onSubmit(
        () =>
          id ? updateSpot({ data: { id, ...fields, image } }) : createSpot({ data: { ...fields, image } }),
        id ? "Spot guardado." : "Spot criado.",
      );
    }
  }

  const title = isSpot ? (existing ? "Editar spot" : "Novo spot") : existing ? "Editar região" : "Nova região";
  const inputClass =
    "min-h-11 w-full rounded-xl border border-line bg-bg px-3 text-base text-fg outline-none transition-colors focus:border-primary/70";

  return (
    <Dialog.Root open onOpenChange={(open) => !open && !busy && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-bg/75 backdrop-blur-sm" />
        <Dialog.Content className="fixed inset-x-0 bottom-0 z-50 max-h-[92vh] overflow-y-auto rounded-t-2xl border border-line bg-surface p-5 font-sans text-fg shadow-2xl sm:inset-auto sm:left-1/2 sm:top-1/2 sm:w-[min(40rem,calc(100vw-2rem))] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl sm:p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="text-xl font-semibold">{title}</Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-muted">
                {isSpot
                  ? "O spot aparece no seletor de praias da região escolhida."
                  : "As regiões agrupam os spots no primeiro seletor da app."}
              </Dialog.Description>
            </div>
            <Dialog.Close
              className="grid size-11 shrink-0 place-items-center rounded-xl text-muted hover:bg-surface-2 hover:text-fg"
              aria-label="Fechar"
              disabled={busy}
            >
              <X className="size-5" />
            </Dialog.Close>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <Field label="Nome" htmlFor={`${ids}-name`}>
              <input
                id={`${ids}-name`}
                className={inputClass}
                value={name}
                maxLength={60}
                required
                autoFocus
                onChange={(e) => setName(e.target.value)}
                placeholder={isSpot ? "ex.: Praia da Rainha" : "ex.: Setúbal"}
              />
            </Field>

            {isSpot && (
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Região" htmlFor={`${ids}-region`}>
                  <select
                    id={`${ids}-region`}
                    className={inputClass}
                    value={regionId}
                    onChange={(e) => setRegionId(Number(e.target.value))}
                  >
                    {regions.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field
                  label="Previsão de referência"
                  htmlFor={`${ids}-profile`}
                  hint="Maré, vento e chuva copiados deste spot, com pequenas variações."
                >
                  <select
                    id={`${ids}-profile`}
                    className={inputClass}
                    value={profile}
                    onChange={(e) => setProfile(Number(e.target.value))}
                  >
                    {SPOT_PROFILES.map((p, i) => (
                      <option key={p} value={i}>
                        {p}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            )}

            <fieldset className="space-y-3">
              <legend className="mb-2 text-sm font-medium">Imagem de fundo</legend>
              <div className="grid gap-3 sm:grid-cols-[1fr_9rem]">
                <PreviewFrame icon={<Monitor className="size-3.5" aria-hidden />} label="Computador">
                  <ScenePreview image={preview} className="aspect-[5/1]" />
                </PreviewFrame>
                <PreviewFrame icon={<Smartphone className="size-3.5" aria-hidden />} label="Telemóvel" className="w-1/2 sm:w-auto">
                  <ScenePreview image={preview} className="aspect-[2/1]" />
                </PreviewFrame>
              </div>
              <p className="text-xs text-muted">
                {SOURCE_LABEL[preview.source]}
                {preview.source === "region" && " — este spot usa a imagem da região até ter uma própria."}
                {preview.source === "default" && " — sem imagem própria, a app mostra a fotografia padrão."}
              </p>
              <div className="flex flex-wrap gap-2">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  id={`${ids}-file`}
                  onChange={(e) => pick(e.target.files?.[0])}
                />
                <GhostButton onClick={() => fileRef.current?.click()} disabled={processing || busy}>
                  <ImagePlus className="size-4" aria-hidden />
                  {processing ? "A processar…" : hasOwn ? "Trocar imagem" : "Carregar imagem"}
                </GhostButton>
                {hasOwn && (
                  <GhostButton
                    tone="danger"
                    disabled={busy}
                    onClick={() => setImageEdit(existing?.hasImage ? { kind: "clear" } : { kind: "keep" })}
                  >
                    <Trash2 className="size-4" aria-hidden /> Remover imagem
                  </GhostButton>
                )}
              </div>
              <Field
                label={`Foco vertical · ${focus}%`}
                htmlFor={`${ids}-focus`}
                hint={hasOwn ? "0% mostra o topo da imagem, 100% o fundo." : "Disponível depois de carregar uma imagem."}
              >
                <input
                  id={`${ids}-focus`}
                  type="range"
                  min={0}
                  max={100}
                  value={focus}
                  disabled={!hasOwn}
                  onChange={(e) => setFocus(Number(e.target.value))}
                  className="h-11 w-full accent-primary disabled:opacity-40"
                />
              </Field>
            </fieldset>

            <div className="flex flex-col-reverse gap-2 border-t border-line pt-5 sm:flex-row sm:justify-end">
              <Dialog.Close asChild>
                <GhostButton disabled={busy}>Cancelar</GhostButton>
              </Dialog.Close>
              <button
                type="submit"
                disabled={busy || processing || !name.trim()}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-fg transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {busy ? "A guardar…" : "Guardar"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function PreviewFrame({
  icon,
  label,
  className,
  children,
}: {
  icon: ReactNode;
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <span className="mb-1 flex items-center gap-1 text-xs text-faint">
        {icon} {label}
      </span>
      <div className="overflow-hidden rounded-lg border border-line">{children}</div>
    </div>
  );
}
