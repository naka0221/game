import { test, expect } from '@playwright/test';

test.describe('Gold Miner 3D gameplay', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#game-canvas');
  });

  test('loads menu and starts level 1', async ({ page }) => {
    await expect(page.locator('#overlay-title')).toHaveText('Đào Vàng 3D');
    await page.click('#overlay-btn');
    await expect(page.locator('#overlay')).toHaveClass(/hidden/);
    await expect(page.locator('#target')).toHaveText('$300');
    await expect(page.locator('#level')).toHaveText('1');
  });

  test('SPACE starts game from menu', async ({ page }) => {
    await page.keyboard.press('Space');
    await expect(page.locator('#overlay')).toHaveClass(/hidden/);
    await expect(page.locator('#target')).toHaveText('$300');
  });

  test('hook can collect gold and increase money', async ({ page }) => {
    await page.click('#overlay-btn');

    // Drop hook repeatedly until money increases or timeout
    let money = 0;
    for (let i = 0; i < 40 && money === 0; i++) {
      await page.waitForTimeout(400);
      await page.keyboard.press('Space');
      await page.waitForTimeout(2500);
      const text = await page.locator('#money').textContent();
      money = parseInt(text?.replace('$', '') ?? '0', 10);
    }

    expect(money).toBeGreaterThan(0);
  });

  test('canvas renders WebGL', async ({ page }) => {
    const hasWebGL = await page.evaluate(() => {
      const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
      return !!(canvas?.getContext('webgl2') || canvas?.getContext('webgl'));
    });
    expect(hasWebGL).toBe(true);
  });
});
