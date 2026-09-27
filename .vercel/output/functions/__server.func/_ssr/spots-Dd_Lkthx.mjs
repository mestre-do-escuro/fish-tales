import { o as __toESM } from "../_runtime.mjs";
import { a as imageUrl, r as SPOT_PROFILES } from "./spots-CGM4tP9h.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as DialogOverlay, i as DialogDescription, n as DialogClose, o as DialogPortal, r as DialogContent, s as DialogTitle, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { a as Smartphone, c as Monitor, d as MapPin, f as ImagePlus, o as Plus, r as Trash2, s as Pencil, t as X } from "../_libs/lucide-react.mjs";
import { a as createSpot, c as updateRegion, i as createRegion, l as updateSpot, n as Route$2, o as deleteRegion, s as deleteSpot } from "./router-BEVyCXtN.mjs";
import { t as AdminShell } from "./admin-shell-B_X1ihmR.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/spots-Dd_Lkthx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var MAX_SIDE = 1920;
/** Downscale an uploaded photo in the browser and re-encode it as JPEG. */
async function resizeImage(file) {
	if (!file.type.startsWith("image/")) throw new Error("Escolha um ficheiro de imagem.");
	let bitmap;
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
	ctx.fillStyle = "#06151d";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
	bitmap.close();
	for (const quality of [
		.85,
		.75,
		.6
	]) {
		const url = canvas.toDataURL("image/jpeg", quality);
		const data = url.slice(url.indexOf(",") + 1);
		if (data.length * 3 / 4 <= 2621440) return {
			data,
			type: "image/jpeg",
			url
		};
	}
	throw new Error("A imagem é demasiado grande, mesmo depois de comprimida.");
}
var DEFAULT_IMAGE = "/scene-cascais.jpg";
var DEFAULT_FOCUS = 62;
function regionImage(region) {
	return region.hasImage ? {
		url: imageUrl("region", region.id, region.imageVersion),
		focus: region.imageFocus,
		source: "own"
	} : {
		url: DEFAULT_IMAGE,
		focus: DEFAULT_FOCUS,
		source: "default"
	};
}
function spotImage(spot, region) {
	if (spot.hasImage) return {
		url: imageUrl("spot", spot.id, spot.imageVersion),
		focus: spot.imageFocus,
		source: "own"
	};
	const fallback = region ? regionImage(region) : {
		url: DEFAULT_IMAGE,
		focus: DEFAULT_FOCUS,
		source: "default"
	};
	return {
		...fallback,
		source: fallback.source === "own" ? "region" : "default"
	};
}
var SOURCE_LABEL = {
	own: "Imagem própria",
	region: "Imagem da região",
	default: "Imagem padrão"
};
function errorMessage(err) {
	return err instanceof Error ? err.message : "Ocorreu um erro. Tente novamente.";
}
function SpotsAdmin() {
	const [regions, setRegions] = (0, import_react.useState)(Route$2.useLoaderData());
	const [editor, setEditor] = (0, import_react.useState)(null);
	const [confirming, setConfirming] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function run(action, done) {
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminShell, {
		title: "Spots e regiões",
		subtitle: "Cada spot aparece no seletor de praias da app. A imagem é o fundo do painel da maré; sem imagem própria, é usada a da região e, depois, a imagem padrão.",
		back: "admin",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PrimaryButton, {
			onClick: () => setEditor({ kind: "region" }),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
				className: "size-4",
				"aria-hidden": true
			}), " Nova região"]
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				theme: "dark",
				position: "top-center",
				richColors: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-10",
				children: [regions.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-2xl border border-dashed border-line p-8 text-center text-muted",
					children: "Ainda não há regiões. Crie a primeira para começar a adicionar spots."
				}), regions.map((region) => {
					const shown = regionImage(region);
					const confirmKey = `region-${region.id}`;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						"aria-labelledby": `region-${region.id}-title`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative overflow-hidden rounded-2xl border border-line",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScenePreview, {
								image: shown,
								className: "aspect-[5/2] sm:aspect-[5/1]"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute inset-0 flex flex-col justify-end gap-3 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent p-4 sm:flex-row sm:items-end sm:justify-between sm:p-5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									id: `region-${region.id}-title`,
									className: "text-xl font-semibold sm:text-2xl",
									children: region.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm text-muted",
									children: [
										region.spots.length,
										" ",
										region.spots.length === 1 ? "spot" : "spots",
										" ·",
										" ",
										region.hasImage ? "com imagem da região" : "sem imagem (usa a padrão)"
									]
								})] }), confirming === confirmKey ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmBar, {
									text: `Apagar a região “${region.name}”?`,
									busy,
									onCancel: () => setConfirming(null),
									onConfirm: async () => {
										if (await run(() => deleteRegion({ data: { id: region.id } }), "Região apagada.")) setConfirming(null);
									}
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GhostButton, {
										onClick: () => setEditor({
											kind: "region",
											region
										}),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, {
											className: "size-4",
											"aria-hidden": true
										}), " Editar região"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GhostButton, {
										tone: "danger",
										disabled: region.spots.length > 0,
										title: region.spots.length > 0 ? "Só é possível apagar uma região sem spots." : void 0,
										onClick: () => setConfirming(confirmKey),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
											className: "size-4",
											"aria-hidden": true
										}), " Apagar"]
									})]
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
							children: [region.spots.map((spot) => {
								const img = spotImage(spot, region);
								const key = `spot-${spot.id}`;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex flex-col overflow-hidden rounded-2xl border border-line bg-surface",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScenePreview, {
											image: img,
											className: "aspect-[5/2]"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "absolute left-3 top-3 rounded-full bg-bg/75 px-2.5 py-1 text-xs font-medium text-muted backdrop-blur",
											children: SOURCE_LABEL[img.source]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-1 flex-col gap-3 p-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
											className: "flex items-center gap-1.5 font-semibold",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
													className: "size-4 text-primary",
													"aria-hidden": true
												}),
												" ",
												spot.name
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-0.5 text-sm text-muted",
											children: ["Previsão baseada em ", SPOT_PROFILES[spot.profile]]
										})] }), confirming === key ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmBar, {
											text: `Apagar “${spot.name}”?`,
											busy,
											onCancel: () => setConfirming(null),
											onConfirm: async () => {
												if (await run(() => deleteSpot({ data: { id: spot.id } }), "Spot apagado.")) setConfirming(null);
											}
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-auto flex gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GhostButton, {
												onClick: () => setEditor({
													kind: "spot",
													regionId: region.id,
													spot
												}),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, {
													className: "size-4",
													"aria-hidden": true
												}), " Editar"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GhostButton, {
												tone: "danger",
												onClick: () => setConfirming(key),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
													className: "size-4",
													"aria-hidden": true
												}), " Apagar"]
											})]
										})]
									})]
								}, spot.id);
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setEditor({
									kind: "spot",
									regionId: region.id
								}),
								className: "flex h-full min-h-40 w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-line text-muted transition-colors hover:border-primary/60 hover:text-primary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
									className: "size-6",
									"aria-hidden": true
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-sm font-medium",
									children: ["Novo spot em ", region.name]
								})]
							}) })]
						})]
					}, region.id);
				})]
			}),
			editor && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditorDialog, {
				editor,
				regions,
				busy,
				onClose: () => setEditor(null),
				onSubmit: async (action, done) => {
					if (await run(action, done)) setEditor(null);
				}
			}, editor.kind === "region" ? `r${editor.region?.id ?? "new"}` : `s${editor.spot?.id ?? "new"}`)
		]
	});
}
/** The image cropped the way the dashboard's wide scene band shows it. */
function ScenePreview({ image, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `relative w-full bg-surface-2 bg-cover bg-no-repeat ${className}`,
		style: {
			backgroundImage: `url("${image.url}")`,
			backgroundPosition: `center ${image.focus}%`
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[linear-gradient(180deg,rgb(4_16_34/0.7)_0%,rgb(8_26_48/0.35)_45%,rgb(10_40_60/0.15)_100%)]" })
	});
}
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
function EditorDialog({ editor, regions, busy, onClose, onSubmit }) {
	const isSpot = editor.kind === "spot";
	const existing = editor.kind === "spot" ? editor.spot : editor.region;
	const [name, setName] = (0, import_react.useState)(existing?.name ?? "");
	const [regionId, setRegionId] = (0, import_react.useState)(editor.kind === "spot" ? editor.regionId : 0);
	const [profile, setProfile] = (0, import_react.useState)(editor.kind === "spot" ? editor.spot?.profile ?? 0 : 0);
	const [focus, setFocus] = (0, import_react.useState)(existing?.imageFocus ?? 50);
	const [imageEdit, setImageEdit] = (0, import_react.useState)({ kind: "keep" });
	const [processing, setProcessing] = (0, import_react.useState)(false);
	const fileRef = (0, import_react.useRef)(null);
	const ids = (0, import_react.useId)();
	const hasOwn = imageEdit.kind === "new" || imageEdit.kind === "keep" && !!existing?.hasImage;
	const region = regions.find((r) => r.id === regionId);
	let preview;
	if (imageEdit.kind === "new") preview = {
		url: imageEdit.image.url,
		focus,
		source: "own"
	};
	else if (hasOwn && existing) preview = {
		url: imageUrl(isSpot ? "spot" : "region", existing.id, existing.imageVersion),
		focus,
		source: "own"
	};
	else if (isSpot && region?.hasImage) preview = {
		...regionImage(region),
		source: "region"
	};
	else preview = {
		url: DEFAULT_IMAGE,
		focus: DEFAULT_FOCUS,
		source: "default"
	};
	async function pick(file) {
		if (!file) return;
		setProcessing(true);
		try {
			const image = await resizeImage(file);
			setImageEdit({
				kind: "new",
				image
			});
			if (!hasOwn) setFocus(50);
		} catch (err) {
			toast.error(errorMessage(err));
		} finally {
			setProcessing(false);
			if (fileRef.current) fileRef.current.value = "";
		}
	}
	function submit(e) {
		e.preventDefault();
		const image = imageEdit.kind === "new" ? {
			data: imageEdit.image.data,
			type: imageEdit.image.type
		} : imageEdit.kind === "clear" ? null : void 0;
		if (editor.kind === "region") {
			const id = editor.region?.id;
			onSubmit(() => id ? updateRegion({ data: {
				id,
				name,
				focus,
				image
			} }) : createRegion({ data: {
				name,
				focus,
				image
			} }), id ? "Região guardada." : "Região criada.");
		} else {
			const id = editor.spot?.id;
			const fields = {
				regionId,
				name,
				profile,
				focus
			};
			onSubmit(() => id ? updateSpot({ data: {
				id,
				...fields,
				image
			} }) : createSpot({ data: {
				...fields,
				image
			} }), id ? "Spot guardado." : "Spot criado.");
		}
	}
	const title = isSpot ? existing ? "Editar spot" : "Novo spot" : existing ? "Editar região" : "Nova região";
	const inputClass = "min-h-11 w-full rounded-xl border border-line bg-bg px-3 text-base text-fg outline-none transition-colors focus:border-primary/70";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: true,
		onOpenChange: (open) => !open && !busy && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-40 bg-bg/75 backdrop-blur-sm" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "fixed inset-x-0 bottom-0 z-50 max-h-[92vh] overflow-y-auto rounded-t-2xl border border-line bg-surface p-5 font-sans text-fg shadow-2xl sm:inset-auto sm:left-1/2 sm:top-1/2 sm:w-[min(40rem,calc(100vw-2rem))] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl sm:p-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-5 flex items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
					className: "text-xl font-semibold",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
					className: "mt-1 text-sm text-muted",
					children: isSpot ? "O spot aparece no seletor de praias da região escolhida." : "As regiões agrupam os spots no primeiro seletor da app."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogClose, {
					className: "grid size-11 shrink-0 place-items-center rounded-xl text-muted hover:bg-surface-2 hover:text-fg",
					"aria-label": "Fechar",
					disabled: busy,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: submit,
				className: "space-y-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Nome",
						htmlFor: `${ids}-name`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: `${ids}-name`,
							className: inputClass,
							value: name,
							maxLength: 60,
							required: true,
							autoFocus: true,
							onChange: (e) => setName(e.target.value),
							placeholder: isSpot ? "ex.: Praia da Rainha" : "ex.: Setúbal"
						})
					}),
					isSpot && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-5 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Região",
							htmlFor: `${ids}-region`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								id: `${ids}-region`,
								className: inputClass,
								value: regionId,
								onChange: (e) => setRegionId(Number(e.target.value)),
								children: regions.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: r.id,
									children: r.name
								}, r.id))
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Previsão de referência",
							htmlFor: `${ids}-profile`,
							hint: "Maré, vento e chuva copiados deste spot, com pequenas variações.",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								id: `${ids}-profile`,
								className: inputClass,
								value: profile,
								onChange: (e) => setProfile(Number(e.target.value)),
								children: SPOT_PROFILES.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: i,
									children: p
								}, p))
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
								className: "mb-2 text-sm font-medium",
								children: "Imagem de fundo"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-3 sm:grid-cols-[1fr_9rem]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewFrame, {
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Monitor, {
										className: "size-3.5",
										"aria-hidden": true
									}),
									label: "Computador",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScenePreview, {
										image: preview,
										className: "aspect-[5/1]"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewFrame, {
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, {
										className: "size-3.5",
										"aria-hidden": true
									}),
									label: "Telemóvel",
									className: "w-1/2 sm:w-auto",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScenePreview, {
										image: preview,
										className: "aspect-[2/1]"
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted",
								children: [
									SOURCE_LABEL[preview.source],
									preview.source === "region" && " — este spot usa a imagem da região até ter uma própria.",
									preview.source === "default" && " — sem imagem própria, a app mostra a fotografia padrão."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										ref: fileRef,
										type: "file",
										accept: "image/jpeg,image/png,image/webp",
										className: "sr-only",
										id: `${ids}-file`,
										onChange: (e) => pick(e.target.files?.[0])
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GhostButton, {
										onClick: () => fileRef.current?.click(),
										disabled: processing || busy,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, {
											className: "size-4",
											"aria-hidden": true
										}), processing ? "A processar…" : hasOwn ? "Trocar imagem" : "Carregar imagem"]
									}),
									hasOwn && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GhostButton, {
										tone: "danger",
										disabled: busy,
										onClick: () => setImageEdit(existing?.hasImage ? { kind: "clear" } : { kind: "keep" }),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
											className: "size-4",
											"aria-hidden": true
										}), " Remover imagem"]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: `Foco vertical · ${focus}%`,
								htmlFor: `${ids}-focus`,
								hint: hasOwn ? "0% mostra o topo da imagem, 100% o fundo." : "Disponível depois de carregar uma imagem.",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: `${ids}-focus`,
									type: "range",
									min: 0,
									max: 100,
									value: focus,
									disabled: !hasOwn,
									onChange: (e) => setFocus(Number(e.target.value)),
									className: "h-11 w-full accent-primary disabled:opacity-40"
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col-reverse gap-2 border-t border-line pt-5 sm:flex-row sm:justify-end",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogClose, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GhostButton, {
								disabled: busy,
								children: "Cancelar"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: busy || processing || !name.trim(),
							className: "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-fg transition-opacity hover:opacity-90 disabled:opacity-60",
							children: busy ? "A guardar…" : "Guardar"
						})]
					})
				]
			})]
		})] })
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
function PreviewFrame({ icon, label, className, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "mb-1 flex items-center gap-1 text-xs text-faint",
			children: [
				icon,
				" ",
				label
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-hidden rounded-lg border border-line",
			children
		})]
	});
}
//#endregion
export { SpotsAdmin as component };
