import { useState, useEffect } from 'react';
import { ACTIVITIES, FORMSPREE_ENDPOINT } from '@/lib/constants';
import SectionWrapper from './SectionWrapper';

const INITIAL_ACTIVITIES = Object.fromEntries(ACTIVITIES.map(a => [a.id, null]));

function TogglePair({ value, onChange, ayeLabel = 'Aye', nayLabel = 'Nay', fire = false, groupLabel = '' }) {
  const base = 'px-3.5 py-1.5 rounded-md font-cinzel text-[11px] tracking-[1px] cursor-pointer border transition-all duration-150';

  return (
    <div className="flex gap-1.5">
      <button
        type="button"
        aria-label={groupLabel ? `Aye: ${groupLabel}` : ayeLabel}
        aria-pressed={value === 'aye'}
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
        aria-label={groupLabel ? `Nay: ${groupLabel}` : nayLabel}
        aria-pressed={value === 'nay'}
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
      className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between px-4 py-3 rounded-[10px] mb-2"
      style={{
        background: activity.fire ? 'rgba(255,90,0,0.02)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${activity.fire ? 'rgba(255,107,0,0.15)' : 'rgba(201,168,76,0.1)'}`,
      }}
    >
      <div className="flex items-start gap-3 min-w-0">
        <span className="text-lg flex-shrink-0 mt-0.5" aria-hidden="true">{activity.icon}</span>
        <div className="min-w-0">
          <p className="font-cinzel text-[13px] font-semibold" style={{ color: activity.fire ? '#ff9040' : 'var(--gold)' }}>
            {activity.name}
          </p>
          <p className="text-[11px] mt-0.5 text-gold-dim">
            {activity.time}
          </p>
          {activity.cost && (
            <p className="text-[11px] mt-0.5" style={{ color: 'rgba(201,168,76,0.45)' }}>
              {activity.cost}
            </p>
          )}
          {activity.location && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.address || activity.location)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] mt-0.5 text-gold-dim hover:underline block break-words"
              aria-label={`Open ${activity.location} in Google Maps`}
            >
              📍 {activity.location}{activity.address ? ` · ${activity.address}` : ''}
            </a>
          )}
        </div>
      </div>
      <TogglePair value={value} onChange={onChange} fire={activity.fire} />
    </div>
  );
}

const legendStyle = {
  fontFamily: 'Cinzel, serif',
  fontSize: 11,
  letterSpacing: 3,
  color: 'rgba(201,168,76,0.5)',
  textTransform: 'uppercase',
  marginBottom: 8,
  display: 'block',
  width: '100%',
};

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

export default function RsvpForm() {
  const [name, setName]             = useState('');
  const [relation, setRelation]     = useState('');
  const [attendance, setAttendance] = useState(null);
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);
  const [needsLift, setNeedsLift]       = useState(null);
  const [liftNeedFrom, setLiftNeedFrom] = useState('');
  const [offersLift, setOffersLift]     = useState(null);
  const [liftFrom, setLiftFrom]         = useState('');
  const [liftSeats, setLiftSeats]       = useState('');
  const [dietary, setDietary]       = useState('');
  const [special, setSpecial]       = useState('');
  const [kinName, setKinName]       = useState('');
  const [kinContact, setKinContact] = useState('');
  const [comments, setComments]     = useState('');
  const [status, setStatus]         = useState('idle'); // idle | submitting | success | error

  useEffect(() => {
    if (attendance === 'nay') {
      setActivities(Object.fromEntries(ACTIVITIES.map(a => [a.id, 'nay'])));
      setNeedsLift('nay');
      setOffersLift('nay');
    } else {
      setActivities(INITIAL_ACTIVITIES);
      setNeedsLift(null);
      setOffersLift(null);
    }
  }, [attendance]);

  function setActivity(id, value) {
    setActivities(prev => ({ ...prev, [id]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');

    const activityEntries = Object.fromEntries(
      ACTIVITIES.map(a => [`activity_${a.id}`, activities[a.id] ?? 'no answer'])
    );

    const payload = {
      name,
      relation,
      attendance: attendance ?? 'no answer',
      ...activityEntries,
      needs_lift:  needsLift  ?? 'no answer',
      offers_lift: offersLift ?? 'no answer',
      ...(needsLift  === 'aye' && { lift_need_from: liftNeedFrom }),
      ...(offersLift === 'aye' && { lift_from: liftFrom, lift_seats: liftSeats }),
      dietary,
      special_tribute: special,
      next_of_kin_name:    kinName,
      next_of_kin_contact: kinContact,
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
        setRelation('');
        setNeedsLift(null); setLiftNeedFrom('');
        setOffersLift(null); setLiftFrom(''); setLiftSeats('');
        setSpecial('');
        setKinName(''); setKinContact('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

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

        {/* Urgency note */}
        <div
          className="text-center py-3 px-4 rounded-lg"
          style={{ background: 'rgba(255,107,0,0.06)', border: '1px solid rgba(255,107,0,0.18)' }}
        >
          <p className="font-cinzel text-xs tracking-[2px] uppercase mb-1" style={{ color: 'var(--fire)' }}>
            <span aria-hidden="true">⚔</span> Respond with haste <span aria-hidden="true">⚔</span>
          </p>
          <p className="text-[12px] leading-relaxed" style={{ color: 'rgba(201,168,76,0.6)', fontFamily: 'Inter, sans-serif' }}>
            The raiding expedition is less than three weeks away. Princess Calvin is sorry about the short
            notice. He took longer than expected to come to terms with his fate.
          </p>
        </div>

        {/* Name */}
        <div>
          <label
            htmlFor="rsvp-name"
            style={legendStyle}
          >
            Your name, warrior
          </label>
          <input
            id="rsvp-name"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Enter your name..."
            style={inputStyle}
            onFocus={e => { e.target.style.borderColor = 'rgba(201,168,76,0.5)'; e.target.style.boxShadow = '0 0 16px rgba(201,168,76,0.08)'; }}
            onBlur={e  => { e.target.style.borderColor = 'rgba(201,168,76,0.2)'; e.target.style.boxShadow = 'none'; }}
          />
        </div>

        {/* Relation to Calvin */}
        <div>
          <label htmlFor="rsvp-relation" style={legendStyle}>
            How did you end up here?
          </label>
          <textarea
            id="rsvp-relation"
            value={relation}
            onChange={e => setRelation(e.target.value)}
            placeholder="Explain to your fellow raiders what dark fate or stubborn loyalty has dragged you into this..."
            rows={2}
            style={{ ...inputStyle, resize: 'vertical' }}
            onFocus={e => { e.target.style.borderColor = 'rgba(201,168,76,0.5)'; e.target.style.boxShadow = '0 0 16px rgba(201,168,76,0.08)'; }}
            onBlur={e  => { e.target.style.borderColor = 'rgba(201,168,76,0.2)'; e.target.style.boxShadow = 'none'; }}
          />
        </div>

        {/* Overall attendance */}
        <fieldset className="border-0 p-0 m-0">
          <legend style={legendStyle}>Will you answer the call?</legend>
          <div className="flex gap-3">
            {[
              { value: 'aye', label: '⚔ Aye, I shall attend' },
              { value: 'nay', label: '✗ Nay, I am a coward'  },
            ].map(opt => (
              <button
                key={opt.value}
                type="button"
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
        </fieldset>

        {attendance !== 'nay' && (<>
          {/* Per-activity */}
          <fieldset className="border-0 p-0 m-0">
            <legend style={legendStyle}>Which quests will you join?</legend>
            {ACTIVITIES.map(activity => (
              <ActivityRow
                key={activity.id}
                activity={activity}
                value={activities[activity.id]}
                onChange={val => setActivity(activity.id, val)}
              />
            ))}
          </fieldset>

          {/* Lifts / Chariots */}
          <fieldset className="border-0 p-0 m-0">
            <legend style={legendStyle}>Chariots &amp; Lifts</legend>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[13px]" style={{ color: 'rgba(201,168,76,0.7)', fontFamily: 'Inter, sans-serif' }}>
                  Do you need a lift?
                </span>
                <TogglePair value={needsLift}  onChange={setNeedsLift}  groupLabel="Do you need a lift?" />
              </div>
              {needsLift === 'aye' && (
                <div>
                  <label htmlFor="rsvp-lift-need-from" style={{ ...legendStyle, marginBottom: 4 }}>Departing from</label>
                  <input
                    id="rsvp-lift-need-from"
                    value={liftNeedFrom}
                    onChange={e => setLiftNeedFrom(e.target.value)}
                    placeholder="e.g. Brossard"
                    style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = 'rgba(201,168,76,0.5)'; e.target.style.boxShadow = '0 0 16px rgba(201,168,76,0.08)'; }}
                    onBlur={e  => { e.target.style.borderColor = 'rgba(201,168,76,0.2)'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-[13px]" style={{ color: 'rgba(201,168,76,0.7)', fontFamily: 'Inter, sans-serif' }}>
                  Can you offer a lift?
                </span>
                <TogglePair value={offersLift} onChange={setOffersLift} groupLabel="Can you offer a lift?" />
              </div>
              {offersLift === 'aye' && (
                <div className="flex gap-3 mt-1">
                  <div className="flex-1">
                    <label htmlFor="rsvp-lift-from" style={{ ...legendStyle, marginBottom: 4 }}>Departing from</label>
                    <input
                      id="rsvp-lift-from"
                      value={liftFrom}
                      onChange={e => setLiftFrom(e.target.value)}
                      placeholder="e.g. Brossard"
                      style={inputStyle}
                      onFocus={e => { e.target.style.borderColor = 'rgba(201,168,76,0.5)'; e.target.style.boxShadow = '0 0 16px rgba(201,168,76,0.08)'; }}
                      onBlur={e  => { e.target.style.borderColor = 'rgba(201,168,76,0.2)'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>
                  <div style={{ width: 90 }}>
                    <label htmlFor="rsvp-lift-seats" style={{ ...legendStyle, marginBottom: 4 }}>Seats</label>
                    <input
                      id="rsvp-lift-seats"
                      type="number"
                      min="1"
                      max="9"
                      value={liftSeats}
                      onChange={e => setLiftSeats(e.target.value)}
                      placeholder="3"
                      style={inputStyle}
                      onFocus={e => { e.target.style.borderColor = 'rgba(201,168,76,0.5)'; e.target.style.boxShadow = '0 0 16px rgba(201,168,76,0.08)'; }}
                      onBlur={e  => { e.target.style.borderColor = 'rgba(201,168,76,0.2)'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>
                </div>
              )}
            </div>
          </fieldset>

          {/* Dietary */}
          <div>
            <label htmlFor="rsvp-dietary" style={legendStyle}>
              Dietary restrictions (optional)
            </label>
            <input
              id="rsvp-dietary"
              value={dietary}
              onChange={e => setDietary(e.target.value)}
              placeholder="Allergies, thou sacred burdens..."
              style={inputStyle}
              onFocus={e => { e.target.style.borderColor = 'rgba(201,168,76,0.5)'; e.target.style.boxShadow = '0 0 16px rgba(201,168,76,0.08)'; }}
              onBlur={e  => { e.target.style.borderColor = 'rgba(201,168,76,0.2)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          {/* Special tribute */}
          <div>
            <label htmlFor="rsvp-special" style={legendStyle}>
              Speech or special tribute? (optional)
            </label>
            <textarea
              id="rsvp-special"
              value={special}
              onChange={e => setSpecial(e.target.value)}
              placeholder="e.g. I wish to make a toast, offer bottle service at supper, provide ammunition for skeet shooting..."
              rows={2}
              style={{ ...inputStyle, resize: 'vertical' }}
              onFocus={e => { e.target.style.borderColor = 'rgba(201,168,76,0.5)'; e.target.style.boxShadow = '0 0 16px rgba(201,168,76,0.08)'; }}
              onBlur={e  => { e.target.style.borderColor = 'rgba(201,168,76,0.2)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          {/* Next of kin */}
          <fieldset className="border-0 p-0 m-0">
            <legend style={legendStyle}>Next of kin (just in case)</legend>
            <div className="flex flex-col gap-3">
              <div>
                <label htmlFor="rsvp-kin-name" style={legendStyle}>Guardian's name</label>
                <input
                  id="rsvp-kin-name"
                  value={kinName}
                  onChange={e => setKinName(e.target.value)}
                  placeholder="Who do we notify when things go sideways..."
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = 'rgba(201,168,76,0.5)'; e.target.style.boxShadow = '0 0 16px rgba(201,168,76,0.08)'; }}
                  onBlur={e  => { e.target.style.borderColor = 'rgba(201,168,76,0.2)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
              <div>
                <label htmlFor="rsvp-kin-contact" style={legendStyle}>Guardian's contact</label>
                <input
                  id="rsvp-kin-contact"
                  value={kinContact}
                  onChange={e => setKinContact(e.target.value)}
                  placeholder="Their contact (phone or carrier pigeon frequency)..."
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = 'rgba(201,168,76,0.5)'; e.target.style.boxShadow = '0 0 16px rgba(201,168,76,0.08)'; }}
                  onBlur={e  => { e.target.style.borderColor = 'rgba(201,168,76,0.2)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>
          </fieldset>

          {/* Comments */}
          <div>
            <label htmlFor="rsvp-comments" style={legendStyle}>
              Comments / excuses
            </label>
            <textarea
              id="rsvp-comments"
              value={comments}
              onChange={e => setComments(e.target.value)}
              placeholder="Speak your peace or hold your tongue forever..."
              rows={3}
              style={{ ...inputStyle, resize: 'vertical' }}
              onFocus={e => { e.target.style.borderColor = 'rgba(201,168,76,0.5)'; e.target.style.boxShadow = '0 0 16px rgba(201,168,76,0.08)'; }}
              onBlur={e  => { e.target.style.borderColor = 'rgba(201,168,76,0.2)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>
        </>)}

        {/* Submit */}
        <button
          type="submit"
          aria-label={status === 'submitting' ? 'Sending your pledge...' : 'Pledge Your Sword'}
          disabled={status === 'submitting' || status === 'success'}
          className="w-full py-4 rounded-[10px] font-cinzel font-bold text-sm tracking-[3px] uppercase transition-all duration-200 disabled:opacity-60 hover:-translate-y-0.5 hover:shadow-[0_6px_30px_rgba(201,168,76,0.25)]"
          style={{
            background: 'linear-gradient(135deg, #8b1a1a, #c9a84c)',
            color: '#0a0602',
          }}
        >
          {status === 'submitting' ? 'Sending...' : '⚔ Pledge Your Sword ⚔'}
        </button>

        {/* Status messages — aria-live so screen readers announce them */}
        <p
          aria-live="polite"
          className="text-center text-xs tracking-widest font-cinzel min-h-[1em]"
          style={{ color: status === 'error' ? 'var(--fire)' : status === 'success' ? 'var(--gold)' : 'transparent' }}
        >
          {status === 'success' && 'Your sword is pledged. ⚔'}
          {status === 'error'   && 'The ravens dropped it. Try again.'}
        </p>

      </form>
    </SectionWrapper>
  );
}
