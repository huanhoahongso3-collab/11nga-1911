import WishFace from './WishFace';

const STAGE_STYLE = {
  width: 560,
  padding: '4px 28px',
  backgroundColor: '#FFFDF9',
  backgroundImage:
    'radial-gradient(rgba(243, 190, 156, 0.35) 1.25px, transparent 1.25px), linear-gradient(to right, rgba(169, 223, 177, 0.16) 1px, transparent 1px), linear-gradient(to bottom, rgba(169, 223, 177, 0.16) 1px, transparent 1px)',
  backgroundSize: '28px 28px',
  backgroundPosition: '14px 14px, 0 0, 0 0',
};

// Off-screen copy of the wish card that html-to-image turns into the PNG: fixed width, no animations, with a QR code.
export default function WishExport({ ref, person, text, qr }) {
  return (
    <div ref={ref} data-theme="light" className="exporting font-sans text-ink" style={STAGE_STYLE}>
      <WishFace person={person} text={text} fixed animated={false}>
        {qr && (
          <div className="mt-5 flex items-center gap-4 border-t border-dashed border-mintBorder pt-5">
            <div className="shrink-0 rounded-2xl bg-white p-2 border-2 border-mintBorder">
              <img src={qr} width={168} height={168} alt="" />
            </div>
            <div className="min-w-0">
              <p className="font-hand text-xl text-ink leading-snug">Quét mã để xem lại lời chúc này</p>
              <p className="mt-1 text-xs font-bold text-inkLight">Happy International Men&apos;s Day • 19/11</p>
            </div>
          </div>
        )}
      </WishFace>
    </div>
  );
}
