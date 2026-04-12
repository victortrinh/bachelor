import SectionWrapper from './SectionWrapper';

const RULES = [
  { icon: '⚔', label: 'Viking armor required' },
  { icon: '🪖', label: 'Horned helmets encouraged' },
  { icon: '🧔', label: 'Beards mandatory' },
  { icon: '🐺', label: 'Furs appreciated' },
  { icon: '👑', label: "Only a tiara (Calvin's orders)" },
];

export default function VikingCode() {
  return (
    <SectionWrapper className="py-20 max-w-3xl mx-auto px-6">
      <div className="chapter-label">Chapter III</div>
      <h2
        className="font-cinzel font-bold text-center mb-10 tracking-[2px]"
        style={{ fontSize: 'clamp(20px, 4vw, 30px)', color: 'var(--gold)' }}
      >
        The Viking Code
      </h2>

      {/* Decree box */}
      <div
        className="glass-card relative p-8 text-center"
        style={{ borderColor: 'rgba(201,168,76,0.15)' }}
      >
        {/* Notch icon */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 font-cinzel text-lg"
          style={{ background: '#080603', color: 'rgba(201,168,76,0.35)' }}
          aria-hidden="true"
        >
          ⚔
        </div>

        <p className="text-[15px] leading-relaxed italic mb-6" style={{ color: '#a07830' }}>
          You have been summoned to witness the last days of a free man.{' '}
          <strong className="not-italic" style={{ color: 'var(--gold)' }}>Calvin Leung</strong>
          {' '}— known henceforth as{' '}
          <strong className="not-italic" style={{ color: 'var(--gold)' }}>Princess Calvin</strong>
          {' '}— shall be escorted into matrimony with all the dignity he deserves.
          <br /><br />
          Which is to say: <strong className="not-italic" style={{ color: 'var(--gold)' }}>very little.</strong>
        </p>

        {/* Rule pills */}
        <div className="flex flex-wrap gap-2.5 justify-center">
          {RULES.map(rule => (
            <span
              key={rule.label}
              className="font-cinzel text-xs tracking-[1px] px-4 py-2 rounded-lg"
              style={{
                background: 'rgba(201,168,76,0.07)',
                border: '1px solid rgba(201,168,76,0.2)',
                color: 'var(--gold)',
              }}
            >
              <span aria-hidden="true">{rule.icon}</span>{' '}{rule.label}
            </span>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
