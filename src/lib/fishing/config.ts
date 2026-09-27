// Pesca Interativa: every balancing number in one place.
// Tweak here; the engine (game.ts), levels (levels.ts) and UI read from it.

// --- Scoring --------------------------------------------------------------

/** Points needed for one coin (10 points = 1 coin). */
export const COIN_RATE = 10;
/** Adventure bonus per second left when a level is cleared. */
export const TIME_BONUS_PER_SECOND = 5;
/** Extra points for each fish after the first in the same cast. */
export const HAUL_BONUS_PER_EXTRA_FISH = 5;
/**
 * Combo: fish landed in a row without a penalty (jellyfish shock, rock snag,
 * shark contact). Every `fishPerStep` fish adds `bonusPerStep` to the points
 * multiplier, up to `maxMultiplier`.
 */
export const COMBO = { fishPerStep: 5, bonusPerStep: 0.1, maxMultiplier: 2 };

export function comboMultiplier(streak: number) {
  return Math.min(COMBO.maxMultiplier, 1 + Math.floor(streak / COMBO.fishPerStep) * COMBO.bonusPerStep);
}

// --- Line & upgrades -------------------------------------------------------

/** Base line speeds (px/s at scale 1) and fish per cast, before upgrades. */
export const LINE = { down: 170, up: 330 };

export type UpgradeKey = "rod" | "hooks" | "bubbleRate" | "bubbleValue";

export interface UpgradeDef {
  key: UpgradeKey;
  name: string;
  description: string;
  /** Value at each upgrade level (index 0 = not upgraded). */
  values: number[];
  /** Cost to reach level i+1 (so costs.length === values.length - 1). */
  costs: number[];
  format: (value: number) => string;
}

export const UPGRADES: Record<UpgradeKey, UpgradeDef> = {
  rod: {
    key: "rod",
    name: "Vara",
    description: "A linha desce e sobe mais depressa.",
    values: [1, 1.15, 1.3, 1.45, 1.6],
    costs: [40, 90, 160, 260],
    format: (v) => `velocidade ×${v.toFixed(2)}`,
  },
  hooks: {
    key: "hooks",
    name: "Anzóis",
    description: "Mais peixes presos em cada lançamento.",
    values: [10, 12, 14, 17, 20],
    costs: [50, 110, 190, 300],
    format: (v) => `${v} peixes por lançamento`,
  },
  bubbleRate: {
    key: "bubbleRate",
    name: "Bolhas frequentes",
    description: "As bolhas de tempo aparecem mais vezes.",
    values: [18, 14, 11, 8],
    costs: [40, 90, 170],
    format: (v) => `uma a cada ~${v} s`,
  },
  bubbleValue: {
    key: "bubbleValue",
    name: "Bolhas maiores",
    description: "Cada bolha de tempo vale mais segundos.",
    values: [5, 7, 10, 12],
    costs: [40, 90, 170],
    format: (v) => `+${v} s por bolha`,
  },
};

/** A bubble bought in the shop and used automatically at the start of the next level/run. */
export const RESERVE_BUBBLE = { seconds: 10, cost: 30, max: 3 };

// --- Time bubbles in the water ---------------------------------------------

export const BUBBLES = {
  /** Random ± fraction applied to the spawn interval. */
  jitter: 0.3,
  /** Seconds before a bubble rises out of the water. */
  lifetime: 14,
  /** Upward drift, px/s at scale 1. */
  rise: 18,
  /** Pick-up radius around the hook, px at scale 1. */
  reach: 22,
};

// --- Hazards --------------------------------------------------------------

export type SharkKind = "normal" | "aggressive";

export interface SharkDef {
  name: string;
  length: number;
  height: number;
  speed: number;
  /** How fast it steers toward the hook's depth (px/s); 0 = straight line. */
  tracking: number;
  /** Bitten lines are also yanked back to the boat. */
  yanksLine: boolean;
  body: string;
  belly: string;
  stripes: boolean;
}

export const SHARKS: Record<SharkKind, SharkDef> = {
  normal: { name: "Tubarão", length: 170, height: 46, speed: 250, tracking: 0, yanksLine: false, body: "#5d6d78", belly: "#dfe5e8", stripes: false },
  aggressive: { name: "Tubarão-tigre", length: 220, height: 60, speed: 340, tracking: 55, yanksLine: true, body: "#4a4f45", belly: "#d8d2bf", stripes: true },
};
/** Seconds of "!" warning before a shark enters. */
export const SHARK_WARNING = 1.8;

/** Jellyfish shock: the line is forced back up; this long it crackles and can't catch. */
export const SHOCK_SECONDS = 0.7;
/** Rock snag: the hook is stuck this long, then forced back up. */
export const SNAG_SECONDS = 0.9;
/** Shark bite: the line jerks to a stop this long. */
export const BITE_SECONDS = 0.45;

export type RockVariant = "mound" | "pillar" | "slab" | "jagged" | "twin";

/** Rock shapes: width (px at scale 1) and height (fraction of the water column) ranges. */
export const ROCK_VARIANTS: Record<RockVariant, { w: [number, number]; h: [number, number] }> = {
  mound: { w: [70, 110], h: [0.14, 0.24] },
  pillar: { w: [36, 55], h: [0.26, 0.38] },
  slab: { w: [130, 190], h: [0.08, 0.13] },
  jagged: { w: [80, 120], h: [0.18, 0.3] },
  twin: { w: [100, 150], h: [0.16, 0.27] },
};

export const ROCK_PALETTES: [string, string][] = [
  ["#5b646b", "#262c30"], // granite
  ["#3a3d44", "#141619"], // basalt
  ["#8a6f55", "#3d2f24"], // sandstone
  ["#7b4a3f", "#2e1d19"], // red rock
  ["#4d5e4f", "#1d2621"], // mossy
];

// --- Golden fish -----------------------------------------------------------

export const GOLDEN = {
  /** Fraction of the level's time window in which it shows up once. */
  appearsBetween: [0.2, 0.55] as [number, number],
  /** Hit radius relative to a normal fish (smaller = harder). */
  reachFactor: 0.35,
  /** Seconds between its sudden changes of depth. */
  dartEvery: [0.5, 1.1] as [number, number],
};

// --- Endless mode ----------------------------------------------------------

export const ENDLESS = {
  startSeconds: 60,
  /** Difficulty goes up one step every this many seconds survived. */
  rampEvery: 20,
  jellyStart: 4,
  jellyMax: 12,
  rocks: 5,
  fishSpeedStart: 1.15,
  fishSpeedStep: 0.04,
  fishSpeedMax: 1.7,
  /** Seconds between sharks at step 0, shrinking by `sharkIntervalStep` per step. */
  sharkIntervalStart: 22,
  sharkIntervalStep: 2,
  sharkIntervalMin: 7,
  /** From this many seconds survived, half the sharks are aggressive. */
  aggressiveAfter: 60,
};

// --- Scenery ---------------------------------------------------------------

export type ThemeKey = "morning" | "afternoon" | "sunset" | "dusk" | "storm" | "night";

export interface Theme {
  sky: string[];
  water: string[];
  coast: string;
  sun?: { x: number; color: string; radius: number; height: number };
  moon?: { x: number };
  stars: number;
  clouds: { count: number; color: string };
  lighthouse: boolean;
  rain: boolean;
  lightning: boolean;
  /** Surface wave amplitude multiplier (and boat bob). */
  waves: number;
  glint: string | null;
}

export const THEMES: Record<ThemeKey, Theme> = {
  morning: {
    sky: ["#6fb8e6", "#a9dcf2", "#f7e6c4"],
    water: ["#2aa7c9", "#137ca3", "#073a58"],
    coast: "#5b8193",
    sun: { x: 0.22, color: "rgba(255,248,215,.95)", radius: 20, height: 0.45 },
    stars: 0,
    clouds: { count: 4, color: "rgba(255,255,255,.75)" },
    lighthouse: false,
    rain: false,
    lightning: false,
    waves: 1,
    glint: "rgba(255,255,240,.22)",
  },
  afternoon: {
    sky: ["#3f8fcc", "#8cc6ea", "#f5d59a"],
    water: ["#1f93b8", "#0e5f86", "#05304c"],
    coast: "#40596a",
    sun: { x: 0.62, color: "rgba(255,226,150,.95)", radius: 22, height: 0.25 },
    stars: 0,
    clouds: { count: 3, color: "rgba(255,245,230,.7)" },
    lighthouse: false,
    rain: false,
    lightning: false,
    waves: 1.1,
    glint: "rgba(255,225,160,.2)",
  },
  sunset: {
    sky: ["#14243f", "#4a4a6a", "#d98b5f", "#f2b27a"],
    water: ["#237fa0", "#0f5476", "#05213a"],
    coast: "#2a2a3f",
    sun: { x: 0.78, color: "rgba(255,214,150,.9)", radius: 26, height: 0 },
    stars: 0,
    clouds: { count: 2, color: "rgba(255,190,150,.35)" },
    lighthouse: false,
    rain: false,
    lightning: false,
    waves: 1.2,
    glint: "rgba(255,210,150,.18)",
  },
  dusk: {
    sky: ["#0e1530", "#3b2d57", "#a0567a", "#e08a6e"],
    water: ["#1a5f7e", "#0b3d5a", "#031526"],
    coast: "#1c1a2e",
    stars: 25,
    clouds: { count: 2, color: "rgba(160,110,150,.35)" },
    lighthouse: true,
    rain: false,
    lightning: false,
    waves: 1.35,
    glint: null,
  },
  storm: {
    sky: ["#1b2028", "#2c3440", "#434d59"],
    water: ["#2a5566", "#16384a", "#06141d"],
    coast: "#171b21",
    stars: 0,
    clouds: { count: 7, color: "rgba(20,24,30,.85)" },
    lighthouse: true,
    rain: true,
    lightning: true,
    waves: 2.2,
    glint: null,
  },
  night: {
    sky: ["#050a18", "#0d1a33", "#1c2d4d"],
    water: ["#0f3f5a", "#082a40", "#020c16"],
    coast: "#0b1120",
    moon: { x: 0.8 },
    stars: 60,
    clouds: { count: 2, color: "rgba(60,80,110,.35)" },
    lighthouse: true,
    rain: false,
    lightning: false,
    waves: 1.3,
    glint: "rgba(200,220,255,.14)",
  },
};
