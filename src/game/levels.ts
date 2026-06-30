import type { LevelConfig } from './types';

export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    targetMoney: 300,
    timeLimit: 60,
    hookSwingSpeed: 1.2,
    items: [
      { type: 'gold_small', x: -3, z: 2 },
      { type: 'gold_small', x: 2, z: 3 },
      { type: 'gold_large', x: 0, z: 4 },
      { type: 'rock', x: -2, z: 5 },
      { type: 'gold_small', x: 4, z: 1 },
    ],
  },
  {
    id: 2,
    targetMoney: 600,
    timeLimit: 60,
    hookSwingSpeed: 1.4,
    items: [
      { type: 'gold_small', x: -4, z: 2 },
      { type: 'gold_large', x: -1, z: 4 },
      { type: 'rock', x: 2, z: 3 },
      { type: 'rock', x: -3, z: 5 },
      { type: 'diamond', x: 3, z: 5 },
      { type: 'gold_small', x: 4, z: 1 },
      { type: 'money_bag', x: 0, z: 2, value: 150 },
    ],
  },
  {
    id: 3,
    targetMoney: 1000,
    timeLimit: 70,
    hookSwingSpeed: 1.6,
    items: [
      { type: 'gold_large', x: -4, z: 3 },
      { type: 'gold_large', x: 3, z: 4 },
      { type: 'rock', x: -2, z: 5 },
      { type: 'rock', x: 1, z: 2 },
      { type: 'rock', x: 4, z: 6 },
      { type: 'diamond', x: -3, z: 6 },
      { type: 'diamond', x: 0, z: 3 },
      { type: 'money_bag', x: 2, z: 1, value: 200 },
      { type: 'gold_small', x: -1, z: 1 },
    ],
  },
  {
    id: 4,
    targetMoney: 1500,
    timeLimit: 75,
    hookSwingSpeed: 1.8,
    items: [
      { type: 'gold_large', x: -5, z: 4 },
      { type: 'gold_large', x: 4, z: 5 },
      { type: 'rock', x: -3, z: 3 },
      { type: 'rock', x: 0, z: 6 },
      { type: 'rock', x: 3, z: 2 },
      { type: 'diamond', x: -1, z: 5 },
      { type: 'diamond', x: 2, z: 4 },
      { type: 'money_bag', x: -4, z: 1, value: 250 },
      { type: 'money_bag', x: 5, z: 3, value: 100 },
      { type: 'gold_small', x: 1, z: 1 },
    ],
  },
  {
    id: 5,
    targetMoney: 2000,
    timeLimit: 80,
    hookSwingSpeed: 2.0,
    items: [
      { type: 'gold_large', x: -4, z: 2 },
      { type: 'gold_large', x: 4, z: 3 },
      { type: 'gold_large', x: 0, z: 6 },
      { type: 'rock', x: -2, z: 4 },
      { type: 'rock', x: 2, z: 5 },
      { type: 'rock', x: -5, z: 5 },
      { type: 'rock', x: 3, z: 1 },
      { type: 'diamond', x: -3, z: 1 },
      { type: 'diamond', x: 1, z: 3 },
      { type: 'diamond', x: 5, z: 6 },
      { type: 'money_bag', x: 0, z: 2, value: 300 },
      { type: 'gold_small', x: -1, z: 6 },
    ],
  },
];

export function getLevel(index: number): LevelConfig {
  return LEVELS[Math.min(index, LEVELS.length - 1)];
}
