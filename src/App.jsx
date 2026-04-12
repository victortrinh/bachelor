import { useState, useRef, useEffect } from 'react';
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
  const unlockTimerRef = useRef(null);

  function handleUnlock() {
    sessionStorage.setItem(SESSION_KEY, 'true');
    // fade the gate out, then remove it
    setGateVisible(false);
    unlockTimerRef.current = setTimeout(() => setUnlocked(true), 700);
  }

  useEffect(() => {
    return () => {
      if (unlockTimerRef.current) clearTimeout(unlockTimerRef.current);
    };
  }, []);

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
        <VikingCode />
        <div className="h-px mx-6" style={{ background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.15), transparent)' }} />
        <QuestLog />
        <div className="h-px mx-6" style={{ background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.15), transparent)' }} />
        <RsvpForm />
        <Footer />
      </div>
    </>
  );
}
