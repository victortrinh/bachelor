import { useState, useEffect } from 'react';
import { getTimeRemaining } from '@/lib/countdown';
import { EVENT_DATE } from '@/lib/constants';

function CountdownUnit({ value, label, critical }) {
  return (
    <div className="text-center">
      <div
        className="font-cinzel text-3xl font-bold leading-none"
        style={{ color: critical ? 'var(--fire)' : 'var(--gold)' }}
      >
        {String(value).padStart(2, '0')}
      </div>
      <div className="text-[9px] tracking-[3px] uppercase mt-1 font-cinzel" style={{ color: 'var(--gold-dim)' }}>
        {label}
      </div>
    </div>
  );
}

function Separator({ critical }) {
  return (
    <div
      className="text-2xl self-start mt-1"
      style={{ color: critical ? 'rgba(255,107,0,0.4)' : 'rgba(201,168,76,0.3)' }}
      aria-hidden="true"
    >
      :
    </div>
  );
}

export default function Countdown() {
  const [time, setTime] = useState(() => getTimeRemaining(EVENT_DATE));

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeRemaining(EVENT_DATE)), 1000);
    return () => clearInterval(id);
  }, []);

  if (time.isOver) {
    return (
      <div className="glass-card px-8 py-4 text-center">
        <p className="font-cinzel tracking-widest" style={{ color: 'var(--fire)' }}>
          The feast has begun. 🔥
        </p>
      </div>
    );
  }

  const { days, hours, minutes, seconds, isCritical } = time;

  return (
    <div
      className="glass-card flex items-center gap-5 px-8 py-4"
      role="timer"
      aria-label="Countdown to the bachelor party"
    >
      <CountdownUnit value={days}    label="Days"    critical={isCritical} />
      <Separator critical={isCritical} />
      <CountdownUnit value={hours}   label="Hours"   critical={isCritical} />
      <Separator critical={isCritical} />
      <CountdownUnit value={minutes} label="Min"     critical={isCritical} />
      {/* Hide seconds on very small screens to prevent overflow */}
      <span className="contents [@media(max-width:360px)]:hidden">
        <Separator critical={isCritical} />
        <CountdownUnit value={seconds} label="Sec"   critical={isCritical} />
      </span>
    </div>
  );
}
