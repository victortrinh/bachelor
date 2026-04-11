import { useState } from 'react';
import { PASSWORD } from '@/lib/constants';

export default function PasswordGate({ onUnlock }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (value.trim().toLowerCase() === PASSWORD.toLowerCase()) {
      setError(false);
      onUnlock();
    } else {
      setError(true);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 px-6"
      style={{ background: '#080603' }}
    >
      {/* Rune decoration */}
      <div
        className="font-cinzel tracking-[12px] text-3xl"
        style={{ color: 'rgba(201,168,76,0.25)' }}
        aria-hidden="true"
      >
        ᚨ ᚱ ᛗ ᛟ ᚱ
      </div>

      {/* Divider */}
      <div className="w-48 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.3), transparent)' }} />

      {/* Title */}
      <h1 className="font-cinzel text-xl font-bold tracking-[4px] text-center text-gold">
        Speak, Friend,<br />and Enter
      </h1>
      <p className="text-[11px] tracking-[3px] uppercase font-cinzel text-gold-dim">
        This feast is not for the uninvited
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-full max-w-xs">
        <input
          type="password"
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(false); }}
          placeholder="enter the sacred word"
          className="w-full rounded-lg px-5 py-3 font-cinzel text-base tracking-[4px] text-center text-gold bg-transparent outline-none transition-all"
          style={{
            border: `1px solid ${error ? 'rgba(139,26,26,0.8)' : 'rgba(201,168,76,0.25)'}`,
            boxShadow: error ? '0 0 16px rgba(139,26,26,0.2)' : 'none',
          }}
          autoComplete="off"
        />
        {error && (
          <p className="text-xs tracking-widest font-cinzel" style={{ color: 'rgba(200,60,60,0.9)' }}>
            Wrong — the kingdom remains sealed
          </p>
        )}
        <button
          type="submit"
          aria-label="Enter the Kingdom"
          className="w-full rounded-lg py-3 font-cinzel text-sm font-bold tracking-[3px] uppercase transition-all hover:-translate-y-0.5"
          style={{
            background: 'linear-gradient(135deg, #8b1a1a, #c9a84c)',
            color: '#0a0602',
            boxShadow: '0 2px 16px rgba(201,168,76,0)',
          }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 24px rgba(201,168,76,0.3)'}
          onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 16px rgba(201,168,76,0)'}
        >
          Enter the Kingdom
        </button>
      </form>

      {/* Bottom divider */}
      <div className="w-48 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.3), transparent)' }} />
    </div>
  );
}
