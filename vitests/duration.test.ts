import { describe, expect, it } from 'vitest';

import {
  NUI_RAINBOW_DURATION_DEFAULT,
  NUI_RAINBOW_HUE_INITIAL,
} from '../src/constants.js';
import {
  formatCssAlpha,
  formatCssAngle,
  formatCssPercent,
  formatCssTime,
  parseCssTimeToMs,
} from '../src/duration.js';

describe('formatCssTime', () => {
  it('appends seconds to numbers', () => {
    expect(formatCssTime(12)).toBe('12s');
    expect(formatCssTime(4.5)).toBe('4.5s');
  });

  it('appends seconds to bare numeric strings', () => {
    expect(formatCssTime('45')).toBe('45s');
  });

  it('keeps CSS time strings', () => {
    expect(formatCssTime('800ms')).toBe('800ms');
    expect(formatCssTime('2.5s')).toBe('2.5s');
  });

  it('falls back for empty or non-finite values', () => {
    expect(formatCssTime('')).toBe(NUI_RAINBOW_DURATION_DEFAULT);
    expect(formatCssTime(Number.NaN)).toBe(NUI_RAINBOW_DURATION_DEFAULT);
    expect(formatCssTime(null)).toBe(NUI_RAINBOW_DURATION_DEFAULT);
  });
});

describe('formatCssAngle', () => {
  it('appends deg to numbers and bare numeric strings', () => {
    expect(formatCssAngle(210)).toBe('210deg');
    expect(formatCssAngle(-24)).toBe('-24deg');
    expect(formatCssAngle('90')).toBe('90deg');
  });

  it('keeps CSS angle strings', () => {
    expect(formatCssAngle('0.5turn')).toBe('0.5turn');
    expect(formatCssAngle('132deg')).toBe('132deg');
  });

  it('falls back for empty values', () => {
    expect(formatCssAngle('')).toBe(NUI_RAINBOW_HUE_INITIAL);
    expect(formatCssAngle(null)).toBe(NUI_RAINBOW_HUE_INITIAL);
  });
});

describe('formatCssPercent', () => {
  it('appends percent to numbers', () => {
    expect(formatCssPercent(40, '55%')).toBe('40%');
    expect(formatCssPercent('35', '55%')).toBe('35%');
    expect(formatCssPercent('55%', '40%')).toBe('55%');
  });
});

describe('formatCssAlpha', () => {
  it('stringifies finite numbers and keeps CSS values', () => {
    expect(formatCssAlpha(0.4)).toBe('0.4');
    expect(formatCssAlpha('80%')).toBe('80%');
    expect(formatCssAlpha('')).toBe('1');
  });
});

describe('parseCssTimeToMs', () => {
  it('parses seconds, milliseconds, and numeric values', () => {
    expect(parseCssTimeToMs(12)).toBe(12000);
    expect(parseCssTimeToMs('30s')).toBe(30000);
    expect(parseCssTimeToMs('500ms')).toBe(500);
    expect(parseCssTimeToMs('4.5')).toBe(4500);
  });

  it('falls back on invalid or empty inputs', () => {
    expect(parseCssTimeToMs('', 10000)).toBe(10000);
    expect(parseCssTimeToMs(null, 15000)).toBe(15000);
  });
});
