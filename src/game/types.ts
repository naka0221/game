export type ItemType = 'gold_small' | 'gold_large' | 'rock' | 'diamond' | 'money_bag';

export interface ItemDef {
  type: ItemType;
  value: number;
  weight: number;
  color: number;
  size: number;
}

export const ITEM_DEFS: Record<ItemType, ItemDef> = {
  gold_small: { type: 'gold_small', value: 50, weight: 1, color: 0xffd700, size: 0.4 },
  gold_large: { type: 'gold_large', value: 500, weight: 3, color: 0xffaa00, size: 0.8 },
  rock: { type: 'rock', value: 20, weight: 5, color: 0x888888, size: 0.7 },
  diamond: { type: 'diamond', value: 600, weight: 1, color: 0x00ffff, size: 0.35 },
  money_bag: { type: 'money_bag', value: 0, weight: 1, color: 0x44aa44, size: 0.45 },
};

export interface LevelItemConfig {
  type: ItemType;
  x: number;
  z: number;
  value?: number;
}

export interface LevelConfig {
  id: number;
  targetMoney: number;
  timeLimit: number;
  hookSwingSpeed: number;
  items: LevelItemConfig[];
}

export type GameState = 'menu' | 'playing' | 'paused' | 'won' | 'lost';

export type HookState = 'swinging' | 'extending' | 'retracting';
