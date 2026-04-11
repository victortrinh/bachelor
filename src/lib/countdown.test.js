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
    const now = new Date('2026-05-02T12:00:00-05:00');
    const result = getTimeRemaining(now, now);
    expect(result.isOver).toBe(true);
  });

  it('calculates exact days, hours, minutes, seconds', () => {
    const target = new Date('2026-05-02T12:00:00-05:00');
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
    const target = new Date('2026-05-02T12:00:00-05:00');
    const now = new Date(target - 23 * 3600 * 1000); // 23 hours before
    const result = getTimeRemaining(target, now);
    expect(result.isCritical).toBe(true);
    expect(result.days).toBe(0);
  });

  it('sets isCritical=false when more than 24h remain', () => {
    const target = new Date('2026-05-02T12:00:00-05:00');
    const now = new Date(target - 25 * 3600 * 1000); // 25 hours before
    const result = getTimeRemaining(target, now);
    expect(result.isCritical).toBe(false);
  });

  it('sets isCritical=false when exactly 24h remain (boundary is exclusive)', () => {
    const target = new Date('2026-05-02T12:00:00-05:00');
    const now = new Date(target - 24 * 3600 * 1000); // exactly 24 hours
    const result = getTimeRemaining(target, now);
    expect(result.isCritical).toBe(false);
  });
});
