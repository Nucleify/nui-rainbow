import {
  NUI_RAINBOW_DURATION_DEFAULT,
  NUI_RAINBOW_HUE_INITIAL,
} from './constants.js';

const BARE_NUMBER = /^\d+(\.\d+)?$/;
const BARE_SIGNED_NUMBER = /^-?\d+(\.\d+)?$/;

function formatWithUnit(
  value: string | number | null | undefined,
  unit: string,
  fallback: string,
  bare = BARE_NUMBER,
): string {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? `${value}${unit}` : fallback;
  }

  if (typeof value !== 'string') {
    return fallback;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return fallback;
  }

  if (bare.test(trimmed)) {
    return `${trimmed}${unit}`;
  }

  return trimmed;
}

export function formatCssTime(
  value: string | number | null | undefined,
  fallback = NUI_RAINBOW_DURATION_DEFAULT,
): string {
  return formatWithUnit(value, 's', fallback);
}

export function formatCssAngle(
  value: string | number | null | undefined,
  fallback = NUI_RAINBOW_HUE_INITIAL,
): string {
  return formatWithUnit(value, 'deg', fallback, BARE_SIGNED_NUMBER);
}

export function formatCssPercent(
  value: string | number | null | undefined,
  fallback: string,
): string {
  return formatWithUnit(value, '%', fallback);
}

export function formatCssAlpha(
  value: string | number | null | undefined,
  fallback = '1',
): string {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? String(value) : fallback;
  }

  if (typeof value !== 'string') {
    return fallback;
  }

  const trimmed = value.trim();
  return trimmed || fallback;
}
