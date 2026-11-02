import {
  NUI_RAINBOW_ALPHA_DEFAULT,
  NUI_RAINBOW_ANIMATION_BRANDED,
  NUI_RAINBOW_ANIMATION_GPU,
  NUI_RAINBOW_ANIMATION_LINEAR,
  NUI_RAINBOW_CLASS,
  NUI_RAINBOW_CYCLE_DEFAULT,
  NUI_RAINBOW_DELAY_DEFAULT,
  NUI_RAINBOW_DURATION_DEFAULT,
  NUI_RAINBOW_EASING_DEFAULT,
  NUI_RAINBOW_EVENT,
  NUI_RAINBOW_FILL_MODE_DEFAULT,
  NUI_RAINBOW_FPS_DEFAULT,
  NUI_RAINBOW_FPS_ECO,
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
  parseCssTimeToMs,
} from './duration.js';
import { ensureRainbowStyles } from './styles.js';
import type {
  NuiRainbowCycle,
  NuiRainbowCycleDetail,
  NuiRainbowDirection,
  NuiRainbowFps,
  NuiRainbowOptions,
} from './types.js';

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
  '--nui-rainbow-play-state',
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

/** Check if the current environment is running on a low-end or battery-saving device. */
export function isLowEndDevice(): boolean {
  if (typeof navigator === 'undefined') {
    return false;
  }

  const nav = navigator as unknown as {
    hardwareConcurrency?: number;
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };

  if (
    typeof nav.hardwareConcurrency === 'number' &&
    nav.hardwareConcurrency > 0 &&
    nav.hardwareConcurrency <= 4
  ) {
    return true;
  }

  if (
    typeof nav.deviceMemory === 'number' &&
    nav.deviceMemory > 0 &&
    nav.deviceMemory <= 4
  ) {
    return true;
  }

  if (nav.connection?.saveData === true) {
    return true;
  }

  return false;
}

/** Calculate cycle hue angle for given normalized progress [0..1]. */
export function computeCycleHue(
  cycle: NuiRainbowCycle,
  progress: number,
): number {
  const p = ((progress % 1) + 1) % 1;

  if (cycle === 'linear') {
    return 152 + p * 360;
  }

  if (p < 0.12) return 152;
  if (p < 0.25) return 152 + ((p - 0.12) / 0.13) * (190 - 152);
  if (p < 0.37) return 190;
  if (p < 0.5) return 190 + ((p - 0.37) / 0.13) * (292 - 190);
  if (p < 0.62) return 292;
  if (p < 0.75) return 292 + ((p - 0.62) / 0.13) * (375 - 292);
  if (p < 0.87) return 375;
  return 375 + ((p - 0.87) / 0.13) * (512 - 375);
}

export function resolveTargetFps(
  fps: NuiRainbowFps | undefined,
): number | null {
  if (fps == null || fps === 'smooth') {
    return null;
  }

  if (fps === 'eco') {
    return NUI_RAINBOW_FPS_ECO;
  }

  if (fps === 'auto') {
    return isLowEndDevice() ? NUI_RAINBOW_FPS_ECO : null;
  }

  if (typeof fps === 'number' && Number.isFinite(fps) && fps > 0 && fps < 60) {
    return Math.round(fps);
  }

  return null;
}

// Shared visibility observer for all rainbow instances to avoid per-element overhead
let sharedObserver: IntersectionObserver | null = null;
const observedElements = new Map<Element, (isVisible: boolean) => void>();
let visibilityListenerAttached = false;

function handleDocVisibilityChange(): void {
  const isDocHidden = typeof document !== 'undefined' && document.hidden;

  for (const [el, callback] of observedElements.entries()) {
    if (isDocHidden) {
      el.setAttribute('data-nui-offscreen', '');
      callback(false);
    } else if (!el.hasAttribute('data-nui-offscreen-viewport')) {
      el.removeAttribute('data-nui-offscreen');
      callback(true);
    }
  }
}

function getSharedObserver(): IntersectionObserver | null {
  if (typeof IntersectionObserver === 'undefined') {
    return null;
  }

  if (!sharedObserver) {
    try {
      sharedObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const callback = observedElements.get(entry.target);
            if (!callback) continue;

            if (entry.isIntersecting) {
              entry.target.removeAttribute('data-nui-offscreen-viewport');
              if (typeof document === 'undefined' || !document.hidden) {
                entry.target.removeAttribute('data-nui-offscreen');
                callback(true);
              }
            } else {
              entry.target.setAttribute('data-nui-offscreen-viewport', '');
              entry.target.setAttribute('data-nui-offscreen', '');
              callback(false);
            }
          }
        },
        { rootMargin: '60px' },
      );
    } catch {
      sharedObserver = null;
    }
  }

  if (!visibilityListenerAttached && typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', handleDocVisibilityChange);
    visibilityListenerAttached = true;
  }

  return sharedObserver;
}

export function observeVisibility(
  el: Element,
  callback: (isVisible: boolean) => void,
): () => void {
  const observer = getSharedObserver();
  observedElements.set(el, callback);

  if (observer) {
    observer.observe(el);
  }

  return () => {
    observedElements.delete(el);
    if (observer) {
      observer.unobserve(el);
    }
    el.removeAttribute('data-nui-offscreen');
    el.removeAttribute('data-nui-offscreen-viewport');
  };
}

export function bindRainbowFpsLoop(
  el: HTMLElement,
  options: {
    durationMs: number;
    cycle: NuiRainbowCycle;
    targetFps: number;
    direction?: NuiRainbowDirection;
    isPaused: () => boolean;
  },
): () => void {
  let rafId: number | null = null;
  let lastTime = 0;
  let accumulatedTime = 0;
  let lastTimestamp =
    typeof performance !== 'undefined' ? performance.now() : 0;
  const frameInterval = 1000 / options.targetFps;
  let isRunning = true;
  let lastLap = -1;

  // Pause CSS animation so RAF throttler takes over
  el.style.setProperty('--nui-rainbow-anim-name', 'none');

  const loop = (timestamp: number): void => {
    if (!isRunning) return;

    const delta = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    if (!options.isPaused()) {
      accumulatedTime += delta;
      if (timestamp - lastTime >= frameInterval) {
        lastTime = timestamp;
        const progress =
          (accumulatedTime % options.durationMs) / options.durationMs;
        const currentLap = Math.floor(accumulatedTime / options.durationMs);

        const effProgress =
          options.direction === 'reverse' ? 1 - progress : progress;

        const hueAngle = computeCycleHue(options.cycle, effProgress);
        el.style.setProperty(
          '--nui-rainbow-cycle',
          `${hueAngle.toFixed(1)}deg`,
        );

        if (currentLap > lastLap && lastLap !== -1) {
          const animName =
            options.cycle === 'linear'
              ? NUI_RAINBOW_ANIMATION_LINEAR
              : NUI_RAINBOW_ANIMATION_BRANDED;
          el.dispatchEvent(
            new CustomEvent<NuiRainbowCycleDetail>(NUI_RAINBOW_EVENT, {
              bubbles: true,
              detail: { animationName: animName },
            }),
          );
        }
        lastLap = currentLap;
      }
    }

    if (typeof requestAnimationFrame !== 'undefined') {
      rafId = requestAnimationFrame(loop);
    }
  };

  if (typeof requestAnimationFrame !== 'undefined') {
    rafId = requestAnimationFrame((ts) => {
      lastTimestamp = ts;
      loop(ts);
    });
  }

  return () => {
    isRunning = false;
    if (rafId != null && typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };
}

export function bindRainbowCycle(el: EventTarget): () => void {
  cycleUnbinds.get(el)?.();

  const onIteration = (event: Event): void => {
    const animationName = animationNameOf(event);
    if (
      animationName !== NUI_RAINBOW_ANIMATION_BRANDED &&
      animationName !== NUI_RAINBOW_ANIMATION_LINEAR &&
      animationName !== NUI_RAINBOW_ANIMATION_GPU
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

  if (options.mode === 'gpu') {
    el.style.setProperty('--nui-rainbow-anim-name', NUI_RAINBOW_ANIMATION_GPU);
    setAttr(el, 'mode', 'gpu');
  } else if (options.cycle != null) {
    el.style.setProperty(
      '--nui-rainbow-anim-name',
      options.cycle === 'linear'
        ? NUI_RAINBOW_ANIMATION_LINEAR
        : NUI_RAINBOW_ANIMATION_BRANDED,
    );
    setAttr(el, 'cycle', options.cycle);
  }

  if (options.mode != null && options.mode !== 'gpu') {
    setAttr(el, 'mode', options.mode);
  }

  if (options.fps != null) {
    setAttr(el, 'fps', String(options.fps));
  }

  if (options.autoPause != null) {
    setAttr(el, 'auto-pause', options.autoPause ? 'true' : 'false');
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

  let unbindVisibility: (() => void) | undefined;
  let isElementVisible = true;

  if (options.autoPause !== false) {
    unbindVisibility = observeVisibility(el, (visible) => {
      isElementVisible = visible;
    });
  }

  let unbindFpsLoop: (() => void) | undefined;
  const targetFps = resolveTargetFps(options.fps);

  if (
    targetFps != null &&
    options.mode !== 'gpu' &&
    el instanceof HTMLElement
  ) {
    const durationMs = parseCssTimeToMs(
      options.duration,
      parseCssTimeToMs(NUI_RAINBOW_DURATION_DEFAULT),
    );
    unbindFpsLoop = bindRainbowFpsLoop(el, {
      durationMs,
      cycle: options.cycle ?? NUI_RAINBOW_CYCLE_DEFAULT,
      targetFps,
      direction: options.direction,
      isPaused: () => options.paused === true || !isElementVisible,
    });
  }

  return () => {
    unbindCycle();
    unbindVisibility?.();
    unbindFpsLoop?.();

    el.classList.remove(NUI_RAINBOW_CLASS, 'is-paused');
    setAttr(el, 'paused', null);
    setAttr(el, 'reduced-motion', null);
    setAttr(el, 'cycle', null);
    setAttr(el, 'fill-mode', null);
    setAttr(el, 'mode', null);
    setAttr(el, 'fps', null);
    setAttr(el, 'auto-pause', null);
    el.removeAttribute('data-nui-offscreen');
    el.removeAttribute('data-nui-offscreen-viewport');

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
    fps: NUI_RAINBOW_FPS_DEFAULT,
    autoPause: true,
    mode: 'css',
  };
}
