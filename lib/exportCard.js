function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && i > 0) {
      ctx.fillText(line.trim(), x, currentY);
      line = words[i] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, currentY);
  return currentY;
}

export function renderPersonalCard(name, wish) {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 960;
  const ctx = canvas.getContext('2d');

  // 1. Nền kem sữa + lưới chấm bi & ô sổ tay pastel
  ctx.fillStyle = '#FFFDF9';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = 'rgba(169, 223, 177, 0.28)';
  ctx.lineWidth = 1.5;
  for (let x = 0; x < canvas.width; x += 32) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += 32) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
  }

  // 2. Khung thẻ giấy bo tròn + bóng đổ xanh mint dịu
  ctx.fillStyle = '#A9DFB1';
  ctx.beginPath();
  ctx.roundRect(56, 72, 688, 826, 40);
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#A9DFB1';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(56, 58, 688, 826, 40);
  ctx.fill();
  ctx.stroke();

  // 3. Băng dính washi tape hồng phấn trên đỉnh thiệp
  ctx.save();
  ctx.translate(400, 58);
  ctx.rotate(-0.025);
  ctx.fillStyle = 'rgba(255, 229, 236, 0.94)';
  ctx.fillRect(-105, -20, 210, 40);
  ctx.restore();

  // 4. Huy hiệu 19/11 • Lớp 11 Nga
  ctx.fillStyle = '#FFF3C4';
  ctx.strokeStyle = '#EBD584';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(225, 112, 350, 48, 24);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#4A4238';
  ctx.font = 'bold 21px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('19/11 • LỚP 11 NGA ✨', 400, 143);

  // 5. Lời đề tặng & Tên bạn nam
  ctx.fillStyle = '#7A7065';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('Tập thể nữ 11 Nga gửi tặng', 400, 212);

  ctx.fillStyle = '#4A4238';
  ctx.font = 'bold 44px sans-serif';
  ctx.fillText(name, 400, 268);

  // Đường kẻ nét đứt nhẹ
  ctx.strokeStyle = '#EFE6D8';
  ctx.lineWidth = 3;
  ctx.setLineDash([10, 8]);
  ctx.beginPath();
  ctx.moveTo(120, 304);
  ctx.lineTo(680, 304);
  ctx.stroke();
  ctx.setLineDash([]);

  // 6. Khung chứa nội dung lời chúc riêng
  ctx.fillStyle = '#F7FCF8';
  ctx.strokeStyle = '#D8F3DC';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(104, 336, 592, 410, 28);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#4A4238';
  ctx.font = '500 25px sans-serif';
  ctx.textAlign = 'left';
  wrapCanvasText(ctx, `"${wish}"`, 144, 396, 512, 42);

  // 7. Chữ ký cuối thiệp
  ctx.fillStyle = '#7A7065';
  ctx.font = 'bold 23px sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('— Hội con gái lớp 11 Nga ♥ —', 656, 706);

  ctx.textAlign = 'center';
  ctx.font = '600 20px sans-serif';
  ctx.fillText('Happy International Men\'s Day • 19/11', 400, 822);

  return canvas;
}

export function renderQrCard(source) {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 840;
  const ctx = canvas.getContext('2d');

  // 1. Nền kem sữa + lưới chấm bi & ô sổ tay
  ctx.fillStyle = '#FFFDF9';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = 'rgba(169, 223, 177, 0.3)';
  ctx.lineWidth = 1.5;
  for (let x = 0; x < canvas.width; x += 28) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += 28) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
  }

  // 2. Thẻ trắng bo tròn + bóng đổ xanh mint dịu
  ctx.fillStyle = '#A9DFB1';
  ctx.beginPath();
  ctx.roundRect(48, 58, 544, 734, 36);
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#A9DFB1';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(48, 46, 544, 734, 36);
  ctx.fill();
  ctx.stroke();

  // 3. Băng dính washi tape cam đào pastel
  ctx.save();
  ctx.translate(320, 46);
  ctx.rotate(-0.025);
  ctx.fillStyle = 'rgba(255, 216, 190, 0.92)';
  ctx.fillRect(-90, -18, 180, 36);
  ctx.restore();

  // 4. Huy hiệu Lớp 11 Nga • 19/11
  ctx.fillStyle = '#FFF3C4';
  ctx.strokeStyle = '#EBD584';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(165, 92, 310, 46, 23);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#4A4238';
  ctx.font = 'bold 21px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Lớp 11 Nga • 19/11 ✨', 320, 122);

  // 5. Lời mời gọi quét mã
  ctx.fillStyle = '#4A4238';
  ctx.font = 'bold 27px sans-serif';
  ctx.fillText('Quét mã & nhập tên', 320, 186);

  ctx.fillStyle = '#7A7065';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('để nhận thiệp nhé!', 320, 222);

  // 6. Khung chứa mã QR chung
  const boxSize = 370;
  const boxX = (canvas.width - boxSize) / 2;
  const boxY = 256;

  ctx.fillStyle = '#FFFDF9';
  ctx.strokeStyle = '#F3BE9C';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(boxX, boxY, boxSize, boxSize, 28);
  ctx.fill();
  ctx.stroke();

  ctx.drawImage(source, boxX + 25, boxY + 25, boxSize - 50, boxSize - 50);

  // Đường kẻ nét đứt
  ctx.strokeStyle = '#EFE6D8';
  ctx.lineWidth = 3;
  ctx.setLineDash([10, 8]);
  ctx.beginPath();
  ctx.moveTo(95, 672);
  ctx.lineTo(545, 672);
  ctx.stroke();
  ctx.setLineDash([]);

  // Chữ ký
  ctx.fillStyle = '#7A7065';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('From Tập thể nữ 11 Nga ♥', 320, 725);

  return canvas;
}

export function downloadCanvas(canvas, filename) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
