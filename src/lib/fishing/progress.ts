// Pesca Interativa: the player's saved progress (browser storage, per device).
import { COIN_RATE, RESERVE_BUBBLE, UPGRADES, type UpgradeKey } from "./config";
import type { Loadout } from "./game";

export interface Progress {
  coins: number;
  upgrades: Record<UpgradeKey, number>;
  /** Reserve time bubbles bought in the shop, used at the next start. */
  reserve: number;
  /** Highest level unlocked (1..5). */
  unlocked: number;
  endlessUnlocked: boolean;
  bestAdventure: number;
  bestEndless: number;
}

const KEY = "o-pescador:pesca-progress";

export const NEW_PROGRESS: Progress = {
  coins: 0,
  upgrades: { rod: 0, hooks: 0, bubbleRate: 0, bubbleValue: 0 },
  reserve: 0,
  unlocked: 1,
  endlessUnlocked: false,
  bestAdventure: 0,
  bestEndless: 0,
};

export function loadProgress(): Progress {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "null") as Partial<Progress> | null;
    if (!raw) return structuredClone(NEW_PROGRESS);
    const upgrades = { ...NEW_PROGRESS.upgrades, ...raw.upgrades };
    for (const key of Object.keys(upgrades) as UpgradeKey[]) {
      upgrades[key] = Math.max(0, Math.min(UPGRADES[key].costs.length, Math.floor(Number(upgrades[key]) || 0)));
    }
    return {
      ...NEW_PROGRESS,
      ...raw,
      coins: Math.max(0, Math.floor(Number(raw.coins) || 0)),
      reserve: Math.max(0, Math.min(RESERVE_BUBBLE.max, Math.floor(Number(raw.reserve) || 0))),
      unlocked: Math.max(1, Math.min(5, Math.floor(Number(raw.unlocked) || 1))),
      upgrades,
    };
  } catch {
    return structuredClone(NEW_PROGRESS);
  }
}

export function saveProgress(p: Progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* private mode: progress just isn't remembered */
  }
}

export const coinsFor = (points: number) => Math.floor(points / COIN_RATE);

/** Price of the next level of an upgrade, or null when maxed. */
export function nextCost(p: Progress, key: UpgradeKey) {
  return UPGRADES[key].costs[p.upgrades[key]] ?? null;
}

/** The loadout the engine gets; `useReserve` spends the stored bubbles. */
export function loadoutFor(p: Progress, useReserve: boolean): Loadout {
  return {
    lineSpeed: UPGRADES.rod.values[p.upgrades.rod],
    capacity: UPGRADES.hooks.values[p.upgrades.hooks],
    bubbleInterval: UPGRADES.bubbleRate.values[p.upgrades.bubbleRate],
    bubbleSeconds: UPGRADES.bubbleValue.values[p.upgrades.bubbleValue],
    bonusSeconds: useReserve ? p.reserve * RESERVE_BUBBLE.seconds : 0,
  };
}
