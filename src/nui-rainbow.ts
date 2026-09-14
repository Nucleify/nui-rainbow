import { applyRainbowOptions, bindRainbowCycle } from './apply.js';
import {
  NUI_RAINBOW_ALPHA_DEFAULT,
  NUI_RAINBOW_CLASS,
  NUI_RAINBOW_CYCLE_DEFAULT,
  NUI_RAINBOW_DELAY_DEFAULT,
  NUI_RAINBOW_DURATION_DEFAULT,
  NUI_RAINBOW_EASING_DEFAULT,
  NUI_RAINBOW_FILL_MODE_DEFAULT,
  NUI_RAINBOW_HUE_INITIAL,
  NUI_RAINBOW_ITERATIONS_DEFAULT,
  NUI_RAINBOW_LIGHTNESS_DEFAULT,
  NUI_RAINBOW_OFFSET_DEFAULT,
  NUI_RAINBOW_SATURATION_DEFAULT,
  NUI_RAINBOW_SPAN_DEFAULT,
  NUI_RAINBOW_TAG,
} from './constants.js';
import {
  formatCssAlpha,
  formatCssAngle,
  formatCssPercent,
  formatCssTime,
} from './duration.js';
import { ensureRainbowStyles } from './styles.js';
import type {
  NuiRainbowCycle,
  NuiRainbowCycleDetail,
  NuiRainbowDirection,
  NuiRainbowFillMode,
  NuiRainbowReducedMotion,
} from './types.js';

const DIRECTIONS = new Set<NuiRainbowDirection>([
  'normal',
  'reverse',
  'alternate',
  'alternate-reverse',
]);

const CYCLES = new Set<NuiRainbowCycle>(['branded', 'linear']);

const FILL_MODES = new Set<NuiRainbowFillMode>([
  'none',
  'forwards',
  'backwards',
  'both',
]);

function isDirection(value: string): value is NuiRainbowDirection {
  return DIRECTIONS.has(value as NuiRainbowDirection);
}

function isCycle(value: string): value is NuiRainbowCycle {
  return CYCLES.has(value as NuiRainbowCycle);
}

function isFillMode(value: string): value is NuiRainbowFillMode {
  return FILL_MODES.has(value as NuiRainbowFillMode);
}

export class NuiRainbow extends HTMLElement {
  static readonly observedAttributes = [
    'duration',
    'initial-hue',
    'from',
    'to',
    'hue-span',
    'offset',
    'easing',
    'iterations',
    'delay',
    'paused',
    'direction',
    'reduced-motion',
    'saturation',
    'lightness',
    'alpha',
    'cycle',
    'fill-mode',
  ];

  private unbindCycle: (() => void) | undefined;

  connectedCallback(): void {
    ensureRainbowStyles();
    this.classList.add(NUI_RAINBOW_CLASS);
    this.syncFromAttributes();
    this.unbindCycle = bindRainbowCycle(this);
  }

  disconnectedCallback(): void {
    this.unbindCycle?.();
    this.unbindCycle = undefined;
  }

  attributeChangedCallback(): void {
    if (!this.isConnected) {
      return;
    }

    this.syncFromAttributes();
  }

  get duration(): string {
    return formatCssTime(
      this.getAttribute('duration'),
      NUI_RAINBOW_DURATION_DEFAULT,
    );
  }

  set duration(value: string | number) {
    this.setAttribute('duration', formatCssTime(value));
  }

  get initialHue(): string {
    return formatCssAngle(
      this.getAttribute('initial-hue') ?? this.getAttribute('from'),
      NUI_RAINBOW_HUE_INITIAL,
    );
  }

  set initialHue(value: string | number) {
    this.setAttribute('initial-hue', formatCssAngle(value));
  }

  get from(): string {
    return formatCssAngle(
      this.getAttribute('from') ?? this.getAttribute('initial-hue'),
      NUI_RAINBOW_HUE_INITIAL,
    );
  }

  set from(value: string | number) {
    this.setAttribute('from', formatCssAngle(value));
  }

  get to(): string {
    const value = this.getAttribute('to');
    return value ? formatCssAngle(value) : '';
  }

  set to(value: string | number) {
    this.setAttribute('to', formatCssAngle(value));
  }

  get hueSpan(): string {
    return formatCssAngle(
      this.getAttribute('hue-span'),
      NUI_RAINBOW_SPAN_DEFAULT,
    );
  }

  set hueSpan(value: string | number) {
    this.setAttribute(
      'hue-span',
      formatCssAngle(value, NUI_RAINBOW_SPAN_DEFAULT),
    );
  }

  get offset(): string {
    return formatCssAngle(
      this.getAttribute('offset'),
      NUI_RAINBOW_OFFSET_DEFAULT,
    );
  }

  set offset(value: string | number) {
    this.setAttribute(
      'offset',
      formatCssAngle(value, NUI_RAINBOW_OFFSET_DEFAULT),
    );
  }

  get easing(): string {
    return this.getAttribute('easing') ?? NUI_RAINBOW_EASING_DEFAULT;
  }

  set easing(value: string) {
    this.setAttribute('easing', value);
  }

  get iterations(): string {
    return this.getAttribute('iterations') ?? NUI_RAINBOW_ITERATIONS_DEFAULT;
  }

  set iterations(value: string | number) {
    this.setAttribute('iterations', String(value));
  }

  get delay(): string {
    return formatCssTime(this.getAttribute('delay'), NUI_RAINBOW_DELAY_DEFAULT);
  }

  set delay(value: string | number) {
    this.setAttribute('delay', formatCssTime(value, NUI_RAINBOW_DELAY_DEFAULT));
  }

  get paused(): boolean {
    return this.hasAttribute('paused');
  }

  set paused(value: boolean) {
    this.toggleAttribute('paused', value);
  }

  get direction(): NuiRainbowDirection {
    const value = this.getAttribute('direction');
    return value && isDirection(value) ? value : 'normal';
  }

  set direction(value: NuiRainbowDirection) {
    this.setAttribute('direction', value);
  }

  get reducedMotion(): NuiRainbowReducedMotion {
    return this.getAttribute('reduced-motion') === 'ignore'
      ? 'ignore'
      : 'reduce';
  }

  set reducedMotion(value: NuiRainbowReducedMotion) {
    this.setAttribute('reduced-motion', value);
  }

  get saturation(): string {
    return formatCssPercent(
      this.getAttribute('saturation'),
      NUI_RAINBOW_SATURATION_DEFAULT,
    );
  }

  set saturation(value: string | number) {
    this.setAttribute(
      'saturation',
      formatCssPercent(value, NUI_RAINBOW_SATURATION_DEFAULT),
    );
  }

  get lightness(): string {
    return formatCssPercent(
      this.getAttribute('lightness'),
      NUI_RAINBOW_LIGHTNESS_DEFAULT,
    );
  }

  set lightness(value: string | number) {
    this.setAttribute(
      'lightness',
      formatCssPercent(value, NUI_RAINBOW_LIGHTNESS_DEFAULT),
    );
  }

  get alpha(): string {
    return formatCssAlpha(
      this.getAttribute('alpha'),
      NUI_RAINBOW_ALPHA_DEFAULT,
    );
  }

  set alpha(value: string | number) {
    this.setAttribute('alpha', formatCssAlpha(value));
  }

  get cycle(): NuiRainbowCycle {
    const value = this.getAttribute('cycle');
    return value && isCycle(value) ? value : NUI_RAINBOW_CYCLE_DEFAULT;
  }

  set cycle(value: NuiRainbowCycle) {
    this.setAttribute('cycle', value);
  }

  get fillMode(): NuiRainbowFillMode {
    const value = this.getAttribute('fill-mode');
    return value && isFillMode(value) ? value : NUI_RAINBOW_FILL_MODE_DEFAULT;
  }

  set fillMode(value: NuiRainbowFillMode) {
    this.setAttribute('fill-mode', value);
  }

  private syncFromAttributes(): void {
    applyRainbowOptions(this, {
      duration: this.duration,
      from: this.from,
      initialHue: this.initialHue,
      easing: this.easing,
      iterations: this.iterations,
      delay: this.delay,
      direction: this.direction,
      saturation: this.saturation,
      lightness: this.lightness,
      alpha: this.alpha,
      offset: this.offset,
      cycle: this.cycle,
      fillMode: this.fillMode,
      ...(this.hasAttribute('to')
        ? { to: this.to }
        : { hueSpan: this.hueSpan }),
    });
    this.classList.toggle('is-paused', this.paused);
  }
}

export function defineNuiRainbow(tag = NUI_RAINBOW_TAG): typeof NuiRainbow {
  if (typeof customElements !== 'undefined' && !customElements.get(tag)) {
    customElements.define(tag, NuiRainbow);
  }

  return NuiRainbow;
}

declare global {
  interface HTMLElementTagNameMap {
    'nui-rainbow': NuiRainbow;
  }

  interface HTMLElementEventMap {
    rainbowcycle: CustomEvent<NuiRainbowCycleDetail>;
  }
}
