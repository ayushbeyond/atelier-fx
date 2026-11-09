import { prefersReducedMotion, hasFinePointer, num, str, onceInView, localPointer, listen } from './core.js';

/*
 * Each effect is `(el, opts) => cleanup`.
 * Effects only ever add classes, CSS custom properties and (for reveal/curtain)
 * a few wrapper elements, and cleanup puts the element back the way it was.
 */

/* ---------------------------------------------------------------- glass */
// Frosted panel with a specular highlight that follows the pointer.
export function glass(el) {
  el.classList.add('af-glass');
  if (!hasFinePointer() || prefersReducedMotion()) {
    return () => el.classList.remove('af-glass');
  }
  const off = [
    listen(el, 'pointermove', (e) => {
      const p = localPointer(el, e);
      el.style.setProperty('--af-mx', p.x + 'px');
      el.style.setProperty('--af-my', p.y + 'px');
      el.classList.add('af-glass--lit');
    }, { passive: true }),
    listen(el, 'pointerleave', () => el.classList.remove('af-glass--lit')),
  ];
  return () => {
    off.forEach((f) => f());
    el.classList.remove('af-glass', 'af-glass--lit');
    el.style.removeProperty('--af-mx');
    el.style.removeProperty('--af-my');
  };
}

/* ----------------------------------------------------------------- draw */
// SVG line art that draws itself when it scrolls into view.
const SHAPES = 'path,line,polyline,polygon,circle,ellipse,rect';

export function draw(el, opts = {}) {
  const svgShapes = Array.from(el.querySelectorAll(SHAPES));
  const touched = [];
  const stagger = num(el, 'stagger', opts.stagger ?? 0.08);
  const duration = num(el, 'duration', opts.duration ?? 1.8);

  svgShapes.forEach((s, i) => {
    // pathLength="1" lets us animate any shape from 1 → 0 without measuring it.
    if (!s.hasAttribute('pathLength')) {
      s.setAttribute('pathLength', '1');
      touched.push(s);
    }
    s.style.setProperty('--af-i', i);
  });
  el.style.setProperty('--af-stagger', stagger + 's');
  el.style.setProperty('--af-duration', duration + 's');
  el.classList.add('af-draw');

  const reveal = () => el.classList.add('af-in');
  const stop = prefersReducedMotion() ? (reveal(), () => {}) : onceInView(el, reveal);

  return () => {
    stop();
    el.classList.remove('af-draw', 'af-in');
    touched.forEach((s) => s.removeAttribute('pathLength'));
    svgShapes.forEach((s) => s.style.removeProperty('--af-i'));
  };
}

/* --------------------------------------------------------------- reveal */
// Headings that rise word by word (or letter by letter) out of a mask.
export function reveal(el, opts = {}) {
  const mode = str(el, 'split', opts.split ?? 'words'); // 'words' | 'chars'
  const stagger = num(el, 'stagger', opts.stagger ?? (mode === 'chars' ? 0.025 : 0.06));
  const original = el.innerHTML;
  const label = el.textContent.trim().replace(/\s+/g, ' ');

  // Split text nodes only, so inline markup like <em> and <br> survives.
  let i = 0;
  const wrap = (text) => {
    const frag = document.createDocumentFragment();
    text.split(/(\s+)/).forEach((word) => {
      if (!word) return;
      if (/^\s+$/.test(word)) {
        frag.appendChild(document.createTextNode(' '));
        return;
      }
      const mask = document.createElement('span');
      mask.className = 'af-mask';
      if (mode === 'chars') {
        for (const ch of Array.from(word)) {
          const inner = document.createElement('span');
          inner.className = 'af-piece';
          inner.style.setProperty('--af-i', i++);
          inner.textContent = ch;
          mask.appendChild(inner);
        }
      } else {
        const inner = document.createElement('span');
        inner.className = 'af-piece';
        inner.style.setProperty('--af-i', i++);
        inner.textContent = word;
        mask.appendChild(inner);
      }
      frag.appendChild(mask);
    });
    return frag;
  };
  const walk = (node) => {
    Array.from(node.childNodes).forEach((child) => {
      if (child.nodeType === 3) child.replaceWith(wrap(child.textContent));
      else if (child.nodeType === 1 && child.tagName !== 'BR') walk(child);
    });
  };
  walk(el);

  // Screen readers get the sentence once, not word fragments.
  el.setAttribute('aria-label', label);
  el.querySelectorAll('.af-mask').forEach((m) => m.setAttribute('aria-hidden', 'true'));
  el.style.setProperty('--af-stagger', stagger + 's');
  el.classList.add('af-reveal');

  const show = () => el.classList.add('af-in');
  const stop = prefersReducedMotion() ? (show(), () => {}) : onceInView(el, show);

  return () => {
    stop();
    el.innerHTML = original;
    el.removeAttribute('aria-label');
    el.classList.remove('af-reveal', 'af-in');
    el.style.removeProperty('--af-stagger');
  };
}

/* ----------------------------------------------------------------- foil */
// Metallic light sweeping across text. Pure CSS; JS only adds the class.
export function foil(el) {
  el.classList.add('af-foil');
  return () => el.classList.remove('af-foil');
}

/* ------------------------------------------------------------ spotlight */
// Soft glow that follows the cursor across a (usually dark) section.
export function spotlight(el) {
  el.classList.add('af-spotlight');
  if (!hasFinePointer()) return () => el.classList.remove('af-spotlight');
  const off = [
    listen(el, 'pointermove', (e) => {
      const p = localPointer(el, e);
      el.style.setProperty('--af-sx', p.x + 'px');
      el.style.setProperty('--af-sy', p.y + 'px');
      el.classList.add('af-spotlight--on');
    }, { passive: true }),
    listen(el, 'pointerleave', () => el.classList.remove('af-spotlight--on')),
  ];
  return () => {
    off.forEach((f) => f());
    el.classList.remove('af-spotlight', 'af-spotlight--on');
  };
}

/* ----------------------------------------------------------------- tilt */
// Card that leans and drifts toward the cursor, then settles back.
export function tilt(el, opts = {}) {
  if (!hasFinePointer() || prefersReducedMotion()) return () => {};
  const max = num(el, 'tilt', opts.tilt ?? 6); // degrees
  const pull = num(el, 'pull', opts.pull ?? 8); // px of magnetic drift
  const ease = num(el, 'ease', opts.ease ?? 0.12); // 0..1, lower = smoother

  el.classList.add('af-tilt');
  let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;

  const frame = () => {
    cx += (tx - cx) * ease;
    cy += (ty - cy) * ease;
    el.style.transform =
      `perspective(900px) translate3d(${(cx * pull).toFixed(2)}px, ${(cy * pull).toFixed(2)}px, 0) ` +
      `rotateX(${(-cy * max).toFixed(2)}deg) rotateY(${(cx * max).toFixed(2)}deg)`;
    if (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) raf = requestAnimationFrame(frame);
    else raf = 0;
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };

  const off = [
    listen(el, 'pointermove', (e) => {
      const p = localPointer(el, e);
      tx = p.nx; ty = p.ny; kick();
    }, { passive: true }),
    listen(el, 'pointerleave', () => { tx = 0; ty = 0; kick(); }),
  ];
  return () => {
    off.forEach((f) => f());
    cancelAnimationFrame(raf);
    el.classList.remove('af-tilt');
    el.style.transform = '';
  };
}

/* -------------------------------------------------------------- curtain */
// A panel that pulls away to unveil the element, on load or when scrolled to.
export function curtain(el, opts = {}) {
  const direction = str(el, 'direction', opts.direction ?? 'up'); // up | down | left | right
  const trigger = str(el, 'trigger', opts.trigger ?? 'view'); // view | load
  const panel = document.createElement('span');
  panel.className = 'af-curtain__panel';
  panel.setAttribute('aria-hidden', 'true');

  el.classList.add('af-curtain', 'af-curtain--' + direction);
  el.appendChild(panel);

  const open = () => requestAnimationFrame(() => el.classList.add('af-in'));
  let stop = () => {};
  if (prefersReducedMotion()) el.classList.add('af-in');
  else if (trigger === 'load') {
    if (document.readyState === 'complete') open();
    else stop = listen(window, 'load', open, { once: true });
  } else stop = onceInView(el, open, { threshold: 0.25 });

  return () => {
    stop();
    panel.remove();
    el.classList.remove('af-curtain', 'af-curtain--' + direction, 'af-in');
  };
}

export const effects = { glass, draw, reveal, foil, spotlight, tilt, curtain };
