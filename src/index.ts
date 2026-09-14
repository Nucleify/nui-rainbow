import { defineNuiRainbow } from './nui-rainbow.js';

defineNuiRainbow();

export {
  applyRainbow,
  applyRainbowOptions,
  bindRainbowCycle,
  rainbowDefaults,
} from './apply.js';
export {
  NUI_RAINBOW_ALPHA_DEFAULT,
  NUI_RAINBOW_ANIMATION_BRANDED,
  NUI_RAINBOW_ANIMATION_LINEAR,
  NUI_RAINBOW_BORDER_CLASS,
  NUI_RAINBOW_CLASS,
  NUI_RAINBOW_CYCLE_DEFAULT,
  NUI_RAINBOW_DELAY_DEFAULT,
  NUI_RAINBOW_DURATION_DEFAULT,
  NUI_RAINBOW_DURATION_SLOW,
  NUI_RAINBOW_EASING_DEFAULT,
  NUI_RAINBOW_EVENT,
  NUI_RAINBOW_FILL_MODE_DEFAULT,
  NUI_RAINBOW_HUE_INITIAL,
  NUI_RAINBOW_ITERATIONS_DEFAULT,
  NUI_RAINBOW_LIGHTNESS_DEFAULT,
  NUI_RAINBOW_OFFSET_DEFAULT,
  NUI_RAINBOW_SATURATION_DEFAULT,
  NUI_RAINBOW_SPAN_DEFAULT,
  NUI_RAINBOW_STYLE_ID,
  NUI_RAINBOW_TAG,
  NUI_RAINBOW_TEXT_CLASS,
  NUI_RAINBOW_UNDERLINE_CLASS,
} from './constants.js';
export { NUI_RAINBOW_CSS } from './css.js';
export {
  formatCssAlpha,
  formatCssAngle,
  formatCssPercent,
  formatCssTime,
} from './duration.js';
export { defineNuiRainbow, NuiRainbow } from './nui-rainbow.js';
export { ensureRainbowStyles, getRainbowStyleSheet } from './styles.js';
export type {
  NuiRainbowCycle,
  NuiRainbowCycleDetail,
  NuiRainbowDirection,
  NuiRainbowFillMode,
  NuiRainbowOptions,
  NuiRainbowReducedMotion,
} from './types.js';
