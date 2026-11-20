'use client';

import { useEffect, useRef, useState } from 'react';
import { renderQrCard, downloadCanvas } from '@/lib/exportCard';

const FALLBACK_URL = 'https://11nga-1911.netlify.app';
const QR_COLORS = { dark: '#4A4238', light: '#FFFDF9' };

export default function QrPanel({ showToast }) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const previewRef = useRef(null);
  const target = url.trim() || FALLBACK_URL;

  useEffect(() => {
    setUrl(window.location.href.split('?')[0].split('#')[0]);
  }, []);

  useEffect(() => {
    if (!open || !previewRef.current) return;
    let cancelled = false;
    import('qrcode').then(({ default: QRCode }) => {
      if (cancelled || !previewRef.current) return;
      QRCode.toCanvas(previewRef.current, target, { width: 152, margin: 1, errorCorrectionLevel: 'M', color: QR_COLORS });
    });
    return () => {
      cancelled = true;
    };
  }, [open, target]);

  async function downloadCard() {
    const { default: QRCode } = await import('qrcode');
    const source = document.createElement('canvas');
    await QRCode.toCanvas(source, target, { width: 512, margin: 1, errorCorrectionLevel: 'M', color: QR_COLORS });
    downloadCanvas(renderQrCard(source), 'The-QR-Chung-19-11-Lop-11-Nga.png');
    showToast('Đã tải thẻ QR chung (PNG) về máy!', '📥');
  }

  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(target);
    } catch {
      const input = document.createElement('input');
      input.value = target;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    }
    showToast('Đã sao chép đường link trang web!', '🔗');
  }

  return (
    <section className="mt-10 sm:mt-12">
      <div className="text-center">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 hover:bg-butter/70 text-inkLight hover:text-ink text-xs font-bold border border-ink/15 shadow-xs transition"
        >
          <span>📲</span>
          <span>{open ? 'Thu gọn khung mã QR chung' : 'Lấy 1 mã QR chung cho cả lớp 11 Nga'}</span>
        </button>
      </div>

      {open && (
        <div className="mt-4 paper-card-peach rounded-3xl p-6 sm:p-7 animate-reveal">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            <div className="sm:col-span-5 flex justify-center">
              <div className="w-full max-w-[235px] bg-white rounded-3xl p-4 border-2 border-mintBorder shadow-[0_5px_0_rgb(var(--c-mintBorder))] text-center">
                <span className="hover-pop cursor-default inline-block px-2.5 py-0.5 rounded-full bg-butter text-ink text-[10px] font-bold border border-butterBorder mb-2">
                  LỚP 11 NGA • 19/11
                </span>
                <div className="p-2 bg-cream rounded-2xl border border-dashed border-ink/20 inline-block">
                  <canvas ref={previewRef} className="mx-auto rounded-[10px]" />
                </div>
                <p className="font-hand text-sm text-ink mt-2.5 leading-snug">Quét mã &amp; nhập tên để nhận thiệp nhé! ✨</p>
              </div>
            </div>

            <div className="sm:col-span-7 space-y-3.5">
              <div>
                <h3 className="font-hand text-xl sm:text-2xl text-ink">Mã QR chung của lớp 11 Nga</h3>
                <p className="text-xs text-inkLight font-medium">
                  Dán đường link trang web sau khi đưa lên Netlify / Vercel để tạo mã QR chung cho cả lớp quét.
                </p>
              </div>

              <div>
                <label htmlFor="sharedUrlInput" className="block text-xs font-bold text-ink mb-1">
                  Đường link trang web:
                </label>
                <input
                  type="url"
                  id="sharedUrlInput"
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                  placeholder={FALLBACK_URL}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-peachBorder focus:border-ink focus:outline-none text-ink text-xs sm:text-sm font-medium"
                />
              </div>

              <div className="flex flex-wrap gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={downloadCard}
                  className="btn-sticker flex-1 py-2.5 px-4 rounded-2xl bg-mintSoft hover:bg-mintBorder/70 text-ink font-bold text-xs sm:text-sm border-2 border-mintBorder shadow-[0_4px_0_rgb(var(--c-mintBorder))] flex items-center justify-center gap-2"
                >
                  <span>📥</span>
                  <span>Tải thẻ QR chung (PNG)</span>
                </button>

                <button
                  type="button"
                  onClick={copyUrl}
                  className="btn-sticker py-2.5 px-4 rounded-2xl bg-white hover:bg-cream text-ink font-bold text-xs sm:text-sm border-2 border-peachBorder shadow-[0_4px_0_rgb(var(--c-peachBorder))] flex items-center justify-center gap-1.5"
                >
                  <span>🔗</span>
                  <span>Chép link</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
