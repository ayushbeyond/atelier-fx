// Shared helpers. Everything here is safe to call during SSR (no window access at import time).

export const hasDOM = () => typeof window !== 'undefined' && typeof document !== 'undefined';

export const prefersReducedMotion = () =>
  hasDOM() && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const hasFinePointer = () =>
  hasDOM() && !!window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/** Read a numeric data attribute, e.g. data-af-strength="0.6". */
export function num(el, name, fallback) {
  const v = parseFloat(el.getAttribute('data-af-' + name));
  return Number.isFinite(v) ? v : fallback;
}

/** Read a string data attribute, e.g. data-af-split="chars". */
export function str(el, name, fallback) {
  const v = el.getAttribute('data-af-' + name);
  return v == null || v === '' ? fallback : v;
}

/**
 * Run `cb` once when `el` scrolls into view. Returns a cleanup function.
 * Falls back to running immediately where IntersectionObserver is unavailable.
 */
export function onceInView(el, cb, { threshold = 0.15, rootMargin = '0px 0px -8% 0px' } = {}) {
  if (!('IntersectionObserver' in window)) {
    cb();
    return () => {};
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          io.disconnect();
          cb();
        }
      }
    },
    { threshold, rootMargin }
  );
  io.observe(el);
  return () => io.disconnect();
}

/** Pointer position inside an element, as px and as -1..1. */
export function localPointer(el, e) {
  const r = el.getBoundingClientRect();
  const x = e.clientX - r.left;
  const y = e.clientY - r.top;
  return {
    x,
    y,
    nx: r.width ? (x / r.width) * 2 - 1 : 0,
    ny: r.height ? (y / r.height) * 2 - 1 : 0,
  };
}

/** Add listeners and get back one function that removes them all. */
export function listen(target, type, fn, opts) {
  target.addEventListener(type, fn, opts);
  return () => target.removeEventListener(type, fn, opts);
}
