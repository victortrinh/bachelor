import Countdown from './Countdown';

export default function Hero() {
  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center gap-5 px-6 py-16 text-center overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0d0a06 0%, #120c05 60%, #0d0a06 100%)',
      }}
    >
      {/* Fire glow from below — animated */}
      <div
        className="fire-glow absolute bottom-0 left-0 right-0 pointer-events-none"
        aria-hidden="true"
        style={{
          height: '50%',
          background: 'radial-gradient(ellipse at 50% 100%, rgba(255,90,0,0.18) 0%, transparent 65%)',
        }}
      />

      {/* Bottom border line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        aria-hidden="true"
        style={{ background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.4), transparent)' }}
      />

      {/* Chapter label */}
      <p className="font-cinzel text-[10px] tracking-[5px] uppercase relative z-10 text-gold-dim">
        Chapter I — The Beginning of the End
      </p>

      {/* Main title */}
      <h1
        className="font-cinzel font-black tracking-[3px] leading-tight relative z-10"
        style={{
          fontSize: 'clamp(28px, 6vw, 52px)',
          color: 'var(--gold)',
          textShadow: '0 0 40px rgba(255,120,0,0.4), 0 2px 8px rgba(0,0,0,0.8)',
        }}
      >
        The Coronation of<br />Princess Calvin
      </h1>

      {/* Subtitle */}
      <p
        className="font-cinzel tracking-[5px] uppercase relative z-10"
        style={{ fontSize: 'clamp(11px, 2vw, 15px)', color: 'var(--fire)' }}
      >
        A Legendary Bachelor Feast
      </p>

      {/* Hero image slot — replace src with NanoBanana-generated image URL */}
      <div
        className="glass-card relative z-10 flex items-center justify-center overflow-hidden"
        style={{ width: 'min(320px, 80vw)', height: 200 }}
      >
        <img
          src=""
          alt="Princess Calvin on the throne"
          className="w-full h-full object-cover rounded-[14px]"
          onError={e => { e.currentTarget.style.display = 'none'; }}
        />
        <span
          className="absolute font-cinzel text-xs tracking-[2px]"
          style={{ color: 'rgba(201,168,76,0.2)' }}
        >
          [ Hero Image ]
        </span>
      </div>

      {/* Countdown */}
      <div className="relative z-10">
        <Countdown />
      </div>

      {/* Roman date stamp */}
      <p className="font-cinzel text-[11px] tracking-[4px] relative z-10 text-gold-dim">
        ⚔ &nbsp; II · V · MMXXVI &nbsp; ⚔
      </p>
    </div>
  );
}
