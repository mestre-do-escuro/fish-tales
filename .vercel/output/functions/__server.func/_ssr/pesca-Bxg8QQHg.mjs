import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { I as Coins, L as CloudRain, M as Flame, N as Flag, R as Clock, V as Anchor, d as Sparkles, g as RotateCcw, k as Infinity$1, l as Target, o as Trophy, p as ShoppingBag, r as Waves, t as Zap, v as Play, x as Mountain } from "../_libs/lucide-react.mjs";
import { t as AdminShell } from "./admin-shell-GW20R2Dp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pesca-Bxg8QQHg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Combo: fish landed in a row without a penalty (jellyfish shock, rock snag,
* shark contact). Every `fishPerStep` fish adds `bonusPerStep` to the points
* multiplier, up to `maxMultiplier`.
*/
var COMBO = {
	fishPerStep: 5,
	bonusPerStep: .1,
	maxMultiplier: 2
};
function comboMultiplier(streak) {
	return Math.min(COMBO.maxMultiplier, 1 + Math.floor(streak / COMBO.fishPerStep) * COMBO.bonusPerStep);
}
/** Base line speeds (px/s at scale 1) and fish per cast, before upgrades. */
var LINE = {
	down: 170,
	up: 330
};
var UPGRADES = {
	rod: {
		key: "rod",
		name: "Vara",
		description: "A linha desce e sobe mais depressa.",
		values: [
			1,
			1.15,
			1.3,
			1.45,
			1.6
		],
		costs: [
			40,
			90,
			160,
			260
		],
		format: (v) => `velocidade ×${v.toFixed(2)}`
	},
	hooks: {
		key: "hooks",
		name: "Anzóis",
		description: "Mais peixes presos em cada lançamento.",
		values: [
			10,
			12,
			14,
			17,
			20
		],
		costs: [
			50,
			110,
			190,
			300
		],
		format: (v) => `${v} peixes por lançamento`
	},
	bubbleRate: {
		key: "bubbleRate",
		name: "Bolhas frequentes",
		description: "As bolhas de tempo aparecem mais vezes.",
		values: [
			18,
			14,
			11,
			8
		],
		costs: [
			40,
			90,
			170
		],
		format: (v) => `uma a cada ~${v} s`
	},
	bubbleValue: {
		key: "bubbleValue",
		name: "Bolhas maiores",
		description: "Cada bolha de tempo vale mais segundos.",
		values: [
			5,
			7,
			10,
			12
		],
		costs: [
			40,
			90,
			170
		],
		format: (v) => `+${v} s por bolha`
	}
};
/** A bubble bought in the shop and used automatically at the start of the next level/run. */
var RESERVE_BUBBLE = {
	seconds: 10,
	cost: 30,
	max: 3
};
var BUBBLES = {
	/** Random ± fraction applied to the spawn interval. */
	jitter: .3,
	/** Seconds before a bubble rises out of the water. */
	lifetime: 14,
	/** Upward drift, px/s at scale 1. */
	rise: 18,
	/** Pick-up radius around the hook, px at scale 1. */
	reach: 22
};
var SHARKS = {
	normal: {
		name: "Tubarão",
		length: 170,
		height: 46,
		speed: 250,
		tracking: 0,
		yanksLine: false,
		body: "#5d6d78",
		belly: "#dfe5e8",
		stripes: false
	},
	aggressive: {
		name: "Tubarão-tigre",
		length: 220,
		height: 60,
		speed: 340,
		tracking: 55,
		yanksLine: true,
		body: "#4a4f45",
		belly: "#d8d2bf",
		stripes: true
	}
};
/** Jellyfish shock: the line is forced back up; this long it crackles and can't catch. */
var SHOCK_SECONDS = .7;
/** Rock snag: the hook is stuck this long, then forced back up. */
var SNAG_SECONDS = .9;
/** Shark bite: the line jerks to a stop this long. */
var BITE_SECONDS = .45;
/** Rock shapes: width (px at scale 1) and height (fraction of the water column) ranges. */
var ROCK_VARIANTS = {
	mound: {
		w: [70, 110],
		h: [.14, .24]
	},
	pillar: {
		w: [36, 55],
		h: [.26, .38]
	},
	slab: {
		w: [130, 190],
		h: [.08, .13]
	},
	jagged: {
		w: [80, 120],
		h: [.18, .3]
	},
	twin: {
		w: [100, 150],
		h: [.16, .27]
	}
};
var ROCK_PALETTES = [
	["#5b646b", "#262c30"],
	["#3a3d44", "#141619"],
	["#8a6f55", "#3d2f24"],
	["#7b4a3f", "#2e1d19"],
	["#4d5e4f", "#1d2621"]
];
var GOLDEN = {
	/** Fraction of the level's time window in which it shows up once. */
	appearsBetween: [.2, .55],
	/** Hit radius relative to a normal fish (smaller = harder). */
	reachFactor: .35,
	/** Seconds between its sudden changes of depth. */
	dartEvery: [.5, 1.1]
};
var ENDLESS = {
	startSeconds: 60,
	/** Difficulty goes up one step every this many seconds survived. */
	rampEvery: 20,
	jellyStart: 4,
	jellyMax: 12,
	rocks: 5,
	fishSpeedStart: 1.15,
	fishSpeedStep: .04,
	fishSpeedMax: 1.7,
	/** Seconds between sharks at step 0, shrinking by `sharkIntervalStep` per step. */
	sharkIntervalStart: 22,
	sharkIntervalStep: 2,
	sharkIntervalMin: 7,
	/** From this many seconds survived, half the sharks are aggressive. */
	aggressiveAfter: 60
};
var THEMES = {
	morning: {
		sky: [
			"#6fb8e6",
			"#a9dcf2",
			"#f7e6c4"
		],
		water: [
			"#2aa7c9",
			"#137ca3",
			"#073a58"
		],
		coast: "#5b8193",
		sun: {
			x: .22,
			color: "rgba(255,248,215,.95)",
			radius: 20,
			height: .45
		},
		stars: 0,
		clouds: {
			count: 4,
			color: "rgba(255,255,255,.75)"
		},
		lighthouse: false,
		rain: false,
		lightning: false,
		waves: 1,
		glint: "rgba(255,255,240,.22)"
	},
	afternoon: {
		sky: [
			"#3f8fcc",
			"#8cc6ea",
			"#f5d59a"
		],
		water: [
			"#1f93b8",
			"#0e5f86",
			"#05304c"
		],
		coast: "#40596a",
		sun: {
			x: .62,
			color: "rgba(255,226,150,.95)",
			radius: 22,
			height: .25
		},
		stars: 0,
		clouds: {
			count: 3,
			color: "rgba(255,245,230,.7)"
		},
		lighthouse: false,
		rain: false,
		lightning: false,
		waves: 1.1,
		glint: "rgba(255,225,160,.2)"
	},
	sunset: {
		sky: [
			"#14243f",
			"#4a4a6a",
			"#d98b5f",
			"#f2b27a"
		],
		water: [
			"#237fa0",
			"#0f5476",
			"#05213a"
		],
		coast: "#2a2a3f",
		sun: {
			x: .78,
			color: "rgba(255,214,150,.9)",
			radius: 26,
			height: 0
		},
		stars: 0,
		clouds: {
			count: 2,
			color: "rgba(255,190,150,.35)"
		},
		lighthouse: false,
		rain: false,
		lightning: false,
		waves: 1.2,
		glint: "rgba(255,210,150,.18)"
	},
	dusk: {
		sky: [
			"#0e1530",
			"#3b2d57",
			"#a0567a",
			"#e08a6e"
		],
		water: [
			"#1a5f7e",
			"#0b3d5a",
			"#031526"
		],
		coast: "#1c1a2e",
		stars: 25,
		clouds: {
			count: 2,
			color: "rgba(160,110,150,.35)"
		},
		lighthouse: true,
		rain: false,
		lightning: false,
		waves: 1.35,
		glint: null
	},
	storm: {
		sky: [
			"#1b2028",
			"#2c3440",
			"#434d59"
		],
		water: [
			"#2a5566",
			"#16384a",
			"#06141d"
		],
		coast: "#171b21",
		stars: 0,
		clouds: {
			count: 7,
			color: "rgba(20,24,30,.85)"
		},
		lighthouse: true,
		rain: true,
		lightning: true,
		waves: 2.2,
		glint: null
	},
	night: {
		sky: [
			"#050a18",
			"#0d1a33",
			"#1c2d4d"
		],
		water: [
			"#0f3f5a",
			"#082a40",
			"#020c16"
		],
		coast: "#0b1120",
		moon: { x: .8 },
		stars: 60,
		clouds: {
			count: 2,
			color: "rgba(60,80,110,.35)"
		},
		lighthouse: true,
		rain: false,
		lightning: false,
		waves: 1.3,
		glint: "rgba(200,220,255,.14)"
	}
};
var SPECIES = [
	{
		key: "sardinha",
		name: "Sardinha",
		points: 5,
		kind: "fish",
		length: 26,
		height: 8,
		back: "#2f6f9a",
		belly: "#e3edf5",
		accent: "#1d3f5c",
		pattern: "spots",
		band: [.04, .32],
		speed: 115,
		count: 9,
		respawn: 2
	},
	{
		key: "carapau",
		name: "Carapau",
		points: 10,
		kind: "fish",
		length: 34,
		height: 10,
		back: "#3f8f8f",
		belly: "#e5f1ee",
		accent: "#1d4d52",
		pattern: "lateral",
		band: [.08, .45],
		speed: 100,
		count: 6,
		respawn: 3
	},
	{
		key: "cavala",
		name: "Cavala",
		points: 15,
		kind: "fish",
		length: 40,
		height: 11,
		back: "#3c9a6a",
		belly: "#eef4ea",
		accent: "#17402f",
		pattern: "waves",
		band: [.12, .5],
		speed: 135,
		count: 4,
		respawn: 4
	},
	{
		key: "sargo",
		name: "Sargo",
		points: 25,
		kind: "fish",
		length: 42,
		height: 22,
		back: "#a9b7c0",
		belly: "#f0f3f5",
		accent: "#262b31",
		pattern: "bands",
		band: [.4, .75],
		speed: 70,
		count: 4,
		respawn: 5
	},
	{
		key: "dourada",
		name: "Dourada",
		points: 30,
		kind: "fish",
		length: 46,
		height: 22,
		back: "#8fa3ad",
		belly: "#f3f5f2",
		accent: "#f5b331",
		pattern: "brow",
		band: [.45, .8],
		speed: 62,
		count: 3,
		respawn: 6
	},
	{
		key: "robalo",
		name: "Robalo",
		points: 40,
		kind: "fish",
		length: 60,
		height: 17,
		back: "#6f8591",
		belly: "#e9eef0",
		accent: "#3c4c56",
		pattern: "none",
		band: [.25, .7],
		speed: 85,
		count: 3,
		respawn: 7
	},
	{
		key: "polvo",
		name: "Polvo",
		points: 60,
		kind: "octopus",
		length: 34,
		height: 30,
		back: "#c8563f",
		belly: "#e98a6c",
		accent: "#7d2a1d",
		pattern: "spots",
		band: [.74, .9],
		speed: 32,
		count: 2,
		respawn: 9
	},
	{
		key: "linguado",
		name: "Linguado",
		points: 50,
		kind: "flat",
		length: 50,
		height: 22,
		back: "#8a6b4a",
		belly: "#b99b72",
		accent: "#5a4330",
		pattern: "spots",
		band: [.97, .99],
		speed: 24,
		count: 2,
		respawn: 9
	},
	{
		key: "tamboril",
		name: "Tamboril",
		points: 100,
		kind: "angler",
		length: 58,
		height: 34,
		back: "#5e4a3a",
		belly: "#8a735e",
		accent: "#9ff7ff",
		pattern: "spots",
		band: [.86, .95],
		speed: 18,
		count: 1,
		respawn: 16
	}
];
/** Special: shows up once in the storm level, darts around, worth a lot. Not part of the normal rotation. */
var GOLDEN_FISH = {
	key: "dourado",
	name: "Peixe Dourado",
	points: 350,
	kind: "fish",
	length: 40,
	height: 17,
	back: "#f6c343",
	belly: "#fff3c4",
	accent: "#d9820f",
	pattern: "waves",
	band: [.3, .8],
	speed: 210,
	count: 0,
	respawn: 0
};
/** Everything the species tally can show. */
var TALLY_SPECIES = [...SPECIES, GOLDEN_FISH];
/** Draw one creature centred at (0,0), facing +x, at its natural size × scale. */
function drawCreature(ctx, sp, scale, t) {
	const L = sp.length * scale;
	const H = sp.height * scale;
	ctx.lineJoin = "round";
	if (sp.kind === "octopus") return drawOctopus(ctx, sp, L, H, t);
	if (sp.kind === "flat") return drawFlat(ctx, sp, L, H, t);
	if (sp.kind === "angler") return drawAngler(ctx, sp, L, H, t);
	const wag = Math.sin(t * 9) * .28;
	ctx.save();
	ctx.translate(-L * .36, 0);
	ctx.rotate(wag);
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(-L * .2, -H * .55);
	ctx.quadraticCurveTo(-L * .12, 0, -L * .2, H * .55);
	ctx.closePath();
	ctx.fillStyle = sp.back;
	ctx.fill();
	ctx.restore();
	ctx.beginPath();
	ctx.moveTo(-L * .12, -H * .42);
	ctx.quadraticCurveTo(L * .02, -H * .85, L * .12, -H * .42);
	ctx.fillStyle = sp.back;
	ctx.fill();
	ctx.beginPath();
	ctx.moveTo(L * .5, 0);
	ctx.bezierCurveTo(L * .34, -H * .62, -L * .2, -H * .58, -L * .38, 0);
	ctx.bezierCurveTo(-L * .2, H * .58, L * .34, H * .62, L * .5, 0);
	const body = ctx.createLinearGradient(0, -H / 2, 0, H / 2);
	body.addColorStop(0, sp.back);
	body.addColorStop(.55, sp.belly);
	body.addColorStop(1, sp.belly);
	ctx.fillStyle = body;
	ctx.fill();
	ctx.save();
	ctx.clip();
	ctx.fillStyle = sp.accent;
	ctx.strokeStyle = sp.accent;
	if (sp.pattern === "bands") for (let i = 0; i < 4; i++) ctx.fillRect(-L * .24 + i * L * .14, -H, L * .05, H * 2);
	else if (sp.pattern === "waves") {
		ctx.lineWidth = Math.max(1, H * .1);
		for (let i = 0; i < 5; i++) {
			ctx.beginPath();
			const x = -L * .28 + i * L * .13;
			ctx.moveTo(x, -H * .5);
			ctx.quadraticCurveTo(x + L * .06, -H * .25, x, -H * .05);
			ctx.stroke();
		}
	} else if (sp.pattern === "lateral") {
		ctx.lineWidth = Math.max(1, H * .12);
		ctx.beginPath();
		ctx.moveTo(L * .38, -H * .12);
		ctx.quadraticCurveTo(0, -H * .02, -L * .36, H * .02);
		ctx.stroke();
	} else if (sp.pattern === "spots") for (let i = 0; i < 4; i++) {
		ctx.beginPath();
		ctx.arc(L * .22 - i * L * .12, -H * .12, Math.max(1, H * .1), 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();
	if (sp.pattern === "brow") {
		ctx.fillStyle = sp.accent;
		ctx.beginPath();
		ctx.ellipse(L * .3, -H * .3, L * .07, H * .07, -.4, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.strokeStyle = "rgba(0,0,0,.25)";
	ctx.lineWidth = Math.max(1, L * .02);
	ctx.beginPath();
	ctx.arc(L * .28, 0, H * .3, -1, 1);
	ctx.stroke();
	ctx.fillStyle = "#fff";
	ctx.beginPath();
	ctx.arc(L * .36, -H * .1, Math.max(1.5, H * .13), 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = "#07131b";
	ctx.beginPath();
	ctx.arc(L * .37, -H * .1, Math.max(1, H * .07), 0, Math.PI * 2);
	ctx.fill();
}
function drawOctopus(ctx, sp, L, H, t) {
	ctx.strokeStyle = sp.back;
	ctx.lineCap = "round";
	for (let i = 0; i < 8; i++) {
		const baseX = -L * .32 + i / 7 * L * .64;
		const sway = Math.sin(t * 3 + i) * L * .18;
		ctx.lineWidth = Math.max(1.5, L * .07);
		ctx.beginPath();
		ctx.moveTo(baseX, H * .05);
		ctx.quadraticCurveTo(baseX + sway, H * .5, baseX - sway * .6 + (i - 3.5) * L * .05, H * .9);
		ctx.stroke();
	}
	const head = ctx.createRadialGradient(-L * .1, -H * .4, 1, 0, -H * .2, L * .5);
	head.addColorStop(0, sp.belly);
	head.addColorStop(1, sp.back);
	ctx.fillStyle = head;
	ctx.beginPath();
	ctx.ellipse(0, -H * .22, L * .4, H * .42, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = sp.accent;
	for (let i = 0; i < 5; i++) {
		ctx.beginPath();
		ctx.arc(-L * .2 + i * L * .1, -H * .4 + i % 2 * H * .12, Math.max(1, L * .03), 0, Math.PI * 2);
		ctx.fill();
	}
	for (const ex of [-L * .14, L * .14]) {
		ctx.fillStyle = "#fff";
		ctx.beginPath();
		ctx.arc(ex, -H * .05, Math.max(1.5, L * .07), 0, Math.PI * 2);
		ctx.fill();
		ctx.fillStyle = "#07131b";
		ctx.fillRect(ex - L * .05, -H * .06, L * .1, Math.max(1, L * .03));
	}
}
function drawFlat(ctx, sp, L, H, t) {
	const ripple = Math.sin(t * 5) * H * .05;
	ctx.fillStyle = sp.accent;
	ctx.beginPath();
	ctx.ellipse(0, 0, L * .52, H * .46 + ripple, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = sp.back;
	ctx.beginPath();
	ctx.ellipse(0, 0, L * .45, H * .36, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.beginPath();
	ctx.moveTo(-L * .44, 0);
	ctx.lineTo(-L * .62, -H * .3);
	ctx.lineTo(-L * .62, H * .3);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = sp.belly;
	for (let i = 0; i < 7; i++) {
		ctx.beginPath();
		ctx.arc(-L * .3 + i % 4 * L * .16, (i < 4 ? -1 : 1) * H * .13, Math.max(1, H * .06), 0, Math.PI * 2);
		ctx.fill();
	}
	for (const [ex, ey] of [[L * .32, -H * .14], [L * .24, -H * .24]]) {
		ctx.fillStyle = "#fff";
		ctx.beginPath();
		ctx.arc(ex, ey, Math.max(1.5, H * .08), 0, Math.PI * 2);
		ctx.fill();
		ctx.fillStyle = "#07131b";
		ctx.beginPath();
		ctx.arc(ex + H * .02, ey, Math.max(1, H * .04), 0, Math.PI * 2);
		ctx.fill();
	}
}
function drawAngler(ctx, sp, L, H, t) {
	const lx = L * .46 + Math.sin(t * 2) * L * .04;
	const ly = -H * .78;
	ctx.strokeStyle = sp.belly;
	ctx.lineWidth = Math.max(1, L * .02);
	ctx.beginPath();
	ctx.moveTo(L * .12, -H * .36);
	ctx.quadraticCurveTo(L * .3, -H * .9, lx, ly);
	ctx.stroke();
	const glow = ctx.createRadialGradient(lx, ly, 0, lx, ly, L * .14);
	glow.addColorStop(0, sp.accent);
	glow.addColorStop(1, "rgba(159,247,255,0)");
	ctx.fillStyle = glow;
	ctx.beginPath();
	ctx.arc(lx, ly, L * .14, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = sp.back;
	ctx.beginPath();
	ctx.moveTo(-L * .3, 0);
	ctx.lineTo(-L * .52, -H * .3 + Math.sin(t * 5) * H * .08);
	ctx.lineTo(-L * .52, H * .3 + Math.sin(t * 5) * H * .08);
	ctx.closePath();
	ctx.fill();
	const body = ctx.createRadialGradient(L * .05, -H * .2, 1, 0, 0, L * .5);
	body.addColorStop(0, sp.belly);
	body.addColorStop(1, sp.back);
	ctx.fillStyle = body;
	ctx.beginPath();
	ctx.moveTo(L * .5, -H * .05);
	ctx.bezierCurveTo(L * .45, -H * .6, -L * .2, -H * .55, -L * .34, 0);
	ctx.bezierCurveTo(-L * .2, H * .45, L * .4, H * .55, L * .5, H * .12);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = "#1a0f0a";
	ctx.beginPath();
	ctx.moveTo(L * .5, -H * .02);
	ctx.quadraticCurveTo(L * .18, H * .12, L * .5, H * .12);
	ctx.fill();
	ctx.fillStyle = "#f3efe6";
	for (let i = 0; i < 4; i++) {
		const tx = L * .46 - i * L * .07;
		ctx.beginPath();
		ctx.moveTo(tx, H * 0);
		ctx.lineTo(tx - L * .02, H * .06);
		ctx.lineTo(tx - L * .04, H * 0);
		ctx.fill();
	}
	ctx.fillStyle = "#fff";
	ctx.beginPath();
	ctx.arc(L * .24, -H * .3, Math.max(1.5, H * .08), 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = "#07131b";
	ctx.beginPath();
	ctx.arc(L * .25, -H * .3, Math.max(1, H * .04), 0, Math.PI * 2);
	ctx.fill();
}
var BASE_LOADOUT = {
	lineSpeed: UPGRADES.rod.values[0],
	capacity: UPGRADES.hooks.values[0],
	bubbleInterval: UPGRADES.bubbleRate.values[0],
	bubbleSeconds: UPGRADES.bubbleValue.values[0],
	bonusSeconds: 0
};
var clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
var rand = (lo, hi) => lo + Math.random() * (hi - lo);
var damp = (from, to, rate, dt) => from + (to - from) * (1 - Math.exp(-rate * dt));
var side = () => Math.random() < .5 ? 1 : -1;
var pick = (items) => items[Math.floor(Math.random() * items.length)];
/** Deterministic noise for rock shapes (same shape on every redraw). */
function seeded(seed) {
	let t = seed >>> 0;
	return () => {
		t += 1831565813;
		let r = Math.imul(t ^ t >>> 15, 1 | t);
		r ^= r + Math.imul(r ^ r >>> 7, 61 | r);
		return ((r ^ r >>> 14) >>> 0) / 4294967296;
	};
}
var ROCK_SAMPLES = 24;
function rockProfile(variant, seed) {
	const rnd = seeded(seed);
	const bump = (u, c, w) => Math.sqrt(Math.max(0, 1 - ((u - c) / w) ** 2));
	return Array.from({ length: 25 }, () => rnd()).map((n, i) => {
		const u = i / ROCK_SAMPLES * 2 - 1;
		const a = Math.abs(u);
		switch (variant) {
			case "mound": return bump(u, 0, 1) * (.93 + n * .07);
			case "pillar": return a < .55 ? 1 - .18 * a * a - n * .05 : Math.max(0, (1 - a) / .45 * .85);
			case "slab": return Math.min(1, (1 - a) * 4) * (.88 + n * .12);
			case "jagged": return bump(u, 0, 1) * (.55 + n * .45);
			case "twin": return Math.max(bump(u, -.45, .55), .75 * bump(u, .45, .5)) * (.92 + n * .08);
		}
	});
}
function createFishingGame(canvas, events) {
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("Canvas 2D indisponível.");
	const g = ctx;
	let W = 0;
	let H = 0;
	let dpr = 1;
	let s = 1;
	const geo = {
		surface: 0,
		seabed: 0
	};
	let setup = setupFor({ kind: "endless" });
	let loadout = BASE_LOADOUT;
	let running = false;
	let ended = false;
	let raf = 0;
	let last = 0;
	let clock = 0;
	let boatX = 0;
	let targetX = 0;
	let hookX = 0;
	let hookY = 0;
	let lineState = "idle";
	let holding = false;
	let hooked = [];
	let boatLockUntil = 0;
	let freezeUntil = 0;
	let shockUntil = 0;
	let immuneUntil = 0;
	let forcedUp = false;
	let snagged = false;
	let flash = 0;
	let lightning = 0;
	let nextLightning = 0;
	let bolt = [];
	let score = 0;
	let timeLeft = 0;
	let elapsedTime = 0;
	let lastSecond = 0;
	let streak = 0;
	let step = 0;
	let speedNow = 1;
	let goldenAt = Infinity;
	let nextBubbleAt = 0;
	let escapes = 0;
	const catches = {};
	let fish = [];
	let jellies = [];
	let rocks = [];
	let sharks = [];
	let passes = [];
	let bubbles = [];
	const respawns = [];
	const popups = [];
	const particles = [];
	const keys = /* @__PURE__ */ new Set();
	const rodTip = () => ({
		x: boatX + 46 * s,
		y: geo.surface - 58 * s
	});
	const restY = () => geo.surface - 16 * s;
	const column = () => geo.seabed - geo.surface - 26 * s;
	const depthY = (d) => geo.surface + 18 * s + d * column();
	const depthOf = (y) => clamp((y - geo.surface - 18 * s) / column(), 0, 1);
	function setupFor(stage) {
		if (stage.kind === "endless") return {
			endless: true,
			level: 0,
			seconds: ENDLESS.startSeconds,
			target: null,
			jellyfish: ENDLESS.jellyStart,
			sharks: 0,
			sharkKind: "normal",
			rocks: ENDLESS.rocks,
			fishSpeed: ENDLESS.fishSpeedStart,
			theme: THEMES.night,
			golden: false
		};
		const l = stage.level;
		return {
			endless: false,
			level: l.number,
			seconds: l.seconds,
			target: l.target,
			jellyfish: l.jellyfish,
			sharks: l.sharks,
			sharkKind: l.sharkKind,
			rocks: l.rocks,
			fishSpeed: l.fishSpeed,
			theme: THEMES[l.theme],
			golden: l.goldenFish
		};
	}
	function hud() {
		return {
			mode: setup.endless ? "endless" : "level",
			level: setup.level,
			score,
			target: setup.target,
			timeLeft: Math.ceil(timeLeft),
			elapsed: Math.floor(elapsedTime),
			hooked: hooked.length,
			capacity: loadout.capacity,
			streak,
			multiplier: comboMultiplier(streak),
			step,
			catches: { ...catches }
		};
	}
	const emit = () => events.onHud(hud());
	function resize() {
		const rect = canvas.getBoundingClientRect();
		dpr = Math.min(window.devicePixelRatio || 1, 2);
		W = Math.max(1, rect.width);
		H = Math.max(1, rect.height);
		canvas.width = Math.round(W * dpr);
		canvas.height = Math.round(H * dpr);
		s = clamp(Math.min(W / 900, H / 560), .55, 1.25);
		geo.surface = H * .24;
		geo.seabed = H - 16 * s;
		boatX = clamp(boatX || W * .4, 30 * s, W - 70 * s);
		targetX = clamp(targetX || boatX, 30 * s, W - 70 * s);
		if (lineState === "idle") {
			hookX = rodTip().x;
			hookY = restY();
		}
		if (!running) draw();
	}
	function rockShape(r) {
		return {
			cx: r.xf * W,
			hw: r.w * s / 2,
			top: geo.seabed - r.hf * (geo.seabed - geo.surface)
		};
	}
	/** Top of the rock at x, or null when x isn't over solid rock. */
	function rockTopAt(r, x) {
		const { cx, hw, top } = rockShape(r);
		const u = (x - cx) / hw;
		if (Math.abs(u) >= 1) return null;
		const f = (u + 1) / 2 * ROCK_SAMPLES;
		const i = Math.min(23, Math.floor(f));
		const h = r.profile[i] + (r.profile[i + 1] - r.profile[i]) * (f - i);
		if (h < .03) return null;
		return geo.seabed - h * (geo.seabed - top);
	}
	function makeRocks(wanted) {
		const n = Math.min(wanted, Math.max(2, Math.floor(W / 130)));
		const order = [...Object.keys(ROCK_VARIANTS)].sort(() => Math.random() - .5);
		const slot = .9 / Math.max(1, n);
		return Array.from({ length: wanted > 0 ? n : 0 }, (_, i) => {
			const variant = order[i % order.length];
			const def = ROCK_VARIANTS[variant];
			const seed = Math.floor(rand(1, 1e9));
			return {
				xf: .05 + slot * (i + rand(.3, .7)),
				w: rand(...def.w),
				hf: rand(...def.h),
				profile: rockProfile(variant, seed),
				palette: pick(ROCK_PALETTES),
				seed,
				variant
			};
		});
	}
	function spawn(sp, fromEdge) {
		const dir = side();
		return {
			sp,
			dir,
			x: fromEdge ? dir === 1 ? -60 * s : W + 60 * s : rand(0, W),
			depth: rand(sp.band[0], sp.band[1]),
			speedMul: rand(.8, 1.2),
			phase: rand(0, Math.PI * 2),
			hooked: false,
			freeUntil: 0,
			special: false,
			targetDepth: 0,
			nextDart: 0
		};
	}
	function makeJelly(i, n) {
		return {
			x: (i + rand(.2, .8)) / n * W,
			depth: rand(.12, .78),
			dir: side(),
			speed: rand(10, 24),
			phase: rand(0, Math.PI * 2),
			zapAt: -10
		};
	}
	function schedulePass(at, kind) {
		return {
			at,
			depth: rand(.22, .72),
			dir: side(),
			kind,
			launched: false
		};
	}
	function endlessSharkInterval() {
		return Math.max(ENDLESS.sharkIntervalMin, ENDLESS.sharkIntervalStart - step * ENDLESS.sharkIntervalStep) * rand(.8, 1.2);
	}
	function reset(stage, kit) {
		setup = setupFor(stage);
		loadout = kit;
		score = 0;
		streak = 0;
		step = 0;
		speedNow = setup.fishSpeed;
		elapsedTime = 0;
		timeLeft = setup.seconds + loadout.bonusSeconds;
		lastSecond = Math.ceil(timeLeft);
		for (const sp of [...SPECIES, GOLDEN_FISH]) catches[sp.key] = 0;
		hooked = [];
		lineState = "idle";
		holding = false;
		boatLockUntil = freezeUntil = shockUntil = immuneUntil = 0;
		forcedUp = snagged = false;
		flash = lightning = 0;
		nextLightning = clock + rand(3, 7);
		respawns.length = 0;
		popups.length = 0;
		particles.length = 0;
		fish = SPECIES.flatMap((sp) => Array.from({ length: sp.count }, () => spawn(sp, false)));
		jellies = Array.from({ length: setup.jellyfish }, (_, i) => makeJelly(i, setup.jellyfish));
		rocks = makeRocks(setup.rocks);
		sharks = [];
		bubbles = [];
		passes = setup.endless ? [schedulePass(endlessSharkInterval(), "normal")] : Array.from({ length: setup.sharks }, (_, i) => schedulePass(Math.max(5, setup.seconds * (i + .5) / (setup.sharks + .2) + rand(-1.5, 1.5)), setup.sharkKind));
		goldenAt = setup.golden ? setup.seconds * rand(...GOLDEN.appearsBetween) : Infinity;
		nextBubbleAt = loadout.bubbleInterval * rand(.5, .8);
		hookX = rodTip().x;
		hookY = restY();
		ended = false;
		if (loadout.bonusSeconds > 0) say(`+${loadout.bonusSeconds}s de reserva`, "#7fe9ff", W / 2, geo.surface + 40 * s, 1.2);
	}
	function splash(x, y, n, color = "rgba(220,245,255,.9)", speed = 1) {
		for (let i = 0; i < n; i++) particles.push({
			x,
			y,
			vx: rand(-80, 80) * s * speed,
			vy: rand(-190, -60) * s * speed,
			age: 0,
			life: rand(.4, .8),
			r: rand(1.2, 3) * s,
			color
		});
	}
	function say(text, color, x = hookX + 14 * s, y = hookY - 10 * s, size = 1) {
		popups.push({
			x,
			y,
			text,
			color,
			age: 0,
			size
		});
	}
	/** Any hazard breaks the combo. */
	function penalty() {
		if (streak > 0) say("Combo perdido", "#ff9d9d", hookX + 14 * s, hookY + 14 * s);
		streak = 0;
	}
	function fishPos(f) {
		const y = depthY(f.depth) + Math.sin(clock * 1.6 + f.phase) * (f.sp.kind === "flat" ? 1 : 6) * s;
		return {
			x: f.x,
			y
		};
	}
	function jellyPos(j) {
		return {
			x: j.x,
			y: depthY(j.depth) + Math.sin(clock * 1.2 + j.phase) * 10 * s
		};
	}
	const sharkY = (sh) => depthY(sh.depth) + Math.sin(clock * 2 + sh.x / 90) * 4 * s;
	const bubbleY = (b) => depthY(b.depth);
	/** A hooked fish slips off, drops below the hook and darts away. */
	function release(f) {
		f.hooked = false;
		f.x = hookX;
		f.depth = clamp(depthOf(hookY) + .1, 0, 1);
		f.dir = side();
		f.speedMul *= 1.8;
		f.freeUntil = clock + 1.5;
		escapes++;
	}
	function finish(outcome) {
		if (ended) return;
		ended = true;
		running = false;
		holding = false;
		keys.clear();
		cancelAnimationFrame(raf);
		last = performance.now();
		raf = requestAnimationFrame(idle);
		events.onEnd(hud(), outcome);
	}
	function land() {
		if (!hooked.length) return;
		const tip = rodTip();
		let base = 0;
		hooked.forEach((f, i) => {
			base += f.sp.points;
			catches[f.sp.key] = (catches[f.sp.key] ?? 0) + 1;
			popups.push({
				x: tip.x - 10 * s,
				y: tip.y - 14 * s - i * 18 * s,
				text: `+${f.sp.points} ${f.sp.name}`,
				color: f.special ? "#ffd84d" : "#ffffff",
				age: -i * .08,
				size: f.special ? 1.4 : 1
			});
			if (!f.special) respawns.push({
				sp: f.sp,
				at: clock + f.sp.respawn * rand(.8, 1.3)
			});
		});
		const haul = (hooked.length - 1) * 5;
		if (haul > 0) popups.push({
			x: tip.x + 34 * s,
			y: tip.y + 10 * s,
			text: `Lanço ×${hooked.length} +${haul}`,
			color: "#9ee7ff",
			age: -.2
		});
		const mult = comboMultiplier(streak);
		const gained = Math.round((base + haul) * mult);
		if (mult > 1) popups.push({
			x: tip.x + 34 * s,
			y: tip.y - 12 * s,
			text: `Combo ×${mult.toFixed(1)}`,
			color: "#f5b331",
			age: -.3
		});
		streak += hooked.length;
		if (comboMultiplier(streak) > mult) say(`Combo ×${comboMultiplier(streak).toFixed(1)}!`, "#f5b331", tip.x, tip.y - 60 * s, 1.3);
		score += gained;
		fish = fish.filter((f) => !f.hooked);
		hooked = [];
		splash(hookX, geo.surface, 14);
		emit();
		if (setup.target !== null && score >= setup.target) finish("win");
	}
	/** Things that move even behind the separator / result screens. */
	function ambient(dt) {
		for (const f of fish) {
			if (f.hooked) continue;
			f.x += f.dir * f.sp.speed * f.speedMul * speedNow * s * dt;
			if (f.special) {
				if (clock >= f.nextDart) {
					f.targetDepth = rand(f.sp.band[0], f.sp.band[1]);
					f.nextDart = clock + rand(...GOLDEN.dartEvery);
				}
				f.depth = damp(f.depth, f.targetDepth, 3, dt);
			} else if (f.x < -80 * s || f.x > W + 80 * s) {
				f.dir = f.x < 0 ? 1 : -1;
				f.depth = rand(f.sp.band[0], f.sp.band[1]);
			}
		}
		fish = fish.filter((f) => !f.special || f.hooked || f.x > -120 * s && f.x < W + 120 * s);
		for (const j of jellies) {
			j.x += j.dir * j.speed * s * dt;
			if (j.x < -30 * s) j.x = W + 30 * s;
			if (j.x > W + 30 * s) j.x = -30 * s;
		}
	}
	function endlessRamp() {
		const next = Math.floor(elapsedTime / ENDLESS.rampEvery);
		if (next <= step) return;
		step = next;
		speedNow = Math.min(ENDLESS.fishSpeedMax, ENDLESS.fishSpeedStart + step * ENDLESS.fishSpeedStep);
		if (jellies.length < ENDLESS.jellyMax) jellies.push(makeJelly(Math.floor(rand(0, 4)), 4));
		say(`Dificuldade ${step + 1}`, "#ff9d9d", W / 2, geo.surface + 40 * s, 1.2);
		emit();
	}
	function update(dt) {
		clock += dt;
		elapsedTime += dt;
		timeLeft = Math.max(0, timeLeft - dt);
		if (Math.ceil(timeLeft) !== lastSecond) {
			lastSecond = Math.ceil(timeLeft);
			emit();
		}
		if (setup.endless) endlessRamp();
		const timeUp = timeLeft <= 0;
		const frozen = clock < freezeUntil;
		const shocked = clock < shockUntil;
		const down = LINE.down * loadout.lineSpeed * s;
		const up = LINE.up * loadout.lineSpeed * s;
		const kx = (keys.has("ArrowRight") || keys.has("KeyD") ? 1 : 0) - (keys.has("ArrowLeft") || keys.has("KeyA") ? 1 : 0);
		const lowering = !timeUp && !forcedUp && (holding || keys.has("Space") || keys.has("ArrowDown") || keys.has("KeyS"));
		if (clock >= boatLockUntil) {
			if (kx !== 0) {
				boatX = clamp(boatX + kx * 460 * s * dt, 30 * s, W - 70 * s);
				targetX = boatX;
			} else {
				targetX = clamp(targetX, 30 * s, W - 70 * s);
				const maxStep = 1100 * s * dt;
				boatX += clamp(damp(boatX, targetX, 12, dt) - boatX, -maxStep, maxStep);
			}
		}
		if (!frozen) {
			if (lowering) {
				if (lineState === "idle") splash(hookX, geo.surface, 6);
				lineState = "down";
			} else if (lineState === "down") lineState = "up";
			if (lineState === "down") {
				hookY = Math.min(hookY + down * dt, geo.seabed - 8 * s);
				for (const r of rocks) {
					const top = rockTopAt(r, hookX);
					if (top !== null && hookY + 8 * s >= top) {
						hookY = top - 8 * s;
						freezeUntil = clock + SNAG_SECONDS;
						forcedUp = true;
						snagged = true;
						lineState = "up";
						say("Preso!", "#ffb35c");
						splash(hookX, top, 8, "rgba(200,190,170,.8)", .6);
						penalty();
						emit();
						break;
					}
				}
			}
			if (lineState === "up" && clock >= freezeUntil) {
				snagged = false;
				hookY -= up * dt;
				if (hookY <= restY()) {
					hookY = restY();
					lineState = "idle";
					forcedUp = false;
					land();
				}
			}
			if (lineState === "idle") hookY = restY();
			hookX = damp(hookX, rodTip().x, lineState === "idle" ? 14 : 5, dt);
		}
		ambient(dt);
		const inWater = lineState !== "idle" && hookY > geo.surface + 4 * s;
		if (inWater && clock >= immuneUntil) for (const j of jellies) {
			const p = jellyPos(j);
			if (Math.abs(hookX - p.x) < 17 * s && hookY > p.y - 15 * s && hookY < p.y + 38 * s) {
				j.zapAt = clock;
				shockUntil = clock + SHOCK_SECONDS;
				boatLockUntil = clock + SHOCK_SECONDS;
				immuneUntil = clock + SHOCK_SECONDS + 1.3;
				forcedUp = true;
				lineState = "up";
				flash = 1;
				splash(hookX, hookY, 10, "rgba(255,236,120,.95)", .8);
				const lost = hooked.pop();
				if (lost) {
					release(lost);
					say(`Choque! −${lost.sp.name}`, "#ffe36e");
				} else say("Choque!", "#ffe36e");
				penalty();
				emit();
				break;
			}
		}
		for (const pass of passes) if (!pass.launched && elapsedTime >= pass.at) {
			pass.launched = true;
			const def = SHARKS[pass.kind];
			sharks.push({
				def,
				x: pass.dir === 1 ? -def.length * s : W + def.length * s,
				depth: pass.depth,
				dir: pass.dir,
				bit: false
			});
			if (setup.endless) {
				const kind = elapsedTime >= ENDLESS.aggressiveAfter && Math.random() < .5 ? "aggressive" : "normal";
				passes.push(schedulePass(elapsedTime + endlessSharkInterval(), kind));
			}
		}
		passes = passes.filter((p) => !p.launched);
		for (const sh of sharks) {
			sh.x += sh.dir * sh.def.speed * s * Math.max(1, speedNow * .9) * dt;
			if (sh.def.tracking > 0 && inWater && !sh.bit) {
				const want = depthOf(hookY);
				const stepD = sh.def.tracking * s * dt / column();
				sh.depth += clamp(want - sh.depth, -stepD, stepD);
			}
			const y = sharkY(sh);
			if (!sh.bit && inWater && Math.abs(hookX - sh.x) < sh.def.length * s * .42 && Math.abs(hookY - y) < sh.def.height * s * .5) {
				sh.bit = true;
				freezeUntil = Math.max(freezeUntil, clock + BITE_SECONDS);
				flash = .7;
				splash(hookX, hookY, 12, "rgba(255,120,120,.9)", .9);
				if (hooked.length) {
					say(`${sh.def.name}! −${hooked.length} ${hooked.length === 1 ? "peixe" : "peixes"}`, "#ff7a7a");
					for (const f of hooked) if (!f.special) respawns.push({
						sp: f.sp,
						at: clock + f.sp.respawn
					});
					fish = fish.filter((f) => !f.hooked);
					hooked = [];
				} else say(`${sh.def.name}!`, "#ff7a7a");
				if (sh.def.yanksLine) {
					forcedUp = true;
					lineState = "up";
				}
				penalty();
				emit();
			}
		}
		sharks = sharks.filter((sh) => sh.x > -sh.def.length * 1.5 * s && sh.x < W + sh.def.length * 1.5 * s);
		if (elapsedTime >= goldenAt) {
			goldenAt = Infinity;
			const f = spawn(GOLDEN_FISH, true);
			f.special = true;
			f.targetDepth = f.depth;
			f.nextDart = clock + .8;
			fish.push(f);
			say("✦ Peixe Dourado à vista! ✦", "#ffd84d", W / 2, geo.surface + 34 * s, 1.3);
		}
		if (elapsedTime >= nextBubbleAt) {
			nextBubbleAt = elapsedTime + loadout.bubbleInterval * rand(1 - BUBBLES.jitter, 1 + BUBBLES.jitter);
			bubbles.push({
				x: rand(.1, .9) * W,
				depth: rand(.5, .95),
				value: loadout.bubbleSeconds,
				born: clock,
				phase: rand(0, Math.PI * 2)
			});
		}
		for (const b of bubbles) b.depth -= BUBBLES.rise * s * dt / column();
		bubbles = bubbles.filter((b) => {
			if (b.depth < -.02 || clock - b.born > BUBBLES.lifetime) return false;
			const bx = b.x + Math.sin(clock * 1.5 + b.phase) * 10 * s;
			if (inWater && Math.hypot(hookX - bx, hookY - bubbleY(b)) < BUBBLES.reach * s) {
				timeLeft += b.value;
				say(`+${b.value}s`, "#7fe9ff", bx, bubbleY(b) - 10 * s, 1.3);
				splash(bx, bubbleY(b), 12, "rgba(160,240,255,.9)", .6);
				emit();
				return false;
			}
			return true;
		});
		if (lineState === "up" && clock >= freezeUntil && !shocked && hooked.length < loadout.capacity) for (const f of fish) {
			if (f.hooked || hooked.length >= loadout.capacity || clock < f.freeUntil) continue;
			const p = fishPos(f);
			const reach = (Math.max(f.sp.length, f.sp.height) * .45 + 9) * s * (f.special ? GOLDEN.reachFactor : 1);
			if (Math.hypot(p.x - hookX, p.y - hookY) < reach) {
				f.hooked = true;
				hooked.push(f);
				splash(p.x, p.y, f.special ? 16 : 5, f.special ? "rgba(255,220,90,.95)" : "rgba(170,230,255,.7)");
				if (f.special) say("Peixe Dourado!", "#ffd84d", p.x, p.y - 20 * s, 1.3);
				emit();
			}
		}
		for (let i = respawns.length - 1; i >= 0; i--) if (clock >= respawns[i].at) {
			fish.push(spawn(respawns[i].sp, true));
			respawns.splice(i, 1);
		}
		if (setup.theme.lightning && clock >= nextLightning) {
			nextLightning = clock + rand(5, 11);
			lightning = 1;
			let x = rand(.15, .85) * W;
			bolt = [[x, 0]];
			for (let y = 0; y < geo.surface; y += geo.surface / 6) {
				x += rand(-26, 26) * s;
				bolt.push([x, y]);
			}
			bolt.push([x + rand(-10, 10) * s, geo.surface]);
		}
		lightning = Math.max(0, lightning - dt * 3.5);
		for (const p of particles) {
			p.age += dt;
			p.x += p.vx * dt;
			p.y += p.vy * dt;
			p.vy += 520 * s * dt;
		}
		for (let i = particles.length - 1; i >= 0; i--) if (particles[i].age > particles[i].life) particles.splice(i, 1);
		for (const p of popups) {
			p.age += dt;
			if (p.age > 0) p.y -= 34 * s * dt;
		}
		for (let i = popups.length - 1; i >= 0; i--) if (popups[i].age > 1.5) popups.splice(i, 1);
		flash = Math.max(0, flash - dt * 2.5);
		if (timeUp && lineState === "idle") {
			if (setup.endless) finish("endless-over");
			else finish(setup.target !== null && score >= setup.target ? "win" : "timeout");
		}
	}
	function drawSky() {
		const t = setup.theme;
		const sky = g.createLinearGradient(0, 0, 0, geo.surface);
		t.sky.forEach((c, i) => sky.addColorStop(i / (t.sky.length - 1), c));
		g.fillStyle = sky;
		g.fillRect(0, 0, W, geo.surface);
		for (let i = 0; i < t.stars; i++) {
			const x = i * 211 % 997 / 997 * W;
			const y = i * 137 % 613 / 613 * geo.surface * .8;
			g.globalAlpha = .35 + .35 * Math.sin(clock * 2 + i);
			g.fillStyle = "#fff";
			g.fillRect(x, y, 1.6 * s, 1.6 * s);
		}
		g.globalAlpha = 1;
		if (t.sun) {
			const y = geo.surface - 6 * s - t.sun.height * geo.surface;
			const glow = g.createRadialGradient(t.sun.x * W, y, 0, t.sun.x * W, y, t.sun.radius * 3 * s);
			glow.addColorStop(0, t.sun.color);
			glow.addColorStop(1, "rgba(255,230,180,0)");
			g.fillStyle = glow;
			g.beginPath();
			g.arc(t.sun.x * W, y, t.sun.radius * 3 * s, 0, Math.PI * 2);
			g.fill();
			g.fillStyle = t.sun.color;
			g.beginPath();
			g.arc(t.sun.x * W, y, t.sun.radius * s, 0, Math.PI * 2);
			g.fill();
		}
		if (t.moon) {
			const x = t.moon.x * W;
			const y = geo.surface * .35;
			g.fillStyle = "rgba(240,244,255,.95)";
			g.shadowColor = "rgba(200,220,255,.8)";
			g.shadowBlur = 18 * s;
			g.beginPath();
			g.arc(x, y, 16 * s, 0, Math.PI * 2);
			g.fill();
			g.shadowBlur = 0;
			g.fillStyle = "rgba(180,190,210,.5)";
			g.beginPath();
			g.arc(x - 5 * s, y - 3 * s, 3.5 * s, 0, Math.PI * 2);
			g.arc(x + 5 * s, y + 5 * s, 2.5 * s, 0, Math.PI * 2);
			g.fill();
		}
		g.fillStyle = t.clouds.color;
		for (let i = 0; i < t.clouds.count; i++) {
			const span = W + 240 * s;
			const x = (i * 311 % 997 / 997 * span + clock * (6 + i % 3 * 3) * s) % span - 120 * s;
			const y = (.12 + i * 53 % 40 / 100) * geo.surface;
			const r = (18 + i % 3 * 8) * s;
			g.beginPath();
			g.ellipse(x, y, r * 2.2, r * .8, 0, 0, Math.PI * 2);
			g.ellipse(x + r, y - r * .4, r * 1.3, r * .8, 0, 0, Math.PI * 2);
			g.ellipse(x - r, y - r * .2, r * 1.1, r * .7, 0, 0, Math.PI * 2);
			g.fill();
		}
		g.fillStyle = t.coast;
		g.beginPath();
		g.moveTo(0, geo.surface);
		for (let x = 0; x <= W * .45; x += 20) g.lineTo(x, geo.surface - (12 + Math.sin(x / 60) * 6 + Math.sin(x / 23) * 3) * s);
		g.lineTo(W * .5, geo.surface);
		g.closePath();
		g.fill();
		if (t.lighthouse) {
			const x = W * .12;
			const base = geo.surface - 14 * s;
			g.fillStyle = "#e9e4da";
			g.fillRect(x - 4 * s, base - 30 * s, 8 * s, 30 * s);
			g.fillStyle = "#b8392e";
			g.fillRect(x - 4 * s, base - 22 * s, 8 * s, 5 * s);
			g.fillRect(x - 4 * s, base - 10 * s, 8 * s, 5 * s);
			const on = Math.sin(clock * 2.4) > .2;
			g.fillStyle = on ? "rgba(255,240,170,1)" : "rgba(120,110,80,.8)";
			if (on) {
				g.shadowColor = "rgba(255,230,140,.9)";
				g.shadowBlur = 16 * s;
			}
			g.beginPath();
			g.arc(x, base - 33 * s, 3.5 * s, 0, Math.PI * 2);
			g.fill();
			g.shadowBlur = 0;
		}
		if (lightning > 0) {
			g.fillStyle = `rgba(230,236,255,${(lightning * .35).toFixed(3)})`;
			g.fillRect(0, 0, W, geo.surface);
			g.strokeStyle = `rgba(255,255,255,${lightning.toFixed(3)})`;
			g.lineWidth = 2 * s;
			g.beginPath();
			bolt.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y));
			g.stroke();
		}
	}
	function drawWater() {
		const t = setup.theme;
		const water = g.createLinearGradient(0, geo.surface, 0, H);
		water.addColorStop(0, t.water[0]);
		water.addColorStop(.35, t.water[1]);
		water.addColorStop(1, t.water[2]);
		g.fillStyle = water;
		g.fillRect(0, geo.surface, W, H - geo.surface);
		if (t.glint && (t.sun || t.moon)) {
			const gx = (t.sun?.x ?? t.moon?.x ?? .5) * W;
			g.fillStyle = t.glint;
			for (let i = 0; i < 6; i++) {
				const y = geo.surface + 4 * s + i * 5 * s;
				const w = (40 - i * 5) * s + Math.sin(clock * 2 + i) * 6 * s;
				g.fillRect(gx - w / 2, y, w, 1.5 * s);
			}
		}
		g.fillStyle = "#3b3a2e";
		g.beginPath();
		g.moveTo(0, H);
		for (let x = 0; x <= W + 20; x += 20) g.lineTo(x, geo.seabed - 4 * s + Math.sin(x / 80) * 5 * s);
		g.lineTo(W, H);
		g.closePath();
		g.fill();
		g.fillStyle = "#23272a";
		for (let i = 0; i < 7; i++) {
			const x = i * 173 % 1e3 / 1e3 * W;
			g.beginPath();
			g.ellipse(x, geo.seabed, (18 + i % 3 * 10) * s, (10 + i % 2 * 6) * s, 0, Math.PI, 0);
			g.fill();
		}
		g.strokeStyle = "#2f6b45";
		g.lineWidth = 3 * s;
		g.lineCap = "round";
		for (let i = 0; i < 12; i++) {
			const x = (i * 97 + 40) % 1e3 / 1e3 * W;
			const h = (30 + i % 4 * 14) * s;
			g.beginPath();
			g.moveTo(x, geo.seabed);
			g.quadraticCurveTo(x + Math.sin(clock * 1.3 + i) * 10 * s, geo.seabed - h / 2, x + Math.sin(clock * 1.3 + i + 1) * 14 * s, geo.seabed - h);
			g.stroke();
		}
		g.fillStyle = "rgba(200,240,255,.22)";
		for (let i = 0; i < 14; i++) {
			const x = i * 131 % 1e3 / 1e3 * W + Math.sin(clock + i) * 6 * s;
			const span = geo.seabed - geo.surface;
			const y = geo.seabed - (clock * (18 + i % 5 * 6) * s + i * 57) % span;
			g.beginPath();
			g.arc(x, y, (1.5 + i % 3) * s, 0, Math.PI * 2);
			g.fill();
		}
	}
	function drawRain() {
		g.strokeStyle = "rgba(190,210,230,.45)";
		g.lineWidth = 1.2 * s;
		g.beginPath();
		for (let i = 0; i < 90; i++) {
			const x = (i * 97 % 1e3 / 1e3 * (W + 60 * s) + clock * 90 * s) % (W + 60 * s) - 30 * s;
			const y = (i * 57 % 1e3 / 1e3 * geo.surface + clock * 620 * s) % geo.surface;
			g.moveTo(x, y);
			g.lineTo(x - 5 * s, y + 13 * s);
		}
		g.stroke();
		g.strokeStyle = "rgba(200,225,240,.35)";
		for (let i = 0; i < 12; i++) {
			const phase = (clock * 1.8 + i * .37) % 1;
			const x = (i * 173 + Math.floor(clock * 1.8 + i * .37) * 211) % 1e3 / 1e3 * W;
			g.globalAlpha = 1 - phase;
			g.beginPath();
			g.ellipse(x, geo.surface + 3 * s, (2 + phase * 10) * s, (1 + phase * 2.5) * s, 0, 0, Math.PI * 2);
			g.stroke();
		}
		g.globalAlpha = 1;
	}
	function drawRock(r) {
		const { cx, hw, top } = rockShape(r);
		const body = g.createLinearGradient(0, top, 0, geo.seabed);
		body.addColorStop(0, r.palette[0]);
		body.addColorStop(1, r.palette[1]);
		g.fillStyle = body;
		g.beginPath();
		g.moveTo(cx - hw, geo.seabed + 2 * s);
		const jitter = seeded(r.seed + 7);
		for (let i = 0; i <= ROCK_SAMPLES; i++) {
			const x = cx - hw + i / ROCK_SAMPLES * hw * 2;
			const y = (rockTopAt(r, Math.min(x, cx + hw - .01)) ?? geo.seabed) + (jitter() - .5) * (r.variant === "jagged" ? 6 : 2.5) * s;
			g.lineTo(x, y);
		}
		g.lineTo(cx + hw, geo.seabed + 2 * s);
		g.closePath();
		g.fill();
		g.strokeStyle = "rgba(200,215,225,.22)";
		g.lineWidth = 1.5 * s;
		g.stroke();
		g.strokeStyle = "rgba(0,0,0,.28)";
		g.lineWidth = 1.2 * s;
		const cr = seeded(r.seed + 13);
		for (let i = 0; i < 2; i++) {
			const x = cx + (cr() - .5) * hw;
			const y0 = (rockTopAt(r, x) ?? geo.seabed) + 6 * s;
			g.beginPath();
			g.moveTo(x, y0);
			g.lineTo(x + (cr() - .5) * 12 * s, y0 + (geo.seabed - y0) * .35);
			g.lineTo(x + (cr() - .5) * 16 * s, y0 + (geo.seabed - y0) * .6);
			g.stroke();
		}
		g.fillStyle = "rgba(70,130,85,.55)";
		for (let i = 0; i < 3; i++) {
			const x = cx + (cr() - .5) * hw * 1.4;
			const y = rockTopAt(r, x);
			if (y === null) continue;
			g.beginPath();
			g.ellipse(x, y + 4 * s, 6 * s, 3 * s, 0, 0, Math.PI * 2);
			g.fill();
		}
	}
	function drawJelly(j) {
		const { x, y } = jellyPos(j);
		const zap = clock - j.zapAt < .6;
		const pulse = 1 + Math.sin(clock * 3 + j.phase) * .08;
		g.save();
		g.translate(x, y);
		g.strokeStyle = zap ? "rgba(255,236,120,.95)" : "rgba(255,190,235,.55)";
		g.lineWidth = 1.6 * s;
		for (let i = 0; i < 5; i++) {
			const tx = (-10 + i * 5) * s;
			g.beginPath();
			g.moveTo(tx, 2 * s);
			for (let k = 1; k <= 4; k++) g.lineTo(tx + Math.sin(clock * 4 + i + k) * 3 * s, 2 * s + k * 9 * s);
			g.stroke();
		}
		const bell = g.createRadialGradient(0, -6 * s, 1, 0, -2 * s, 18 * s);
		bell.addColorStop(0, zap ? "rgba(255,250,200,.95)" : "rgba(255,200,235,.9)");
		bell.addColorStop(1, zap ? "rgba(255,220,90,.5)" : "rgba(190,110,230,.35)");
		g.fillStyle = bell;
		g.shadowColor = zap ? "rgba(255,236,120,.9)" : "rgba(230,150,255,.6)";
		g.shadowBlur = 12 * s;
		g.beginPath();
		g.ellipse(0, 0, 16 * s * pulse, 13 * s / pulse, 0, Math.PI, 0);
		g.quadraticCurveTo(8 * s, 5 * s, 0, 3 * s);
		g.quadraticCurveTo(-8 * s, 5 * s, -16 * s * pulse, 0);
		g.fill();
		g.restore();
	}
	function drawShark(sh) {
		const L = sh.def.length * s;
		const Hh = sh.def.height * s;
		const y = sharkY(sh);
		g.save();
		g.translate(sh.x, y);
		g.scale(sh.dir, 1);
		const wag = Math.sin(clock * (sh.def.tracking ? 8 : 6)) * .18;
		g.save();
		g.translate(-L * .42, 0);
		g.rotate(wag);
		g.fillStyle = sh.def.body;
		g.beginPath();
		g.moveTo(0, 0);
		g.lineTo(-L * .14, -Hh * .9);
		g.quadraticCurveTo(-L * .06, 0, -L * .12, Hh * .55);
		g.closePath();
		g.fill();
		g.restore();
		g.fillStyle = sh.def.body;
		g.beginPath();
		g.moveTo(-L * .02, -Hh * .42);
		g.lineTo(-L * .14, -Hh * 1.05);
		g.lineTo(-L * .2, -Hh * .36);
		g.fill();
		g.beginPath();
		g.moveTo(L * .12, Hh * .28);
		g.lineTo(-L * .04, Hh * .85);
		g.lineTo(-L * .02, Hh * .28);
		g.fill();
		const body = g.createLinearGradient(0, -Hh / 2, 0, Hh / 2);
		body.addColorStop(0, sh.def.body);
		body.addColorStop(.6, sh.def.body);
		body.addColorStop(1, sh.def.belly);
		g.fillStyle = body;
		g.beginPath();
		g.moveTo(L * .5, Hh * .05);
		g.bezierCurveTo(L * .42, -Hh * .55, -L * .2, -Hh * .6, -L * .44, 0);
		g.bezierCurveTo(-L * .2, Hh * .5, L * .35, Hh * .5, L * .5, Hh * .05);
		g.fill();
		if (sh.def.stripes) {
			g.save();
			g.clip();
			g.fillStyle = "rgba(20,22,18,.45)";
			for (let i = 0; i < 6; i++) g.fillRect(-L * .3 + i * L * .09, -Hh, L * .035, Hh * .75);
			g.restore();
		}
		g.strokeStyle = "rgba(40,50,58,.5)";
		g.lineWidth = 1.4 * s;
		for (let i = 0; i < 3; i++) {
			g.beginPath();
			g.moveTo(L * .18 - i * 5 * s, -Hh * .12);
			g.lineTo(L * .16 - i * 5 * s, Hh * .18);
			g.stroke();
		}
		g.beginPath();
		g.moveTo(L * .44, Hh * .18);
		g.quadraticCurveTo(L * .34, Hh * .3, L * .26, Hh * .2);
		g.stroke();
		if (sh.def.tracking) {
			g.fillStyle = "#f3efe6";
			for (let i = 0; i < 4; i++) {
				const tx = L * .42 - i * L * .04;
				g.beginPath();
				g.moveTo(tx, Hh * .2);
				g.lineTo(tx - L * .012, Hh * .27);
				g.lineTo(tx - L * .024, Hh * .2);
				g.fill();
			}
		}
		g.fillStyle = sh.def.tracking ? "#b01616" : "#0b1116";
		g.beginPath();
		g.arc(L * .36, -Hh * .1, 3 * s, 0, Math.PI * 2);
		g.fill();
		g.restore();
	}
	function drawWarnings() {
		for (const pass of passes) {
			if (pass.launched || elapsedTime < pass.at - 1.8) continue;
			const aggressive = pass.kind === "aggressive";
			const x = pass.dir === 1 ? 22 * s : W - 22 * s;
			const y = depthY(pass.depth);
			const blink = .55 + .45 * Math.sin(clock * (aggressive ? 20 : 14));
			const k = aggressive ? 1.35 : 1;
			g.save();
			g.globalAlpha = blink;
			g.fillStyle = aggressive ? "#ff2e2e" : "#ff5a5a";
			g.beginPath();
			g.moveTo(x, y - 16 * s * k);
			g.lineTo(x + 15 * s * k, y + 11 * s * k);
			g.lineTo(x - 15 * s * k, y + 11 * s * k);
			g.closePath();
			g.fill();
			g.fillStyle = "#fff";
			g.font = `800 ${Math.round(16 * s * k + 2)}px Poppins, system-ui, sans-serif`;
			g.textAlign = "center";
			g.fillText(aggressive ? "!!" : "!", x, y + 8 * s * k);
			g.restore();
		}
	}
	function drawBubble(b) {
		const x = b.x + Math.sin(clock * 1.5 + b.phase) * 10 * s;
		const y = bubbleY(b);
		const r = 15 * s;
		const fade = Math.min(1, (BUBBLES.lifetime - (clock - b.born)) / 2);
		g.save();
		g.globalAlpha = fade;
		const fill = g.createRadialGradient(x - r * .35, y - r * .4, 1, x, y, r);
		fill.addColorStop(0, "rgba(255,255,255,.55)");
		fill.addColorStop(1, "rgba(120,220,255,.18)");
		g.fillStyle = fill;
		g.strokeStyle = "rgba(170,240,255,.9)";
		g.lineWidth = 1.5 * s;
		g.shadowColor = "rgba(120,230,255,.8)";
		g.shadowBlur = 10 * s;
		g.beginPath();
		g.arc(x, y, r, 0, Math.PI * 2);
		g.fill();
		g.stroke();
		g.shadowBlur = 0;
		g.fillStyle = "#eaffff";
		g.font = `800 ${Math.round(11 * s + 2)}px Poppins, system-ui, sans-serif`;
		g.textAlign = "center";
		g.fillText(`+${b.value}s`, x, y + 4 * s);
		g.restore();
	}
	function drawFish(f) {
		const p = fishPos(f);
		g.save();
		g.translate(p.x, p.y);
		if (f.special) {
			const glow = g.createRadialGradient(0, 0, 0, 0, 0, 34 * s);
			glow.addColorStop(0, "rgba(255,220,90,.55)");
			glow.addColorStop(1, "rgba(255,220,90,0)");
			g.fillStyle = glow;
			g.beginPath();
			g.arc(0, 0, 34 * s, 0, Math.PI * 2);
			g.fill();
			g.fillStyle = "#fff6c8";
			for (let i = 0; i < 4; i++) {
				const a = clock * 3 + i * (Math.PI / 2);
				g.fillRect(Math.cos(a) * 24 * s, Math.sin(a) * 14 * s, 2.2 * s, 2.2 * s);
			}
		}
		if (f.sp.kind !== "octopus") g.scale(f.dir, 1);
		drawCreature(g, f.sp, s, clock + f.phase);
		g.restore();
	}
	function drawBoat() {
		const bob = Math.sin(clock * 1.8) * 2.5 * s * setup.theme.waves;
		const tilt = Math.sin(clock * 1.4) * .03 * setup.theme.waves;
		g.save();
		g.translate(boatX, geo.surface - 4 * s + bob);
		g.rotate(tilt);
		g.fillStyle = "#f2efe6";
		g.beginPath();
		g.moveTo(-44 * s, -14 * s);
		g.lineTo(44 * s, -14 * s);
		g.quadraticCurveTo(38 * s, 6 * s, 22 * s, 8 * s);
		g.lineTo(-30 * s, 8 * s);
		g.quadraticCurveTo(-42 * s, 2 * s, -44 * s, -14 * s);
		g.fill();
		g.fillStyle = "#c0392b";
		g.fillRect(-44 * s, -14 * s, 88 * s, 5 * s);
		g.fillStyle = "#1f5f8b";
		g.fillRect(-36 * s, -3 * s, 64 * s, 3 * s);
		g.fillStyle = "#18222c";
		g.beginPath();
		g.arc(-8 * s, -36 * s, 7 * s, 0, Math.PI * 2);
		g.fill();
		g.fillRect(-15 * s, -30 * s, 14 * s, 17 * s);
		g.fillStyle = setup.theme.rain ? "#e8c21c" : "#f5b331";
		g.beginPath();
		g.ellipse(-8 * s, -41 * s, 10 * s, 3 * s, 0, 0, Math.PI * 2);
		g.fill();
		g.restore();
		const tip = rodTip();
		g.strokeStyle = "#3a2a1c";
		g.lineWidth = 3 * s;
		g.lineCap = "round";
		g.beginPath();
		g.moveTo(boatX - 2 * s, geo.surface - 24 * s + bob);
		g.quadraticCurveTo(boatX + 24 * s, geo.surface - 52 * s, tip.x, tip.y);
		g.stroke();
	}
	function drawLine() {
		const tip = rodTip();
		const shocked = clock < shockUntil;
		const shake = snagged && clock < freezeUntil ? Math.sin(clock * 70) * 2.2 * s : 0;
		const hx = hookX + shake;
		if (shocked) {
			g.strokeStyle = "rgba(255,236,120,.95)";
			g.lineWidth = 1.8 * s;
			g.beginPath();
			g.moveTo(tip.x, tip.y);
			const n = 14;
			for (let i = 1; i <= n; i++) {
				const t = i / n;
				g.lineTo(tip.x + (hx - tip.x) * t + (i < n ? rand(-4, 4) * s : 0), tip.y + (hookY - tip.y) * t);
			}
			g.stroke();
		} else {
			g.strokeStyle = "rgba(235,245,250,.85)";
			g.lineWidth = 1.2 * s;
			g.beginPath();
			g.moveTo(tip.x, tip.y);
			const sag = lineState === "idle" ? 6 * s : 0;
			g.quadraticCurveTo((tip.x + hx) / 2 + sag, (tip.y + hookY) / 2 + sag, hx, hookY);
			g.stroke();
		}
		hooked.forEach((f, i) => {
			const col = i % 3 - 1;
			const row = Math.floor(i / 3);
			g.save();
			g.translate(hx + col * 12 * s, hookY + (16 + row * 14) * s + Math.max(f.sp.length, f.sp.height) * .3 * s);
			g.rotate(-Math.PI / 2 + Math.sin(clock * 12 + i) * .25);
			drawCreature(g, f.sp, s * .9, clock + i);
			g.restore();
		});
		g.fillStyle = "#9aa7b0";
		g.beginPath();
		g.arc(hx, hookY - 3 * s, 3.2 * s, 0, Math.PI * 2);
		g.fill();
		g.strokeStyle = "#d8e1e6";
		g.lineWidth = 1.8 * s;
		g.beginPath();
		g.moveTo(hx, hookY);
		g.lineTo(hx, hookY + 8 * s);
		g.arc(hx + 4 * s, hookY + 8 * s, 4 * s, Math.PI, 0, true);
		g.stroke();
		if (lineState !== "idle" && hookY > geo.surface) {
			const meters = Math.round((hookY - geo.surface) / (geo.seabed - geo.surface) * 30);
			g.font = `600 ${Math.round(12 * s + 2)}px Poppins, system-ui, sans-serif`;
			g.fillStyle = "rgba(220,240,250,.85)";
			g.textAlign = "left";
			g.fillText(`${meters} m`, hx + 12 * s, hookY + 4 * s);
		}
	}
	function draw() {
		g.setTransform(dpr, 0, 0, dpr, 0, 0);
		g.clearRect(0, 0, W, H);
		drawSky();
		drawWater();
		for (const b of bubbles) drawBubble(b);
		for (const f of fish) if (!f.hooked) drawFish(f);
		for (const r of rocks) drawRock(r);
		for (const j of jellies) drawJelly(j);
		for (const sh of sharks) drawShark(sh);
		drawWarnings();
		drawLine();
		drawBoat();
		const amp = 1.8 * s * setup.theme.waves;
		g.strokeStyle = "rgba(210,240,255,.55)";
		g.lineWidth = 1.5 * s;
		g.beginPath();
		for (let x = 0; x <= W; x += 8) {
			const y = geo.surface + Math.sin(x / 22 + clock * 2.2) * amp;
			if (x === 0) g.moveTo(x, y);
			else g.lineTo(x, y);
		}
		g.stroke();
		if (setup.theme.rain) drawRain();
		for (const p of particles) {
			g.globalAlpha = clamp(1 - p.age / p.life, 0, 1);
			g.fillStyle = p.color;
			g.beginPath();
			g.arc(p.x, p.y, p.r, 0, Math.PI * 2);
			g.fill();
		}
		g.globalAlpha = 1;
		g.textAlign = "center";
		for (const p of popups) {
			if (p.age < 0) continue;
			g.globalAlpha = clamp(1.5 - p.age, 0, 1);
			const pop = 1 + Math.max(0, .25 - p.age) * 1.6;
			g.font = `700 ${Math.round((13 * s + 3) * pop * (p.size ?? 1))}px Poppins, system-ui, sans-serif`;
			g.fillStyle = "rgba(4,16,26,.6)";
			g.fillText(p.text, p.x + 1.5, p.y + 1.5);
			g.fillStyle = p.color;
			g.fillText(p.text, p.x, p.y);
		}
		g.globalAlpha = 1;
		if (flash > 0) {
			g.fillStyle = `rgba(255,236,140,${(flash * .16).toFixed(3)})`;
			g.fillRect(0, 0, W, H);
		}
	}
	function frame(now) {
		const dt = Math.min(.05, (now - last) / 1e3 || 0);
		last = now;
		update(dt);
		draw();
		if (running) raf = requestAnimationFrame(frame);
	}
	/** Attract mode behind overlays: the scene moves, the game doesn't. */
	function idle(now) {
		if (running) return;
		const dt = Math.min(.05, (now - last) / 1e3 || 0);
		last = now;
		clock += dt;
		ambient(dt);
		for (const p of particles) p.age += dt;
		for (const p of popups) p.age += dt;
		lightning = Math.max(0, lightning - dt * 3.5);
		draw();
		raf = requestAnimationFrame(idle);
	}
	const localX = (e) => e.clientX - canvas.getBoundingClientRect().left;
	const steerTo = (x) => targetX = x - 46 * s;
	const onMove = (e) => {
		if (e.pointerType === "mouse" || holding) steerTo(localX(e));
	};
	const onDown = (e) => {
		if (!running || e.button > 0) return;
		e.preventDefault();
		canvas.setPointerCapture(e.pointerId);
		steerTo(localX(e));
		holding = true;
	};
	const onUp = () => {
		holding = false;
	};
	const GAME_KEYS = /* @__PURE__ */ new Set([
		"ArrowLeft",
		"ArrowRight",
		"ArrowDown",
		"Space",
		"KeyA",
		"KeyD",
		"KeyS"
	]);
	const onKeyDown = (e) => {
		if (!running || !GAME_KEYS.has(e.code)) return;
		e.preventDefault();
		keys.add(e.code);
	};
	const onKeyUp = (e) => keys.delete(e.code);
	const onBlur = () => {
		keys.clear();
		holding = false;
	};
	canvas.addEventListener("pointermove", onMove);
	canvas.addEventListener("pointerdown", onDown);
	canvas.addEventListener("pointerup", onUp);
	canvas.addEventListener("pointercancel", onUp);
	window.addEventListener("keydown", onKeyDown);
	window.addEventListener("keyup", onKeyUp);
	window.addEventListener("blur", onBlur);
	const ro = new ResizeObserver(resize);
	ro.observe(canvas);
	resize();
	raf = requestAnimationFrame(idle);
	return {
		prepare(stage, kit) {
			running = false;
			cancelAnimationFrame(raf);
			reset(stage, kit);
			emit();
			last = performance.now();
			raf = requestAnimationFrame(idle);
		},
		start() {
			cancelAnimationFrame(raf);
			running = true;
			ended = false;
			last = performance.now();
			emit();
			raf = requestAnimationFrame(frame);
		},
		destroy() {
			running = false;
			cancelAnimationFrame(raf);
			ro.disconnect();
			canvas.removeEventListener("pointermove", onMove);
			canvas.removeEventListener("pointerdown", onDown);
			canvas.removeEventListener("pointerup", onUp);
			canvas.removeEventListener("pointercancel", onUp);
			window.removeEventListener("keydown", onKeyDown);
			window.removeEventListener("keyup", onKeyUp);
			window.removeEventListener("blur", onBlur);
		},
		debug: () => ({
			mode: setup.endless ? "endless" : "level",
			level: setup.level,
			boatX,
			targetX,
			hookX,
			hookY,
			lineState,
			hooked: hooked.length,
			capacity: loadout.capacity,
			lineSpeed: loadout.lineSpeed,
			score,
			timeLeft,
			elapsed: elapsedTime,
			step,
			streak,
			W,
			H,
			surface: geo.surface,
			seabed: geo.seabed,
			tipX: rodTip().x,
			forcedUp,
			shocked: clock < shockUntil,
			frozen: clock < freezeUntil,
			snagged,
			escapes,
			theme: Object.entries(THEMES).find(([, t]) => t === setup.theme)?.[0],
			jellies: jellies.map(jellyPos),
			sharks: sharks.map((sh) => ({
				name: sh.def.name,
				x: sh.x,
				y: sharkY(sh)
			})),
			sharkPasses: passes.map((p) => ({
				at: p.at,
				kind: p.kind
			})),
			goldenAt,
			rocks: rocks.map((r) => ({
				...rockShape(r),
				variant: r.variant
			})),
			bubbles: bubbles.map((b) => ({
				x: b.x,
				y: bubbleY(b),
				value: b.value
			})),
			fish: fish.filter((f) => !f.hooked).map((f) => ({
				key: f.sp.key,
				special: f.special,
				...fishPos(f)
			}))
		}),
		debugColumn: (n) => {
			for (let i = 0; i < n; i++) {
				const f = spawn(SPECIES[0], false);
				f.x = hookX;
				f.depth = .05 + i / n * .6;
				f.speedMul = 0;
				fish.push(f);
			}
		},
		debugHazard: (kind) => {
			const d = depthOf(hookY);
			const ahead = lineState === "up" ? d - .1 : d + .12;
			if (kind === "jelly") jellies.push({
				x: hookX,
				depth: clamp(ahead, 0, .9),
				dir: 1,
				speed: 0,
				phase: 0,
				zapAt: -10
			});
			if (kind === "shark" || kind === "tiger") {
				const def = SHARKS[kind === "tiger" ? "aggressive" : "normal"];
				sharks.push({
					def,
					x: hookX - def.length * s * .8,
					depth: d,
					dir: 1,
					bit: false
				});
			}
			if (kind === "rock") {
				const seed = 42;
				rocks.push({
					xf: hookX / W,
					w: 90,
					hf: .3,
					profile: rockProfile("mound", seed),
					palette: ROCK_PALETTES[0],
					seed,
					variant: "mound"
				});
			}
			if (kind === "bubble") bubbles.push({
				x: hookX,
				depth: clamp(ahead, 0, .95),
				value: loadout.bubbleSeconds,
				born: clock,
				phase: -Math.PI / 2
			});
			if (kind === "golden") goldenAt = elapsedTime;
		},
		debugTime: (seconds) => {
			timeLeft = seconds;
		}
	};
}
var LEVELS = [
	{
		number: 1,
		name: "Águas Calmas",
		story: "O mar está sereno. Desce a linha, recolhe devagar e enche o barco pela primeira vez.",
		seconds: 90,
		target: 250,
		jellyfish: 0,
		sharks: 0,
		sharkKind: "normal",
		rocks: 0,
		fishSpeed: 1,
		theme: "morning",
		goldenFish: false
	},
	{
		number: 2,
		name: "Primeiras Surpresas",
		story: "Alforrecas à deriva. Um toque no anzol e a linha leva um choque — e sobe sozinha.",
		seconds: 80,
		target: 330,
		jellyfish: 3,
		sharks: 0,
		sharkKind: "normal",
		rocks: 0,
		fishSpeed: 1.05,
		theme: "afternoon",
		goldenFish: false
	},
	{
		number: 3,
		name: "Águas Mais Profundas",
		story: "Mais longe da costa, uma sombra enorme patrulha o azul. Se o tubarão apanhar a linha, leva tudo.",
		seconds: 70,
		target: 380,
		jellyfish: 5,
		sharks: 1,
		sharkKind: "normal",
		rocks: 0,
		fishSpeed: 1.1,
		theme: "sunset",
		goldenFish: false
	},
	{
		number: 4,
		name: "Fundos Rochosos",
		story: "O fundo enche-se de pedras de todas as formas. Desce demais e o anzol fica preso.",
		seconds: 65,
		target: 400,
		jellyfish: 6,
		sharks: 2,
		sharkKind: "normal",
		rocks: 4,
		fishSpeed: 1.15,
		theme: "dusk",
		goldenFish: false
	},
	{
		number: 5,
		name: "O Grande Desafio",
		story: "Tempestade. O tubarão-tigre caça de perto e um peixe dourado cruza o mar uma única vez.",
		seconds: 60,
		target: 450,
		jellyfish: 9,
		sharks: 5,
		sharkKind: "aggressive",
		rocks: 7,
		fishSpeed: 1.25,
		theme: "storm",
		goldenFish: true
	}
];
var KEY = "o-pescador:pesca-progress";
var NEW_PROGRESS = {
	coins: 0,
	upgrades: {
		rod: 0,
		hooks: 0,
		bubbleRate: 0,
		bubbleValue: 0
	},
	reserve: 0,
	unlocked: 1,
	endlessUnlocked: false,
	bestAdventure: 0,
	bestEndless: 0
};
function loadProgress() {
	try {
		const raw = JSON.parse(localStorage.getItem(KEY) || "null");
		if (!raw) return structuredClone(NEW_PROGRESS);
		const upgrades = {
			...NEW_PROGRESS.upgrades,
			...raw.upgrades
		};
		for (const key of Object.keys(upgrades)) upgrades[key] = Math.max(0, Math.min(UPGRADES[key].costs.length, Math.floor(Number(upgrades[key]) || 0)));
		return {
			...NEW_PROGRESS,
			...raw,
			coins: Math.max(0, Math.floor(Number(raw.coins) || 0)),
			reserve: Math.max(0, Math.min(RESERVE_BUBBLE.max, Math.floor(Number(raw.reserve) || 0))),
			unlocked: Math.max(1, Math.min(5, Math.floor(Number(raw.unlocked) || 1))),
			upgrades
		};
	} catch {
		return structuredClone(NEW_PROGRESS);
	}
}
function saveProgress(p) {
	try {
		localStorage.setItem(KEY, JSON.stringify(p));
	} catch {}
}
var coinsFor = (points) => Math.floor(points / 10);
/** Price of the next level of an upgrade, or null when maxed. */
function nextCost(p, key) {
	return UPGRADES[key].costs[p.upgrades[key]] ?? null;
}
/** The loadout the engine gets; `useReserve` spends the stored bubbles. */
function loadoutFor(p, useReserve) {
	return {
		lineSpeed: UPGRADES.rod.values[p.upgrades.rod],
		capacity: UPGRADES.hooks.values[p.upgrades.hooks],
		bubbleInterval: UPGRADES.bubbleRate.values[p.upgrades.bubbleRate],
		bubbleSeconds: UPGRADES.bubbleValue.values[p.upgrades.bubbleValue],
		bonusSeconds: useReserve ? p.reserve * RESERVE_BUBBLE.seconds : 0
	};
}
var SEPARATOR_MS = 3200;
var ENDLESS_INTRO_MS = 4200;
var noCatches = () => Object.fromEntries(TALLY_SPECIES.map((sp) => [sp.key, 0]));
var emptyHud = (stage) => ({
	mode: stage.kind === "endless" ? "endless" : "level",
	level: stage.kind === "level" ? stage.level.number : 0,
	score: 0,
	target: stage.kind === "level" ? stage.level.target : null,
	timeLeft: stage.kind === "level" ? stage.level.seconds : ENDLESS.startSeconds,
	elapsed: 0,
	hooked: 0,
	capacity: BASE_LOADOUT.capacity,
	streak: 0,
	multiplier: 1,
	step: 0,
	catches: noCatches()
});
function FishingGamePanel() {
	const canvasRef = (0, import_react.useRef)(null);
	const gameRef = (0, import_react.useRef)(null);
	const [progress, setProgress] = (0, import_react.useState)(NEW_PROGRESS);
	const [stage, setStage] = (0, import_react.useState)({
		kind: "level",
		level: LEVELS[0]
	});
	const [phase, setPhase] = (0, import_react.useState)({ kind: "intro" });
	const [hud, setHud] = (0, import_react.useState)(emptyHud(stage));
	const [total, setTotal] = (0, import_react.useState)(0);
	const [campaignCatches, setCampaignCatches] = (0, import_react.useState)(noCatches);
	const level = stage.kind === "level" ? stage.level : null;
	const levelIndex = level ? level.number - 1 : -1;
	const stageRef = (0, import_react.useRef)(stage);
	stageRef.current = stage;
	const totalRef = (0, import_react.useRef)(total);
	totalRef.current = total;
	/** Update + persist progress. */
	const commit = (change) => setProgress((prev) => {
		const next = change(prev);
		saveProgress(next);
		return next;
	});
	(0, import_react.useEffect)(() => {
		setProgress(loadProgress());
		const canvas = canvasRef.current;
		if (!canvas) return;
		const game = createFishingGame(canvas, {
			onHud: setHud,
			onEnd: (final, outcome) => {
				setHud(final);
				setCampaignCatches((prev) => {
					const next = { ...prev };
					for (const [k, n] of Object.entries(final.catches)) next[k] = (next[k] ?? 0) + n;
					return next;
				});
				const current = stageRef.current;
				if (outcome === "endless-over") {
					const coins = coinsFor(final.score);
					const record = final.score > loadProgress().bestEndless;
					commit((p) => ({
						...p,
						coins: p.coins + coins,
						bestEndless: Math.max(p.bestEndless, final.score)
					}));
					setPhase({
						kind: "endless-over",
						coins,
						record
					});
					return;
				}
				if (current.kind !== "level") return;
				if (outcome === "win") {
					const bonus = final.timeLeft * 5;
					const coins = coinsFor(final.score + bonus);
					const newTotal = totalRef.current + final.score + bonus;
					setTotal(newTotal);
					const n = current.level.number;
					commit((p) => ({
						...p,
						coins: p.coins + coins,
						unlocked: Math.max(p.unlocked, Math.min(LEVELS.length, n + 1)),
						endlessUnlocked: p.endlessUnlocked || n === LEVELS.length,
						bestAdventure: n === LEVELS.length ? Math.max(p.bestAdventure, newTotal) : p.bestAdventure
					}));
					if (n === LEVELS.length) setPhase({
						kind: "endless-intro",
						afterAdventure: true
					});
					else setPhase({
						kind: "won",
						levelScore: final.score,
						bonus,
						coins
					});
				} else {
					const coins = coinsFor(final.score);
					commit((p) => ({
						...p,
						coins: p.coins + coins
					}));
					setPhase({
						kind: "lost",
						coins
					});
				}
			}
		});
		gameRef.current = game;
		return () => game.destroy();
	}, []);
	/** Prepare a stage (spending reserve bubbles) behind its separator. */
	function prepare(next) {
		const kit = loadoutFor(progress, true);
		if (progress.reserve > 0) commit((p) => ({
			...p,
			reserve: 0
		}));
		setStage(next);
		setHud({
			...emptyHud(next),
			capacity: kit.capacity,
			timeLeft: emptyHud(next).timeLeft + kit.bonusSeconds
		});
		gameRef.current?.prepare(next, kit);
	}
	function openLevel(index) {
		prepare({
			kind: "level",
			level: LEVELS[index]
		});
		setPhase({ kind: "separator" });
	}
	function openEndless(afterAdventure) {
		prepare({ kind: "endless" });
		setPhase({
			kind: "endless-intro",
			afterAdventure
		});
	}
	function startStage() {
		setPhase({ kind: "playing" });
		gameRef.current?.start();
		canvasRef.current?.focus();
	}
	function newCampaign(fromIndex) {
		setTotal(0);
		setCampaignCatches(noCatches());
		openLevel(fromIndex);
	}
	(0, import_react.useEffect)(() => {
		if (phase.kind === "separator") {
			const timer = window.setTimeout(startStage, SEPARATOR_MS);
			return () => window.clearTimeout(timer);
		}
		if (phase.kind === "endless-intro") {
			if (phase.afterAdventure && stage.kind !== "endless") prepare({ kind: "endless" });
			const timer = window.setTimeout(startStage, ENDLESS_INTRO_MS);
			return () => window.clearTimeout(timer);
		}
	}, [phase]);
	function buy(key) {
		const cost = nextCost(progress, key);
		if (cost === null || progress.coins < cost) return;
		commit((p) => ({
			...p,
			coins: p.coins - cost,
			upgrades: {
				...p.upgrades,
				[key]: p.upgrades[key] + 1
			}
		}));
	}
	function buyReserve() {
		if (progress.coins < RESERVE_BUBBLE.cost || progress.reserve >= RESERVE_BUBBLE.max) return;
		commit((p) => ({
			...p,
			coins: p.coins - RESERVE_BUBBLE.cost,
			reserve: p.reserve + 1
		}));
	}
	const openShop = () => setPhase({
		kind: "shop",
		back: phase
	});
	const shownCatches = phase.kind === "playing" ? Object.fromEntries(TALLY_SPECIES.map((sp) => [sp.key, (campaignCatches[sp.key] ?? 0) + (hud.catches[sp.key] ?? 0)])) : campaignCatches;
	const speciesFound = TALLY_SPECIES.filter((sp) => shownCatches[sp.key] > 0).length;
	const full = hud.hooked >= hud.capacity;
	const progressToTarget = hud.target ? Math.min(1, hud.score / hud.target) : 0;
	const prevLevel = levelIndex > 0 ? LEVELS[levelIndex - 1] : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
				ref: canvasRef,
				tabIndex: 0,
				"aria-label": "Área de jogo: move o barco e segura para descer a linha",
				className: "block h-[min(72vh,620px)] min-h-[440px] w-full touch-none select-none outline-none",
				onContextMenu: (e) => e.preventDefault()
			}),
			phase.kind === "playing" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-2 sm:p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-1.5 sm:gap-2",
					children: [
						hud.mode === "level" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HudChip, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, {
								className: "size-4 text-primary",
								"aria-hidden": true
							}),
							label: "Nível",
							value: hud.level
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HudChip, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Infinity$1, {
								className: "size-4 text-primary",
								"aria-hidden": true
							}),
							label: "Dificuldade",
							value: hud.step + 1
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex min-w-28 flex-col justify-center gap-1 rounded-xl border border-line bg-bg/70 px-2.5 py-1.5 backdrop-blur sm:min-w-36 sm:px-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, {
										className: "size-4 text-amber-300",
										"aria-hidden": true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
										className: "tabular-nums",
										children: hud.score
									}),
									hud.target !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs text-muted",
										children: ["/ ", hud.target]
									})
								]
							}), hud.target !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-1.5 overflow-hidden rounded-full bg-bg",
								"aria-hidden": true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full rounded-full bg-amber-300 transition-[width] duration-300",
									style: { width: `${progressToTarget * 100}%` }
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HudChip, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, {
								className: "size-4 text-primary",
								"aria-hidden": true
							}),
							label: "Tempo",
							value: `${hud.timeLeft}s`,
							warn: hud.timeLeft <= 10
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HudChip, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, {
								className: `size-4 ${hud.multiplier > 1 ? "text-amber-300" : "text-muted"}`,
								"aria-hidden": true
							}),
							label: "Combo",
							value: hud.multiplier > 1 ? `${hud.streak} · ×${hud.multiplier.toFixed(1)}` : hud.streak,
							hot: hud.multiplier > 1
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HudChip, {
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Anchor, {
						className: `size-4 ${full ? "text-danger" : "text-primary"}`,
						"aria-hidden": true
					}),
					label: "Anzol",
					value: `${hud.hooked}/${hud.capacity}`,
					warn: full
				})]
			}),
			phase.kind === "separator" && level && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: startStage,
				"aria-label": `Nível ${level.number}: ${level.name}. Toque para começar.`,
				className: "absolute inset-0 grid cursor-pointer place-items-center overflow-y-auto bg-bg/70 p-4 backdrop-blur-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "animate-in fade-in zoom-in-95 text-center duration-500",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold uppercase tracking-[0.4em] text-primary",
							children: "Nível"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-8xl font-bold leading-none tabular-nums sm:text-9xl",
							children: level.number
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-3 text-2xl font-semibold italic sm:text-3xl",
							children: level.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto my-4 h-px w-16 bg-primary/50" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mx-auto max-w-sm text-sm leading-relaxed text-muted",
							children: level.story
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mx-auto mt-5 flex max-w-md flex-wrap justify-center gap-2 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tag, {
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, {
										className: "size-3.5",
										"aria-hidden": true
									}),
									children: [level.target, " pts"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tag, {
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, {
										className: "size-3.5",
										"aria-hidden": true
									}),
									children: [
										level.seconds,
										" s",
										hud.timeLeft > level.seconds ? ` +${hud.timeLeft - level.seconds} s` : ""
									]
								}),
								level.jellyfish > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tag, {
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, {
										className: "size-3.5",
										"aria-hidden": true
									}),
									fresh: prevLevel?.jellyfish === 0,
									children: ["Alforrecas ×", level.jellyfish]
								}),
								level.sharks > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tag, {
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Waves, {
										className: "size-3.5",
										"aria-hidden": true
									}),
									fresh: prevLevel?.sharks === 0 || level.sharkKind === "aggressive" && prevLevel?.sharkKind !== "aggressive",
									children: [
										level.sharkKind === "aggressive" ? "Tubarão-tigre" : "Tubarão",
										" ×",
										level.sharks
									]
								}),
								level.rocks > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tag, {
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mountain, {
										className: "size-3.5",
										"aria-hidden": true
									}),
									fresh: prevLevel?.rocks === 0,
									children: ["Pedras ×", level.rocks]
								}),
								level.theme === "storm" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudRain, {
										className: "size-3.5",
										"aria-hidden": true
									}),
									children: "Tempestade"
								}),
								level.goldenFish && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
										className: "size-3.5",
										"aria-hidden": true
									}),
									fresh: true,
									children: "Peixe Dourado"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-6 text-xs text-faint",
							children: "Toque para começar"
						})
					]
				}, level.number)
			}),
			phase.kind === "endless-intro" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: startStage,
				"aria-label": "Modo Infinito. Toque para começar.",
				className: "absolute inset-0 grid cursor-pointer place-items-center bg-bg/75 p-4 backdrop-blur-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "animate-in fade-in zoom-in-95 text-center duration-500",
					children: [
						phase.afterAdventure && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mb-4 text-sm font-medium text-amber-300",
							children: [
								"Aventura concluída · ",
								total,
								" pontos"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold uppercase tracking-[0.4em] text-primary",
							children: "Modo"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Infinity$1, {
							className: "mx-auto mt-2 size-24 text-fg sm:size-28",
							strokeWidth: 1.6,
							"aria-hidden": true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 text-2xl font-semibold italic sm:text-3xl",
							children: "Infinito"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto my-4 h-px w-16 bg-primary/50" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mx-auto max-w-sm text-sm leading-relaxed text-muted",
							children: [
								"A noite cai sobre o mar. Sobrevive o máximo que conseguires: a dificuldade sobe a cada ",
								ENDLESS.rampEvery,
								" s e só as bolhas de tempo prolongam a run."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 flex flex-wrap justify-center gap-2 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tag, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, {
									className: "size-3.5",
									"aria-hidden": true
								}),
								children: [hud.timeLeft, " s iniciais"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tag, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, {
									className: "size-3.5",
									"aria-hidden": true
								}),
								children: ["Recorde ", progress.bestEndless]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-6 text-xs text-faint",
							children: "Toque para começar"
						})
					]
				})
			}),
			phase.kind === "shop" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 overflow-y-auto bg-bg/80 p-3 backdrop-blur-sm sm:p-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shop, {
					progress,
					onBuy: buy,
					onBuyReserve: buyReserve,
					onClose: () => setPhase(phase.back)
				})
			}),
			(phase.kind === "intro" || phase.kind === "won" || phase.kind === "lost" || phase.kind === "endless-over") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 grid place-items-center overflow-y-auto bg-bg/55 p-4 backdrop-blur-[2px]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-md rounded-2xl border border-line bg-surface/95 p-6 text-center shadow-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CoinBalance, { coins: progress.coins }),
						phase.kind === "intro" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-2xl font-semibold",
								children: "Pesca Interativa"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-sm leading-relaxed text-muted",
								children: [
									"Uma aventura em ",
									LEVELS.length,
									" níveis, das águas calmas à tempestade. Atinge a pontuação-alvo antes de o tempo acabar e troca pontos por coins (",
									10,
									" pts = 1 coin)."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "mt-4 grid gap-2 text-left text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Help, {
										keys: "Rato / dedo",
										text: "mover o barco"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Help, {
										keys: "Segurar",
										text: "descer a linha"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Help, {
										keys: "Largar",
										text: "recolher e apanhar o que a linha atravessa"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Help, {
										keys: "Bolhas",
										text: "toca-lhes com o anzol para ganhar tempo"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryAction, {
								onClick: () => newCampaign(0),
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
									className: "size-5",
									"aria-hidden": true
								}),
								children: "Começar aventura"
							}),
							progress.unlocked > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SecondaryAction, {
								onClick: () => newCampaign(progress.unlocked - 1),
								children: [
									"Continuar no Nível ",
									progress.unlocked,
									" · ",
									LEVELS[progress.unlocked - 1].name
								]
							}),
							progress.endlessUnlocked && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SecondaryAction, {
								onClick: () => openEndless(false),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Infinity$1, {
										className: "mr-2 size-4",
										"aria-hidden": true
									}),
									" Modo Infinito · recorde ",
									progress.bestEndless
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SecondaryAction, {
								onClick: openShop,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, {
									className: "mr-2 size-4",
									"aria-hidden": true
								}), " Loja"]
							})
						] }),
						phase.kind === "won" && level && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm font-medium uppercase tracking-wider text-primary",
								children: [
									"Nível ",
									level.number,
									" concluído"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-5xl font-bold text-amber-300",
								children: phase.levelScore
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-sm text-muted",
								children: [
									"Bónus de tempo +",
									phase.bonus,
									" · Total ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
										className: "text-fg",
										children: total
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CoinsEarned, { coins: phase.coins }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PrimaryAction, {
								onClick: () => openLevel(levelIndex + 1),
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
									className: "size-5",
									"aria-hidden": true
								}),
								children: [
									"Nível ",
									level.number + 1,
									" · ",
									LEVELS[levelIndex + 1]?.name
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SecondaryAction, {
								onClick: openShop,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, {
									className: "mr-2 size-4",
									"aria-hidden": true
								}), " Loja de upgrades"]
							})
						] }),
						phase.kind === "lost" && level && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium uppercase tracking-wider text-danger",
								children: "Tempo esgotado"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-5xl font-bold",
								children: [hud.score, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-2xl text-muted",
									children: [" / ", level.target]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-sm text-muted",
								children: [
									"Faltaram ",
									Math.max(0, level.target - hud.score),
									" pontos para passar o Nível ",
									level.number,
									"."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CoinsEarned, { coins: phase.coins }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PrimaryAction, {
								onClick: () => openLevel(levelIndex),
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, {
									className: "size-5",
									"aria-hidden": true
								}),
								children: ["Repetir o Nível ", level.number]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SecondaryAction, {
								onClick: openShop,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, {
									className: "mr-2 size-4",
									"aria-hidden": true
								}), " Loja de upgrades"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SecondaryAction, {
								onClick: () => setPhase({ kind: "intro" }),
								children: "Menu"
							})
						] }),
						phase.kind === "endless-over" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium uppercase tracking-wider text-primary",
								children: "Fim da run infinita"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-5xl font-bold text-amber-300",
								children: hud.score
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-sm text-muted",
								children: [
									phase.record ? "Novo recorde!" : `Recorde: ${progress.bestEndless}`,
									" · sobreviveste ",
									hud.elapsed,
									" s · dificuldade ",
									hud.step + 1
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CoinsEarned, { coins: phase.coins }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryAction, {
								onClick: () => openEndless(false),
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, {
									className: "size-5",
									"aria-hidden": true
								}),
								children: "Nova run infinita"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SecondaryAction, {
								onClick: openShop,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, {
									className: "mr-2 size-4",
									"aria-hidden": true
								}), " Loja de upgrades"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SecondaryAction, {
								onClick: () => setPhase({ kind: "intro" }),
								children: "Menu"
							})
						] })
					]
				})
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-6",
		"aria-labelledby": "pesca-especies",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 flex flex-wrap items-baseline justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				id: "pesca-especies",
				className: "text-lg font-semibold",
				children: "Espécies da aventura"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-sm text-muted",
				children: [
					speciesFound,
					"/",
					TALLY_SPECIES.length,
					" apanhadas · recorde aventura ",
					progress.bestAdventure,
					" · infinito ",
					progress.bestEndless
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5",
			children: TALLY_SPECIES.map((sp) => {
				const n = shownCatches[sp.key] ?? 0;
				const golden = sp.key === "dourado";
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: `flex items-center gap-3 rounded-xl border p-3 transition-colors ${n ? golden ? "border-amber-300/60 bg-amber-300/10" : "border-primary/40 bg-surface" : "border-line bg-surface/50"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpeciesIcon, {
						sp,
						dim: !n
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: `truncate text-sm font-semibold ${n ? "" : "text-muted"}`,
							children: golden && !n ? "???" : sp.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted",
							children: [
								sp.points,
								" pts",
								n ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", {
									className: "ml-1.5 text-primary",
									children: ["×", n]
								}) : null
							]
						})]
					})]
				}, sp.key);
			})
		})]
	})] });
}
function Shop({ progress, onBuy, onBuyReserve, onClose }) {
	const reserveFull = progress.reserve >= RESERVE_BUBBLE.max;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-2xl rounded-2xl border border-line bg-surface/95 p-4 shadow-2xl sm:p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "flex items-center gap-2 text-xl font-semibold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, {
						className: "size-5 text-primary",
						"aria-hidden": true
					}), " Loja de upgrades"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1.5 rounded-full border border-amber-300/50 bg-amber-300/10 px-3 py-1 text-sm font-semibold text-amber-200",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, {
							className: "size-4",
							"aria-hidden": true
						}),
						" ",
						progress.coins
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "grid gap-3 sm:grid-cols-2",
				children: [Object.keys(UPGRADES).map((key) => {
					const def = UPGRADES[key];
					const lvl = progress.upgrades[key];
					const cost = def.costs[lvl] ?? null;
					const max = cost === null;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex flex-col rounded-xl border border-line bg-bg/50 p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-semibold",
									children: def.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs leading-relaxed text-muted",
									children: def.description
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex shrink-0 gap-1 pt-1",
									"aria-label": `Nível ${lvl} de ${def.costs.length}`,
									children: def.costs.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-2 w-4 rounded-full ${i < lvl ? "bg-primary" : "bg-surface-2"}` }, i))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-3 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted",
										children: "Agora:"
									}),
									" ",
									def.format(def.values[lvl]),
									!max && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted",
											children: "Próximo:"
										}),
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
											className: "text-primary",
											children: def.format(def.values[lvl + 1])
										})
									] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BuyButton, {
								cost,
								coins: progress.coins,
								onClick: () => onBuy(key),
								maxedLabel: "Nível máximo"
							})
						]
					}, key);
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex flex-col rounded-xl border border-line bg-bg/50 p-4 sm:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold",
							children: "Bolha de reserva"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs leading-relaxed text-muted",
							children: [
								"+",
								RESERVE_BUBBLE.seconds,
								" s no início do próximo nível ou run. Acumula até ",
								RESERVE_BUBBLE.max,
								"."
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "shrink-0 rounded-full border border-primary/40 px-2.5 py-1 text-xs font-semibold text-primary",
							children: [
								progress.reserve,
								"/",
								RESERVE_BUBBLE.max
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BuyButton, {
						cost: reserveFull ? null : RESERVE_BUBBLE.cost,
						coins: progress.coins,
						onClick: onBuyReserve,
						maxedLabel: "Reserva cheia"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onClose,
				className: "mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-line px-4 text-sm font-medium text-muted transition-colors hover:border-primary/50 hover:text-fg",
				children: "Voltar"
			})
		]
	});
}
function BuyButton({ cost, coins, onClick, maxedLabel }) {
	if (cost === null) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-3 inline-flex min-h-10 items-center justify-center rounded-lg bg-surface-2/60 text-xs font-medium text-muted",
		children: maxedLabel
	});
	const short = coins < cost;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		disabled: short,
		onClick,
		className: "mt-3 inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg bg-amber-300 px-3 text-sm font-semibold text-primary-fg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-muted",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, {
				className: "size-4",
				"aria-hidden": true
			}),
			" ",
			cost,
			" ",
			short && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "font-normal",
				children: ["· faltam ", cost - coins]
			})
		]
	});
}
function CoinBalance({ coins }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mb-3 flex justify-end",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "inline-flex items-center gap-1.5 rounded-full border border-amber-300/50 bg-amber-300/10 px-3 py-1 text-xs font-semibold text-amber-200",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, {
					className: "size-3.5",
					"aria-hidden": true
				}),
				" ",
				coins
			]
		})
	});
}
function CoinsEarned({ coins }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-300/10 px-3 py-1 text-sm font-semibold text-amber-200",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, {
				className: "size-4",
				"aria-hidden": true
			}),
			" +",
			coins,
			" coins"
		]
	});
}
function PrimaryAction({ onClick, icon, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: "mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-base font-semibold text-primary-fg shadow-[0_0_20px_rgb(40_185_255/0.3)] transition-opacity hover:opacity-90",
		children: [icon, children]
	});
}
function SecondaryAction({ onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: "mt-2 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-line px-4 text-sm font-medium text-muted transition-colors hover:border-primary/50 hover:text-fg",
		children
	});
}
function Tag({ icon, fresh, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: `inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-medium ${fresh ? "border-amber-300/70 bg-amber-300/10 text-amber-200" : "border-line bg-bg/60 text-fg/80"}`,
		children: [
			icon,
			children,
			fresh && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[0.65rem] font-bold uppercase tracking-wider",
				children: "Novo"
			})
		]
	});
}
function HudChip({ icon, label, value, warn, hot }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 backdrop-blur sm:gap-2 sm:px-3 sm:py-2 ${warn ? "border-danger/60 bg-danger/15" : hot ? "border-amber-300/60 bg-amber-300/10" : "border-line bg-bg/70"}`,
		children: [
			icon,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only text-xs text-muted sm:not-sr-only",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
				className: "text-sm tabular-nums sm:text-base",
				children: value
			})
		]
	});
}
function Help({ keys, text }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "flex items-center gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
			className: "min-w-28 rounded-lg border border-line bg-bg px-2 py-1 text-center font-sans text-xs font-semibold text-fg",
			children: keys
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted",
			children: text
		})]
	});
}
/** The species drawn by the game's own renderer, as a small static icon. */
function SpeciesIcon({ sp, dim }) {
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const canvas = ref.current;
		const ctx = canvas?.getContext("2d");
		if (!canvas || !ctx) return;
		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		const size = 44;
		canvas.width = size * dpr;
		canvas.height = size * dpr;
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		ctx.clearRect(0, 0, size, size);
		const fit = Math.min(34 / sp.length, 30 / sp.height, 1.1);
		ctx.translate(size / 2 + (sp.kind === "fish" ? 2 : 0), size / 2 + (sp.kind === "octopus" ? -4 : 0));
		drawCreature(ctx, sp, fit, .4);
	}, [sp]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
		ref,
		"aria-hidden": true,
		className: `size-11 shrink-0 rounded-lg bg-[#0f5476]/60 ${dim ? "opacity-40 grayscale" : ""}`
	});
}
function PescaPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, {
		title: "Pesca Interativa",
		subtitle: "Aventura em 5 níveis, das Águas Calmas à tempestade, seguida do Modo Infinito. Ganha coins, melhora a vara e os anzóis e apanha bolhas de tempo.",
		back: "admin",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FishingGamePanel, {})
	});
}
//#endregion
export { PescaPage as component };
