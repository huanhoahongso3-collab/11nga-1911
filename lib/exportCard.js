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
