import { test, expect } from '@playwright/test';

const PIVOT_Y = 9;
const PIVOT_Z = 4;
const MAX_ROPE = 20;

function tipPosition(angle: number, ropeLength: number) {
  const x = Math.sin(angle) * ropeLength;
  const y = PIVOT_Y - Math.cos(angle) * ropeLength;
  const z = PIVOT_Z;
  return { x, y, z };
}

function distance(a: { x: number; y: number; z: number }, b: { x: number; y: number; z: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
}

test.describe('Hook collision math', () => {
  const level1Items = [
    { x: -3, z: 4, radius: 0.32 },
    { x: 2, z: 4, radius: 0.32 },
    { x: 0, z: 4, radius: 0.64 },
    { x: -2, z: 4, radius: 0.56 },
    { x: 4, z: 4, radius: 0.32 },
  ];

  test('hook tip can reach all level 1 items', () => {
    for (const item of level1Items) {
      let reachable = false;
      for (let angle = -Math.PI / 3; angle <= Math.PI / 3; angle += 0.05) {
        for (let len = 8; len <= MAX_ROPE; len += 0.5) {
          const tip = tipPosition(angle, len);
          const itemPos = { x: item.x, y: 0.4, z: item.z };
          if (distance(tip, itemPos) < item.radius + 0.6) {
            reachable = true;
            break;
          }
        }
        if (reachable) break;
      }
      expect(reachable, `item at x=${item.x}`).toBe(true);
    }
  });
});
