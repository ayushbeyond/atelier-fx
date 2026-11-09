// Entry for the <script> build. Exposes window.AtelierFX and auto-initialises,
// unless the script tag carries data-manual.
import * as AtelierFX from './index.js';

const script = typeof document !== 'undefined' ? document.currentScript : null;
const manual = script && script.hasAttribute('data-manual');

if (typeof window !== 'undefined') {
  window.AtelierFX = AtelierFX;
  if (!manual) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => AtelierFX.init(), { once: true });
    } else {
      AtelierFX.init();
    }
  }
}
