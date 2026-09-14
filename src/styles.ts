import { NUI_RAINBOW_STYLE_ID } from './constants.js';
import { NUI_RAINBOW_CSS } from './css.js';

let rainbowSheet: CSSStyleSheet | null = null;

function canAdoptStyleSheets(): boolean {
  return (
    typeof CSSStyleSheet !== 'undefined' &&
    typeof CSSStyleSheet.prototype.replaceSync === 'function' &&
    typeof document !== 'undefined' &&
    'adoptedStyleSheets' in document
  );
}

export function getRainbowStyleSheet(): CSSStyleSheet {
  if (!rainbowSheet) {
    rainbowSheet = new CSSStyleSheet();
    rainbowSheet.replaceSync(NUI_RAINBOW_CSS);
  }

  return rainbowSheet;
}

export function ensureRainbowStyles(): void {
  if (typeof document === 'undefined') {
    return;
  }

  if (canAdoptStyleSheets()) {
    try {
      const sheet = getRainbowStyleSheet();
      if (!document.adoptedStyleSheets.includes(sheet)) {
        document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
      }
      return;
    } catch {
      // Fall through to a <style> tag when constructable sheets are unavailable.
    }
  }

  if (document.getElementById(NUI_RAINBOW_STYLE_ID)) {
    return;
  }

  const style = document.createElement('style');
  style.id = NUI_RAINBOW_STYLE_ID;
  style.textContent = NUI_RAINBOW_CSS;
  document.head.appendChild(style);
}
