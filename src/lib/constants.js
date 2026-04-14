// Set VITE_PASSWORD in your hosting platform's environment variables (Netlify/Vercel).
// Falls back to 'vikingsonly' for local dev — never commit the real password here.
export const PASSWORD = import.meta.env.VITE_PASSWORD ?? 'vikingsonly';

// UPDATE THE TIMEZONE OFFSET before deploying.
// '-05:00' = CDT (Central Daylight Time). Change to match the event's local timezone.
// e.g. '-04:00' for EDT, '-06:00' for MDT, '-07:00' for PDT.
export const EVENT_DATE = new Date('2026-05-02T12:00:00-05:00');

// Set VITE_FORMSPREE_ENDPOINT in your hosting platform's environment variables (Netlify/Vercel).
export const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT ?? 'https://formspree.io/f/YOUR_FORM_ID';

if (import.meta.env.DEV && FORMSPREE_ENDPOINT.includes('YOUR_FORM_ID')) {
  // eslint-disable-next-line no-console
  console.warn('[constants] FORMSPREE_ENDPOINT is still a placeholder — form submissions will fail.');
}

export const ACTIVITIES = [
  { id: 'brunch',  icon: '🍳', name: 'Brunch',        time: '12:30 – 2:00 PM',          fire: false, location: 'Petinos',               address: '590 Ave Saint-Charles, Vaudreuil-Dorion' },
  { id: 'skeet',   icon: '🎯', name: 'Skeet Shooting', time: '2:00 – 4:00 PM',            fire: false, location: 'Montreal Skeet Club',    address: 'Les Cèdres, QC' },
  { id: 'axes',    icon: '🪓', name: 'Axe Throwing / NERF',   time: '6:00 – 8:00 PM',    fire: false, location: 'Sports de Combats',      address: '5335 Ave Casgrain, Montréal' },
  { id: 'tavern',  icon: '🍺', name: 'The Tavern',     time: '8:30 PM – Until the kingdom falls', fire: true, location: 'Auberge du Dragon Rouge', address: '8870 Rue Lajeunesse, Montréal' },
];
