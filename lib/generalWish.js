// Lời chúc chung hiển thị cho mọi bạn. Dùng **chữ** để in đậm.
export const DEFAULT_GENERAL_WISH = [
  'Chúc mừng ngày Quốc tế Nam giới 19/11 tới toàn thể các chàng trai của đại gia đình **11 Nga**! 🥳',
  'Cảm ơn các cậu vì suốt thời gian qua đã luôn nhiệt tình, ga-lăng và sẵn sàng gánh vác mọi việc nặng nhọc cùng hội con gái — từ kê bàn ghế, trực nhật cho đến những pha quăng miếng hài hước cứu cả lớp khỏi những tiết học căng thẳng.',
  'Năm lớp 11 bận rộn nhưng chắc chắn sẽ thật đáng nhớ khi có các cậu đồng hành. Chúc các bạn nam 11 Nga luôn khỏe mạnh, học tập thật tốt, giữ vững phong độ đỉnh cao và lúc nào cũng rạng rỡ, vui vẻ nhé! 💙',
];

// Tùy chọn: đặt biến GENERAL_WISH để thay lời chúc chung. Để trống thì giữ nguyên lời chúc mặc định ở trên.
// Các đoạn cách nhau bằng một dòng trống (hoặc chuỗi \n\n nếu nơi nhập biến không cho xuống dòng).
export function getGeneralWish() {
  const custom = (process.env.GENERAL_WISH || '').trim();
  if (!custom) return DEFAULT_GENERAL_WISH;

  const paragraphs = custom
    .split(/\r?\n\s*\n|\\n\\n/)
    .map((paragraph) => paragraph.replace(/\\n/g, ' ').trim())
    .filter(Boolean);
  return paragraphs.length ? paragraphs : DEFAULT_GENERAL_WISH;
}
