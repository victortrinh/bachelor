# Bachelor Party RSVP Site — Design Spec
**Date:** 2026-04-11  
**Project:** The Coronation of Princess Calvin — Bachelor Party RSVP Website

---

## Overview

A single-page React application serving as a password-protected RSVP site for Calvin Leung's bachelor party on May 2, 2026. The tone is epic-parody: Game of Thrones + Vikings aesthetic with Calvin cast as "Princess Calvin." Guests must dress as Vikings.

---

## Tech Stack

| Concern | Choice | Reason |
|---|---|---|
| Framework | React + Vite | Enables 21st.dev components; still deploys as static files |
| Styling | Tailwind CSS + custom CSS vars | Utility-first with themed overrides |
| Components | 21st.dev (shadcn-style) | Modern glassmorphism UI: toggles, cards, inputs |
| Form backend | Formspree (free tier) | Fully custom-styled native HTML form; 50 submissions/month is sufficient for ~20 guests; responses go to email |
| Deployment | Netlify or Vercel (free tier) | Auto-builds from GitHub on push; zero config |
| Fonts | Cinzel (headers) + Inter (body) via Google Fonts | Cinzel = cinematic medieval; Inter = clean, modern, readable |

---

## Visual Design

### Palette
| Token | Value | Usage |
|---|---|---|
| `bg-base` | `#080603` | Page background |
| `bg-card` | `rgba(255,255,255,0.025)` | Glassmorphism card surface |
| `gold` | `#d4a843` | Primary text, headings |
| `gold-dim` | `#5a3e1b` | Muted labels, metadata |
| `fire` | `#ff6b00` | Accent, tavern highlight, CTA glow |
| `border` | `rgba(201,168,76,0.15)` | Card and input borders |
| `blood` | `#8b1a1a` | Button gradient start |

### Typography
- **Display headings:** Cinzel, weight 700–900, letter-spacing `3–5px`, uppercase
- **Section labels:** Cinzel, 10px, `letter-spacing: 5px`, `color: gold-dim`
- **Body / form labels:** Inter, weight 400–500
- **Chapter labels:** flanked by fading gold divider lines (`::before` / `::after` pseudo-elements)

### Atmosphere
- Radial fire glow from the bottom of the hero (`rgba(255,90,0,0.18)`)
- Glassmorphism cards: `backdrop-filter: blur(8px)`, `rgba(255,255,255,0.025)` background
- Buttons: `linear-gradient(135deg, #8b1a1a, #c9a84c)` with `translateY(-1px)` + gold box-shadow on hover
- Scroll fade-ins on each chapter section via `IntersectionObserver`
- Countdown turns fire-red in the final 24 hours

---

## Page Structure

All content is a single scrolling page. The password gate renders as a full-screen overlay; once cleared it fades out and the main page fades in.

### 1. Password Gate
- Full-screen overlay (`position: fixed; inset: 0`)
- Norse rune decorations (`ᚨ ᚱ ᛗ ᛟ ᚱ`)
- Title: *"Speak, Friend, and Enter"*
- Subtitle: *"This feast is not for the uninvited"*
- Password input (Cinzel font, centered, gold border on focus)
- Submit button: gradient `blood → gold`, label **"Enter the Kingdom"**
- Hardcoded password: `vikingsonly` (single string in a JS constant at the top of the component — easy to change)
- On success: gate fades out, main page fades in; session persisted in `sessionStorage` so page refresh doesn't re-prompt

### 2. Hero Section
- Chapter label: *"Chapter I — The Beginning of the End"*
- Title: **"The Coronation of Princess Calvin"** (Cinzel 900, clamp 28px–52px)
- Subtitle: **"A Legendary Bachelor Feast"** (fire colour, letter-spaced)
- Hero image: `320×200px` slot with gold border and placeholder text; swap by replacing `src` in `HeroImage` component
- Countdown timer: live JS counter to `2026-05-02T12:00:00`; displays Days / Hours / Min / Sec in glassmorphism box; turns fire-red at `< 24h`
- Date stamp: **⚔ II · V · MMXXVI ⚔** (Roman numerals)

### 3. Quest Log
- Chapter label: *"Chapter II"*
- Title: **"The Quest Log"**
- One glassmorphism card per activity, containing:
  - Emoji icon in a rounded-square badge
  - Activity name (Cinzel)
  - Time and location metadata (`📍 TBD` — find-and-replace to update later)
- Activities:
  1. 🍳 Brunch — 12:00–2:00 PM
  2. 🎯 Skeet Shooting — 2:00–5:00 PM
  3. 🥩 Supper — 6:00 PM
  4. 🪓 Axe Throwing — 9:00–10:00 PM
  5. 🍺 The Tavern — *Until the kingdom falls* (fire accent colour, fire border)
- Cards have hover state: brighter border, slightly lighter background

### 4. Viking Code
- Chapter label: *"Chapter III"*
- Title: **"The Viking Code"**
- Glassmorphism decree box with a centred ⚔ icon notch at the top
- Body copy (humorous, epic tone):
  > *"You have been summoned to witness the last days of a free man. Calvin Leung — known henceforth as Princess Calvin — shall be escorted into matrimony with all the dignity he deserves. Which is to say: very little."*
- Dress code rule pills (pill chips, gold border):
  - ⚔ Viking armor required
  - 🪖 Horned helmets encouraged
  - 🧔 Beards mandatory
  - 🐺 Furs appreciated
  - 👑 No crowns (Calvin's orders)

### 5. RSVP Form — "Swear Your Allegiance"
- Chapter label: *"Chapter IV"*
- Title: **"Swear Your Allegiance"**
- Glassmorphism form card
- **Fields:**
  1. **Name** — text input, placeholder: *"Enter your name..."*
  2. **Overall attendance** — two full-width toggle buttons: *"⚔ Aye, I shall attend"* / *"✗ Nay, I am a coward"*
  3. **Per-activity attendance** — one row per activity (same 5 as Quest Log), each row contains: emoji + name + time on the left, **Aye / Nay** pill buttons on the right; the Tavern row uses fire accent colours
  4. **Dietary restrictions** — optional text input, placeholder: *"Allergies, thou sacred burdens..."*
  5. **Comments / excuses** — optional textarea, placeholder: *"Speak your peace or hold your tongue forever..."*
- **Submit button:** full-width, gradient `blood → gold`, label **"⚔ Pledge Your Sword ⚔"**
- **Form backend:** Formspree. Action URL is a single constant `FORMSPREE_ENDPOINT` at the top of the form component — replace with your Formspree form ID after signup.
- On success: button text changes to *"Your sword is pledged. ⚔"*, form fields clear.
- On error: error message in fire colour below the button.

### 6. Footer
- Top border: fading gold line
- Norse rune row: `ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ` (very dim)
- Quote: *"Swear your allegiance. Attendance is not optional."*
- Sub-line: *"In honour of Calvin Leung · May 2, 2026"*

---

## Component Structure

```
src/
├── main.jsx
├── App.jsx                  # Password gate + main page routing
├── components/
│   ├── PasswordGate.jsx     # Full-screen gate overlay
│   ├── Hero.jsx             # Title, image, countdown
│   ├── Countdown.jsx        # Live timer logic
│   ├── QuestLog.jsx         # Activity cards
│   ├── VikingCode.jsx       # Decree + rule pills
│   ├── RsvpForm.jsx         # Form with per-activity toggles
│   └── Footer.jsx
├── lib/
│   └── constants.js         # PASSWORD, FORMSPREE_ENDPOINT, EVENT_DATE, ACTIVITIES
└── index.css                # Tailwind directives + global CSS vars
```

---

## Data / Constants (`lib/constants.js`)

```js
export const PASSWORD = 'vikingsonly';          // change this
export const EVENT_DATE = '2026-05-02T12:00:00';
export const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID'; // replace after signup

export const ACTIVITIES = [
  { id: 'brunch',   icon: '🍳', name: 'Brunch',         time: '12:00 – 2:00 PM' },
  { id: 'skeet',    icon: '🎯', name: 'Skeet Shooting',  time: '2:00 – 5:00 PM'  },
  { id: 'supper',   icon: '🥩', name: 'Supper',          time: '6:00 PM'          },
  { id: 'axes',     icon: '🪓', name: 'Axe Throwing',    time: '9:00 – 10:00 PM' },
  { id: 'tavern',   icon: '🍺', name: 'The Tavern',      time: 'Until the kingdom falls', fire: true },
];
```

Locations are not in the data model yet. When ready, add a `location` field to each activity object and render it in both `QuestLog` and `RsvpForm`.

---

## Animations

- **Scroll fade-in:** each `<section>` starts at `opacity: 0, translateY: 20px`; `IntersectionObserver` triggers `opacity: 1, translateY: 0` with a 0.5s ease transition
- **Hero fire pulse:** subtle `box-shadow` keyframe animation on the hero's radial glow (3s loop, amplitude ±15% opacity)
- **Button hover:** `translateY(-1px)` + gold `box-shadow` spread on all primary buttons
- **Gate fade-out:** `opacity: 0` → `display: none` after 0.6s transition on correct password entry

---

## Deployment

1. Push repo to GitHub
2. Connect to Netlify or Vercel (both auto-detect Vite; build command: `npm run build`, publish dir: `dist`)
3. Every push to `main` triggers a redeploy

**To change the password:** edit `PASSWORD` in `src/lib/constants.js`  
**To add locations:** add a `location` field to each entry in `ACTIVITIES`  
**To connect Formspree:** sign up at formspree.io, create a form, paste the endpoint into `FORMSPREE_ENDPOINT`  
**To swap the hero image:** replace the `src` prop on the `<HeroImage>` component in `Hero.jsx`

---

## NanoBanana Image Prompts

1. **Hero image:** *"A Viking warrior seated on an ornate golden throne, wearing a flower crown, surrounded by fur and fire, cinematic fantasy lighting, dark background, oil painting style, dramatic shadows"*
2. **Background texture (optional):** *"Ancient dark leather parchment texture, worn and scorched edges, minimal grain, seamless tile, 4K, dark brown and black tones"*
3. **Password gate background (optional):** *"Nordic rune stone in darkness, glowing golden inscriptions, fog and embers, wide shot, cinematic"*
