# Đào Vàng 3D

Game arcade đào vàng 3D chạy trên trình duyệt, xây bằng **Three.js** + **TypeScript** + **Vite**.

## Cách chơi

- Móc cẩu tự động quét trái/phải
- Nhấn **SPACE** hoặc **Click** để hạ móc
- Lấy vàng, kim cương, túi tiền — tránh đá nặng (kéo lên chậm)
- Đạt đủ tiền mục tiêu trước khi hết giờ để qua màn

## Chạy local

```bash
npm install
npm run dev
```

Mở http://localhost:5173

## Chơi online

https://naka0221.github.io/game/

> **Lần đầu deploy:** Vào [Settings → Pages](https://github.com/naka0221/game/settings/pages), chọn **Deploy from a branch**, branch **gh-pages**, folder **/ (root)**, rồi Save. Sau vài phút game sẽ live tại URL trên.

Mỗi lần push lên `main`, GitHub Actions tự build và deploy lên branch `gh-pages`.

## Build production

```bash
npm run build
npm run preview
```

## Cấu trúc

```
src/
├── game/
│   ├── Game.ts          # Game loop, win/lose
│   ├── SceneManager.ts  # Three.js scene
│   ├── Hook.ts          # Móc cẩu
│   ├── Item.ts          # Vật phẩm
│   ├── levels.ts        # 5 màn chơi
│   └── types.ts
├── ui/
│   └── HUD.ts           # Giao diện HUD + overlay
└── main.ts
```
