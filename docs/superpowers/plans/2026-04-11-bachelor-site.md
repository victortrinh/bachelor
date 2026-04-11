# Bachelor Party RSVP Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a password-protected, single-page React RSVP site for Calvin Leung's bachelor party with a Game of Thrones + Vikings parody theme, per-activity attendance tracking, and Formspree form submission.

**Architecture:** React + Vite SPA with Tailwind CSS and shadcn/ui (21st.dev-compatible) components. The password gate is a full-screen overlay that fades out on correct entry (persisted in `sessionStorage`). All page data (activities, password, form endpoint) lives in a single constants file for easy editing.

**Tech Stack:** React 18, Vite 5, Tailwind CSS 3, shadcn/ui, Vitest + @testing-library/react, Formspree (free), Netlify/Vercel (free)

---

## File Map

| File | Responsibility |
|---|---|
| `index.html` | Vite entry HTML, Google Fonts link |
| `vite.config.js` | Vite + Vitest config |
| `tailwind.config.js` | Custom palette tokens, Cinzel/Inter fonts |
| `postcss.config.js` | Tailwind + autoprefixer |
| `src/main.jsx` | React root mount |
| `src/App.jsx` | Gate/unlock state, sessionStorage, page layout |
| `src/index.css` | Tailwind directives, global CSS custom properties |
| `src/lib/constants.js` | PASSWORD, EVENT_DATE, FORMSPREE_ENDPOINT, ACTIVITIES |
| `src/lib/countdown.js` | Pure `getTimeRemaining(targetDate)` function |
| `src/hooks/useFadeIn.js` | IntersectionObserver hook for scroll fade-ins |
| `src/components/PasswordGate.jsx` | Full-screen overlay, password input, gate logic |
| `src/components/Hero.jsx` | Title, subtitle, image slot, countdown |
| `src/components/Countdown.jsx` | Renders live countdown using `getTimeRemaining` |
| `src/components/QuestLog.jsx` | Activity glassmorphism cards from ACTIVITIES |
| `src/components/VikingCode.jsx` | Decree box + dress code rule pills |
| `src/components/RsvpForm.jsx` | Per-activity Aye/Nay toggles + Formspree submit |
| `src/components/Footer.jsx` | Rune row, quote, sub-line |
| `src/components/SectionWrapper.jsx` | Fade-in wrapper used by every chapter section |
| `src/test/setup.js` | Vitest global setup (jest-dom matchers) |
| `src/lib/countdown.test.js` | Unit tests for `getTimeRemaining` |
| `src/components/PasswordGate.test.jsx` | Tests for password validation + gate behaviour |
| `src/components/RsvpForm.test.jsx` | Tests for form state + submission |
| `netlify.toml` | SPA redirect rule for Netlify |

---

## Task 1: Scaffold the project

**Files:**
- Create: `package.json`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `index.html`, `src/main.jsx`, `src/App.jsx`, `src/index.css`, `src/test/setup.js`, `.gitignore`

- [ ] **Step 1: Create the Vite + React project**

```bash
cd /Users/victortrinh/Documents/GitHub/bachelor
npm create vite@latest . -- --template react
```

When prompted about existing files, select **"Ignore files and continue"**.

- [ ] **Step 2: Install dependencies**

```bash
npm install
npm install -D tailwindcss@3 postcss autoprefixer
npm install -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
npx tailwindcss init -p
```

- [ ] **Step 3: Set up shadcn/ui**

```bash
npx shadcn@latest init
```

When prompted:
- Style: **Default**
- Base color: **Neutral**
- CSS variables: **Yes**

Then add the components we need:

```bash
npx shadcn@latest add button input textarea
```

- [ ] **Step 4: Replace `vite.config.js`**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    globals: true,
  },
})
```

- [ ] **Step 5: Replace `tailwind.config.js`**

```js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        'bg-base':   '#080603',
        'bg-card':   'rgba(255,255,255,0.025)',
        gold:        '#d4a843',
        'gold-dim':  '#5a3e1b',
        'gold-border': 'rgba(201,168,76,0.15)',
        fire:        '#ff6b00',
        blood:       '#8b1a1a',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
```

Install the animate plugin:
```bash
npm install -D tailwindcss-animate
```

- [ ] **Step 6: Replace `index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>The Coronation of Princess Calvin</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 7: Replace `src/index.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg-base: #080603;
  --gold: #d4a843;
  --gold-dim: #5a3e1b;
  --fire: #ff6b00;
  --blood: #8b1a1a;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background-color: var(--bg-base);
  color: var(--gold);
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
  overflow-x: hidden;
}

/* Chapter divider lines flanking the label text */
.chapter-label {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: 'Cinzel', serif;
  font-size: 10px;
  letter-spacing: 5px;
  color: var(--gold-dim);
  text-transform: uppercase;
  margin-bottom: 8px;
}
.chapter-label::before,
.chapter-label::after {
  content: '';
  flex: 1;
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(201,168,76,0.2));
}
.chapter-label::after {
  background: linear-gradient(to left, transparent, rgba(201,168,76,0.2));
}

/* Glassmorphism card base */
.glass-card {
  background: rgba(255,255,255,0.025);
  border: 1px solid rgba(201,168,76,0.15);
  border-radius: 14px;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* Fade-in animation for sections */
.fade-section {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.fade-section.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Fire pulse on hero glow */
@keyframes fire-pulse {
  0%, 100% { opacity: 0.18; }
  50% { opacity: 0.28; }
}
.fire-glow {
  animation: fire-pulse 3s ease-in-out infinite;
}
```

- [ ] **Step 8: Write `src/test/setup.js`**

```js
import '@testing-library/jest-dom';
```

- [ ] **Step 9: Write `src/main.jsx`**

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

- [ ] **Step 10: Write a placeholder `src/App.jsx` (will be replaced in Task 5)**

```jsx
export default function App() {
  return <div style={{ color: 'gold', padding: 40 }}>Scaffold OK</div>
}
```

- [ ] **Step 11: Verify the dev server starts**

```bash
npm run dev
```

Expected: browser opens at `http://localhost:5173` showing "Scaffold OK" in gold text. Stop the server with Ctrl+C.

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "feat: scaffold Vite + React + Tailwind + shadcn/ui"
```

---

## Task 2: Constants and countdown utility

**Files:**
- Create: `src/lib/constants.js`
- Create: `src/lib/countdown.js`

- [ ] **Step 1: Write `src/lib/constants.js`**

```js
export const PASSWORD = 'vikingsonly';

export const EVENT_DATE = new Date('2026-05-02T12:00:00');

// Sign up at formspree.io, create a form, replace YOUR_FORM_ID
export const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

export const ACTIVITIES = [
  { id: 'brunch',  icon: '🍳', name: 'Brunch',        time: '12:00 – 2:00 PM',          fire: false },
  { id: 'skeet',   icon: '🎯', name: 'Skeet Shooting', time: '2:00 – 5:00 PM',            fire: false },
  { id: 'supper',  icon: '🥩', name: 'Supper',         time: '6:00 PM',                   fire: false },
  { id: 'axes',    icon: '🪓', name: 'Axe Throwing',   time: '9:00 – 10:00 PM',           fire: false },
  { id: 'tavern',  icon: '🍺', name: 'The Tavern',     time: 'Until the kingdom falls',   fire: true  },
];
```

- [ ] **Step 2: Write `src/lib/countdown.js`**

```js
/**
 * Returns time remaining until targetDate.
 * Pure function — no side effects, safe to test.
 * @param {Date} targetDate
 * @param {Date} [now=new Date()] - injectable for testing
 * @returns {{ days: number, hours: number, minutes: number, seconds: number, isOver: boolean, isCritical: boolean }}
 */
export function getTimeRemaining(targetDate, now = new Date()) {
  const total = targetDate - now;

  if (total <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true, isCritical: false };
  }

  const seconds   = Math.floor((total / 1000) % 60);
  const minutes   = Math.floor((total / 1000 / 60) % 60);
  const hours     = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days      = Math.floor(total / (1000 * 60 * 60 * 24));
  const isCritical = total < 24 * 60 * 60 * 1000;

  return { days, hours, minutes, seconds, isOver: false, isCritical };
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/
git commit -m "feat: add constants and countdown utility"
```

---

## Task 3: Unit tests for utilities

**Files:**
- Create: `src/lib/countdown.test.js`

- [ ] **Step 1: Write failing tests**

```js
// src/lib/countdown.test.js
import { describe, it, expect } from 'vitest';
import { getTimeRemaining } from './countdown.js';

describe('getTimeRemaining', () => {
  it('returns isOver=true when target is in the past', () => {
    const past = new Date('2020-01-01T00:00:00');
    const result = getTimeRemaining(past, new Date('2020-01-02T00:00:00'));
    expect(result.isOver).toBe(true);
    expect(result.days).toBe(0);
    expect(result.hours).toBe(0);
  });

  it('returns isOver=true when target equals now', () => {
    const now = new Date('2026-05-02T12:00:00');
    const result = getTimeRemaining(now, now);
    expect(result.isOver).toBe(true);
  });

  it('calculates exact days, hours, minutes, seconds', () => {
    const target = new Date('2026-05-02T12:00:00');
    // exactly 2 days, 3 hours, 4 minutes, 5 seconds before target
    const now = new Date(target - (2 * 86400 + 3 * 3600 + 4 * 60 + 5) * 1000);
    const result = getTimeRemaining(target, now);
    expect(result.days).toBe(2);
    expect(result.hours).toBe(3);
    expect(result.minutes).toBe(4);
    expect(result.seconds).toBe(5);
    expect(result.isOver).toBe(false);
  });

  it('sets isCritical=true when less than 24h remain', () => {
    const target = new Date('2026-05-02T12:00:00');
    const now = new Date(target - 23 * 3600 * 1000); // 23 hours before
    const result = getTimeRemaining(target, now);
    expect(result.isCritical).toBe(true);
    expect(result.days).toBe(0);
  });

  it('sets isCritical=false when more than 24h remain', () => {
    const target = new Date('2026-05-02T12:00:00');
    const now = new Date(target - 25 * 3600 * 1000); // 25 hours before
    const result = getTimeRemaining(target, now);
    expect(result.isCritical).toBe(false);
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npx vitest run src/lib/countdown.test.js
```

Expected: FAIL — "Cannot find module './countdown.js'" (the file doesn't exist yet since we wrote it in Task 2; if it exists, tests should pass immediately — that's fine, proceed).

- [ ] **Step 3: Run tests to confirm they pass after Task 2 code**

```bash
npx vitest run src/lib/countdown.test.js
```

Expected: 5 tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/lib/countdown.test.js
git commit -m "test: unit tests for countdown utility"
```

---

## Task 4: `useFadeIn` hook

**Files:**
- Create: `src/hooks/useFadeIn.js`
- Create: `src/components/SectionWrapper.jsx`

- [ ] **Step 1: Write `src/hooks/useFadeIn.js`**

```js
import { useEffect, useRef, useState } from 'react';

/**
 * Returns a ref and a `visible` boolean.
 * Attach `ref` to the element you want to observe.
 * `visible` becomes true once it enters the viewport (fires once, never reverts).
 */
export function useFadeIn(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}
```

- [ ] **Step 2: Write `src/components/SectionWrapper.jsx`**

```jsx
import { useFadeIn } from '@/hooks/useFadeIn';

/**
 * Wraps a page section in a fade-in observer.
 * Usage: <SectionWrapper className="py-20 max-w-3xl mx-auto px-6">...</SectionWrapper>
 */
export default function SectionWrapper({ children, className = '' }) {
  const { ref, visible } = useFadeIn();
  return (
    <section
      ref={ref}
      className={`fade-section ${visible ? 'visible' : ''} ${className}`}
    >
      {children}
    </section>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/hooks/ src/components/SectionWrapper.jsx
git commit -m "feat: useFadeIn hook and SectionWrapper"
```

---

## Task 5: App shell + password gate state

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Write failing test**

```jsx
// src/components/PasswordGate.test.jsx
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PasswordGate from './PasswordGate';

describe('PasswordGate', () => {
  it('renders the password input', () => {
    render(<PasswordGate onUnlock={() => {}} />);
    expect(screen.getByPlaceholderText(/sacred word/i)).toBeInTheDocument();
  });

  it('calls onUnlock when correct password is entered', async () => {
    const onUnlock = vi.fn();
    render(<PasswordGate onUnlock={onUnlock} />);
    const input = screen.getByPlaceholderText(/sacred word/i);
    fireEvent.change(input, { target: { value: 'vikingsonly' } });
    fireEvent.click(screen.getByRole('button', { name: /enter/i }));
    expect(onUnlock).toHaveBeenCalledTimes(1);
  });

  it('does NOT call onUnlock for a wrong password', () => {
    const onUnlock = vi.fn();
    render(<PasswordGate onUnlock={onUnlock} />);
    const input = screen.getByPlaceholderText(/sacred word/i);
    fireEvent.change(input, { target: { value: 'wrongword' } });
    fireEvent.click(screen.getByRole('button', { name: /enter/i }));
    expect(onUnlock).not.toHaveBeenCalled();
  });

  it('shows an error message for a wrong password', () => {
    render(<PasswordGate onUnlock={() => {}} />);
    const input = screen.getByPlaceholderText(/sacred word/i);
    fireEvent.change(input, { target: { value: 'wrongword' } });
    fireEvent.click(screen.getByRole('button', { name: /enter/i }));
    expect(screen.getByText(/wrong/i)).toBeInTheDocument();
  });

  it('is case-insensitive', () => {
    const onUnlock = vi.fn();
    render(<PasswordGate onUnlock={onUnlock} />);
    const input = screen.getByPlaceholderText(/sacred word/i);
    fireEvent.change(input, { target: { value: 'VIKINGSONLY' } });
    fireEvent.click(screen.getByRole('button', { name: /enter/i }));
    expect(onUnlock).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
npx vitest run src/components/PasswordGate.test.jsx
```

Expected: FAIL — "Cannot find module './PasswordGate'"

- [ ] **Step 3: Write `src/App.jsx`**

```jsx
import { useState, useEffect } from 'react';
import PasswordGate from '@/components/PasswordGate';
import Hero from '@/components/Hero';
import QuestLog from '@/components/QuestLog';
import VikingCode from '@/components/VikingCode';
import RsvpForm from '@/components/RsvpForm';
import Footer from '@/components/Footer';

const SESSION_KEY = 'calvin_unlocked';

export default function App() {
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === 'true'
  );
  const [gateVisible, setGateVisible] = useState(!unlocked);

  function handleUnlock() {
    sessionStorage.setItem(SESSION_KEY, 'true');
    // fade the gate out, then remove it
    setGateVisible(false);
    setTimeout(() => setUnlocked(true), 700);
  }

  return (
    <>
      {gateVisible && <PasswordGate onUnlock={handleUnlock} />}
      <div
        className="page"
        style={{
          opacity: unlocked ? 1 : 0,
          transition: 'opacity 0.8s ease',
        }}
      >
        <Hero />
        <div className="h-px mx-6" style={{ background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.15), transparent)' }} />
        <QuestLog />
        <div className="h-px mx-6" style={{ background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.15), transparent)' }} />
        <VikingCode />
        <div className="h-px mx-6" style={{ background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.15), transparent)' }} />
        <RsvpForm />
        <Footer />
      </div>
    </>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx src/components/PasswordGate.test.jsx
git commit -m "feat: App shell with gate/unlock state + PasswordGate tests"
```

---

## Task 6: PasswordGate component

**Files:**
- Create: `src/components/PasswordGate.jsx`

- [ ] **Step 1: Write `src/components/PasswordGate.jsx`**

```jsx
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
```

- [ ] **Step 2: Run PasswordGate tests**

```bash
npx vitest run src/components/PasswordGate.test.jsx
```

Expected: 5 tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/components/PasswordGate.jsx
git commit -m "feat: PasswordGate component"
```

---

## Task 7: Countdown component

**Files:**
- Create: `src/components/Countdown.jsx`

- [ ] **Step 1: Write `src/components/Countdown.jsx`**

```jsx
import { useState, useEffect } from 'react';
import { getTimeRemaining } from '@/lib/countdown';
import { EVENT_DATE } from '@/lib/constants';

function CountdownUnit({ value, label, critical }) {
  return (
    <div className="text-center">
      <div
        className="font-cinzel text-3xl font-bold leading-none"
        style={{ color: critical ? 'var(--fire)' : 'var(--gold)' }}
      >
        {String(value).padStart(2, '0')}
      </div>
      <div className="text-[9px] tracking-[3px] uppercase mt-1 font-cinzel" style={{ color: 'var(--gold-dim)' }}>
        {label}
      </div>
    </div>
  );
}

function Separator({ critical }) {
  return (
    <div
      className="text-2xl self-start mt-1"
      style={{ color: critical ? 'rgba(255,107,0,0.4)' : 'rgba(201,168,76,0.3)' }}
      aria-hidden="true"
    >
      :
    </div>
  );
}

export default function Countdown() {
  const [time, setTime] = useState(() => getTimeRemaining(EVENT_DATE));

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeRemaining(EVENT_DATE)), 1000);
    return () => clearInterval(id);
  }, []);

  if (time.isOver) {
    return (
      <div className="glass-card px-8 py-4 text-center">
        <p className="font-cinzel tracking-widest" style={{ color: 'var(--fire)' }}>
          The feast has begun. 🔥
        </p>
      </div>
    );
  }

  const { days, hours, minutes, seconds, isCritical } = time;

  return (
    <div
      className="glass-card flex items-center gap-5 px-8 py-4"
      role="timer"
      aria-label="Countdown to the bachelor party"
    >
      <CountdownUnit value={days}    label="Days"    critical={isCritical} />
      <Separator critical={isCritical} />
      <CountdownUnit value={hours}   label="Hours"   critical={isCritical} />
      <Separator critical={isCritical} />
      <CountdownUnit value={minutes} label="Min"     critical={isCritical} />
      <Separator critical={isCritical} />
      <CountdownUnit value={seconds} label="Sec"     critical={isCritical} />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Countdown.jsx
git commit -m "feat: Countdown component"
```

---

## Task 8: Hero section

**Files:**
- Create: `src/components/Hero.jsx`

- [ ] **Step 1: Write `src/components/Hero.jsx`**

```jsx
import Countdown from './Countdown';

export default function Hero() {
  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center gap-5 px-6 py-16 text-center overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0d0a06 0%, #120c05 60%, #0d0a06 100%)',
      }}
    >
      {/* Fire glow from below — animated */}
      <div
        className="fire-glow absolute bottom-0 left-0 right-0 pointer-events-none"
        aria-hidden="true"
        style={{
          height: '50%',
          background: 'radial-gradient(ellipse at 50% 100%, rgba(255,90,0,0.18) 0%, transparent 65%)',
        }}
      />

      {/* Bottom border line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.4), transparent)' }}
      />

      {/* Chapter label */}
      <p className="font-cinzel text-[10px] tracking-[5px] uppercase relative z-10" style={{ color: 'var(--gold-dim)' }}>
        Chapter I — The Beginning of the End
      </p>

      {/* Main title */}
      <h1
        className="font-cinzel font-black tracking-[3px] leading-tight relative z-10"
        style={{
          fontSize: 'clamp(28px, 6vw, 52px)',
          color: 'var(--gold)',
          textShadow: '0 0 40px rgba(255,120,0,0.4), 0 2px 8px rgba(0,0,0,0.8)',
        }}
      >
        The Coronation of<br />Princess Calvin
      </h1>

      {/* Subtitle */}
      <p
        className="font-cinzel tracking-[5px] uppercase relative z-10"
        style={{ fontSize: 'clamp(11px, 2vw, 15px)', color: 'var(--fire)' }}
      >
        A Legendary Bachelor Feast
      </p>

      {/* Hero image slot — replace src with NanoBanana-generated image URL */}
      <div
        className="glass-card relative z-10 flex items-center justify-center overflow-hidden"
        style={{ width: 'min(320px, 80vw)', height: 200 }}
      >
        <img
          src=""
          alt="Princess Calvin on the throne"
          className="w-full h-full object-cover rounded-[14px]"
          onError={e => { e.currentTarget.style.display = 'none'; }}
        />
        <span
          className="absolute font-cinzel text-xs tracking-[2px]"
          style={{ color: 'rgba(201,168,76,0.2)' }}
        >
          [ Hero Image ]
        </span>
      </div>

      {/* Countdown */}
      <div className="relative z-10">
        <Countdown />
      </div>

      {/* Roman date stamp */}
      <p className="font-cinzel text-[11px] tracking-[4px] relative z-10" style={{ color: 'var(--gold-dim)' }}>
        ⚔ &nbsp; II · V · MMXXVI &nbsp; ⚔
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Hero.jsx
git commit -m "feat: Hero section with countdown and image slot"
```

---

## Task 9: Quest Log

**Files:**
- Create: `src/components/QuestLog.jsx`

- [ ] **Step 1: Write `src/components/QuestLog.jsx`**

```jsx
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
          <span className="text-xs" style={{ color: 'var(--gold-dim)' }}>
            🕐 {time}
          </span>
          <span className="text-xs" style={{ color: 'var(--gold-dim)' }}>
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/QuestLog.jsx
git commit -m "feat: QuestLog with glassmorphism activity cards"
```

---

## Task 10: Viking Code

**Files:**
- Create: `src/components/VikingCode.jsx`

- [ ] **Step 1: Write `src/components/VikingCode.jsx`**

```jsx
import SectionWrapper from './SectionWrapper';

const RULES = [
  { icon: '⚔', label: 'Viking armor required' },
  { icon: '🪖', label: 'Horned helmets encouraged' },
  { icon: '🧔', label: 'Beards mandatory' },
  { icon: '🐺', label: 'Furs appreciated' },
  { icon: '👑', label: "No crowns (Calvin's orders)" },
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
              {rule.icon} {rule.label}
            </span>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/VikingCode.jsx
git commit -m "feat: VikingCode section with decree and rule pills"
```

---

## Task 11: RSVP Form

**Files:**
- Create: `src/components/RsvpForm.jsx`
- Create: `src/components/RsvpForm.test.jsx`

- [ ] **Step 1: Write failing tests**

```jsx
// src/components/RsvpForm.test.jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RsvpForm from './RsvpForm';

// Mock fetch globally
beforeEach(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
  );
});

describe('RsvpForm', () => {
  it('renders the name field', () => {
    render(<RsvpForm />);
    expect(screen.getByPlaceholderText(/enter your name/i)).toBeInTheDocument();
  });

  it('renders Aye/Nay buttons for each activity', () => {
    render(<RsvpForm />);
    // 5 activities × 2 buttons = 10 toggle buttons, plus 2 overall attendance buttons
    const ayeButtons = screen.getAllByRole('button', { name: /aye/i });
    expect(ayeButtons.length).toBe(6); // 1 overall + 5 activities
  });

  it('marks overall Aye button as selected when clicked', () => {
    render(<RsvpForm />);
    const ayeBtn = screen.getAllByRole('button', { name: /aye/i })[0];
    fireEvent.click(ayeBtn);
    expect(ayeBtn).toHaveAttribute('data-selected', 'true');
  });

  it('submits form data to Formspree endpoint', async () => {
    render(<RsvpForm />);
    fireEvent.change(screen.getByPlaceholderText(/enter your name/i), {
      target: { value: 'Ragnar' },
    });
    fireEvent.click(screen.getAllByRole('button', { name: /aye/i })[0]);
    fireEvent.click(screen.getByRole('button', { name: /pledge/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledOnce();
      const [url, opts] = global.fetch.mock.calls[0];
      expect(url).toContain('formspree.io');
      const body = JSON.parse(opts.body);
      expect(body.name).toBe('Ragnar');
      expect(body.attendance).toBe('aye');
    });
  });

  it('shows success message after submission', async () => {
    render(<RsvpForm />);
    fireEvent.change(screen.getByPlaceholderText(/enter your name/i), {
      target: { value: 'Ragnar' },
    });
    fireEvent.click(screen.getByRole('button', { name: /pledge/i }));
    await waitFor(() => {
      expect(screen.getByText(/pledged/i)).toBeInTheDocument();
    });
  });

  it('shows error message when fetch fails', async () => {
    global.fetch = vi.fn(() => Promise.resolve({ ok: false }));
    render(<RsvpForm />);
    fireEvent.click(screen.getByRole('button', { name: /pledge/i }));
    await waitFor(() => {
      expect(screen.getByText(/failed/i)).toBeInTheDocument();
    });
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npx vitest run src/components/RsvpForm.test.jsx
```

Expected: FAIL — "Cannot find module './RsvpForm'"

- [ ] **Step 3: Write `src/components/RsvpForm.jsx`**

```jsx
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
          <p className="text-[11px] mt-0.5 truncate" style={{ color: 'var(--gold-dim)' }}>
            {activity.time}
          </p>
        </div>
      </div>
      <TogglePair value={value} onChange={onChange} fire={activity.fire} />
    </div>
  );
}

export default function RsvpForm() {
  const [name, setName]           = useState('');
  const [attendance, setAttendance] = useState(null);
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);
  const [dietary, setDietary]     = useState('');
  const [comments, setComments]   = useState('');
  const [status, setStatus]       = useState('idle'); // idle | submitting | success | error

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
          className="w-full py-4 rounded-[10px] font-cinzel font-bold text-sm tracking-[3px] uppercase transition-all duration-200 disabled:opacity-60"
          style={{
            background: 'linear-gradient(135deg, #8b1a1a, #c9a84c)',
            color: '#0a0602',
          }}
          onMouseEnter={e => { if (status !== 'submitting') e.currentTarget.style.boxShadow = '0 6px 30px rgba(201,168,76,0.25)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          {status === 'submitting' ? 'Sending...' :
           status === 'success'    ? 'Your sword is pledged. ⚔' :
           '⚔ Pledge Your Sword ⚔'}
        </button>

        {status === 'error' && (
          <p className="text-center text-xs tracking-widest font-cinzel" style={{ color: 'var(--fire)' }}>
            The ravens failed to deliver. Submission failed — try again.
          </p>
        )}
      </form>
    </SectionWrapper>
  );
}
```

- [ ] **Step 4: Run tests**

```bash
npx vitest run src/components/RsvpForm.test.jsx
```

Expected: 6 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/RsvpForm.jsx src/components/RsvpForm.test.jsx
git commit -m "feat: RsvpForm with per-activity Aye/Nay toggles and Formspree submission"
```

---

## Task 12: Footer

**Files:**
- Create: `src/components/Footer.jsx`

- [ ] **Step 1: Write `src/components/Footer.jsx`**

```jsx
export default function Footer() {
  return (
    <footer
      className="py-10 px-6 text-center flex flex-col gap-3"
      style={{ borderTop: '1px solid rgba(201,168,76,0.1)' }}
    >
      <div
        className="font-cinzel text-lg tracking-[16px]"
        style={{ color: 'rgba(201,168,76,0.1)' }}
        aria-hidden="true"
      >
        ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ
      </div>
      <p className="font-cinzel text-[13px] tracking-[2px] italic" style={{ color: 'var(--gold-dim)' }}>
        "Swear your allegiance. Attendance is not optional."
      </p>
      <p className="text-[11px] tracking-[1px]" style={{ color: 'rgba(90,62,27,0.6)' }}>
        In honour of Calvin Leung · May 2, 2026
      </p>
    </footer>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Footer.jsx
git commit -m "feat: Footer component"
```

---

## Task 13: Wire up all components and verify full page

**Files:**
- Verify: `src/App.jsx` imports are all satisfied

- [ ] **Step 1: Run the full test suite**

```bash
npx vitest run
```

Expected: all tests pass (countdown, PasswordGate, RsvpForm).

- [ ] **Step 2: Add responsive seconds-hiding to `src/components/Countdown.jsx`**

Screens narrower than 360px can't fit 4 countdown units. Wrap the seconds unit and its separator in a container that hides on very small screens. Replace the return block's countdown box with:

```jsx
return (
  <div
    className="glass-card flex items-center gap-5 px-8 py-4"
    role="timer"
    aria-label="Countdown to the bachelor party"
  >
    <CountdownUnit value={days}    label="Days"    critical={isCritical} />
    <Separator critical={isCritical} />
    <CountdownUnit value={hours}   label="Hours"   critical={isCritical} />
    <Separator critical={isCritical} />
    <CountdownUnit value={minutes} label="Min"     critical={isCritical} />
    {/* Hide seconds on very small screens to prevent overflow */}
    <span className="contents [@media(max-width:360px)]:hidden">
      <Separator critical={isCritical} />
      <CountdownUnit value={seconds} label="Sec"   critical={isCritical} />
    </span>
  </div>
);
```

- [ ] **Step 3: Start the dev server and verify the full page**

```bash
npm run dev
```

Visit `http://localhost:5173`. Verify in order:
1. Password gate appears — enter `vikingsonly` — gate fades out, main page fades in
2. Hero renders with title, countdown ticking, and image placeholder
3. Scroll down — each section fades in as it enters the viewport
4. Quest Log shows all 5 activities with TBD locations; Tavern has fire styling
5. Viking Code shows decree text and all 5 rule pills
6. RSVP Form: toggle Overall attendance, toggle per-activity Aye/Nay for each activity, fill name and comments
7. Footer shows rune row and quote
8. On mobile width (DevTools → 375px): all sections stack cleanly, text doesn't overflow, Aye/Nay buttons remain tappable

Stop the server with Ctrl+C.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: complete page wired up and verified"
```

---

## Task 14: Deployment configuration

**Files:**
- Create: `netlify.toml`
- Create: `public/_redirects` (Vercel fallback)

- [ ] **Step 1: Write `netlify.toml`**

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

- [ ] **Step 2: Write `public/_redirects`** (needed for Vercel SPA routing)

```
/* /index.html 200
```

- [ ] **Step 3: Build and verify the production bundle**

```bash
npm run build
```

Expected: `dist/` directory created with no errors. Output should show bundle sizes — main JS chunk should be under 300KB.

- [ ] **Step 4: Preview the production build locally**

```bash
npm run preview
```

Open `http://localhost:4173` and re-verify password gate and full page as in Task 13 Step 2.

- [ ] **Step 5: Commit**

```bash
git add netlify.toml public/_redirects
git commit -m "feat: add Netlify/Vercel deployment config"
```

---

## Post-deployment checklist

After deploying to Netlify or Vercel:

1. **Connect Formspree:**
   - Sign up at formspree.io (free)
   - Create a new form, copy the endpoint URL (e.g. `https://formspree.io/f/xpzgkwjq`)
   - Edit `src/lib/constants.js` → replace `YOUR_FORM_ID` with your real ID
   - Commit and push — site redeploys automatically

2. **Add a hero image:**
   - Generate an image using NanoBanana with this prompt:
     *"A Viking warrior seated on an ornate golden throne, wearing a flower crown, surrounded by fur and fire, cinematic fantasy lighting, dark background, oil painting style, dramatic shadows"*
   - Host it (upload to the repo under `public/` or use an image CDN)
   - Set the `src` attribute on the `<img>` inside `Hero.jsx`

3. **Update locations when confirmed:**
   - Edit `src/lib/constants.js` → add `location: 'Venue Name'` to each activity in `ACTIVITIES`
   - Update `QuestLog.jsx` to render `activity.location ?? 'TBD'` instead of the hardcoded `'TBD'`

4. **Change the password:**
   - Edit `PASSWORD` in `src/lib/constants.js`
