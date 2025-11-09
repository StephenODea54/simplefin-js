import { describe, it, expect } from 'vitest';
import { toUnixEpoch } from './utils.js';

describe('toUnixEpoch', () => {
  it('converts a Date object to a Unix timestamp string', () => {
    const date = new Date('2025-11-09T12:34:56Z');
    const expected = Math.floor(date.getTime() / 1000).toString();
    expect(toUnixEpoch(date)).toBe(expected);
  });

  it('converts a valid date string to a Unix timestamp string', () => {
    const dateString = '2025-11-09T12:34:56Z';
    const expected = Math.floor(
      new Date(dateString).getTime() / 1000,
    ).toString();
    expect(toUnixEpoch(dateString)).toBe(expected);
  });

  it('converts a timestamp number to a Unix timestamp string', () => {
    const timestamp = 1762923296000; // milliseconds
    const expected = Math.floor(timestamp / 1000).toString();
    expect(toUnixEpoch(timestamp)).toBe(expected);
  });

  it('throws an error for an invalid date string', () => {
    expect(() => toUnixEpoch('invalid-date')).toThrowError(
      'Invalid date value: invalid-date',
    );
  });

  it('works with date strings without time zone', () => {
    const dateString = '2025-11-09';
    const expected = Math.floor(
      new Date(dateString).getTime() / 1000,
    ).toString();
    expect(toUnixEpoch(dateString)).toBe(expected);
  });
});
