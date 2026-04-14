import { ACTIVITIES } from '@/lib/constants';
import SectionWrapper from './SectionWrapper';

function QuestCard({ activity }) {
  const { icon, name, time, fire, location, address } = activity;

  const bg         = fire ? 'rgba(100,35,0,0.07)'  : 'rgba(0,0,0,0.04)';
  const border     = fire ? 'rgba(100,35,0,0.22)'  : 'rgba(130,80,15,0.18)';
  const iconBg     = fire ? 'rgba(100,35,0,0.08)'  : 'rgba(130,80,15,0.08)';
  const iconBorder = fire ? 'rgba(100,35,0,0.22)'  : 'rgba(130,80,15,0.18)';
  const nameColor  = fire ? '#7b2000'               : 'var(--gold)';

  return (
    <div
      className="flex items-center gap-4 p-4 mb-2.5 rounded-[10px]"
      style={{ border: `1px solid ${border}`, background: bg }}
    >
      <div
        className="w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-[10px] text-xl"
        style={{ background: iconBg, border: `1px solid ${iconBorder}` }}
        aria-hidden="true"
      >
        {icon}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-cinzel font-semibold text-[15px]" style={{ color: nameColor }}>
          {name}
        </p>
        <div className="flex flex-wrap gap-3 mt-1">
          <span className="text-xs text-gold-dim" aria-label={`Time: ${time}`}>
            🕐 {time}
          </span>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address || location)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gold-dim hover:underline"
            aria-label={`Open ${location} in Google Maps`}
          >
            📍 {location}{address ? ` · ${address}` : ''}
          </a>
        </div>
      </div>
    </div>
  );
}

export default function QuestLog() {
  return (
    <SectionWrapper className="py-20 max-w-2xl mx-auto px-6">
      <div className="scroll-outer">
        <div className="scroll-roll scroll-roll-top" aria-hidden="true" />

        <div className="scroll-parchment px-8 py-10 sm:px-14 sm:py-12">
          <div className="chapter-label">Chapter III</div>
          <h2
            className="font-cinzel font-bold text-center mb-10 tracking-[2px]"
            style={{ fontSize: 'clamp(20px, 4vw, 30px)', color: 'var(--gold)' }}
          >
            The Quest Log
          </h2>
          {ACTIVITIES.map(activity => (
            <QuestCard key={activity.id} activity={activity} />
          ))}
        </div>

        <div className="scroll-roll scroll-roll-bottom" aria-hidden="true" />
      </div>
    </SectionWrapper>
  );
}
