import type { GameState } from '../game/types';
import { LEVELS } from '../game/levels';

export class HUD {
  private moneyEl: HTMLElement;
  private targetEl: HTMLElement;
  private timerEl: HTMLElement;
  private levelEl: HTMLElement;
  private overlay: HTMLElement;
  private overlayTitle: HTMLElement;
  private overlayMessage: HTMLElement;
  private overlayBtn: HTMLButtonElement;

  constructor() {
    this.moneyEl = document.getElementById('money')!;
    this.targetEl = document.getElementById('target')!;
    this.timerEl = document.getElementById('timer')!;
    this.levelEl = document.getElementById('level')!;
    this.overlay = document.getElementById('overlay')!;
    this.overlayTitle = document.getElementById('overlay-title')!;
    this.overlayMessage = document.getElementById('overlay-message')!;
    this.overlayBtn = document.getElementById('overlay-btn') as HTMLButtonElement;
  }

  update(money: number, target: number, timeLeft: number, levelIndex: number): void {
    this.moneyEl.textContent = `$${money}`;
    this.targetEl.textContent = `$${target}`;
    this.timerEl.textContent = Math.ceil(timeLeft).toString();
    this.levelEl.textContent = `${levelIndex + 1}`;

    if (timeLeft <= 10) {
      this.timerEl.style.color = '#ff4444';
    } else {
      this.timerEl.style.color = '#ffd700';
    }
  }

  showOverlay(state: GameState, levelIndex: number, money: number, target: number): void {
    this.overlay.classList.remove('hidden');

    switch (state) {
      case 'menu':
        this.overlayTitle.textContent = 'Đào Vàng 3D';
        this.overlayMessage.textContent =
          'Móc cẩu tự quét trái/phải.\nNhấn SPACE hoặc Click để hạ móc lấy vàng!\nTránh đá nặng — kéo lên rất chậm.';
        this.overlayBtn.textContent = 'Bắt đầu';
        break;
      case 'paused':
        this.overlayTitle.textContent = 'Tạm dừng';
        this.overlayMessage.textContent = `Tiền: $${money} / $${target}`;
        this.overlayBtn.textContent = 'Tiếp tục';
        break;
      case 'won': {
        const hasNext = levelIndex < LEVELS.length - 1;
        this.overlayTitle.textContent = 'Chúc mừng!';
        this.overlayMessage.textContent = hasNext
          ? `Đạt $${money}! Sẵn sàng cho màn ${levelIndex + 2}?`
          : `Đạt $${money}! Bạn đã hoàn thành tất cả màn!`;
        this.overlayBtn.textContent = hasNext ? 'Màn tiếp theo' : 'Chơi lại';
        break;
      }
      case 'lost':
        this.overlayTitle.textContent = 'Hết giờ!';
        this.overlayMessage.textContent = `Chỉ kiếm được $${money} / $${target}. Thử lại nhé!`;
        this.overlayBtn.textContent = 'Thử lại';
        break;
      default:
        this.overlay.classList.add('hidden');
    }
  }

  hideOverlay(): void {
    this.overlay.classList.add('hidden');
  }

  onOverlayButton(callback: () => void): void {
    this.overlayBtn.addEventListener('click', callback);
  }
}
