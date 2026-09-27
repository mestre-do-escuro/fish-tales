// Pesca Interativa: the species (catalogue data) and how each one is drawn.

export type SpeciesKind = "fish" | "flat" | "octopus" | "angler";
export type Pattern = "none" | "bands" | "waves" | "lateral" | "spots" | "brow";

export interface Species {
  key: string;
  name: string;
  points: number;
  kind: SpeciesKind;
  /** Body length / height in px at scale 1. */
  length: number;
  height: number;
  back: string;
  belly: string;
  accent: string;
  pattern: Pattern;
  /** Depth band as a fraction of the water column (0 = surface, 1 = seabed). */
  band: [number, number];
  speed: number;
  /** How many of this species swim at once. */
  count: number;
  /** Seconds before a caught one is replaced. */
  respawn: number;
}

export const SPECIES: Species[] = [
  { key: "sardinha", name: "Sardinha", points: 5, kind: "fish", length: 26, height: 8, back: "#2f6f9a", belly: "#e3edf5", accent: "#1d3f5c", pattern: "spots", band: [0.04, 0.32], speed: 115, count: 9, respawn: 2 },
  { key: "carapau", name: "Carapau", points: 10, kind: "fish", length: 34, height: 10, back: "#3f8f8f", belly: "#e5f1ee", accent: "#1d4d52", pattern: "lateral", band: [0.08, 0.45], speed: 100, count: 6, respawn: 3 },
  { key: "cavala", name: "Cavala", points: 15, kind: "fish", length: 40, height: 11, back: "#3c9a6a", belly: "#eef4ea", accent: "#17402f", pattern: "waves", band: [0.12, 0.5], speed: 135, count: 4, respawn: 4 },
  { key: "sargo", name: "Sargo", points: 25, kind: "fish", length: 42, height: 22, back: "#a9b7c0", belly: "#f0f3f5", accent: "#262b31", pattern: "bands", band: [0.4, 0.75], speed: 70, count: 4, respawn: 5 },
  { key: "dourada", name: "Dourada", points: 30, kind: "fish", length: 46, height: 22, back: "#8fa3ad", belly: "#f3f5f2", accent: "#f5b331", pattern: "brow", band: [0.45, 0.8], speed: 62, count: 3, respawn: 6 },
  { key: "robalo", name: "Robalo", points: 40, kind: "fish", length: 60, height: 17, back: "#6f8591", belly: "#e9eef0", accent: "#3c4c56", pattern: "none", band: [0.25, 0.7], speed: 85, count: 3, respawn: 7 },
  { key: "polvo", name: "Polvo", points: 60, kind: "octopus", length: 34, height: 30, back: "#c8563f", belly: "#e98a6c", accent: "#7d2a1d", pattern: "spots", band: [0.74, 0.9], speed: 32, count: 2, respawn: 9 },
  { key: "linguado", name: "Linguado", points: 50, kind: "flat", length: 50, height: 22, back: "#8a6b4a", belly: "#b99b72", accent: "#5a4330", pattern: "spots", band: [0.97, 0.99], speed: 24, count: 2, respawn: 9 },
  { key: "tamboril", name: "Tamboril", points: 100, kind: "angler", length: 58, height: 34, back: "#5e4a3a", belly: "#8a735e", accent: "#9ff7ff", pattern: "spots", band: [0.86, 0.95], speed: 18, count: 1, respawn: 16 },
];


/** Special: shows up once in the storm level, darts around, worth a lot. Not part of the normal rotation. */
export const GOLDEN_FISH: Species = { key: "dourado", name: "Peixe Dourado", points: 350, kind: "fish", length: 40, height: 17, back: "#f6c343", belly: "#fff3c4", accent: "#d9820f", pattern: "waves", band: [0.3, 0.8], speed: 210, count: 0, respawn: 0 };

/** Everything the species tally can show. */
export const TALLY_SPECIES: Species[] = [...SPECIES, GOLDEN_FISH];


// ---------------------------------------------------------------------------
// Drawing: species (also used for the tally icons), boat, scenery.

/** Draw one creature centred at (0,0), facing +x, at its natural size × scale. */
export function drawCreature(ctx: CanvasRenderingContext2D, sp: Species, scale: number, t: number) {
  const L = sp.length * scale;
  const H = sp.height * scale;
  ctx.lineJoin = "round";
  if (sp.kind === "octopus") return drawOctopus(ctx, sp, L, H, t);
  if (sp.kind === "flat") return drawFlat(ctx, sp, L, H, t);
  if (sp.kind === "angler") return drawAngler(ctx, sp, L, H, t);

  const wag = Math.sin(t * 9) * 0.28;
  // Tail
  ctx.save();
  ctx.translate(-L * 0.36, 0);
  ctx.rotate(wag);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(-L * 0.2, -H * 0.55);
  ctx.quadraticCurveTo(-L * 0.12, 0, -L * 0.2, H * 0.55);
  ctx.closePath();
  ctx.fillStyle = sp.back;
  ctx.fill();
  ctx.restore();
  // Dorsal fin
  ctx.beginPath();
  ctx.moveTo(-L * 0.12, -H * 0.42);
  ctx.quadraticCurveTo(L * 0.02, -H * 0.85, L * 0.12, -H * 0.42);
  ctx.fillStyle = sp.back;
  ctx.fill();
  // Body
  ctx.beginPath();
  ctx.moveTo(L * 0.5, 0);
  ctx.bezierCurveTo(L * 0.34, -H * 0.62, -L * 0.2, -H * 0.58, -L * 0.38, 0);
  ctx.bezierCurveTo(-L * 0.2, H * 0.58, L * 0.34, H * 0.62, L * 0.5, 0);
  const body = ctx.createLinearGradient(0, -H / 2, 0, H / 2);
  body.addColorStop(0, sp.back);
  body.addColorStop(0.55, sp.belly);
  body.addColorStop(1, sp.belly);
  ctx.fillStyle = body;
  ctx.fill();
  ctx.save();
  ctx.clip();
  ctx.fillStyle = sp.accent;
  ctx.strokeStyle = sp.accent;
  if (sp.pattern === "bands") {
    for (let i = 0; i < 4; i++) ctx.fillRect(-L * 0.24 + i * L * 0.14, -H, L * 0.05, H * 2);
  } else if (sp.pattern === "waves") {
    ctx.lineWidth = Math.max(1, H * 0.1);
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      const x = -L * 0.28 + i * L * 0.13;
      ctx.moveTo(x, -H * 0.5);
      ctx.quadraticCurveTo(x + L * 0.06, -H * 0.25, x, -H * 0.05);
      ctx.stroke();
    }
  } else if (sp.pattern === "lateral") {
    ctx.lineWidth = Math.max(1, H * 0.12);
    ctx.beginPath();
    ctx.moveTo(L * 0.38, -H * 0.12);
    ctx.quadraticCurveTo(0, -H * 0.02, -L * 0.36, H * 0.02);
    ctx.stroke();
  } else if (sp.pattern === "spots") {
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.arc(L * 0.22 - i * L * 0.12, -H * 0.12, Math.max(1, H * 0.1), 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
  if (sp.pattern === "brow") {
    ctx.fillStyle = sp.accent;
    ctx.beginPath();
    ctx.ellipse(L * 0.3, -H * 0.3, L * 0.07, H * 0.07, -0.4, 0, Math.PI * 2);
    ctx.fill();
  }
  // Gill + eye
  ctx.strokeStyle = "rgba(0,0,0,.25)";
  ctx.lineWidth = Math.max(1, L * 0.02);
  ctx.beginPath();
  ctx.arc(L * 0.28, 0, H * 0.3, -1, 1);
  ctx.stroke();
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(L * 0.36, -H * 0.1, Math.max(1.5, H * 0.13), 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#07131b";
  ctx.beginPath();
  ctx.arc(L * 0.37, -H * 0.1, Math.max(1, H * 0.07), 0, Math.PI * 2);
  ctx.fill();
}

function drawOctopus(ctx: CanvasRenderingContext2D, sp: Species, L: number, H: number, t: number) {
  ctx.strokeStyle = sp.back;
  ctx.lineCap = "round";
  for (let i = 0; i < 8; i++) {
    const baseX = -L * 0.32 + (i / 7) * L * 0.64;
    const sway = Math.sin(t * 3 + i) * L * 0.18;
    ctx.lineWidth = Math.max(1.5, L * 0.07);
    ctx.beginPath();
    ctx.moveTo(baseX, H * 0.05);
    ctx.quadraticCurveTo(baseX + sway, H * 0.5, baseX - sway * 0.6 + (i - 3.5) * L * 0.05, H * 0.9);
    ctx.stroke();
  }
  const head = ctx.createRadialGradient(-L * 0.1, -H * 0.4, 1, 0, -H * 0.2, L * 0.5);
  head.addColorStop(0, sp.belly);
  head.addColorStop(1, sp.back);
  ctx.fillStyle = head;
  ctx.beginPath();
  ctx.ellipse(0, -H * 0.22, L * 0.4, H * 0.42, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = sp.accent;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.arc(-L * 0.2 + i * L * 0.1, -H * 0.4 + (i % 2) * H * 0.12, Math.max(1, L * 0.03), 0, Math.PI * 2);
    ctx.fill();
  }
  for (const ex of [-L * 0.14, L * 0.14]) {
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(ex, -H * 0.05, Math.max(1.5, L * 0.07), 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#07131b";
    ctx.fillRect(ex - L * 0.05, -H * 0.06, L * 0.1, Math.max(1, L * 0.03));
  }
}

function drawFlat(ctx: CanvasRenderingContext2D, sp: Species, L: number, H: number, t: number) {
  // Seen from above-ish: a flat oval with a frilled fin all around.
  const ripple = Math.sin(t * 5) * H * 0.05;
  ctx.fillStyle = sp.accent;
  ctx.beginPath();
  ctx.ellipse(0, 0, L * 0.52, H * 0.46 + ripple, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = sp.back;
  ctx.beginPath();
  ctx.ellipse(0, 0, L * 0.45, H * 0.36, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-L * 0.44, 0);
  ctx.lineTo(-L * 0.62, -H * 0.3);
  ctx.lineTo(-L * 0.62, H * 0.3);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = sp.belly;
  for (let i = 0; i < 7; i++) {
    ctx.beginPath();
    ctx.arc(-L * 0.3 + (i % 4) * L * 0.16, (i < 4 ? -1 : 1) * H * 0.13, Math.max(1, H * 0.06), 0, Math.PI * 2);
    ctx.fill();
  }
  for (const [ex, ey] of [[L * 0.32, -H * 0.14], [L * 0.24, -H * 0.24]]) {
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(ex, ey, Math.max(1.5, H * 0.08), 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#07131b";
    ctx.beginPath();
    ctx.arc(ex + H * 0.02, ey, Math.max(1, H * 0.04), 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawAngler(ctx: CanvasRenderingContext2D, sp: Species, L: number, H: number, t: number) {
  // Lure on a stalk, glowing.
  const lx = L * 0.46 + Math.sin(t * 2) * L * 0.04;
  const ly = -H * 0.78;
  ctx.strokeStyle = sp.belly;
  ctx.lineWidth = Math.max(1, L * 0.02);
  ctx.beginPath();
  ctx.moveTo(L * 0.12, -H * 0.36);
  ctx.quadraticCurveTo(L * 0.3, -H * 0.9, lx, ly);
  ctx.stroke();
  const glow = ctx.createRadialGradient(lx, ly, 0, lx, ly, L * 0.14);
  glow.addColorStop(0, sp.accent);
  glow.addColorStop(1, "rgba(159,247,255,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(lx, ly, L * 0.14, 0, Math.PI * 2);
  ctx.fill();
  // Tail
  ctx.fillStyle = sp.back;
  ctx.beginPath();
  ctx.moveTo(-L * 0.3, 0);
  ctx.lineTo(-L * 0.52, -H * 0.3 + Math.sin(t * 5) * H * 0.08);
  ctx.lineTo(-L * 0.52, H * 0.3 + Math.sin(t * 5) * H * 0.08);
  ctx.closePath();
  ctx.fill();
  // Big body/head
  const body = ctx.createRadialGradient(L * 0.05, -H * 0.2, 1, 0, 0, L * 0.5);
  body.addColorStop(0, sp.belly);
  body.addColorStop(1, sp.back);
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.moveTo(L * 0.5, -H * 0.05);
  ctx.bezierCurveTo(L * 0.45, -H * 0.6, -L * 0.2, -H * 0.55, -L * 0.34, 0);
  ctx.bezierCurveTo(-L * 0.2, H * 0.45, L * 0.4, H * 0.55, L * 0.5, H * 0.12);
  ctx.closePath();
  ctx.fill();
  // Mouth + teeth
  ctx.fillStyle = "#1a0f0a";
  ctx.beginPath();
  ctx.moveTo(L * 0.5, -H * 0.02);
  ctx.quadraticCurveTo(L * 0.18, H * 0.12, L * 0.5, H * 0.12);
  ctx.fill();
  ctx.fillStyle = "#f3efe6";
  for (let i = 0; i < 4; i++) {
    const tx = L * 0.46 - i * L * 0.07;
    ctx.beginPath();
    ctx.moveTo(tx, H * 0.0);
    ctx.lineTo(tx - L * 0.02, H * 0.06);
    ctx.lineTo(tx - L * 0.04, H * 0.0);
    ctx.fill();
  }
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(L * 0.24, -H * 0.3, Math.max(1.5, H * 0.08), 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#07131b";
  ctx.beginPath();
  ctx.arc(L * 0.25, -H * 0.3, Math.max(1, H * 0.04), 0, Math.PI * 2);
  ctx.fill();
}

