export const PASSWORD = 'vikingsonly';

// UPDATE THE TIMEZONE OFFSET before deploying.
// '-05:00' = CDT (Central Daylight Time). Change to match the event's local timezone.
// e.g. '-04:00' for EDT, '-06:00' for MDT, '-07:00' for PDT.
export const EVENT_DATE = new Date('2026-05-02T12:00:00-05:00');

// Sign up at formspree.io, create a form, replace YOUR_FORM_ID
export const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

if (import.meta.env.DEV && FORMSPREE_ENDPOINT.includes('YOUR_FORM_ID')) {
  // eslint-disable-next-line no-console
  console.warn('[constants] FORMSPREE_ENDPOINT is still a placeholder — form submissions will fail.');
}

export const ACTIVITIES = [
  { id: 'brunch',  icon: '🍳', name: 'Brunch',        time: '12:00 – 2:00 PM',          fire: false },
  { id: 'skeet',   icon: '🎯', name: 'Skeet Shooting', time: '2:00 – 5:00 PM',            fire: false },
  { id: 'supper',  icon: '🥩', name: 'Supper',         time: '6:00 PM',                   fire: false },
  { id: 'axes',    icon: '🪓', name: 'Axe Throwing',   time: '9:00 – 10:00 PM',           fire: false },
  { id: 'tavern',  icon: '🍺', name: 'The Tavern',     time: 'Until the kingdom falls',   fire: true  },
];
