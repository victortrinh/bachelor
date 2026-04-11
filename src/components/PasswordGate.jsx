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
          aria-describedby="gate-error"
          aria-invalid={error}
          className={`w-full rounded-lg px-5 py-3 font-cinzel text-base tracking-[4px] text-center text-gold bg-transparent outline-none transition-all ${
            error
              ? 'border border-[rgba(139,26,26,0.8)] shadow-[0_0_16px_rgba(139,26,26,0.2)]'
              : 'border border-[rgba(201,168,76,0.25)]'
          }`}
          autoComplete="off"
        />
        {/* Always rendered; empty when no error so aria-live announces changes */}
        <p
          id="gate-error"
          aria-live="polite"
          className="text-xs tracking-widest font-cinzel min-h-[1em]"
          style={{ color: 'rgba(200,60,60,0.9)' }}
        >
          {error ? 'Wrong — the kingdom remains sealed' : ''}
        </p>
        <button
          type="submit"
          aria-label="Enter the Kingdom"
          className="w-full rounded-lg py-3 font-cinzel text-sm font-bold tracking-[3px] uppercase transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_24px_rgba(201,168,76,0.3)]"
          style={{
            background: 'linear-gradient(135deg, #8b1a1a, #c9a84c)',
            color: '#0a0602',
          }}
        >
          Enter the Kingdom
        </button>
      </form>

      {/* Bottom divider */}
      <div className="w-48 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.3), transparent)' }} />
    </div>
  );
}
