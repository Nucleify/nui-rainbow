export type NuiRainbowDirection =
  | 'normal'
  | 'reverse'
  | 'alternate'
  | 'alternate-reverse';

export type NuiRainbowReducedMotion = 'reduce' | 'ignore';

export type NuiRainbowCycle = 'branded' | 'linear';

export type NuiRainbowFillMode = 'none' | 'forwards' | 'backwards' | 'both';

export type NuiRainbowMode = 'css' | 'gpu';

export type NuiRainbowFps = number | 'auto' | 'smooth' | 'eco';

export interface NuiRainbowCycleDetail {
  animationName: string;
}

export interface NuiRainbowOptions {
  duration?: string | number;
  initialHue?: string | number;
  easing?: string;
  iterations?: string | number;
  delay?: string | number;
  paused?: boolean;
  direction?: NuiRainbowDirection;
  reducedMotion?: NuiRainbowReducedMotion;
  saturation?: string | number;
  lightness?: string | number;
  cycle?: NuiRainbowCycle;
  fillMode?: NuiRainbowFillMode;
  hueSpan?: string | number;
  from?: string | number;
  to?: string | number;
  offset?: string | number;
  alpha?: string | number;
  fps?: NuiRainbowFps;
  autoPause?: boolean;
  mode?: NuiRainbowMode;
}
