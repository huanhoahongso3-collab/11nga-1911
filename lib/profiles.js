// Chỉ dùng phía server. Dữ liệu lấy từ slide Canva, đã viết lại nhẹ nhàng để dùng công khai.
const PROFILES = {
  'Dao Hong Phuc': {
    tone: 'hài hước, trêu nhẹ như bạn thân, xen một chút lời cảm ơn',
    facts: ['nói nhiều đến mức cả lớp phải xin cậu ấy nghỉ giải lao', 'cái đầu trứng nổi tiếng của lớp', 'nhảy nhót trông buồn cười mà dễ thương', 'rất tốt bụng, hay chỉ bài và chia sẻ locket gold, Spotify premium cho các bạn', 'học cực giỏi', 'hay chụp dìm các bạn nhưng cũng chụp đẹp và chịu khó quay chụp lại kỉ niệm của lớp'],
    fallback: "Chúc Phúc ngày Boy's Day vui hết cỡ! Cậu nói nhiều thật, nhưng chính cậu chỉ bài, chia sẻ cả locket gold lẫn Spotify premium cho cả lớp, rồi còn chụp lại những kỉ niệm của tụi mình nữa. Mong cái đầu trứng thông minh này luôn học giỏi, khỏe mạnh và đạt hết mục tiêu nhé!",
  },
  'Tran Manh Khang': {
    tone: 'vui vẻ, trêu nhẹ, nhấn mạnh lòng biết ơn vì tài vẽ và sự tận tâm',
    facts: ['nói nhiều toàn chuyện linh tinh', 'trông hơi ngơ ngác nhưng rất nghe lời', 'rất tận tâm với văn nghệ', 'vẽ rất rất đẹp, thức đêm vẽ báo tường cho cả lớp', 'có thói quen ngậm tăm'],
    fallback: "Chúc Khang một ngày Boy's Day thật vui! Cảm ơn cậu đã thức đêm vẽ báo tường cho lớp và tận tâm với văn nghệ, tụi mình nhớ hết đó. Mong cậu luôn vẽ thật đẹp, đạt mọi mục tiêu, và nhớ bỏ cái tăm ra trước khi nói chuyện nhé!",
  },
  'Nguyen Anh Tuan': {
    tone: 'chân thành, ấm áp, thiên về lời cảm ơn, có chút đùa vui về sự chỉn chu',
    facts: ['lớp phó vệ sinh vô cùng trách nhiệm', 'hay giúp đỡ mọi người', 'chỉn chu, sáng sủa và đẹp trai', 'dẫn dắt văn nghệ rất tốt', 'làm việc nhóm cùng cậu ấy ai cũng yên tâm, thậm chí còn làm hộ phần của người khác'],
    fallback: "Chúc Tuấn một ngày Boy's Day thật ý nghĩa! Có cậu làm lớp phó vệ sinh và dẫn dắt văn nghệ, ai cũng thấy yên tâm, nhiều khi cậu còn làm hộ cả phần việc của người khác. Mong cậu luôn sáng sủa, khỏe mạnh và nhận lại thật nhiều điều tốt đẹp như những gì cậu đã cho đi.",
  },
  'Do Tran Thien Minh': {
    tone: 'nhẹ nhàng, hài hước kiểu bựa, thấu hiểu sự tốt bụng thầm lặng',
    facts: ['trắng trẻo, sáng sủa', 'trông ngơ ngác nhưng tiến bộ trong học tập rất nhanh', 'hay sốc và bựa vô cùng', 'tốt với mọi người dù ít thể hiện', 'đôi khi hơi hậu đậu nên bị hiểu lầm là thờ ơ'],
    fallback: "Chúc Thiện Minh ngày Boy's Day thật vui! Cậu trông ngơ ngác vậy thôi chứ học tiến bộ nhanh lắm, lại còn tốt với mọi người dù ít khi thể hiện. Tụi mình hiểu hết, cậu không hề thờ ơ đâu. Chúc cậu luôn bựa vui, khỏe mạnh và đạt mọi mục tiêu!",
  },
  'Nguyen Tan Phat': {
    tone: 'vui, thân mật, xen chút nghiêm túc khi nói về sự tinh tế và những buổi nói chuyện sâu',
    facts: ['nụ cười tươi và đẹp', 'thẳng tính', 'chụp ảnh hay thè lưỡi', 'quan tâm và tinh tế với mọi người', 'nói chuyện hay, nhất là lúc deep talk, trưởng thành hơn vẻ ngoài'],
    fallback: "Chúc Phát một ngày Boy's Day thật tuyệt! Cậu thẳng tính, cười tươi, và quan trọng hơn là rất tinh tế với mọi người, những buổi deep talk với cậu tụi mình đều nhớ. Mong cậu luôn vui, khỏe, và lần sau chụp ảnh nhớ thu cái lưỡi lại nha!",
  },
  'Tran Tu Nguyen': {
    tone: 'lịch sự, dí dỏm, khen phong thái thư sinh và trách nhiệm',
    facts: ['thư sinh nhất khối', 'sáng sủa, học giỏi vô cùng', 'cao ráo', 'công tử bột theo nghĩa tích cực', 'trách nhiệm trong cả việc lớp lẫn văn nghệ'],
    fallback: "Chúc Nguyên ngày Boy's Day thật trọn vẹn! Cậu thư sinh, học giỏi, cao ráo, lại còn trách nhiệm cả việc lớp lẫn văn nghệ, đúng kiểu công tử bột theo nghĩa tích cực. Chúc cậu luôn tự tin, khỏe mạnh và chạm tới mọi mục tiêu của mình.",
  },
  'Truong Ngoc Thai An': {
    tone: 'bông đùa như bạn bè thân, trêu nhẹ chuyện bóng đá và cái miệng mạnh mẽ',
    facts: ['nerdy, cười tươi tắn', 'học tốt, làm leader rất ổn', 'họ Trương nghe như người Trung Quốc', 'nói chuyện thoải mái dù hay buông lời mạnh miệng', 'khi thân rồi thì nói nhiều vô cùng', 'ra sân đá bóng trông rất có aura dù chưa thắng trận nào'],
    fallback: "Chúc Thái An ngày Boy's Day thật vui! Cậu học tốt, làm leader ổn áp, nói chuyện thoải mái và khi thân thì nói không ngừng luôn. Chúc cậu sớm thắng trận bóng đầu tiên cho xứng với cái aura trên sân, và luôn khỏe mạnh, hạnh phúc nhé!",
  },
  'Nguyen Tuan Thanh': {
    tone: 'nhẹ nhàng, dễ thương, trêu về chuyện ngủ gật và cắn bút',
    facts: ['rất cao', 'hay ngủ trong giờ', 'ham vui nên dễ rủ đi chơi', 'thân thiện nhưng khá ít nói', 'hay cắn bút', 'quan tâm mọi người dù cách thể hiện hơi vụng về'],
    fallback: "Chúc Thành ngày Boy's Day thật vui! Cậu cao nhất nhóm, dễ rủ đi chơi, ít nói mà vẫn quan tâm mọi người theo cách vụng về rất đáng yêu. Mong cậu ngủ ít trong giờ hơn một chút, đừng cắn bút nữa, và luôn khỏe, luôn vui nhé!",
  },
  'Trinh Phan Manh Tan': {
    tone: 'tếu táo, đùa về những câu hài nhạt và gu ăn mặc, nhưng ghi nhận sự hào phóng và học giỏi',
    facts: ['cười tươi, trông rất nerd', 'học tốt, thi được nhất', 'hài nhạt nhưng thích đùa', 'hào phóng, chịu chi cho các sự kiện của lớp', 'dạo này ăn mặc trông khá buồn cười', 'được nhiều người quý'],
    fallback: "Chúc Tân ngày Boy's Day thật vui! Cậu hài nhạt nhưng thích đùa, học giỏi, hào phóng với bạn bè và luôn chịu chi cho các sự kiện của lớp nên ai cũng quý. Chúc cậu giữ vững phong độ, mặc đồ thật chất và đạt mọi mục tiêu!",
  },
  'Lai Minh Quang': {
    tone: 'vui vẻ, trêu nhẹ cái miệng nói nhiều và việc hay vắng tập văn nghệ, nhưng khen trí nhớ và sự tốt bụng',
    facts: ['cao ráo', 'học giỏi, trí nhớ siêu tốt', 'nói nhiều nhất nhì lớp', 'ít ở lại tập văn nghệ nhưng khi tập thì rất chăm', 'trách nhiệm và tốt với bạn bè, đôi khi làm người khác xúc động'],
    fallback: "Chúc Quang ngày Boy's Day thật vui! Cậu học giỏi, trí nhớ siêu tốt, nói nhiều nhất nhì lớp, và dù hay về sớm sau buổi tập thì tụi mình vẫn thấy cậu cực kì tốt với bạn bè. Chúc cậu luôn khỏe, luôn vui và đạt mọi điều mình mong muốn.",
  },
  'Vu Duc Quy': {
    tone: 'dịu dàng, đáng yêu, khen sự đáng tin và hay chia sẻ kiến thức',
    facts: ['nhỏ nhắn, cute', 'học giỏi và tốt bụng', 'dễ gần, nói chuyện dễ chịu', 'biết nhiều thứ và hay chia sẻ cho mọi người', 'trách nhiệm với mọi việc của lớp'],
    fallback: "Chúc Quý ngày Boy's Day thật đáng nhớ! Cậu nhỏ nhắn dễ thương, học giỏi, biết nhiều thứ và luôn sẵn lòng chia sẻ, lại còn trách nhiệm với mọi việc của lớp. Chúc cậu luôn khỏe mạnh, tự tin và đạt được mọi mục tiêu của mình.",
  },
};

const ANGLES = [
  'mở đầu bằng một câu trêu nhẹ rồi chuyển sang lời cảm ơn',
  'mở đầu bằng lời cảm ơn cụ thể rồi kết bằng một câu đùa',
  'kể như một kỉ niệm nhỏ của lớp rồi gửi lời chúc',
  'viết như đang nói trực tiếp với bạn ấy, rất tự nhiên',
];

export function getProfile(full) {
  return PROFILES[full] || null;
}

export function buildPrompt(person, profile) {
  const angle = ANGLES[Math.floor(Math.random() * ANGLES.length)];
  return [
    'Bạn đại diện tập thể nữ lớp 11 Nga viết lời chúc nhân Ngày Quốc tế Nam giới (19/11) gửi tặng một bạn nam trong lớp.',
    '',
    'NGƯỜI NHẬN',
    '- Họ tên: ' + person.full,
    '- Tên gọi: ' + person.call,
    '',
    'NHỮNG ĐIỀU CẢ LỚP BIẾT VỀ ' + person.call.toUpperCase() + ' (chỉ dùng những điều này, không bịa thêm)',
    profile.facts.map((f) => '- ' + f).join('\n'),
    '',
    'GIỌNG VĂN RIÊNG CHO BẠN NÀY: ' + profile.tone + '.',
    'CÁCH MỞ BÀI LẦN NÀY: ' + angle + '.',
    '',
    'YÊU CẦU',
    '- Viết bằng tiếng Việt, 4 đến 6 câu, một đoạn duy nhất, xưng "tụi mình" và gọi bạn ấy là "cậu".',
    '- Nhắc đến ít nhất 2 chi tiết riêng ở trên, trêu thật nhẹ nhàng, thân mật, không làm bạn ấy tổn thương.',
    '- Không dùng lời thô tục, không đùa về giới tính, xu hướng, cân nặng hay ngoại hình theo hướng chê bai.',
    '- Có lời chúc thật lòng về sức khỏe, tự tin và đạt được mục tiêu.',
    '- Chỉ trả về nội dung lời chúc, không tiêu đề, không markdown, không giải thích.',
  ].join('\n');
}
