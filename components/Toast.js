export default function Toast({ text, icon, show }) {
  return (
    <div
      className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-300 ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="bg-ink text-cream px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2">
        <span>{icon}</span>
        <span>{text}</span>
      </div>
    </div>
  );
}
