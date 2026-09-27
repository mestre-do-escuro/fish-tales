// Pesca Interativa: campaign, shop and endless-mode UI around the canvas engine
// in @/lib/fishing. Balancing lives in @/lib/fishing/config and levels.
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Anchor,
  Clock,
  Coins,
  Flag,
  Flame,
  Infinity as InfinityIcon,
  Mountain,
  Play,
  RotateCcw,
  ShoppingBag,
  Sparkles,
  Target,
  Trophy,
  Waves,
  Zap,
  CloudRain,
} from "lucide-react";
import { COIN_RATE, ENDLESS, RESERVE_BUBBLE, TIME_BONUS_PER_SECOND, UPGRADES, type UpgradeKey } from "@/lib/fishing/config";
import { BASE_LOADOUT, createFishingGame, type FishingGame, type Hud, type Outcome, type Stage } from "@/lib/fishing/game";
import { LEVELS, type LevelConfig } from "@/lib/fishing/levels";
import { coinsFor, loadoutFor, loadProgress, NEW_PROGRESS, nextCost, saveProgress, type Progress } from "@/lib/fishing/progress";
import { drawCreature, TALLY_SPECIES, type Species } from "@/lib/fishing/species";

const SEPARATOR_MS = 3200;
const ENDLESS_INTRO_MS = 4200;

const noCatches = () => Object.fromEntries(TALLY_SPECIES.map((sp) => [sp.key, 0]));
const emptyHud = (stage: Stage): Hud => ({
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
  catches: noCatches(),
});

type Phase =
  | { kind: "intro" }
  | { kind: "shop"; back: Phase }
  | { kind: "separator" }
  | { kind: "endless-intro"; afterAdventure: boolean }
  | { kind: "playing" }
  | { kind: "won"; levelScore: number; bonus: number; coins: number }
  | { kind: "lost"; coins: number }
  | { kind: "endless-over"; coins: number; record: boolean };

export function FishingGamePanel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<FishingGame | null>(null);
  const [progress, setProgress] = useState<Progress>(NEW_PROGRESS);
  const [stage, setStage] = useState<Stage>({ kind: "level", level: LEVELS[0] });
  const [phase, setPhase] = useState<Phase>({ kind: "intro" });
  const [hud, setHud] = useState<Hud>(emptyHud(stage));
  const [total, setTotal] = useState(0);
  const [campaignCatches, setCampaignCatches] = useState<Record<string, number>>(noCatches);

  const level: LevelConfig | null = stage.kind === "level" ? stage.level : null;
  const levelIndex = level ? level.number - 1 : -1;

  // Refs so the engine callbacks (bound once) see current values.
  const stageRef = useRef(stage);
  stageRef.current = stage;
  const totalRef = useRef(total);
  totalRef.current = total;

  /** Update + persist progress. */
  const commit = (change: (p: Progress) => Progress) =>
    setProgress((prev) => {
      const next = change(prev);
      saveProgress(next);
      return next;
    });

  useEffect(() => {
    setProgress(loadProgress());
    const canvas = canvasRef.current;
    if (!canvas) return;
    const game = createFishingGame(canvas, {
      onHud: setHud,
      onEnd: (final: Hud, outcome: Outcome) => {
        setHud(final);
        setCampaignCatches((prev) => {
          const next = { ...prev };
          for (const [k, n] of Object.entries(final.catches)) next[k] = (next[k] ?? 0) + n;
          return next;
        });
        const current = stageRef.current;
        if (outcome === "endless-over") {
          const coins = coinsFor(final.score);
          const record = final.score > loadProgress().bestEndless; // storage is the source of truth here
          commit((p) => ({ ...p, coins: p.coins + coins, bestEndless: Math.max(p.bestEndless, final.score) }));
          setPhase({ kind: "endless-over", coins, record });
          return;
        }
        if (current.kind !== "level") return;
        if (outcome === "win") {
          const bonus = final.timeLeft * TIME_BONUS_PER_SECOND;
          const coins = coinsFor(final.score + bonus);
          const newTotal = totalRef.current + final.score + bonus;
          setTotal(newTotal);
          const n = current.level.number;
          commit((p) => ({
            ...p,
            coins: p.coins + coins,
            unlocked: Math.max(p.unlocked, Math.min(LEVELS.length, n + 1)),
            endlessUnlocked: p.endlessUnlocked || n === LEVELS.length,
            bestAdventure: n === LEVELS.length ? Math.max(p.bestAdventure, newTotal) : p.bestAdventure,
          }));
          if (n === LEVELS.length) setPhase({ kind: "endless-intro", afterAdventure: true });
          else setPhase({ kind: "won", levelScore: final.score, bonus, coins });
        } else {
          const coins = coinsFor(final.score);
          commit((p) => ({ ...p, coins: p.coins + coins }));
          setPhase({ kind: "lost", coins });
        }
      },
    });
    gameRef.current = game;
    if (import.meta.env.DEV) (window as unknown as { __pesca?: FishingGame }).__pesca = game;
    return () => game.destroy();
  }, []);

  /** Prepare a stage (spending reserve bubbles) behind its separator. */
  function prepare(next: Stage) {
    const kit = loadoutFor(progress, true);
    if (progress.reserve > 0) commit((p) => ({ ...p, reserve: 0 }));
    setStage(next);
    setHud({ ...emptyHud(next), capacity: kit.capacity, timeLeft: emptyHud(next).timeLeft + kit.bonusSeconds });
    gameRef.current?.prepare(next, kit);
  }
  function openLevel(index: number) {
    prepare({ kind: "level", level: LEVELS[index] });
    setPhase({ kind: "separator" });
  }
  function openEndless(afterAdventure: boolean) {
    prepare({ kind: "endless" });
    setPhase({ kind: "endless-intro", afterAdventure });
  }
  function startStage() {
    setPhase({ kind: "playing" });
    gameRef.current?.start();
    canvasRef.current?.focus();
  }
  function newCampaign(fromIndex: number) {
    setTotal(0);
    setCampaignCatches(noCatches());
    openLevel(fromIndex);
  }

  // Separators start the stage by themselves (a tap skips the wait).
  useEffect(() => {
    if (phase.kind === "separator") {
      const timer = window.setTimeout(startStage, SEPARATOR_MS);
      return () => window.clearTimeout(timer);
    }
    if (phase.kind === "endless-intro") {
      if (phase.afterAdventure && stage.kind !== "endless") {
        // Straight from level 5: set up the endless run behind the intro.
        prepare({ kind: "endless" });
      }
      const timer = window.setTimeout(startStage, ENDLESS_INTRO_MS);
      return () => window.clearTimeout(timer);
    }
    // Only a phase change should (re)start the separator timer; prepare/stage are read at that moment.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  function buy(key: UpgradeKey) {
    const cost = nextCost(progress, key);
    if (cost === null || progress.coins < cost) return;
    commit((p) => ({ ...p, coins: p.coins - cost, upgrades: { ...p.upgrades, [key]: p.upgrades[key] + 1 } }));
  }
  function buyReserve() {
    if (progress.coins < RESERVE_BUBBLE.cost || progress.reserve >= RESERVE_BUBBLE.max) return;
    commit((p) => ({ ...p, coins: p.coins - RESERVE_BUBBLE.cost, reserve: p.reserve + 1 }));
  }
  const openShop = () => setPhase({ kind: "shop", back: phase });

  const shownCatches =
    phase.kind === "playing"
      ? Object.fromEntries(TALLY_SPECIES.map((sp) => [sp.key, (campaignCatches[sp.key] ?? 0) + (hud.catches[sp.key] ?? 0)]))
      : campaignCatches;
  const speciesFound = TALLY_SPECIES.filter((sp) => shownCatches[sp.key] > 0).length;
  const full = hud.hooked >= hud.capacity;
  const progressToTarget = hud.target ? Math.min(1, hud.score / hud.target) : 0;
  const prevLevel = levelIndex > 0 ? LEVELS[levelIndex - 1] : null;

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl">
        <canvas
          ref={canvasRef}
          tabIndex={0}
          aria-label="Área de jogo: move o barco e segura para descer a linha"
          className="block h-[min(72vh,620px)] min-h-[440px] w-full touch-none select-none outline-none"
          onContextMenu={(e) => e.preventDefault()}
        />

        {phase.kind === "playing" && (
          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-2 sm:p-3">
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {hud.mode === "level" ? (
                <HudChip icon={<Flag className="size-4 text-primary" aria-hidden />} label="Nível" value={hud.level} />
              ) : (
                <HudChip icon={<InfinityIcon className="size-4 text-primary" aria-hidden />} label="Dificuldade" value={hud.step + 1} />
              )}
              <div className="flex min-w-28 flex-col justify-center gap-1 rounded-xl border border-line bg-bg/70 px-2.5 py-1.5 backdrop-blur sm:min-w-36 sm:px-3">
                <div className="flex items-center gap-1.5 text-sm">
                  <Trophy className="size-4 text-amber-300" aria-hidden />
                  <b className="tabular-nums">{hud.score}</b>
                  {hud.target !== null && <span className="text-xs text-muted">/ {hud.target}</span>}
                </div>
                {hud.target !== null && (
                  <div className="h-1.5 overflow-hidden rounded-full bg-bg" aria-hidden>
                    <div className="h-full rounded-full bg-amber-300 transition-[width] duration-300" style={{ width: `${progressToTarget * 100}%` }} />
                  </div>
                )}
              </div>
              <HudChip icon={<Clock className="size-4 text-primary" aria-hidden />} label="Tempo" value={`${hud.timeLeft}s`} warn={hud.timeLeft <= 10} />
              <HudChip
                icon={<Flame className={`size-4 ${hud.multiplier > 1 ? "text-amber-300" : "text-muted"}`} aria-hidden />}
                label="Combo"
                value={hud.multiplier > 1 ? `${hud.streak} · ×${hud.multiplier.toFixed(1)}` : hud.streak}
                hot={hud.multiplier > 1}
              />
            </div>
            <HudChip
              icon={<Anchor className={`size-4 ${full ? "text-danger" : "text-primary"}`} aria-hidden />}
              label="Anzol"
              value={`${hud.hooked}/${hud.capacity}`}
              warn={full}
            />
          </div>
        )}

        {phase.kind === "separator" && level && (
          <button
            type="button"
            onClick={startStage}
            aria-label={`Nível ${level.number}: ${level.name}. Toque para começar.`}
            className="absolute inset-0 grid cursor-pointer place-items-center overflow-y-auto bg-bg/70 p-4 backdrop-blur-sm"
          >
            <div key={level.number} className="animate-in fade-in zoom-in-95 text-center duration-500">
              <p className="text-sm font-semibold uppercase tracking-[0.4em] text-primary">Nível</p>
              <p className="mt-1 text-8xl font-bold leading-none tabular-nums sm:text-9xl">{level.number}</p>
              <h2 className="mt-3 text-2xl font-semibold italic sm:text-3xl">{level.name}</h2>
              <div className="mx-auto my-4 h-px w-16 bg-primary/50" />
              <p className="mx-auto max-w-sm text-sm leading-relaxed text-muted">{level.story}</p>
              <div className="mx-auto mt-5 flex max-w-md flex-wrap justify-center gap-2 text-xs">
                <Tag icon={<Target className="size-3.5" aria-hidden />}>{level.target} pts</Tag>
                <Tag icon={<Clock className="size-3.5" aria-hidden />}>
                  {level.seconds} s{hud.timeLeft > level.seconds ? ` +${hud.timeLeft - level.seconds} s` : ""}
                </Tag>
                {level.jellyfish > 0 && (
                  <Tag icon={<Zap className="size-3.5" aria-hidden />} fresh={prevLevel?.jellyfish === 0}>
                    Alforrecas ×{level.jellyfish}
                  </Tag>
                )}
                {level.sharks > 0 && (
                  <Tag
                    icon={<Waves className="size-3.5" aria-hidden />}
                    fresh={prevLevel?.sharks === 0 || (level.sharkKind === "aggressive" && prevLevel?.sharkKind !== "aggressive")}
                  >
                    {level.sharkKind === "aggressive" ? "Tubarão-tigre" : "Tubarão"} ×{level.sharks}
                  </Tag>
                )}
                {level.rocks > 0 && (
                  <Tag icon={<Mountain className="size-3.5" aria-hidden />} fresh={prevLevel?.rocks === 0}>
                    Pedras ×{level.rocks}
                  </Tag>
                )}
                {level.theme === "storm" && <Tag icon={<CloudRain className="size-3.5" aria-hidden />}>Tempestade</Tag>}
                {level.goldenFish && (
                  <Tag icon={<Sparkles className="size-3.5" aria-hidden />} fresh>
                    Peixe Dourado
                  </Tag>
                )}
              </div>
              <p className="mt-6 text-xs text-faint">Toque para começar</p>
            </div>
          </button>
        )}

        {phase.kind === "endless-intro" && (
          <button
            type="button"
            onClick={startStage}
            aria-label="Modo Infinito. Toque para começar."
            className="absolute inset-0 grid cursor-pointer place-items-center bg-bg/75 p-4 backdrop-blur-sm"
          >
            <div className="animate-in fade-in zoom-in-95 text-center duration-500">
              {phase.afterAdventure && (
                <p className="mb-4 text-sm font-medium text-amber-300">
                  Aventura concluída · {total} pontos
                </p>
              )}
              <p className="text-sm font-semibold uppercase tracking-[0.4em] text-primary">Modo</p>
              <InfinityIcon className="mx-auto mt-2 size-24 text-fg sm:size-28" strokeWidth={1.6} aria-hidden />
              <h2 className="mt-2 text-2xl font-semibold italic sm:text-3xl">Infinito</h2>
              <div className="mx-auto my-4 h-px w-16 bg-primary/50" />
              <p className="mx-auto max-w-sm text-sm leading-relaxed text-muted">
                A noite cai sobre o mar. Sobrevive o máximo que conseguires: a dificuldade sobe a cada {ENDLESS.rampEvery} s e só as bolhas de tempo prolongam a run.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2 text-xs">
                <Tag icon={<Clock className="size-3.5" aria-hidden />}>{hud.timeLeft} s iniciais</Tag>
                <Tag icon={<Trophy className="size-3.5" aria-hidden />}>Recorde {progress.bestEndless}</Tag>
              </div>
              <p className="mt-6 text-xs text-faint">Toque para começar</p>
            </div>
          </button>
        )}

        {phase.kind === "shop" && (
          <div className="absolute inset-0 overflow-y-auto bg-bg/80 p-3 backdrop-blur-sm sm:p-6">
            <Shop progress={progress} onBuy={buy} onBuyReserve={buyReserve} onClose={() => setPhase(phase.back)} />
          </div>
        )}

        {(phase.kind === "intro" || phase.kind === "won" || phase.kind === "lost" || phase.kind === "endless-over") && (
          <div className="absolute inset-0 grid place-items-center overflow-y-auto bg-bg/55 p-4 backdrop-blur-[2px]">
            <div className="w-full max-w-md rounded-2xl border border-line bg-surface/95 p-6 text-center shadow-2xl">
              <CoinBalance coins={progress.coins} />
              {phase.kind === "intro" && (
                <>
                  <h2 className="text-2xl font-semibold">Pesca Interativa</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    Uma aventura em {LEVELS.length} níveis, das águas calmas à tempestade. Atinge a pontuação-alvo antes de o tempo acabar e troca pontos por coins ({COIN_RATE} pts = 1 coin).
                  </p>
                  <ul className="mt-4 grid gap-2 text-left text-sm">
                    <Help keys="Rato / dedo" text="mover o barco" />
                    <Help keys="Segurar" text="descer a linha" />
                    <Help keys="Largar" text="recolher e apanhar o que a linha atravessa" />
                    <Help keys="Bolhas" text="toca-lhes com o anzol para ganhar tempo" />
                  </ul>
                  <PrimaryAction onClick={() => newCampaign(0)} icon={<Play className="size-5" aria-hidden />}>
                    Começar aventura
                  </PrimaryAction>
                  {progress.unlocked > 1 && (
                    <SecondaryAction onClick={() => newCampaign(progress.unlocked - 1)}>
                      Continuar no Nível {progress.unlocked} · {LEVELS[progress.unlocked - 1].name}
                    </SecondaryAction>
                  )}
                  {progress.endlessUnlocked && (
                    <SecondaryAction onClick={() => openEndless(false)}>
                      <InfinityIcon className="mr-2 size-4" aria-hidden /> Modo Infinito · recorde {progress.bestEndless}
                    </SecondaryAction>
                  )}
                  <SecondaryAction onClick={openShop}>
                    <ShoppingBag className="mr-2 size-4" aria-hidden /> Loja
                  </SecondaryAction>
                </>
              )}
              {phase.kind === "won" && level && (
                <>
                  <p className="text-sm font-medium uppercase tracking-wider text-primary">Nível {level.number} concluído</p>
                  <p className="mt-1 text-5xl font-bold text-amber-300">{phase.levelScore}</p>
                  <p className="mt-1 text-sm text-muted">
                    Bónus de tempo +{phase.bonus} · Total <b className="text-fg">{total}</b>
                  </p>
                  <CoinsEarned coins={phase.coins} />
                  <PrimaryAction onClick={() => openLevel(levelIndex + 1)} icon={<Play className="size-5" aria-hidden />}>
                    Nível {level.number + 1} · {LEVELS[levelIndex + 1]?.name}
                  </PrimaryAction>
                  <SecondaryAction onClick={openShop}>
                    <ShoppingBag className="mr-2 size-4" aria-hidden /> Loja de upgrades
                  </SecondaryAction>
                </>
              )}
              {phase.kind === "lost" && level && (
                <>
                  <p className="text-sm font-medium uppercase tracking-wider text-danger">Tempo esgotado</p>
                  <p className="mt-1 text-5xl font-bold">
                    {hud.score}
                    <span className="text-2xl text-muted"> / {level.target}</span>
                  </p>
                  <p className="mt-1 text-sm text-muted">Faltaram {Math.max(0, level.target - hud.score)} pontos para passar o Nível {level.number}.</p>
                  <CoinsEarned coins={phase.coins} />
                  <PrimaryAction onClick={() => openLevel(levelIndex)} icon={<RotateCcw className="size-5" aria-hidden />}>
                    Repetir o Nível {level.number}
                  </PrimaryAction>
                  <SecondaryAction onClick={openShop}>
                    <ShoppingBag className="mr-2 size-4" aria-hidden /> Loja de upgrades
                  </SecondaryAction>
                  <SecondaryAction onClick={() => setPhase({ kind: "intro" })}>Menu</SecondaryAction>
                </>
              )}
              {phase.kind === "endless-over" && (
                <>
                  <p className="text-sm font-medium uppercase tracking-wider text-primary">Fim da run infinita</p>
                  <p className="mt-1 text-5xl font-bold text-amber-300">{hud.score}</p>
                  <p className="mt-1 text-sm text-muted">
                    {phase.record ? "Novo recorde!" : `Recorde: ${progress.bestEndless}`} · sobreviveste {hud.elapsed} s · dificuldade {hud.step + 1}
                  </p>
                  <CoinsEarned coins={phase.coins} />
                  <PrimaryAction onClick={() => openEndless(false)} icon={<RotateCcw className="size-5" aria-hidden />}>
                    Nova run infinita
                  </PrimaryAction>
                  <SecondaryAction onClick={openShop}>
                    <ShoppingBag className="mr-2 size-4" aria-hidden /> Loja de upgrades
                  </SecondaryAction>
                  <SecondaryAction onClick={() => setPhase({ kind: "intro" })}>Menu</SecondaryAction>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <section className="mt-6" aria-labelledby="pesca-especies">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="pesca-especies" className="text-lg font-semibold">
            Espécies da aventura
          </h2>
          <span className="text-sm text-muted">
            {speciesFound}/{TALLY_SPECIES.length} apanhadas · recorde aventura {progress.bestAdventure} · infinito {progress.bestEndless}
          </span>
        </div>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {TALLY_SPECIES.map((sp) => {
            const n = shownCatches[sp.key] ?? 0;
            const golden = sp.key === "dourado";
            return (
              <li
                key={sp.key}
                className={`flex items-center gap-3 rounded-xl border p-3 transition-colors ${n ? (golden ? "border-amber-300/60 bg-amber-300/10" : "border-primary/40 bg-surface") : "border-line bg-surface/50"}`}
              >
                <SpeciesIcon sp={sp} dim={!n} />
                <div className="min-w-0">
                  <p className={`truncate text-sm font-semibold ${n ? "" : "text-muted"}`}>{golden && !n ? "???" : sp.name}</p>
                  <p className="text-xs text-muted">
                    {sp.points} pts{n ? <b className="ml-1.5 text-primary">×{n}</b> : null}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}

function Shop({
  progress,
  onBuy,
  onBuyReserve,
  onClose,
}: {
  progress: Progress;
  onBuy: (key: UpgradeKey) => void;
  onBuyReserve: () => void;
  onClose: () => void;
}) {
  const reserveFull = progress.reserve >= RESERVE_BUBBLE.max;
  return (
    <div className="mx-auto w-full max-w-2xl rounded-2xl border border-line bg-surface/95 p-4 shadow-2xl sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <ShoppingBag className="size-5 text-primary" aria-hidden /> Loja de upgrades
        </h2>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/50 bg-amber-300/10 px-3 py-1 text-sm font-semibold text-amber-200">
          <Coins className="size-4" aria-hidden /> {progress.coins}
        </span>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {(Object.keys(UPGRADES) as UpgradeKey[]).map((key) => {
          const def = UPGRADES[key];
          const lvl = progress.upgrades[key];
          const cost = def.costs[lvl] ?? null;
          const max = cost === null;
          return (
            <li key={key} className="flex flex-col rounded-xl border border-line bg-bg/50 p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">{def.name}</p>
                  <p className="text-xs leading-relaxed text-muted">{def.description}</p>
                </div>
                <div className="flex shrink-0 gap-1 pt-1" aria-label={`Nível ${lvl} de ${def.costs.length}`}>
                  {def.costs.map((_, i) => (
                    <span key={i} className={`h-2 w-4 rounded-full ${i < lvl ? "bg-primary" : "bg-surface-2"}`} />
                  ))}
                </div>
              </div>
              <p className="mt-3 text-sm">
                <span className="text-muted">Agora:</span> {def.format(def.values[lvl])}
                {!max && (
                  <>
                    <br />
                    <span className="text-muted">Próximo:</span> <b className="text-primary">{def.format(def.values[lvl + 1])}</b>
                  </>
                )}
              </p>
              <BuyButton cost={cost} coins={progress.coins} onClick={() => onBuy(key)} maxedLabel="Nível máximo" />
            </li>
          );
        })}
        <li className="flex flex-col rounded-xl border border-line bg-bg/50 p-4 sm:col-span-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold">Bolha de reserva</p>
              <p className="text-xs leading-relaxed text-muted">
                +{RESERVE_BUBBLE.seconds} s no início do próximo nível ou run. Acumula até {RESERVE_BUBBLE.max}.
              </p>
            </div>
            <span className="shrink-0 rounded-full border border-primary/40 px-2.5 py-1 text-xs font-semibold text-primary">
              {progress.reserve}/{RESERVE_BUBBLE.max}
            </span>
          </div>
          <BuyButton cost={reserveFull ? null : RESERVE_BUBBLE.cost} coins={progress.coins} onClick={onBuyReserve} maxedLabel="Reserva cheia" />
        </li>
      </ul>
      <button
        type="button"
        onClick={onClose}
        className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-line px-4 text-sm font-medium text-muted transition-colors hover:border-primary/50 hover:text-fg"
      >
        Voltar
      </button>
    </div>
  );
}

function BuyButton({ cost, coins, onClick, maxedLabel }: { cost: number | null; coins: number; onClick: () => void; maxedLabel: string }) {
  if (cost === null) {
    return <p className="mt-3 inline-flex min-h-10 items-center justify-center rounded-lg bg-surface-2/60 text-xs font-medium text-muted">{maxedLabel}</p>;
  }
  const short = coins < cost;
  return (
    <button
      type="button"
      disabled={short}
      onClick={onClick}
      className="mt-3 inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg bg-amber-300 px-3 text-sm font-semibold text-primary-fg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-muted"
    >
      <Coins className="size-4" aria-hidden /> {cost} {short && <span className="font-normal">· faltam {cost - coins}</span>}
    </button>
  );
}

function CoinBalance({ coins }: { coins: number }) {
  return (
    <p className="mb-3 flex justify-end">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/50 bg-amber-300/10 px-3 py-1 text-xs font-semibold text-amber-200">
        <Coins className="size-3.5" aria-hidden /> {coins}
      </span>
    </p>
  );
}

function CoinsEarned({ coins }: { coins: number }) {
  return (
    <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-300/10 px-3 py-1 text-sm font-semibold text-amber-200">
      <Coins className="size-4" aria-hidden /> +{coins} coins
    </p>
  );
}

function PrimaryAction({ onClick, icon, children }: { onClick: () => void; icon: ReactNode; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-base font-semibold text-primary-fg shadow-[0_0_20px_rgb(40_185_255/0.3)] transition-opacity hover:opacity-90"
    >
      {icon}
      {children}
    </button>
  );
}

function SecondaryAction({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-2 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-line px-4 text-sm font-medium text-muted transition-colors hover:border-primary/50 hover:text-fg"
    >
      {children}
    </button>
  );
}

function Tag({ icon, fresh, children }: { icon: ReactNode; fresh?: boolean; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-medium ${fresh ? "border-amber-300/70 bg-amber-300/10 text-amber-200" : "border-line bg-bg/60 text-fg/80"}`}
    >
      {icon}
      {children}
      {fresh && <span className="text-[0.65rem] font-bold uppercase tracking-wider">Novo</span>}
    </span>
  );
}

function HudChip({
  icon,
  label,
  value,
  warn,
  hot,
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
  warn?: boolean;
  hot?: boolean;
}) {
  const tone = warn ? "border-danger/60 bg-danger/15" : hot ? "border-amber-300/60 bg-amber-300/10" : "border-line bg-bg/70";
  return (
    <div className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 backdrop-blur sm:gap-2 sm:px-3 sm:py-2 ${tone}`}>
      {icon}
      <span className="sr-only text-xs text-muted sm:not-sr-only">{label}</span>
      <b className="text-sm tabular-nums sm:text-base">{value}</b>
    </div>
  );
}

function Help({ keys, text }: { keys: string; text: string }) {
  return (
    <li className="flex items-center gap-3">
      <kbd className="min-w-28 rounded-lg border border-line bg-bg px-2 py-1 text-center font-sans text-xs font-semibold text-fg">{keys}</kbd>
      <span className="text-muted">{text}</span>
    </li>
  );
}

/** The species drawn by the game's own renderer, as a small static icon. */
function SpeciesIcon({ sp, dim }: { sp: Species; dim: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
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
    drawCreature(ctx, sp, fit, 0.4);
  }, [sp]);
  return (
    <canvas
      ref={ref}
      aria-hidden
      className={`size-11 shrink-0 rounded-lg bg-[#0f5476]/60 ${dim ? "opacity-40 grayscale" : ""}`}
    />
  );
}
