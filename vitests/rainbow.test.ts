import { afterEach, describe, expect, it } from 'vitest';

import { STYLE_VARS } from '../src/apply.js';
import {
  applyRainbow,
  bindRainbowCycle,
  NUI_RAINBOW_ANIMATION_BRANDED,
  NUI_RAINBOW_ANIMATION_LINEAR,
  NUI_RAINBOW_BORDER_CLASS,
  NUI_RAINBOW_CLASS,
  NUI_RAINBOW_CSS,
  NUI_RAINBOW_DURATION_DEFAULT,
  NUI_RAINBOW_DURATION_SLOW,
  NUI_RAINBOW_EVENT,
  NUI_RAINBOW_HUE_INITIAL,
  NUI_RAINBOW_STYLE_ID,
  NUI_RAINBOW_TEXT_CLASS,
  NUI_RAINBOW_UNDERLINE_CLASS,
} from '../src/index.js';

function stylesInjected(): boolean {
  return (
    document.getElementById(NUI_RAINBOW_STYLE_ID) !== null ||
    document.adoptedStyleSheets.length > 0
  );
}

describe('nui-rainbow', () => {
  afterEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    if ('adoptedStyleSheets' in document) {
      document.adoptedStyleSheets = [];
    }
  });

  it('keeps the hue origin and duration presets stable', () => {
    expect(NUI_RAINBOW_HUE_INITIAL).toBe('152deg');
    expect(NUI_RAINBOW_DURATION_DEFAULT).toBe('30s');
    expect(NUI_RAINBOW_DURATION_SLOW).toBe('60s');
  });

  it('ships extra tokens, a linear cycle, recipes, and a composable animation', () => {
    expect(NUI_RAINBOW_CSS).toContain('--nui-rainbow-color-soft');
    expect(NUI_RAINBOW_CSS).toContain('--nui-rainbow-color-muted');
    expect(NUI_RAINBOW_CSS).toContain('--nui-rainbow-complement');
    expect(NUI_RAINBOW_CSS).toContain('--nui-rainbow-oklch');
    expect(NUI_RAINBOW_CSS).toContain('--nui-rainbow-offset');
    expect(NUI_RAINBOW_CSS).toContain('--nui-rainbow-span');
    expect(NUI_RAINBOW_CSS).toContain('--nui-rainbow-animation');
    expect(NUI_RAINBOW_CSS).toContain('--nui-rainbow-extra-animation');
    expect(NUI_RAINBOW_CSS).toContain(NUI_RAINBOW_ANIMATION_LINEAR);
    expect(NUI_RAINBOW_CSS).toContain(`.${NUI_RAINBOW_TEXT_CLASS}`);
    expect(NUI_RAINBOW_CSS).toContain(`.${NUI_RAINBOW_BORDER_CLASS}`);
    expect(NUI_RAINBOW_CSS).toContain(`.${NUI_RAINBOW_UNDERLINE_CLASS}`);
  });

  it('applies the cycle class, duration, and injects styles', () => {
    const el = document.createElement('div');
    document.body.append(el);

    const stop = applyRainbow(el, { duration: 12, paused: true });

    expect(el.classList.contains(NUI_RAINBOW_CLASS)).toBe(true);
    expect(el.style.getPropertyValue('--nui-rainbow-duration')).toBe('12s');
    expect(el.hasAttribute('paused')).toBe(true);
    expect(stylesInjected()).toBe(true);

    stop();

    expect(el.classList.contains(NUI_RAINBOW_CLASS)).toBe(false);
    expect(el.style.getPropertyValue('--nui-rainbow-duration')).toBe('');
  });

  it('maps hue, span, offset, alpha, cycle, and fill-mode, then clears them on stop', () => {
    const el = document.createElement('div');
    document.body.append(el);

    const stop = applyRainbow(el, {
      initialHue: 210,
      hueSpan: 60,
      offset: 24,
      alpha: 0.5,
      saturation: 40,
      lightness: 48,
      cycle: 'linear',
      fillMode: 'forwards',
      reducedMotion: 'ignore',
    });

    expect(el.style.getPropertyValue('--nui-rainbow-initial-hue')).toBe(
      '210deg',
    );
    expect(el.style.getPropertyValue('--nui-rainbow-from')).toBe('210deg');
    expect(el.style.getPropertyValue('--nui-rainbow-span')).toBe('60deg');
    expect(el.style.getPropertyValue('--nui-rainbow-offset')).toBe('24deg');
    expect(el.style.getPropertyValue('--nui-rainbow-alpha')).toBe('0.5');
    expect(el.style.getPropertyValue('--nui-rainbow-saturation')).toBe('40%');
    expect(el.style.getPropertyValue('--nui-rainbow-lightness')).toBe('48%');
    expect(el.style.getPropertyValue('--nui-rainbow-anim-name')).toBe(
      NUI_RAINBOW_ANIMATION_LINEAR,
    );
    expect(el.style.getPropertyValue('--nui-rainbow-fill-mode')).toBe(
      'forwards',
    );
    expect(el.getAttribute('cycle')).toBe('linear');
    expect(el.getAttribute('reduced-motion')).toBe('ignore');

    stop();

    for (const name of STYLE_VARS) {
      expect(el.style.getPropertyValue(name)).toBe('');
    }

    expect(el.hasAttribute('cycle')).toBe(false);
    expect(el.hasAttribute('fill-mode')).toBe(false);
    expect(el.hasAttribute('reduced-motion')).toBe(false);
  });

  it('derives span from to when both from and to are set', () => {
    const el = document.createElement('div');
    document.body.append(el);

    applyRainbow(el, { from: '120deg', to: '180deg' });

    expect(el.style.getPropertyValue('--nui-rainbow-from')).toBe('120deg');
    expect(el.style.getPropertyValue('--nui-rainbow-span')).toBe(
      'calc(180deg - var(--nui-rainbow-from))',
    );
  });

  it('emits rainbowcycle for the hue animation only', () => {
    const el = document.createElement('div');
    document.body.append(el);

    const seen: string[] = [];
    el.addEventListener(NUI_RAINBOW_EVENT, (event) => {
      seen.push(event.detail.animationName);
    });

    const stop = applyRainbow(el);
    el.dispatchEvent(
      new AnimationEvent('animationiteration', {
        animationName: NUI_RAINBOW_ANIMATION_BRANDED,
      }),
    );
    el.dispatchEvent(
      new AnimationEvent('animationiteration', {
        animationName: 'fade-in',
      }),
    );

    expect(seen).toEqual([NUI_RAINBOW_ANIMATION_BRANDED]);
    stop();

    el.dispatchEvent(
      new AnimationEvent('animationiteration', {
        animationName: NUI_RAINBOW_ANIMATION_BRANDED,
      }),
    );
    expect(seen).toEqual([NUI_RAINBOW_ANIMATION_BRANDED]);
  });

  it('bindRainbowCycle is idempotent', () => {
    const el = document.createElement('div');
    document.body.append(el);

    let count = 0;
    el.addEventListener(NUI_RAINBOW_EVENT, () => {
      count += 1;
    });

    bindRainbowCycle(el);
    bindRainbowCycle(el);
    el.dispatchEvent(
      new AnimationEvent('animationiteration', {
        animationName: NUI_RAINBOW_ANIMATION_LINEAR,
      }),
    );

    expect(count).toBe(1);
  });

  it('registers <nui-rainbow> and reflects duration', async () => {
    const el = document.createElement('nui-rainbow');
    el.setAttribute('duration', '8');
    document.body.append(el);
    await customElements.whenDefined('nui-rainbow');

    expect(el.classList.contains(NUI_RAINBOW_CLASS)).toBe(true);
    expect(el.duration).toBe('8s');
    expect(el.style.getPropertyValue('--nui-rainbow-duration')).toBe('8s');

    el.duration = 45;
    expect(el.getAttribute('duration')).toBe('45s');
    expect(el.style.getPropertyValue('--nui-rainbow-duration')).toBe('45s');
  });

  it('reflects cycle, offset, and to on the web component', async () => {
    const el = document.createElement('nui-rainbow');
    el.setAttribute('cycle', 'linear');
    el.setAttribute('offset', '18');
    el.setAttribute('from', '90');
    el.setAttribute('to', '150');
    document.body.append(el);
    await customElements.whenDefined('nui-rainbow');

    expect(el.cycle).toBe('linear');
    expect(el.offset).toBe('18deg');
    expect(el.from).toBe('90deg');
    expect(el.style.getPropertyValue('--nui-rainbow-anim-name')).toBe(
      NUI_RAINBOW_ANIMATION_LINEAR,
    );
    expect(el.style.getPropertyValue('--nui-rainbow-offset')).toBe('18deg');
    expect(el.style.getPropertyValue('--nui-rainbow-span')).toBe(
      'calc(150deg - var(--nui-rainbow-from))',
    );
  });
});
