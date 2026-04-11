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
