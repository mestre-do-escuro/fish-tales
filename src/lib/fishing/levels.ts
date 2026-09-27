// Pesca Interativa campaign: five levels of rising difficulty, each with a
// short line of story for the separator screen. Balancing numbers shared by
// all stages (combo, upgrades, sharks, endless mode…) live in config.ts.
import type { SharkKind, ThemeKey } from "./config";

export interface LevelConfig {
  number: number;
  name: string;
  story: string;
  /** Round length. */
  seconds: number;
  /** Points needed to clear the level. */
  target: number;
  jellyfish: number;
  /** How many times a shark crosses during the level, and which kind. */
  sharks: number;
  sharkKind: SharkKind;
  /** Fixed rocks on the seabed (varied shapes). */
  rocks: number;
  /** Multiplier on every fish's swimming speed. */
  fishSpeed: number;
  theme: ThemeKey;
  /** The golden fish shows up once. */
  goldenFish: boolean;
}

export const LEVELS: LevelConfig[] = [
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
    goldenFish: false,
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
    goldenFish: false,
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
    goldenFish: false,
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
    goldenFish: false,
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
    goldenFish: true,
  },
];
