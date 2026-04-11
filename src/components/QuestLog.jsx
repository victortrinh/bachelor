import { ACTIVITIES } from '@/lib/constants';
import SectionWrapper from './SectionWrapper';

function QuestCard({ activity }) {
  const { icon, name, time, fire } = activity;

  return (
    <div
      className="glass-card flex items-center gap-4 p-4 mb-2.5 transition-all duration-200 cursor-default"
      style={{
        borderColor: fire ? 'rgba(255,107,0,0.3)' : 'rgba(201,168,76,0.15)',
        background: fire ? 'rgba(255,90,0,0.04)' : 'rgba(255,255,255,0.025)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = fire ? 'rgba(255,107,0,0.5)' : 'rgba(201,168,76,0.35)';
        e.currentTarget.style.background  = fire ? 'rgba(255,90,0,0.07)' : 'rgba(255,255,255,0.04)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = fire ? 'rgba(255,107,0,0.3)' : 'rgba(201,168,76,0.15)';
        e.currentTarget.style.background  = fire ? 'rgba(255,90,0,0.04)' : 'rgba(255,255,255,0.025)';
      }}
    >
      {/* Icon badge */}
      <div
        className="w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-[10px] text-xl"
        style={{
          background: fire ? 'rgba(255,90,0,0.1)' : 'rgba(201,168,76,0.08)',
          border: `1px solid ${fire ? 'rgba(255,107,0,0.3)' : 'rgba(201,168,76,0.2)'}`,
        }}
        aria-hidden="true"
      >
        {icon}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p
          className="font-cinzel font-semibold text-[15px]"
          style={{ color: fire ? '#ff9040' : 'var(--gold)' }}
        >
          {name}
        </p>
        <div className="flex flex-wrap gap-3 mt-1">
          <span className="text-xs text-gold-dim" aria-label={`Time: ${time}`}>
            🕐 {time}
          </span>
          <span className="text-xs text-gold-dim">
            📍 TBD
          </span>
        </div>
      </div>
    </div>
  );
}

export default function QuestLog() {
  return (
    <SectionWrapper className="py-20 max-w-3xl mx-auto px-6">
      <div className="chapter-label">Chapter II</div>
      <h2
        className="font-cinzel font-bold text-center mb-10 tracking-[2px]"
        style={{ fontSize: 'clamp(20px, 4vw, 30px)', color: 'var(--gold)' }}
      >
        The Quest Log
      </h2>
      {ACTIVITIES.map(activity => (
        <QuestCard key={activity.id} activity={activity} />
      ))}
    </SectionWrapper>
  );
}
