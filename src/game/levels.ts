import type { LevelConfig } from './types';

// Items share play-plane Z so the hook (swings in X-Y at Z=4) can reach them.
const Z = 4;

export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    targetMoney: 300,
    timeLimit: 60,
    hookSwingSpeed: 1.2,
    items: [
      { type: 'gold_small', x: -3, z: Z },
      { type: 'gold_small', x: 2, z: Z },
      { type: 'gold_large', x: 0, z: Z },
      { type: 'rock', x: -2, z: Z },
      { type: 'gold_small', x: 4, z: Z },
    ],
  },
  {
    id: 2,
    targetMoney: 600,
    timeLimit: 60,
    hookSwingSpeed: 1.4,
    items: [
      { type: 'gold_small', x: -4, z: Z },
      { type: 'gold_large', x: -1, z: Z },
      { type: 'rock', x: 2, z: Z },
      { type: 'rock', x: -3, z: Z },
      { type: 'diamond', x: 3, z: Z },
      { type: 'gold_small', x: 4, z: Z },
      { type: 'money_bag', x: 0, z: Z, value: 150 },
    ],
  },
  {
    id: 3,
    targetMoney: 1000,
    timeLimit: 70,
    hookSwingSpeed: 1.6,
    items: [
      { type: 'gold_large', x: -4, z: Z },
      { type: 'gold_large', x: 3, z: Z },
      { type: 'rock', x: -2, z: Z },
      { type: 'rock', x: 1, z: Z },
      { type: 'rock', x: 4, z: Z },
      { type: 'diamond', x: -3, z: Z },
      { type: 'diamond', x: 0, z: Z },
      { type: 'money_bag', x: 2, z: Z, value: 200 },
      { type: 'gold_small', x: -1, z: Z },
    ],
  },
  {
    id: 4,
    targetMoney: 1500,
    timeLimit: 75,
    hookSwingSpeed: 1.8,
    items: [
      { type: 'gold_large', x: -5, z: Z },
      { type: 'gold_large', x: 4, z: Z },
      { type: 'rock', x: -3, z: Z },
      { type: 'rock', x: 0, z: Z },
      { type: 'rock', x: 3, z: Z },
      { type: 'diamond', x: -1, z: Z },
      { type: 'diamond', x: 2, z: Z },
      { type: 'money_bag', x: -4, z: Z, value: 250 },
      { type: 'money_bag', x: 5, z: Z, value: 100 },
      { type: 'gold_small', x: 1, z: Z },
    ],
  },
  {
    id: 5,
    targetMoney: 2000,
    timeLimit: 80,
    hookSwingSpeed: 2.0,
    items: [
      { type: 'gold_large', x: -4, z: Z },
      { type: 'gold_large', x: 4, z: Z },
      { type: 'gold_large', x: 0, z: Z },
      { type: 'rock', x: -2, z: Z },
      { type: 'rock', x: 2, z: Z },
      { type: 'rock', x: -5, z: Z },
      { type: 'rock', x: 3, z: Z },
      { type: 'diamond', x: -3, z: Z },
      { type: 'diamond', x: 1, z: Z },
      { type: 'diamond', x: 5, z: Z },
      { type: 'money_bag', x: 0, z: Z, value: 300 },
      { type: 'gold_small', x: -1, z: Z },
    ],
  },
];

export function getLevel(index: number): LevelConfig {
  return LEVELS[Math.min(index, LEVELS.length - 1)];
}
