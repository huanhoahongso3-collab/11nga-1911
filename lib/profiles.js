// Chỉ dùng phía server. Dữ liệu lấy từ slide Canva, đã viết lại nhẹ nhàng để dùng công khai.
const PROFILES = {
  'Dao Hong Phuc': {
    tone: 'hài hước, trêu nhẹ như bạn thân, xen một chút lời cảm ơn',
    facts: ['nói nhiều đến mức cả lớp phải xin cậu ấy nghỉ giải lao', 'cái đầu trứng nổi tiếng của lớp', 'nhảy nhót trông buồn cười mà dễ thương', 'rất tốt bụng, hay chỉ bài và chia sẻ locket gold, Spotify premium cho các bạn', 'học cực giỏi', 'hay chụp dìm các bạn nhưng cũng chụp đẹp và chịu khó quay chụp lại kỉ niệm của lớp'],
    fallback: "Phúc ơi, nói thiệt là lớp mà thiếu cái giọng nói không ngừng nghỉ của cậu chắc yên tĩnh đến lạ luôn á 😂 Cảm ơn cậu vì toàn chỉ bài, rồi còn chia sẻ cả locket gold với Spotify premium cho tụi mình, lại chịu khó chụp lại kỉ niệm của lớp nữa. Cậu học giỏi nữa chứ, cái đầu trứng này thông minh ghê.",
  },
  'Tran Manh Khang': {
    tone: 'vui vẻ, trêu nhẹ, nhấn mạnh lòng biết ơn vì tài vẽ và sự tận tâm',
    facts: ['nói nhiều toàn chuyện linh tinh', 'trông hơi ngơ ngác nhưng rất nghe lời', 'rất tận tâm với văn nghệ', 'vẽ rất rất đẹp, thức đêm vẽ báo tường cho cả lớp', 'có thói quen ngậm tăm'],
    fallback: "Khang ơi, cảm ơn cậu nhiều lắm vì cái báo tường cậu thức đêm vẽ cho lớp, đẹp thiệt sự luôn đó. Cậu nói nhiều mấy chuyện linh tinh nhưng tụi mình nghe cũng vui mà 😆 Văn nghệ cậu cũng làm hết mình nữa. Chúc cậu vẽ mãi nha, với lại bỏ cái tăm ra khỏi miệng giùm tụi mình hen!",
  },
  'Nguyen Anh Tuan': {
    tone: 'chân thành, ấm áp, thiên về lời cảm ơn, có chút đùa vui về sự chỉn chu',
    facts: ['lớp phó vệ sinh vô cùng trách nhiệm', 'hay giúp đỡ mọi người', 'chỉn chu, sáng sủa và đẹp trai', 'dẫn dắt văn nghệ rất tốt', 'làm việc nhóm cùng cậu ấy ai cũng yên tâm, thậm chí còn làm hộ phần của người khác'],
    fallback: "Tuấn ơi, có cậu làm lớp phó vệ sinh là cả lớp yên tâm hẳn, nhiều khi cậu còn làm luôn phần của người khác mà không kêu ca gì. Lead văn nghệ cũng ngầu nữa. Cảm ơn cậu thiệt nhiều. Hôm nay cậu cứ nghỉ ngơi đi, để người khác làm giúp một lần nha.",
  },
  'Do Tran Thien Minh': {
    tone: 'nhẹ nhàng, hài hước kiểu bựa, thấu hiểu sự tốt bụng thầm lặng',
    facts: ['trắng trẻo, sáng sủa', 'trông ngơ ngác nhưng tiến bộ trong học tập rất nhanh', 'hay sốc và bựa vô cùng', 'tốt với mọi người dù ít thể hiện', 'đôi khi hơi hậu đậu nên bị hiểu lầm là thờ ơ'],
    fallback: "Minh ơi, nhìn cậu ngơ ngơ vậy mà học tiến bộ nhanh ghê, tụi mình phục lắm. Cậu hay bị hiểu lầm là lạnh lùng thôi chứ ai cũng biết cậu tốt mà ít khi nói ra. Chúc cậu cứ bựa bựa vui vui như vậy, và đạt được hết mấy mục tiêu cậu đặt ra nha.",
  },
  'Nguyen Tan Phat': {
    tone: 'vui, thân mật, xen chút nghiêm túc khi nói về sự tinh tế và những buổi nói chuyện sâu',
    facts: ['nụ cười tươi và đẹp', 'thẳng tính', 'chụp ảnh hay thè lưỡi', 'quan tâm và tinh tế với mọi người', 'nói chuyện hay, nhất là lúc deep talk, trưởng thành hơn vẻ ngoài'],
    fallback: "Phát ơi, nụ cười của cậu đẹp thiệt á, nhớ giữ nó nha. Tụi mình thích nhất mấy lúc cậu ngồi nói chuyện nghiêm túc, deep talk xong thấy nhẹ cả lòng, cậu trưởng thành hơn vẻ ngoài nhiều lắm. Còn lần sau chụp ảnh làm ơn cất cái lưỡi vô giùm cái 😂",
  },
  'Tran Tu Nguyen': {
    tone: 'lịch sự, dí dỏm, khen phong thái thư sinh và trách nhiệm',
    facts: ['thư sinh nhất khối', 'sáng sủa, học giỏi vô cùng', 'cao ráo', 'công tử bột theo nghĩa tích cực', 'trách nhiệm trong cả việc lớp lẫn văn nghệ'],
    fallback: "Nguyên ơi, cậu đúng kiểu thư sinh trong truyện luôn, học giỏi, cao ráo, lại còn làm việc lớp với văn nghệ rất có trách nhiệm. Tụi mình thấy tự hào lắm khi có cậu trong lớp. Chúc cậu cứ tự tin và đạt hết những gì cậu muốn nha.",
  },
  'Truong Ngoc Thai An': {
    tone: 'bông đùa như bạn bè thân, trêu nhẹ chuyện bóng đá và cái miệng mạnh mẽ',
    facts: ['nerdy, cười tươi tắn', 'học tốt, làm leader rất ổn', 'họ Trương nghe như người Trung Quốc', 'nói chuyện thoải mái dù hay buông lời mạnh miệng', 'khi thân rồi thì nói nhiều vô cùng', 'ra sân đá bóng trông rất có aura dù chưa thắng trận nào'],
    fallback: "An ơi, thân rồi mới biết cậu nói nhiều dữ chưa, mà nói chuyện với cậu thoải mái thiệt, dù thỉnh thoảng cậu hơi mạnh miệng 😅 Làm leader cũng ổn lắm đó. Chúc cậu sớm thắng được một trận bóng cho xứng với cái aura lúc ra sân nha!",
  },
  'Nguyen Tuan Thanh': {
    tone: 'nhẹ nhàng, dễ thương, trêu về chuyện ngủ gật và cắn bút',
    facts: ['rất cao', 'hay ngủ trong giờ', 'ham vui nên dễ rủ đi chơi', 'thân thiện nhưng khá ít nói', 'hay cắn bút', 'quan tâm mọi người dù cách thể hiện hơi vụng về'],
    fallback: "Thành ơi, cậu cao nhất nhóm mà hay ngủ gật trong giờ, tụi mình để ý hết đó nha 😂 Cậu ít nói thôi chứ quan tâm mọi người theo kiểu vụng vụng dễ thương lắm. Chúc cậu rủ đi chơi là đi, học thì tỉnh táo hơn xíu, và bớt cắn bút lại nha.",
  },
  'Trinh Phan Manh Tan': {
    tone: 'tếu táo, đùa về những câu hài nhạt và gu ăn mặc, nhưng ghi nhận sự hào phóng và học giỏi',
    facts: ['cười tươi, trông rất nerd', 'học tốt, thi được nhất', 'hài nhạt nhưng thích đùa', 'hào phóng, chịu chi cho các sự kiện của lớp', 'dạo này ăn mặc trông khá buồn cười', 'được nhiều người quý'],
    fallback: "Tân ơi, tụi mình hơi cạn lời với mấy câu đùa của cậu thiệt, nhưng cậu chịu chi cho mấy sự kiện của lớp, lại học giỏi nên ai cũng quý cậu. Dạo này gu ăn mặc của cậu cũng độc đáo ghê. Cảm ơn cậu nha, giữ phong độ nhé!",
  },
  'Lai Minh Quang': {
    tone: 'vui vẻ, trêu nhẹ cái miệng nói nhiều và việc hay vắng tập văn nghệ, nhưng khen trí nhớ và sự tốt bụng',
    facts: ['cao ráo', 'học giỏi, trí nhớ siêu tốt', 'nói nhiều nhất nhì lớp', 'ít ở lại tập văn nghệ nhưng khi tập thì rất chăm', 'trách nhiệm và tốt với bạn bè, đôi khi làm người khác xúc động'],
    fallback: "Quang ơi, cậu nói nhiều nhất nhì lớp mà trí nhớ siêu thiệt, hỏi gì cậu cũng nhớ. Tiếc là cậu hay về sớm sau buổi tập văn nghệ, nhưng lúc tập là cậu chăm lắm. Cảm ơn cậu vì luôn tốt với bạn bè nha. Lần sau ở lại tập lâu hơn xíu cũng được 😆",
  },
  'Vu Duc Quy': {
    tone: 'dịu dàng, đáng yêu, khen sự đáng tin và hay chia sẻ kiến thức',
    facts: ['nhỏ nhắn, cute', 'học giỏi và tốt bụng', 'dễ gần, nói chuyện dễ chịu', 'biết nhiều thứ và hay chia sẻ cho mọi người', 'trách nhiệm với mọi việc của lớp'],
    fallback: "Quý ơi, cậu nhỏ nhắn dễ thương mà biết nhiều thứ ghê, cái gì hay cậu cũng chia sẻ cho cả lớp. Việc lớp giao cho cậu thì khỏi lo luôn. Cảm ơn cậu nha. Chúc cậu luôn khỏe, tự tin và đạt hết mục tiêu của mình.",
  },
};

const ANGLES = [
  'mở đầu bằng một câu trêu nhẹ rồi chuyển sang lời cảm ơn',
  'mở đầu bằng lời cảm ơn cụ thể rồi kết bằng một câu đùa',
  'kể như một kỉ niệm nhỏ của lớp rồi gửi lời chúc',
  'viết như đang nói trực tiếp với bạn ấy, rất tự nhiên',
];

// Tùy chọn giọng điệu do người xem chọn. Không chọn thì không thêm gì vào prompt (giữ nguyên như cũ).
export const TONE_PROMPTS = {
  funny: 'hài hước và tếu táo hơn bình thường, nhiều câu trêu đáng yêu, vẫn có một câu cảm ơn thật lòng.',
  touching: 'ấm áp, chân thành, xúc động nhẹ, ít đùa, tập trung vào lời cảm ơn và những điều tốt đẹp của bạn ấy.',
  short: 'thật ngắn gọn: chỉ 2 đến 3 câu, đi thẳng vào ý.',
};

export function getProfile(full) {
  return PROFILES[full] || null;
}

export function buildPrompt(person, profile, tone = '') {
  const angle = ANGLES[Math.floor(Math.random() * ANGLES.length)];
  return [
    'Bạn là một bạn nữ trong lớp 11 Nga, đang nhắn tin chúc 19/11 (Ngày Quốc tế Nam giới) cho một bạn nam cùng lớp. Đây là tin nhắn thật của một người bạn, không phải bài văn hay thiệp mẫu.',
    '',
    'NGƯỜI NHẬN',
    '- Họ tên: ' + person.full,
    '- Tên gọi: ' + person.call,
    '',
    'NHỮNG ĐIỀU CẢ LỚP BIẾT VỀ ' + person.call.toUpperCase() + ' (chỉ dùng những điều này, không bịa thêm)',
    profile.facts.map((f) => '- ' + f).join('\n'),
    '',
    'GIỌNG ĐIỆU RIÊNG CHO BẠN NÀY: ' + profile.tone + '.',
    'CÁCH MỞ ĐẦU LẦN NÀY: ' + angle + '.',
    ...(Object.hasOwn(TONE_PROMPTS, tone)
      ? ['GIỌNG ĐIỆU NGƯỜI XEM CHỌN LẦN NÀY (ưu tiên hơn giọng riêng và độ dài ở dưới nếu mâu thuẫn): ' + TONE_PROMPTS[tone]]
      : []),
    '',
    'CÁCH VIẾT (quan trọng)',
    '- Giọng nói chuyện hằng ngày của học sinh cấp 3: thân mật, tự nhiên, có thể dùng "nha", "á", "luôn", "ghê", "thiệt", "hen", "à mà"... vừa phải, đừng lố.',
    '- Xưng "tớ" hoặc "tụi mình", gọi bạn ấy là "cậu" hoặc gọi thẳng tên.',
    '- Câu ngắn dài lẫn lộn như đang nói, được phép có một câu rất ngắn. Không cần ngữ pháp trang trọng.',
    '- KHÔNG mở bài bằng "Chúc ..." và không dùng khuôn "Chúc cậu luôn ..., mong cậu ...". Mở đầu bằng cách gọi tên, một nhận xét hoặc một kỉ niệm nhỏ.',
    '- Tránh sáo rỗng như "vạn sự như ý", "sức khỏe dồi dào", "luôn vui vẻ hạnh phúc", "gặt hái thành công". Lời chúc (nếu có) phải cụ thể, gắn với đúng con người này, tối đa một câu.',
    '- Nhắc 2-3 chi tiết riêng ở trên theo kiểu kể chuyện, trêu rất nhẹ và đáng yêu, kèm một câu cảm ơn thật lòng.',
    '- Dài 3 đến 5 câu, một đoạn duy nhất. Dùng 0 đến 2 emoji, đừng rải khắp nơi.',
    '- Không thô tục; không đùa về giới tính, xu hướng, cân nặng hay ngoại hình theo hướng chê bai.',
    '- Chỉ trả về chính tin nhắn. Không tiêu đề, không markdown, không dấu ngoặc kép bao quanh, không nhắc mình là AI.',
    '',
    'Ví dụ về GIỌNG VĂN cho một bạn khác (chỉ để lấy cảm giác, tuyệt đối không chép lại): "Bình ơi, nay 19/11 nên tớ nhắn cậu xíu nè. Cậu than buồn ngủ hoài mà bài nào cũng nộp đủ, tụi mình phục á. Cảm ơn vụ hôm bữa cho tớ mượn vở nha. Mong cậu ngủ đủ giấc, đỡ ngáp trong giờ cô 😆"',
  ].join('\n');
}
