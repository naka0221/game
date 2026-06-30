import type { GameState } from './types';
import { getLevel, LEVELS } from './levels';
import { SceneManager } from './SceneManager';
import { checkHookCollision } from './Hook';
import { HUD } from '../ui/HUD';

export class Game {
  private sceneManager: SceneManager;
  private hud: HUD;

  state: GameState = 'menu';
  levelIndex = 0;
  money = 0;
  timeLeft = 60;
  private lastTime = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.sceneManager = new SceneManager(canvas);
    this.hud = new HUD();

    this.hud.onOverlayButton(() => this.onOverlayAction());
    this.setupInput();
    this.hud.showOverlay('menu', 0, 0, 0);
    this.loop(0);
  }

  private setupInput(): void {
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (this.state === 'menu') {
          this.startLevel(0);
          return;
        }
        this.onDrop();
      }
      if (e.code === 'KeyP') {
        this.togglePause();
      }
    });

    this.sceneManager.renderer.domElement.addEventListener('pointerdown', () => {
      if (this.state === 'playing') {
        this.onDrop();
      }
    });
  }

  private onDrop(): void {
    if (this.state !== 'playing') return;
    this.sceneManager.hook.drop();
  }

  private togglePause(): void {
    if (this.state === 'playing') {
      this.state = 'paused';
      const level = getLevel(this.levelIndex);
      this.hud.showOverlay('paused', this.levelIndex, this.money, level.targetMoney);
    } else if (this.state === 'paused') {
      this.state = 'playing';
      this.hud.hideOverlay();
      this.lastTime = performance.now();
    }
  }

  private onOverlayAction(): void {
    switch (this.state) {
      case 'menu':
        this.startLevel(0);
        break;
      case 'paused':
        this.state = 'playing';
        this.hud.hideOverlay();
        this.lastTime = performance.now();
        break;
      case 'won':
        if (this.levelIndex < LEVELS.length - 1) {
          this.startLevel(this.levelIndex + 1);
        } else {
          this.startLevel(0);
        }
        break;
      case 'lost':
        this.startLevel(this.levelIndex);
        break;
    }
  }

  private startLevel(index: number): void {
    this.levelIndex = index;
    const level = getLevel(index);
    this.money = 0;
    this.timeLeft = level.timeLimit;
    this.state = 'playing';
    this.sceneManager.loadLevel(level);
    this.hud.hideOverlay();
    this.hud.update(this.money, level.targetMoney, this.timeLeft, this.levelIndex);
    this.lastTime = performance.now();
  }

  private loop(now: number): void {
    requestAnimationFrame((t) => this.loop(t));

    const dt = Math.min((now - this.lastTime) / 1000, 0.05);
    this.lastTime = now;

    if (this.state === 'playing') {
      this.update(dt);
    }

    this.sceneManager.render();
  }

  private update(dt: number): void {
    const level = getLevel(this.levelIndex);
    const hook = this.sceneManager.hook;

    hook.update(dt);

    const hit = checkHookCollision(hook, this.sceneManager.getItems());
    if (hit) {
      hook.grab(hit);
    }

    if (hook.isAtTop() && hook.attachedItem) {
      const item = hook.consumeCollected();
      if (item) {
        this.money += item.value;
        this.sceneManager.removeItem(item);
        this.flashMoney();
      }
    }

    this.timeLeft -= dt;
    this.hud.update(this.money, level.targetMoney, this.timeLeft, this.levelIndex);

    if (this.money >= level.targetMoney) {
      this.state = 'won';
      this.hud.showOverlay('won', this.levelIndex, this.money, level.targetMoney);
    } else if (this.timeLeft <= 0) {
      this.state = 'lost';
      this.hud.showOverlay('lost', this.levelIndex, this.money, level.targetMoney);
    }
  }

  private flashMoney(): void {
    const el = document.getElementById('money');
    if (!el) return;
    el.style.transform = 'scale(1.2)';
    setTimeout(() => {
      el.style.transform = 'scale(1)';
    }, 150);
  }
}
