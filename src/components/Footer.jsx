export default function Footer() {
  return (
    <footer
      className="py-10 px-6 text-center flex flex-col gap-3"
      style={{ borderTop: '1px solid rgba(201,168,76,0.1)' }}
    >
      <div
        className="font-cinzel text-lg tracking-[16px]"
        style={{ color: 'rgba(201,168,76,0.1)' }}
        aria-hidden="true"
      >
        ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ
      </div>
      <p className="font-cinzel text-[13px] tracking-[2px] italic text-gold-dim">
        "Swear your allegiance. Attendance is not optional."
      </p>
      <p className="text-[11px] tracking-[1px]" style={{ color: 'rgba(90,62,27,0.6)' }}>
        In honour of Calvin Leung · May 2, 2026
      </p>
    </footer>
  );
}
