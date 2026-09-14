import {
  NUI_RAINBOW_ALPHA_DEFAULT,
  NUI_RAINBOW_ANIMATION_BRANDED,
  NUI_RAINBOW_ANIMATION_LINEAR,
  NUI_RAINBOW_CLASS,
  NUI_RAINBOW_CYCLE_DEFAULT,
  NUI_RAINBOW_DELAY_DEFAULT,
  NUI_RAINBOW_DURATION_DEFAULT,
  NUI_RAINBOW_EASING_DEFAULT,
  NUI_RAINBOW_EVENT,
  NUI_RAINBOW_FILL_MODE_DEFAULT,
  NUI_RAINBOW_HUE_INITIAL,
  NUI_RAINBOW_ITERATIONS_DEFAULT,
  NUI_RAINBOW_LIGHTNESS_DEFAULT,
  NUI_RAINBOW_OFFSET_DEFAULT,
  NUI_RAINBOW_SATURATION_DEFAULT,
  NUI_RAINBOW_SPAN_DEFAULT,
} from './constants.js';
import {
  formatCssAlpha,
  formatCssAngle,
  formatCssPercent,
  formatCssTime,
} from './duration.js';
import { ensureRainbowStyles } from './styles.js';
import type { NuiRainbowCycleDetail, NuiRainbowOptions } from './types.js';

export const STYLE_VARS = [
  '--nui-rainbow-duration',
  '--nui-rainbow-initial-hue',
  '--nui-rainbow-from',
  '--nui-rainbow-easing',
  '--nui-rainbow-iterations',
  '--nui-rainbow-delay',
  '--nui-rainbow-direction',
  '--nui-rainbow-fill-mode',
  '--nui-rainbow-saturation',
  '--nui-rainbow-lightness',
  '--nui-rainbow-alpha',
  '--nui-rainbow-offset',
  '--nui-rainbow-span',
  '--nui-rainbow-anim-name',
] as const;

const cycleUnbinds = new WeakMap<EventTarget, () => void>();

function setAttr(el: Element, name: string, value: string | null): void {
  if (value == null) {
    if (el.hasAttribute(name)) {
      el.removeAttribute(name);
    }
    return;
  }

  if (el.getAttribute(name) !== value) {
    el.setAttribute(name, value);
  }
}

function animationNameOf(event: Event): string {
  if ('animationName' in event && typeof event.animationName === 'string') {
    return event.animationName;
  }

  return '';
}

export function bindRainbowCycle(el: EventTarget): () => void {
  cycleUnbinds.get(el)?.();

  const onIteration = (event: Event): void => {
    const animationName = animationNameOf(event);
    if (
      animationName !== NUI_RAINBOW_ANIMATION_BRANDED &&
      animationName !== NUI_RAINBOW_ANIMATION_LINEAR
    ) {
      return;
    }

    el.dispatchEvent(
      new CustomEvent<NuiRainbowCycleDetail>(NUI_RAINBOW_EVENT, {
        bubbles: true,
        detail: { animationName },
      }),
    );
  };

  el.addEventListener('animationiteration', onIteration);

  const unbind = (): void => {
    el.removeEventListener('animationiteration', onIteration);
    if (cycleUnbinds.get(el) === unbind) {
      cycleUnbinds.delete(el);
    }
  };

  cycleUnbinds.set(el, unbind);
  return unbind;
}

export function applyRainbowOptions(
  el: Element,
  options: NuiRainbowOptions = {},
): void {
  if (!(el instanceof HTMLElement)) {
    return;
  }

  if (options.duration != null) {
    el.style.setProperty(
      '--nui-rainbow-duration',
      formatCssTime(options.duration, NUI_RAINBOW_DURATION_DEFAULT),
    );
  }

  const hueStart = options.from ?? options.initialHue;
  if (hueStart != null) {
    const angle = formatCssAngle(hueStart);
    el.style.setProperty('--nui-rainbow-initial-hue', angle);
    el.style.setProperty('--nui-rainbow-from', angle);
  }

  if (options.easing != null) {
    el.style.setProperty('--nui-rainbow-easing', options.easing);
  }

  if (options.iterations != null) {
    el.style.setProperty(
      '--nui-rainbow-iterations',
      String(options.iterations),
    );
  }

  if (options.delay != null) {
    el.style.setProperty(
      '--nui-rainbow-delay',
      formatCssTime(options.delay, NUI_RAINBOW_DELAY_DEFAULT),
    );
  }

  if (options.direction != null) {
    el.style.setProperty('--nui-rainbow-direction', options.direction);
  }

  if (options.saturation != null) {
    el.style.setProperty(
      '--nui-rainbow-saturation',
      formatCssPercent(options.saturation, NUI_RAINBOW_SATURATION_DEFAULT),
    );
  }

  if (options.lightness != null) {
    el.style.setProperty(
      '--nui-rainbow-lightness',
      formatCssPercent(options.lightness, NUI_RAINBOW_LIGHTNESS_DEFAULT),
    );
  }

  if (options.alpha != null) {
    el.style.setProperty(
      '--nui-rainbow-alpha',
      formatCssAlpha(options.alpha, NUI_RAINBOW_ALPHA_DEFAULT),
    );
  }

  if (options.offset != null) {
    el.style.setProperty(
      '--nui-rainbow-offset',
      formatCssAngle(options.offset, NUI_RAINBOW_OFFSET_DEFAULT),
    );
  }

  if (options.to != null) {
    el.style.setProperty(
      '--nui-rainbow-span',
      `calc(${formatCssAngle(options.to)} - var(--nui-rainbow-from))`,
    );
  } else if (options.hueSpan != null) {
    el.style.setProperty(
      '--nui-rainbow-span',
      formatCssAngle(options.hueSpan, NUI_RAINBOW_SPAN_DEFAULT),
    );
  }

  if (options.fillMode != null) {
    el.style.setProperty('--nui-rainbow-fill-mode', options.fillMode);
    setAttr(el, 'fill-mode', options.fillMode);
  }

  if (options.cycle != null) {
    el.style.setProperty(
      '--nui-rainbow-anim-name',
      options.cycle === 'linear'
        ? NUI_RAINBOW_ANIMATION_LINEAR
        : NUI_RAINBOW_ANIMATION_BRANDED,
    );
    setAttr(el, 'cycle', options.cycle);
  }

  if (options.paused != null) {
    el.classList.toggle('is-paused', options.paused);
    setAttr(el, 'paused', options.paused ? '' : null);
  }

  if (options.reducedMotion != null) {
    setAttr(el, 'reduced-motion', options.reducedMotion);
  }
}

export function applyRainbow(
  el: Element,
  options: NuiRainbowOptions = {},
): () => void {
  ensureRainbowStyles();
  el.classList.add(NUI_RAINBOW_CLASS);
  applyRainbowOptions(el, options);
  const unbindCycle = bindRainbowCycle(el);

  return () => {
    unbindCycle();
    el.classList.remove(NUI_RAINBOW_CLASS, 'is-paused');
    setAttr(el, 'paused', null);
    setAttr(el, 'reduced-motion', null);
    setAttr(el, 'cycle', null);
    setAttr(el, 'fill-mode', null);

    if (el instanceof HTMLElement) {
      for (const name of STYLE_VARS) {
        el.style.removeProperty(name);
      }
    }
  };
}

export function rainbowDefaults(): Required<NuiRainbowOptions> {
  return {
    duration: NUI_RAINBOW_DURATION_DEFAULT,
    initialHue: NUI_RAINBOW_HUE_INITIAL,
    easing: NUI_RAINBOW_EASING_DEFAULT,
    iterations: NUI_RAINBOW_ITERATIONS_DEFAULT,
    delay: NUI_RAINBOW_DELAY_DEFAULT,
    direction: 'normal',
    saturation: NUI_RAINBOW_SATURATION_DEFAULT,
    lightness: NUI_RAINBOW_LIGHTNESS_DEFAULT,
    paused: false,
    reducedMotion: 'reduce',
    cycle: NUI_RAINBOW_CYCLE_DEFAULT,
    fillMode: NUI_RAINBOW_FILL_MODE_DEFAULT,
    hueSpan: NUI_RAINBOW_SPAN_DEFAULT,
    from: NUI_RAINBOW_HUE_INITIAL,
    to: `calc(${NUI_RAINBOW_HUE_INITIAL} + ${NUI_RAINBOW_SPAN_DEFAULT})`,
    offset: NUI_RAINBOW_OFFSET_DEFAULT,
    alpha: NUI_RAINBOW_ALPHA_DEFAULT,
  };
}
