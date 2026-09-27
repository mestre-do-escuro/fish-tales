// Pesca Interativa: the canvas game loop (no React, no image assets).
// Move the boat horizontally; hold to lower the line; release to reel it up.
// Only a rising hook catches fish (up to the loadout's capacity per cast);
// they score when the hook reaches the boat. Hazards (see config.ts):
//   - jellyfish: a shock forces the line back up and one hooked fish escapes;
//   - sharks: contact steals every hooked fish (the aggressive one hunts the hook);
//   - rocks: a hook that hits one snags, then is forced back up.
// Every hazard also resets the combo. Time bubbles in the water add seconds.
import {
  BITE_SECONDS,
  BUBBLES,
  comboMultiplier,
  ENDLESS,
  GOLDEN,
  HAUL_BONUS_PER_EXTRA_FISH,
  LINE,
  ROCK_PALETTES,
  ROCK_VARIANTS,
  SHARK_WARNING,
  SHARKS,
  SHOCK_SECONDS,
  SNAG_SECONDS,
  THEMES,
  UPGRADES,
  type RockVariant,
  type SharkDef,
  type SharkKind,
  type Theme,
} from "./config";
import type { LevelConfig } from "./levels";
import { drawCreature, GOLDEN_FISH, SPECIES, type Species } from "./species";

/** What the player brings into a stage, from shop upgrades. */
export interface Loadout {
  lineSpeed: number;
  capacity: number;
  bubbleInterval: number;
  bubbleSeconds: number;
  /** Seconds from reserve bubbles, added at the start. */
  bonusSeconds: number;
}

export const BASE_LOADOUT: Loadout = {
  lineSpeed: UPGRADES.rod.values[0],
  capacity: UPGRADES.hooks.values[0],
  bubbleInterval: UPGRADES.bubbleRate.values[0],
  bubbleSeconds: UPGRADES.bubbleValue.values[0],
  bonusSeconds: 0,
};

export type Stage = { kind: "level"; level: LevelConfig } | { kind: "endless" };

export interface Hud {
  mode: "level" | "endless";
  level: number;
  score: number;
  /** null in endless mode. */
  target: number | null;
  timeLeft: number;
  elapsed: number;
  hooked: number;
  capacity: number;
  /** Fish landed in a row without a penalty, and the points multiplier it gives. */
  streak: number;
  multiplier: number;
  /** Endless difficulty step (0 in levels). */
  step: number;
  catches: Record<string, number>;
}

export type Outcome = "win" | "timeout" | "endless-over";

export interface GameEvents {
  onHud: (hud: Hud) => void;
  onEnd: (hud: Hud, outcome: Outcome) => void;
}

export interface FishingGame {
  /** Set up a stage's scene behind the separator screen. */
  prepare: (stage: Stage, loadout: Loadout) => void;
  start: () => void;
  destroy: () => void;
}

interface Fish {
  sp: Species;
  x: number;
  depth: number; // fraction of the water column
  dir: 1 | -1;
  speedMul: number;
  phase: number;
  hooked: boolean;
  /** A fish that just escaped can't be re-hooked until then. */
  freeUntil: number;
  /** The golden fish: crosses once, darts between depths. */
  special: boolean;
  targetDepth: number;
  nextDart: number;
}
interface Jelly { x: number; depth: number; dir: 1 | -1; speed: number; phase: number; zapAt: number }
interface Shark { def: SharkDef; x: number; depth: number; dir: 1 | -1; bit: boolean }
interface SharkPass { at: number; depth: number; dir: 1 | -1; kind: SharkKind; launched: boolean }
/** Positions as fractions so rocks survive resizes; `profile` = heights (0..1) across the width. */
interface Rock { xf: number; w: number; hf: number; profile: number[]; palette: [string, string]; seed: number; variant: RockVariant }
interface Bubble { x: number; depth: number; value: number; born: number; phase: number }
interface Popup { x: number; y: number; text: string; color: string; age: number; size?: number }
interface Particle { x: number; y: number; vx: number; vy: number; age: number; life: number; r: number; color: string }

interface Setup {
  endless: boolean;
  level: number;
  seconds: number;
  target: number | null;
  jellyfish: number;
  sharks: number;
  sharkKind: SharkKind;
  rocks: number;
  fishSpeed: number;
  theme: Theme;
  golden: boolean;
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const rand = (lo: number, hi: number) => lo + Math.random() * (hi - lo);
const damp = (from: number, to: number, rate: number, dt: number) => from + (to - from) * (1 - Math.exp(-rate * dt));
const side = (): 1 | -1 => (Math.random() < 0.5 ? 1 : -1);
const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];

/** Deterministic noise for rock shapes (same shape on every redraw). */
function seeded(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

const ROCK_SAMPLES = 24;
function rockProfile(variant: RockVariant, seed: number): number[] {
  const rnd = seeded(seed);
  const bump = (u: number, c: number, w: number) => Math.sqrt(Math.max(0, 1 - ((u - c) / w) ** 2));
  const noise = Array.from({ length: ROCK_SAMPLES + 1 }, () => rnd());
  return noise.map((n, i) => {
    const u = (i / ROCK_SAMPLES) * 2 - 1;
    const a = Math.abs(u);
    switch (variant) {
      case "mound":
        return bump(u, 0, 1) * (0.93 + n * 0.07);
      case "pillar":
        return a < 0.55 ? 1 - 0.18 * a * a - n * 0.05 : Math.max(0, ((1 - a) / 0.45) * 0.85);
      case "slab":
        return Math.min(1, (1 - a) * 4) * (0.88 + n * 0.12);
      case "jagged":
        return bump(u, 0, 1) * (0.55 + n * 0.45);
      case "twin":
        return Math.max(bump(u, -0.45, 0.55), 0.75 * bump(u, 0.45, 0.5)) * (0.92 + n * 0.08);
    }
  });
}

export function createFishingGame(canvas: HTMLCanvasElement, events: GameEvents): FishingGame {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D indisponível.");
  const g = ctx;

  let W = 0;
  let H = 0;
  let dpr = 1;
  let s = 1; // world scale
  const geo = { surface: 0, seabed: 0 };

  let setup: Setup = setupFor({ kind: "endless" });
  let loadout: Loadout = BASE_LOADOUT;
  let running = false;
  let ended = false;
  let raf = 0;
  let last = 0;
  let clock = 0;

  // Boat / rod / hook
  let boatX = 0;
  let targetX = 0;
  let hookX = 0;
  let hookY = 0;
  let lineState: "idle" | "down" | "up" = "idle";
  let holding = false;
  let hooked: Fish[] = [];
  // Hazard effects
  let boatLockUntil = 0;
  let freezeUntil = 0; // line doesn't move (snag, bite)
  let shockUntil = 0; // crackling line that can't catch
  let immuneUntil = 0;
  let forcedUp = false;
  let snagged = false;
  let flash = 0;
  let lightning = 0;
  let nextLightning = 0;
  let bolt: [number, number][] = [];
  // Round
  let score = 0;
  let timeLeft = 0;
  let elapsedTime = 0;
  let lastSecond = 0;
  let streak = 0;
  let step = 0;
  let speedNow = 1;
  let goldenAt = Infinity;
  let nextBubbleAt = 0;
  let escapes = 0; // QA counter
  const catches: Record<string, number> = {};
  // World
  let fish: Fish[] = [];
  let jellies: Jelly[] = [];
  let rocks: Rock[] = [];
  let sharks: Shark[] = [];
  let passes: SharkPass[] = [];
  let bubbles: Bubble[] = [];
  const respawns: { sp: Species; at: number }[] = [];
  const popups: Popup[] = [];
  const particles: Particle[] = [];
  const keys = new Set<string>();

  const rodTip = () => ({ x: boatX + 46 * s, y: geo.surface - 58 * s });
  const restY = () => geo.surface - 16 * s;
  const column = () => geo.seabed - geo.surface - 26 * s;
  const depthY = (d: number) => geo.surface + 18 * s + d * column();
  const depthOf = (y: number) => clamp((y - geo.surface - 18 * s) / column(), 0, 1);

  function setupFor(stage: Stage): Setup {
    if (stage.kind === "endless") {
      return {
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
        golden: false,
      };
    }
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
      golden: l.goldenFish,
    };
  }

  function hud(): Hud {
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
      catches: { ...catches },
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
    s = clamp(Math.min(W / 900, H / 560), 0.55, 1.25);
    geo.surface = H * 0.24;
    geo.seabed = H - 16 * s;
    boatX = clamp(boatX || W * 0.4, 30 * s, W - 70 * s);
    targetX = clamp(targetX || boatX, 30 * s, W - 70 * s);
    if (lineState === "idle") {
      hookX = rodTip().x;
      hookY = restY();
    }
    if (!running) draw();
  }

  // --- rocks ---------------------------------------------------------------
  function rockShape(r: Rock) {
    return { cx: r.xf * W, hw: (r.w * s) / 2, top: geo.seabed - r.hf * (geo.seabed - geo.surface) };
  }
  /** Top of the rock at x, or null when x isn't over solid rock. */
  function rockTopAt(r: Rock, x: number) {
    const { cx, hw, top } = rockShape(r);
    const u = (x - cx) / hw;
    if (Math.abs(u) >= 1) return null;
    const f = ((u + 1) / 2) * ROCK_SAMPLES;
    const i = Math.min(ROCK_SAMPLES - 1, Math.floor(f));
    const h = r.profile[i] + (r.profile[i + 1] - r.profile[i]) * (f - i);
    if (h < 0.03) return null;
    return geo.seabed - h * (geo.seabed - top);
  }
  function makeRocks(wanted: number): Rock[] {
    // Narrow screens get fewer rocks so the seabed stays reachable (at most one per ~130 px).
    const n = Math.min(wanted, Math.max(2, Math.floor(W / 130)));
    const variants = Object.keys(ROCK_VARIANTS) as RockVariant[];
    // Shuffle so each level shows a mix of shapes.
    const order = [...variants].sort(() => Math.random() - 0.5);
    const slot = 0.9 / Math.max(1, n);
    return Array.from({ length: wanted > 0 ? n : 0 }, (_, i) => {
      const variant = order[i % order.length];
      const def = ROCK_VARIANTS[variant];
      const seed = Math.floor(rand(1, 1e9));
      return {
        xf: 0.05 + slot * (i + rand(0.3, 0.7)),
        w: rand(...def.w),
        hf: rand(...def.h),
        profile: rockProfile(variant, seed),
        palette: pick(ROCK_PALETTES),
        seed,
        variant,
      };
    });
  }

  // --- setup ---------------------------------------------------------------
  function spawn(sp: Species, fromEdge: boolean): Fish {
    const dir = side();
    return {
      sp,
      dir,
      x: fromEdge ? (dir === 1 ? -60 * s : W + 60 * s) : rand(0, W),
      depth: rand(sp.band[0], sp.band[1]),
      speedMul: rand(0.8, 1.2),
      phase: rand(0, Math.PI * 2),
      hooked: false,
      freeUntil: 0,
      special: false,
      targetDepth: 0,
      nextDart: 0,
    };
  }
  function makeJelly(i: number, n: number): Jelly {
    return { x: ((i + rand(0.2, 0.8)) / n) * W, depth: rand(0.12, 0.78), dir: side(), speed: rand(10, 24), phase: rand(0, Math.PI * 2), zapAt: -10 };
  }
  function schedulePass(at: number, kind: SharkKind): SharkPass {
    return { at, depth: rand(0.22, 0.72), dir: side(), kind, launched: false };
  }
  function endlessSharkInterval() {
    return Math.max(ENDLESS.sharkIntervalMin, ENDLESS.sharkIntervalStart - step * ENDLESS.sharkIntervalStep) * rand(0.8, 1.2);
  }

  function reset(stage: Stage, kit: Loadout) {
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
    passes = setup.endless
      ? [schedulePass(endlessSharkInterval(), "normal")]
      : Array.from({ length: setup.sharks }, (_, i) =>
          schedulePass(Math.max(5, (setup.seconds * (i + 0.5)) / (setup.sharks + 0.2) + rand(-1.5, 1.5)), setup.sharkKind),
        );
    goldenAt = setup.golden ? setup.seconds * rand(...GOLDEN.appearsBetween) : Infinity;
    nextBubbleAt = loadout.bubbleInterval * rand(0.5, 0.8);
    hookX = rodTip().x;
    hookY = restY();
    ended = false;
    if (loadout.bonusSeconds > 0) say(`+${loadout.bonusSeconds}s de reserva`, "#7fe9ff", W / 2, geo.surface + 40 * s, 1.2);
  }

  // --- effects -------------------------------------------------------------
  function splash(x: number, y: number, n: number, color = "rgba(220,245,255,.9)", speed = 1) {
    for (let i = 0; i < n; i++) {
      particles.push({ x, y, vx: rand(-80, 80) * s * speed, vy: rand(-190, -60) * s * speed, age: 0, life: rand(0.4, 0.8), r: rand(1.2, 3) * s, color });
    }
  }
  function say(text: string, color: string, x = hookX + 14 * s, y = hookY - 10 * s, size = 1) {
    popups.push({ x, y, text, color, age: 0, size });
  }
  /** Any hazard breaks the combo. */
  function penalty() {
    if (streak > 0) say("Combo perdido", "#ff9d9d", hookX + 14 * s, hookY + 14 * s);
    streak = 0;
  }

  function fishPos(f: Fish) {
    const y = depthY(f.depth) + Math.sin(clock * 1.6 + f.phase) * (f.sp.kind === "flat" ? 1 : 6) * s;
    return { x: f.x, y };
  }
  function jellyPos(j: Jelly) {
    return { x: j.x, y: depthY(j.depth) + Math.sin(clock * 1.2 + j.phase) * 10 * s };
  }
  const sharkY = (sh: Shark) => depthY(sh.depth) + Math.sin(clock * 2 + sh.x / 90) * 4 * s;
  const bubbleY = (b: Bubble) => depthY(b.depth);

  /** A hooked fish slips off, drops below the hook and darts away. */
  function release(f: Fish) {
    f.hooked = false;
    f.x = hookX;
    f.depth = clamp(depthOf(hookY) + 0.1, 0, 1);
    f.dir = side();
    f.speedMul *= 1.8;
    f.freeUntil = clock + 1.5;
    escapes++;
  }

  function finish(outcome: Outcome) {
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
        age: -i * 0.08,
        size: f.special ? 1.4 : 1,
      });
      if (!f.special) respawns.push({ sp: f.sp, at: clock + f.sp.respawn * rand(0.8, 1.3) });
    });
    const haul = (hooked.length - 1) * HAUL_BONUS_PER_EXTRA_FISH;
    if (haul > 0) popups.push({ x: tip.x + 34 * s, y: tip.y + 10 * s, text: `Lanço ×${hooked.length} +${haul}`, color: "#9ee7ff", age: -0.2 });
    const mult = comboMultiplier(streak);
    const gained = Math.round((base + haul) * mult);
    if (mult > 1) popups.push({ x: tip.x + 34 * s, y: tip.y - 12 * s, text: `Combo ×${mult.toFixed(1)}`, color: "#f5b331", age: -0.3 });
    streak += hooked.length;
    if (comboMultiplier(streak) > mult) say(`Combo ×${comboMultiplier(streak).toFixed(1)}!`, "#f5b331", tip.x, tip.y - 60 * s, 1.3);
    score += gained;
    fish = fish.filter((f) => !f.hooked);
    hooked = [];
    splash(hookX, geo.surface, 14);
    emit();
    if (setup.target !== null && score >= setup.target) finish("win");
  }

  // --- simulation ----------------------------------------------------------
  /** Things that move even behind the separator / result screens. */
  function ambient(dt: number) {
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
    // The golden fish crosses once and is gone.
    fish = fish.filter((f) => !f.special || f.hooked || (f.x > -120 * s && f.x < W + 120 * s));
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

  function update(dt: number) {
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

    // Input -> actions
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

    // Line
    if (!frozen) {
      if (lowering) {
        if (lineState === "idle") splash(hookX, geo.surface, 6);
        lineState = "down";
      } else if (lineState === "down") {
        lineState = "up";
      }
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
            splash(hookX, top, 8, "rgba(200,190,170,.8)", 0.6);
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

    // Jellyfish: shock, the line is forced up, one hooked fish escapes.
    if (inWater && clock >= immuneUntil) {
      for (const j of jellies) {
        const p = jellyPos(j);
        if (Math.abs(hookX - p.x) < 17 * s && hookY > p.y - 15 * s && hookY < p.y + 38 * s) {
          j.zapAt = clock;
          shockUntil = clock + SHOCK_SECONDS;
          boatLockUntil = clock + SHOCK_SECONDS;
          immuneUntil = clock + SHOCK_SECONDS + 1.3;
          forcedUp = true;
          lineState = "up";
          flash = 1;
          splash(hookX, hookY, 10, "rgba(255,236,120,.95)", 0.8);
          const lost = hooked.pop();
          if (lost) {
            release(lost);
            say(`Choque! −${lost.sp.name}`, "#ffe36e");
          } else {
            say("Choque!", "#ffe36e");
          }
          penalty();
          emit();
          break;
        }
      }
    }

    // Sharks: warn, cross (the aggressive kind steers toward the hook), steal the catch.
    for (const pass of passes) {
      if (!pass.launched && elapsedTime >= pass.at) {
        pass.launched = true;
        const def = SHARKS[pass.kind];
        sharks.push({ def, x: pass.dir === 1 ? -def.length * s : W + def.length * s, depth: pass.depth, dir: pass.dir, bit: false });
        if (setup.endless) {
          const kind: SharkKind = elapsedTime >= ENDLESS.aggressiveAfter && Math.random() < 0.5 ? "aggressive" : "normal";
          passes.push(schedulePass(elapsedTime + endlessSharkInterval(), kind));
        }
      }
    }
    passes = passes.filter((p) => !p.launched);
    for (const sh of sharks) {
      sh.x += sh.dir * sh.def.speed * s * Math.max(1, speedNow * 0.9) * dt;
      if (sh.def.tracking > 0 && inWater && !sh.bit) {
        const want = depthOf(hookY);
        const stepD = (sh.def.tracking * s * dt) / column();
        sh.depth += clamp(want - sh.depth, -stepD, stepD);
      }
      const y = sharkY(sh);
      if (!sh.bit && inWater && Math.abs(hookX - sh.x) < sh.def.length * s * 0.42 && Math.abs(hookY - y) < sh.def.height * s * 0.5) {
        sh.bit = true;
        freezeUntil = Math.max(freezeUntil, clock + BITE_SECONDS);
        flash = 0.7;
        splash(hookX, hookY, 12, "rgba(255,120,120,.9)", 0.9);
        if (hooked.length) {
          say(`${sh.def.name}! −${hooked.length} ${hooked.length === 1 ? "peixe" : "peixes"}`, "#ff7a7a");
          for (const f of hooked) if (!f.special) respawns.push({ sp: f.sp, at: clock + f.sp.respawn });
          fish = fish.filter((f) => !f.hooked);
          hooked = [];
        } else {
          say(`${sh.def.name}!`, "#ff7a7a");
        }
        if (sh.def.yanksLine) {
          forcedUp = true;
          lineState = "up";
        }
        penalty();
        emit();
      }
    }
    sharks = sharks.filter((sh) => sh.x > -sh.def.length * 1.5 * s && sh.x < W + sh.def.length * 1.5 * s);

    // Golden fish, once.
    if (elapsedTime >= goldenAt) {
      goldenAt = Infinity;
      const f = spawn(GOLDEN_FISH, true);
      f.special = true;
      f.targetDepth = f.depth;
      f.nextDart = clock + 0.8;
      fish.push(f);
      say("✦ Peixe Dourado à vista! ✦", "#ffd84d", W / 2, geo.surface + 34 * s, 1.3);
    }

    // Time bubbles: spawn, rise, collect.
    if (elapsedTime >= nextBubbleAt) {
      nextBubbleAt = elapsedTime + loadout.bubbleInterval * rand(1 - BUBBLES.jitter, 1 + BUBBLES.jitter);
      bubbles.push({ x: rand(0.1, 0.9) * W, depth: rand(0.5, 0.95), value: loadout.bubbleSeconds, born: clock, phase: rand(0, Math.PI * 2) });
    }
    for (const b of bubbles) b.depth -= (BUBBLES.rise * s * dt) / column();
    bubbles = bubbles.filter((b) => {
      if (b.depth < -0.02 || clock - b.born > BUBBLES.lifetime) return false;
      const bx = b.x + Math.sin(clock * 1.5 + b.phase) * 10 * s;
      if (inWater && Math.hypot(hookX - bx, hookY - bubbleY(b)) < BUBBLES.reach * s) {
        timeLeft += b.value;
        say(`+${b.value}s`, "#7fe9ff", bx, bubbleY(b) - 10 * s, 1.3);
        splash(bx, bubbleY(b), 12, "rgba(160,240,255,.9)", 0.6);
        emit();
        return false;
      }
      return true;
    });

    // Only a rising, free-moving, un-shocked hook catches.
    if (lineState === "up" && clock >= freezeUntil && !shocked && hooked.length < loadout.capacity) {
      for (const f of fish) {
        if (f.hooked || hooked.length >= loadout.capacity || clock < f.freeUntil) continue;
        const p = fishPos(f);
        const reach = (Math.max(f.sp.length, f.sp.height) * 0.45 + 9) * s * (f.special ? GOLDEN.reachFactor : 1);
        if (Math.hypot(p.x - hookX, p.y - hookY) < reach) {
          f.hooked = true;
          hooked.push(f);
          splash(p.x, p.y, f.special ? 16 : 5, f.special ? "rgba(255,220,90,.95)" : "rgba(170,230,255,.7)");
          if (f.special) say("Peixe Dourado!", "#ffd84d", p.x, p.y - 20 * s, 1.3);
          emit();
        }
      }
    }
    for (let i = respawns.length - 1; i >= 0; i--) {
      if (clock >= respawns[i].at) {
        fish.push(spawn(respawns[i].sp, true));
        respawns.splice(i, 1);
      }
    }

    // Weather
    if (setup.theme.lightning && clock >= nextLightning) {
      nextLightning = clock + rand(5, 11);
      lightning = 1;
      let x = rand(0.15, 0.85) * W;
      bolt = [[x, 0]];
      for (let y = 0; y < geo.surface; y += geo.surface / 6) {
        x += rand(-26, 26) * s;
        bolt.push([x, y]);
      }
      bolt.push([x + rand(-10, 10) * s, geo.surface]);
    }
    lightning = Math.max(0, lightning - dt * 3.5);

    // Effects
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

  // --- rendering -----------------------------------------------------------
  function drawSky() {
    const t = setup.theme;
    const sky = g.createLinearGradient(0, 0, 0, geo.surface);
    t.sky.forEach((c, i) => sky.addColorStop(i / (t.sky.length - 1), c));
    g.fillStyle = sky;
    g.fillRect(0, 0, W, geo.surface);
    for (let i = 0; i < t.stars; i++) {
      const x = (((i * 211) % 997) / 997) * W;
      const y = (((i * 137) % 613) / 613) * geo.surface * 0.8;
      g.globalAlpha = 0.35 + 0.35 * Math.sin(clock * 2 + i);
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
      const y = geo.surface * 0.35;
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
    // Clouds drift slowly
    g.fillStyle = t.clouds.color;
    for (let i = 0; i < t.clouds.count; i++) {
      const span = W + 240 * s;
      const x = ((((i * 311) % 997) / 997) * span + clock * (6 + (i % 3) * 3) * s) % span - 120 * s;
      const y = (0.12 + ((i * 53) % 40) / 100) * geo.surface;
      const r = (18 + (i % 3) * 8) * s;
      g.beginPath();
      g.ellipse(x, y, r * 2.2, r * 0.8, 0, 0, Math.PI * 2);
      g.ellipse(x + r, y - r * 0.4, r * 1.3, r * 0.8, 0, 0, Math.PI * 2);
      g.ellipse(x - r, y - r * 0.2, r * 1.1, r * 0.7, 0, 0, Math.PI * 2);
      g.fill();
    }
    // Coastline, with a lighthouse on darker levels
    g.fillStyle = t.coast;
    g.beginPath();
    g.moveTo(0, geo.surface);
    for (let x = 0; x <= W * 0.45; x += 20) g.lineTo(x, geo.surface - (12 + Math.sin(x / 60) * 6 + Math.sin(x / 23) * 3) * s);
    g.lineTo(W * 0.5, geo.surface);
    g.closePath();
    g.fill();
    if (t.lighthouse) {
      const x = W * 0.12;
      const base = geo.surface - 14 * s;
      g.fillStyle = "#e9e4da";
      g.fillRect(x - 4 * s, base - 30 * s, 8 * s, 30 * s);
      g.fillStyle = "#b8392e";
      g.fillRect(x - 4 * s, base - 22 * s, 8 * s, 5 * s);
      g.fillRect(x - 4 * s, base - 10 * s, 8 * s, 5 * s);
      const on = Math.sin(clock * 2.4) > 0.2;
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
      g.fillStyle = `rgba(230,236,255,${(lightning * 0.35).toFixed(3)})`;
      g.fillRect(0, 0, W, geo.surface);
      g.strokeStyle = `rgba(255,255,255,${lightning.toFixed(3)})`;
      g.lineWidth = 2 * s;
      g.beginPath();
      bolt.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
      g.stroke();
    }
  }

  function drawWater() {
    const t = setup.theme;
    const water = g.createLinearGradient(0, geo.surface, 0, H);
    water.addColorStop(0, t.water[0]);
    water.addColorStop(0.35, t.water[1]);
    water.addColorStop(1, t.water[2]);
    g.fillStyle = water;
    g.fillRect(0, geo.surface, W, H - geo.surface);
    if (t.glint && (t.sun || t.moon)) {
      const gx = (t.sun?.x ?? t.moon?.x ?? 0.5) * W;
      g.fillStyle = t.glint;
      for (let i = 0; i < 6; i++) {
        const y = geo.surface + 4 * s + i * 5 * s;
        const w = (40 - i * 5) * s + Math.sin(clock * 2 + i) * 6 * s;
        g.fillRect(gx - w / 2, y, w, 1.5 * s);
      }
    }
    // Seabed: sand, pebbles, weed, bubbles
    g.fillStyle = "#3b3a2e";
    g.beginPath();
    g.moveTo(0, H);
    for (let x = 0; x <= W + 20; x += 20) g.lineTo(x, geo.seabed - 4 * s + Math.sin(x / 80) * 5 * s);
    g.lineTo(W, H);
    g.closePath();
    g.fill();
    g.fillStyle = "#23272a";
    for (let i = 0; i < 7; i++) {
      const x = (((i * 173) % 1000) / 1000) * W;
      g.beginPath();
      g.ellipse(x, geo.seabed, (18 + (i % 3) * 10) * s, (10 + (i % 2) * 6) * s, 0, Math.PI, 0);
      g.fill();
    }
    g.strokeStyle = "#2f6b45";
    g.lineWidth = 3 * s;
    g.lineCap = "round";
    for (let i = 0; i < 12; i++) {
      const x = (((i * 97 + 40) % 1000) / 1000) * W;
      const h = (30 + (i % 4) * 14) * s;
      g.beginPath();
      g.moveTo(x, geo.seabed);
      g.quadraticCurveTo(x + Math.sin(clock * 1.3 + i) * 10 * s, geo.seabed - h / 2, x + Math.sin(clock * 1.3 + i + 1) * 14 * s, geo.seabed - h);
      g.stroke();
    }
    g.fillStyle = "rgba(200,240,255,.22)";
    for (let i = 0; i < 14; i++) {
      const x = (((i * 131) % 1000) / 1000) * W + Math.sin(clock + i) * 6 * s;
      const span = geo.seabed - geo.surface;
      const y = geo.seabed - ((clock * (18 + (i % 5) * 6) * s + i * 57) % span);
      g.beginPath();
      g.arc(x, y, (1.5 + (i % 3)) * s, 0, Math.PI * 2);
      g.fill();
    }
  }

  function drawRain() {
    g.strokeStyle = "rgba(190,210,230,.45)";
    g.lineWidth = 1.2 * s;
    g.beginPath();
    for (let i = 0; i < 90; i++) {
      const x = ((((i * 97) % 1000) / 1000) * (W + 60 * s) + clock * 90 * s) % (W + 60 * s) - 30 * s;
      const y = ((((i * 57) % 1000) / 1000) * geo.surface + clock * 620 * s) % geo.surface;
      g.moveTo(x, y);
      g.lineTo(x - 5 * s, y + 13 * s);
    }
    g.stroke();
    // Ripples where the drops hit the surface
    g.strokeStyle = "rgba(200,225,240,.35)";
    for (let i = 0; i < 12; i++) {
      const phase = (clock * 1.8 + i * 0.37) % 1;
      const x = (((i * 173 + Math.floor(clock * 1.8 + i * 0.37) * 211) % 1000) / 1000) * W;
      g.globalAlpha = 1 - phase;
      g.beginPath();
      g.ellipse(x, geo.surface + 3 * s, (2 + phase * 10) * s, (1 + phase * 2.5) * s, 0, 0, Math.PI * 2);
      g.stroke();
    }
    g.globalAlpha = 1;
  }

  function drawRock(r: Rock) {
    const { cx, hw, top } = rockShape(r);
    const body = g.createLinearGradient(0, top, 0, geo.seabed);
    body.addColorStop(0, r.palette[0]);
    body.addColorStop(1, r.palette[1]);
    g.fillStyle = body;
    g.beginPath();
    g.moveTo(cx - hw, geo.seabed + 2 * s);
    const jitter = seeded(r.seed + 7);
    for (let i = 0; i <= ROCK_SAMPLES; i++) {
      const x = cx - hw + (i / ROCK_SAMPLES) * hw * 2;
      const y = (rockTopAt(r, Math.min(x, cx + hw - 0.01)) ?? geo.seabed) + (jitter() - 0.5) * (r.variant === "jagged" ? 6 : 2.5) * s;
      g.lineTo(x, y);
    }
    g.lineTo(cx + hw, geo.seabed + 2 * s);
    g.closePath();
    g.fill();
    g.strokeStyle = "rgba(200,215,225,.22)";
    g.lineWidth = 1.5 * s;
    g.stroke();
    // Cracks and moss vary by seed
    g.strokeStyle = "rgba(0,0,0,.28)";
    g.lineWidth = 1.2 * s;
    const cr = seeded(r.seed + 13);
    for (let i = 0; i < 2; i++) {
      const x = cx + (cr() - 0.5) * hw;
      const y0 = (rockTopAt(r, x) ?? geo.seabed) + 6 * s;
      g.beginPath();
      g.moveTo(x, y0);
      g.lineTo(x + (cr() - 0.5) * 12 * s, y0 + (geo.seabed - y0) * 0.35);
      g.lineTo(x + (cr() - 0.5) * 16 * s, y0 + (geo.seabed - y0) * 0.6);
      g.stroke();
    }
    g.fillStyle = "rgba(70,130,85,.55)";
    for (let i = 0; i < 3; i++) {
      const x = cx + (cr() - 0.5) * hw * 1.4;
      const y = rockTopAt(r, x);
      if (y === null) continue;
      g.beginPath();
      g.ellipse(x, y + 4 * s, 6 * s, 3 * s, 0, 0, Math.PI * 2);
      g.fill();
    }
  }

  function drawJelly(j: Jelly) {
    const { x, y } = jellyPos(j);
    const zap = clock - j.zapAt < 0.6;
    const pulse = 1 + Math.sin(clock * 3 + j.phase) * 0.08;
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
    g.ellipse(0, 0, 16 * s * pulse, (13 * s) / pulse, 0, Math.PI, 0);
    g.quadraticCurveTo(8 * s, 5 * s, 0, 3 * s);
    g.quadraticCurveTo(-8 * s, 5 * s, -16 * s * pulse, 0);
    g.fill();
    g.restore();
  }

  function drawShark(sh: Shark) {
    const L = sh.def.length * s;
    const Hh = sh.def.height * s;
    const y = sharkY(sh);
    g.save();
    g.translate(sh.x, y);
    g.scale(sh.dir, 1);
    const wag = Math.sin(clock * (sh.def.tracking ? 8 : 6)) * 0.18;
    g.save();
    g.translate(-L * 0.42, 0);
    g.rotate(wag);
    g.fillStyle = sh.def.body;
    g.beginPath();
    g.moveTo(0, 0);
    g.lineTo(-L * 0.14, -Hh * 0.9);
    g.quadraticCurveTo(-L * 0.06, 0, -L * 0.12, Hh * 0.55);
    g.closePath();
    g.fill();
    g.restore();
    g.fillStyle = sh.def.body;
    g.beginPath();
    g.moveTo(-L * 0.02, -Hh * 0.42);
    g.lineTo(-L * 0.14, -Hh * 1.05);
    g.lineTo(-L * 0.2, -Hh * 0.36);
    g.fill();
    g.beginPath();
    g.moveTo(L * 0.12, Hh * 0.28);
    g.lineTo(-L * 0.04, Hh * 0.85);
    g.lineTo(-L * 0.02, Hh * 0.28);
    g.fill();
    const body = g.createLinearGradient(0, -Hh / 2, 0, Hh / 2);
    body.addColorStop(0, sh.def.body);
    body.addColorStop(0.6, sh.def.body);
    body.addColorStop(1, sh.def.belly);
    g.fillStyle = body;
    g.beginPath();
    g.moveTo(L * 0.5, Hh * 0.05);
    g.bezierCurveTo(L * 0.42, -Hh * 0.55, -L * 0.2, -Hh * 0.6, -L * 0.44, 0);
    g.bezierCurveTo(-L * 0.2, Hh * 0.5, L * 0.35, Hh * 0.5, L * 0.5, Hh * 0.05);
    g.fill();
    if (sh.def.stripes) {
      g.save();
      g.clip();
      g.fillStyle = "rgba(20,22,18,.45)";
      for (let i = 0; i < 6; i++) g.fillRect(-L * 0.3 + i * L * 0.09, -Hh, L * 0.035, Hh * 0.75);
      g.restore();
    }
    g.strokeStyle = "rgba(40,50,58,.5)";
    g.lineWidth = 1.4 * s;
    for (let i = 0; i < 3; i++) {
      g.beginPath();
      g.moveTo(L * 0.18 - i * 5 * s, -Hh * 0.12);
      g.lineTo(L * 0.16 - i * 5 * s, Hh * 0.18);
      g.stroke();
    }
    // Mouth: the aggressive one shows its teeth
    g.beginPath();
    g.moveTo(L * 0.44, Hh * 0.18);
    g.quadraticCurveTo(L * 0.34, Hh * 0.3, L * 0.26, Hh * 0.2);
    g.stroke();
    if (sh.def.tracking) {
      g.fillStyle = "#f3efe6";
      for (let i = 0; i < 4; i++) {
        const tx = L * 0.42 - i * L * 0.04;
        g.beginPath();
        g.moveTo(tx, Hh * 0.2);
        g.lineTo(tx - L * 0.012, Hh * 0.27);
        g.lineTo(tx - L * 0.024, Hh * 0.2);
        g.fill();
      }
    }
    g.fillStyle = sh.def.tracking ? "#b01616" : "#0b1116";
    g.beginPath();
    g.arc(L * 0.36, -Hh * 0.1, 3 * s, 0, Math.PI * 2);
    g.fill();
    g.restore();
  }

  function drawWarnings() {
    for (const pass of passes) {
      if (pass.launched || elapsedTime < pass.at - SHARK_WARNING) continue;
      const aggressive = pass.kind === "aggressive";
      const x = pass.dir === 1 ? 22 * s : W - 22 * s;
      const y = depthY(pass.depth);
      const blink = 0.55 + 0.45 * Math.sin(clock * (aggressive ? 20 : 14));
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

  function drawBubble(b: Bubble) {
    const x = b.x + Math.sin(clock * 1.5 + b.phase) * 10 * s;
    const y = bubbleY(b);
    const r = 15 * s;
    const fade = Math.min(1, (BUBBLES.lifetime - (clock - b.born)) / 2);
    g.save();
    g.globalAlpha = fade;
    const fill = g.createRadialGradient(x - r * 0.35, y - r * 0.4, 1, x, y, r);
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

  function drawFish(f: Fish) {
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
    const tilt = Math.sin(clock * 1.4) * 0.03 * setup.theme.waves;
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
    g.fillStyle = setup.theme.rain ? "#e8c21c" : "#f5b331"; // oilskin hat in the storm
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
      const col = (i % 3) - 1;
      const row = Math.floor(i / 3);
      g.save();
      g.translate(hx + col * 12 * s, hookY + (16 + row * 14) * s + Math.max(f.sp.length, f.sp.height) * 0.3 * s);
      g.rotate(-Math.PI / 2 + Math.sin(clock * 12 + i) * 0.25);
      drawCreature(g, f.sp, s * 0.9, clock + i);
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
      const meters = Math.round(((hookY - geo.surface) / (geo.seabed - geo.surface)) * 30);
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
      const pop = 1 + Math.max(0, 0.25 - p.age) * 1.6;
      g.font = `700 ${Math.round((13 * s + 3) * pop * (p.size ?? 1))}px Poppins, system-ui, sans-serif`;
      g.fillStyle = "rgba(4,16,26,.6)";
      g.fillText(p.text, p.x + 1.5, p.y + 1.5);
      g.fillStyle = p.color;
      g.fillText(p.text, p.x, p.y);
    }
    g.globalAlpha = 1;
    if (flash > 0) {
      g.fillStyle = `rgba(255,236,140,${(flash * 0.16).toFixed(3)})`;
      g.fillRect(0, 0, W, H);
    }
  }

  function frame(now: number) {
    const dt = Math.min(0.05, (now - last) / 1000 || 0);
    last = now;
    update(dt);
    draw();
    if (running) raf = requestAnimationFrame(frame);
  }
  /** Attract mode behind overlays: the scene moves, the game doesn't. */
  function idle(now: number) {
    if (running) return;
    const dt = Math.min(0.05, (now - last) / 1000 || 0);
    last = now;
    clock += dt;
    ambient(dt);
    for (const p of particles) p.age += dt;
    for (const p of popups) p.age += dt;
    lightning = Math.max(0, lightning - dt * 3.5);
    draw();
    raf = requestAnimationFrame(idle);
  }

  // --- input ---------------------------------------------------------------
  const localX = (e: PointerEvent) => e.clientX - canvas.getBoundingClientRect().left;
  // Pointer X steers the rod tip, so offset by the tip's distance from the boat.
  const steerTo = (x: number) => (targetX = x - 46 * s);
  const onMove = (e: PointerEvent) => {
    if (e.pointerType === "mouse" || holding) steerTo(localX(e));
  };
  const onDown = (e: PointerEvent) => {
    if (!running || e.button > 0) return;
    e.preventDefault();
    canvas.setPointerCapture(e.pointerId);
    steerTo(localX(e));
    holding = true;
  };
  const onUp = () => {
    holding = false;
  };
  const GAME_KEYS = new Set(["ArrowLeft", "ArrowRight", "ArrowDown", "Space", "KeyA", "KeyD", "KeyS"]);
  const onKeyDown = (e: KeyboardEvent) => {
    if (!running || !GAME_KEYS.has(e.code)) return;
    e.preventDefault();
    keys.add(e.code);
  };
  const onKeyUp = (e: KeyboardEvent) => keys.delete(e.code);
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

  const game: FishingGame & {
    debug: () => unknown;
    debugColumn: (n: number) => void;
    debugHazard: (kind: "jelly" | "shark" | "tiger" | "rock" | "bubble" | "golden") => void;
    debugTime: (seconds: number) => void;
  } = {
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
    // QA hooks (exposed on window in development only).
    debug: () => ({
      mode: setup.endless ? "endless" : "level", level: setup.level, boatX, targetX, hookX, hookY, lineState, hooked: hooked.length,
      capacity: loadout.capacity, lineSpeed: loadout.lineSpeed, score, timeLeft, elapsed: elapsedTime, step, streak, W, H,
      surface: geo.surface, seabed: geo.seabed, tipX: rodTip().x, forcedUp, shocked: clock < shockUntil,
      frozen: clock < freezeUntil, snagged, escapes, theme: Object.entries(THEMES).find(([, t]) => t === setup.theme)?.[0],
      jellies: jellies.map(jellyPos), sharks: sharks.map((sh) => ({ name: sh.def.name, x: sh.x, y: sharkY(sh) })),
      sharkPasses: passes.map((p) => ({ at: p.at, kind: p.kind })), goldenAt,
      rocks: rocks.map((r) => ({ ...rockShape(r), variant: r.variant })),
      bubbles: bubbles.map((b) => ({ x: b.x, y: bubbleY(b), value: b.value })),
      fish: fish.filter((f) => !f.hooked).map((f) => ({ key: f.sp.key, special: f.special, ...fishPos(f) })),
    }),
    debugColumn: (n) => {
      for (let i = 0; i < n; i++) {
        const f = spawn(SPECIES[0], false);
        f.x = hookX;
        f.depth = 0.05 + (i / n) * 0.6;
        f.speedMul = 0;
        fish.push(f);
      }
    },
    debugHazard: (kind) => {
      const d = depthOf(hookY);
      const ahead = lineState === "up" ? d - 0.1 : d + 0.12;
      if (kind === "jelly") jellies.push({ x: hookX, depth: clamp(ahead, 0, 0.9), dir: 1, speed: 0, phase: 0, zapAt: -10 });
      if (kind === "shark" || kind === "tiger") {
        const def = SHARKS[kind === "tiger" ? "aggressive" : "normal"];
        sharks.push({ def, x: hookX - def.length * s * 0.8, depth: d, dir: 1, bit: false });
      }
      if (kind === "rock") {
        const seed = 42;
        rocks.push({ xf: hookX / W, w: 90, hf: 0.3, profile: rockProfile("mound", seed), palette: ROCK_PALETTES[0], seed, variant: "mound" });
      }
      if (kind === "bubble") bubbles.push({ x: hookX, depth: clamp(ahead, 0, 0.95), value: loadout.bubbleSeconds, born: clock, phase: -Math.PI / 2 });
      if (kind === "golden") goldenAt = elapsedTime;
    },
    debugTime: (seconds) => {
      timeLeft = seconds;
    },
  };
  return game;
}
