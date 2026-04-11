import { useState } from 'react';
import { ACTIVITIES, FORMSPREE_ENDPOINT } from '@/lib/constants';
import SectionWrapper from './SectionWrapper';

const INITIAL_ACTIVITIES = Object.fromEntries(ACTIVITIES.map(a => [a.id, null]));

function TogglePair({ value, onChange, ayeLabel = 'Aye', nayLabel = 'Nay', fire = false }) {
  const base = 'px-3.5 py-1.5 rounded-md font-cinzel text-[11px] tracking-[1px] cursor-pointer border transition-all duration-150';

  return (
    <div className="flex gap-1.5">
      <button
        type="button"
        role="button"
        aria-label={ayeLabel}
        data-selected={value === 'aye' ? 'true' : 'false'}
        onClick={() => onChange(value === 'aye' ? null : 'aye')}
        className={base}
        style={{
          background: value === 'aye'
            ? fire ? 'rgba(255,90,0,0.15)' : 'rgba(201,168,76,0.15)'
            : 'transparent',
          borderColor: value === 'aye'
            ? fire ? 'rgba(255,107,0,0.5)' : 'rgba(201,168,76,0.5)'
            : 'rgba(255,255,255,0.08)',
          color: value === 'aye'
            ? fire ? '#ff9040' : 'var(--gold)'
            : 'rgba(201,168,76,0.3)',
        }}
      >
        {ayeLabel}
      </button>
      <button
        type="button"
        role="button"
        aria-label={nayLabel}
        data-selected={value === 'nay' ? 'true' : 'false'}
        onClick={() => onChange(value === 'nay' ? null : 'nay')}
        className={base}
        style={{
          background: value === 'nay' ? 'rgba(139,26,26,0.2)' : 'transparent',
          borderColor: value === 'nay' ? 'rgba(139,26,26,0.6)' : 'rgba(255,255,255,0.08)',
          color: value === 'nay' ? '#c04040' : 'rgba(201,168,76,0.3)',
        }}
      >
        {nayLabel}
      </button>
    </div>
  );
}

function ActivityRow({ activity, value, onChange }) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3 rounded-[10px] mb-2"
      style={{
        background: activity.fire ? 'rgba(255,90,0,0.02)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${activity.fire ? 'rgba(255,107,0,0.15)' : 'rgba(201,168,76,0.1)'}`,
      }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-lg flex-shrink-0" aria-hidden="true">{activity.icon}</span>
        <div className="min-w-0">
          <p className="font-cinzel text-[13px] font-semibold truncate" style={{ color: activity.fire ? '#ff9040' : 'var(--gold)' }}>
            {activity.name}
          </p>
          <p className="text-[11px] mt-0.5 truncate text-gold-dim">
            {activity.time}
          </p>
        </div>
      </div>
      <TogglePair value={value} onChange={onChange} fire={activity.fire} />
    </div>
  );
}

export default function RsvpForm() {
  const [name, setName]             = useState('');
  const [attendance, setAttendance] = useState(null);
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);
  const [dietary, setDietary]       = useState('');
  const [comments, setComments]     = useState('');
  const [status, setStatus]         = useState('idle'); // idle | submitting | success | error

  function setActivity(id, value) {
    setActivities(prev => ({ ...prev, [id]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');

    const payload = {
      name,
      attendance: attendance ?? 'no answer',
      activity_brunch:  activities.brunch  ?? 'no answer',
      activity_skeet:   activities.skeet   ?? 'no answer',
      activity_supper:  activities.supper  ?? 'no answer',
      activity_axes:    activities.axes    ?? 'no answer',
      activity_tavern:  activities.tavern  ?? 'no answer',
      dietary,
      comments,
    };

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatus('success');
        setName(''); setAttendance(null);
        setActivities(INITIAL_ACTIVITIES);
        setDietary(''); setComments('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  const inputStyle = {
    background: 'rgba(201,168,76,0.05)',
    border: '1px solid rgba(201,168,76,0.2)',
    borderRadius: 8,
    padding: '12px 16px',
    color: 'var(--gold)',
    fontFamily: 'Inter, sans-serif',
    fontSize: 14,
    width: '100%',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };

  const labelStyle = {
    display: 'block',
    fontFamily: 'Cinzel, serif',
    fontSize: 11,
    letterSpacing: 3,
    color: 'rgba(201,168,76,0.5)',
    textTransform: 'uppercase',
    marginBottom: 8,
  };

  return (
    <SectionWrapper className="py-20 max-w-3xl mx-auto px-6">
      <div className="chapter-label">Chapter IV</div>
      <h2
        className="font-cinzel font-bold text-center mb-10 tracking-[2px]"
        style={{ fontSize: 'clamp(20px, 4vw, 30px)', color: 'var(--gold)' }}
      >
        Swear Your Allegiance
      </h2>

      <form onSubmit={handleSubmit} className="glass-card p-8 flex flex-col gap-6">

        {/* Name */}
        <div>
          <label style={labelStyle}>Your name, warrior</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Enter your name..."
            style={inputStyle}
            onFocus={e => { e.target.style.borderColor = 'rgba(201,168,76,0.5)'; e.target.style.boxShadow = '0 0 16px rgba(201,168,76,0.08)'; }}
            onBlur={e  => { e.target.style.borderColor = 'rgba(201,168,76,0.2)'; e.target.style.boxShadow = 'none'; }}
          />
        </div>

        {/* Overall attendance */}
        <div>
          <label style={labelStyle}>Will you answer the call?</label>
          <div className="flex gap-3">
            {[
              { value: 'aye', label: '⚔ Aye, I shall attend' },
              { value: 'nay', label: '✗ Nay, I am a coward'  },
            ].map(opt => (
              <button
                key={opt.value}
                type="button"
                role="button"
                aria-label={opt.value === 'aye' ? 'Aye' : 'Nay'}
                data-selected={attendance === opt.value ? 'true' : 'false'}
                onClick={() => setAttendance(prev => prev === opt.value ? null : opt.value)}
                className="flex-1 py-3 rounded-lg font-cinzel text-xs tracking-[1px] border transition-all duration-150"
                style={{
                  background: attendance === opt.value
                    ? opt.value === 'aye' ? 'rgba(201,168,76,0.15)' : 'rgba(139,26,26,0.2)'
                    : 'transparent',
                  borderColor: attendance === opt.value
                    ? opt.value === 'aye' ? 'rgba(201,168,76,0.5)'  : 'rgba(139,26,26,0.6)'
                    : 'rgba(255,255,255,0.08)',
                  color: attendance === opt.value
                    ? opt.value === 'aye' ? 'var(--gold)' : '#c04040'
                    : 'var(--gold-dim)',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Per-activity */}
        <div>
          <label style={labelStyle}>Which quests will you join?</label>
          {ACTIVITIES.map(activity => (
            <ActivityRow
              key={activity.id}
              activity={activity}
              value={activities[activity.id]}
              onChange={val => setActivity(activity.id, val)}
            />
          ))}
        </div>

        {/* Dietary */}
        <div>
          <label style={labelStyle}>Dietary restrictions (optional)</label>
          <input
            value={dietary}
            onChange={e => setDietary(e.target.value)}
            placeholder="Allergies, thou sacred burdens..."
            style={inputStyle}
            onFocus={e => { e.target.style.borderColor = 'rgba(201,168,76,0.5)'; e.target.style.boxShadow = '0 0 16px rgba(201,168,76,0.08)'; }}
            onBlur={e  => { e.target.style.borderColor = 'rgba(201,168,76,0.2)'; e.target.style.boxShadow = 'none'; }}
          />
        </div>

        {/* Comments */}
        <div>
          <label style={labelStyle}>Comments / excuses</label>
          <textarea
            value={comments}
            onChange={e => setComments(e.target.value)}
            placeholder="Speak your peace or hold your tongue forever..."
            rows={3}
            style={{ ...inputStyle, resize: 'vertical' }}
            onFocus={e => { e.target.style.borderColor = 'rgba(201,168,76,0.5)'; e.target.style.boxShadow = '0 0 16px rgba(201,168,76,0.08)'; }}
            onBlur={e  => { e.target.style.borderColor = 'rgba(201,168,76,0.2)'; e.target.style.boxShadow = 'none'; }}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          role="button"
          aria-label="Pledge Your Sword"
          disabled={status === 'submitting'}
          className="w-full py-4 rounded-[10px] font-cinzel font-bold text-sm tracking-[3px] uppercase transition-all duration-200 disabled:opacity-60 hover:-translate-y-0.5 hover:shadow-[0_6px_30px_rgba(201,168,76,0.25)]"
          style={{
            background: 'linear-gradient(135deg, #8b1a1a, #c9a84c)',
            color: '#0a0602',
          }}
        >
          {status === 'submitting' ? 'Sending...' :
           status === 'success'    ? 'Your sword is pledged. ⚔' :
           '⚔ Pledge Your Sword ⚔'}
        </button>

        {status === 'error' && (
          <p className="text-center text-xs tracking-widest font-cinzel text-fire" aria-live="polite">
            The ravens failed to deliver. Submission failed — try again.
          </p>
        )}
      </form>
    </SectionWrapper>
  );
}
