# 11nga-1911

Thiệp 19/11 cho các chàng trai 11 Nga. Next.js (App Router) + Tailwind, lời chúc riêng cho từng bạn viết bởi AI qua một serverless function.

## Chạy

```bash
npm install
cp .env.example .env.local   # điền CYO_AI_API (hoặc ANTHROPIC_API_KEY)
npm run dev
```

Trên Android/Termux, Turbopack không chạy được, dùng `npx next build --webpack`.

Thứ tự thử: proxy CYO (`CYO_AI_API`) rồi Claude (`ANTHROPIC_API_KEY`). Không có key nào hoặc cả hai lỗi thì `/api/wish` trả lời chúc viết sẵn của từng bạn.

## Cấu trúc

- `app/page.js`, `app/layout.js`: trang và font
- `app/api/wish/route.js`: serverless function, kiểm tra tên rồi gọi AI (key chỉ nằm ở server)
- `components/`: màn hình nhập tên, thiệp, lời chúc riêng, mã QR
- `lib/generalWish.js`: lời chúc chung mặc định, đổi bằng biến `GENERAL_WISH` (tùy chọn, không đặt thì giữ nguyên)
- `lib/names.js`: luật tên hợp lệ (từ cuối của họ tên hoặc họ tên đầy đủ), dùng chung client và server
- `lib/ai.js`: gọi proxy CYO, dự phòng Claude
- `lib/profiles.js`: dữ liệu từng bạn và prompt (chỉ server)
- `lib/audio.js`, `lib/fireworks.js`, `lib/exportCard.js`: nhạc, pháo, xuất ảnh PNG

## Deploy

Vercel hoặc Netlify: import repo, đặt biến `CYO_AI_API` và/hoặc `ANTHROPIC_API_KEY` (tùy chọn `WISH_MODEL`, mặc định `claude-opus-5-5`).
