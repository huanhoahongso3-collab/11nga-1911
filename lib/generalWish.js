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

const ANGLES = [
  'mở đầu bằng cách gọi cả đám con trai một câu thân mật',
  'mở đầu bằng một nhận xét vui về cả lớp',
  'mở đầu bằng một kỉ niệm nhỏ của lớp',
  'mở đầu như đang nhắn vào nhóm chat của lớp',
];

// Prompt cho nút "Viết lại lời chúc chung" (chỉ chạy khi bấm nút).
export function buildGeneralPrompt() {
  const angle = ANGLES[Math.floor(Math.random() * ANGLES.length)];
  return [
    'Bạn đại diện tập thể nữ lớp 11 Nga viết một lời chúc chung nhân Ngày Quốc tế Nam giới (19/11) gửi TẤT CẢ các bạn nam trong lớp. Đây là lời nhắn thật của bạn bè, không phải bài văn hay thiệp mẫu.',
    '',
    'Ý có thể dùng (chọn vài ý, đừng bịa thêm chi tiết lạ): các bạn nam luôn nhiệt tình, ga-lăng, gánh việc nặng như kê bàn ghế, trực nhật; những pha quăng miếng hài hước cứu cả lớp khỏi tiết học căng thẳng; năm lớp 11 bận rộn nhưng đáng nhớ.',
    'CÁCH MỞ ĐẦU LẦN NÀY: ' + angle + '.',
    '',
    'CÁCH VIẾT (quan trọng)',
    '- Giọng nói chuyện hằng ngày của học sinh cấp 3: thân mật, tự nhiên, có thể dùng "nha", "á", "luôn", "ghê", "thiệt"... vừa phải, đừng lố.',
    '- Xưng "tụi mình", gọi các bạn là "các cậu" hoặc "mấy cậu".',
    '- Câu ngắn dài lẫn lộn như đang nói. Không dùng khuôn "Chúc các bạn luôn ..., mong các bạn ...".',
    '- Tránh sáo rỗng như "vạn sự như ý", "sức khỏe dồi dào", "luôn vui vẻ hạnh phúc", "gặt hái thành công". Lời chúc phải cụ thể và gắn với lớp mình.',
    '- Đúng 3 đoạn ngắn, mỗi đoạn 1 đến 3 câu, cách nhau một dòng trống: lời chào, lời cảm ơn cụ thể, lời chúc cho năm lớp 11.',
    '- Tổng cộng 0 đến 3 emoji. Không nhắc tên riêng ai. Không thô tục.',
    '- Chỉ trả về lời chúc. Không tiêu đề, không markdown, không dấu ngoặc kép bao quanh, không nhắc mình là AI.',
    '',
    'Ví dụ về GIỌNG VĂN (chỉ để lấy cảm giác, tuyệt đối không chép lại): "Cả đám con trai ơi, 19/11 rồi nè. Tụi mình biết mấy cậu hay than mệt mà hễ có việc nặng là có mặt đầu tiên, cảm ơn nhiều nha. Chúc mấy cậu ngủ đủ giấc, điểm cao, và cười thật nhiều như hồi nãy trong giờ ra chơi 😆"',
  ].join('\n');
}

// Tách câu trả lời của AI thành các đoạn, bỏ ký hiệu in đậm.
export function parseGeneralWish(text) {
  return String(text || '')
    .replace(/\*\*/g, '')
    .split(/\r?\n\s*\n/)
    .map((paragraph) => paragraph.replace(/\s*\n\s*/g, ' ').trim())
    .filter(Boolean)
    .slice(0, 5)
    .map((paragraph) => paragraph.slice(0, 700));
}
