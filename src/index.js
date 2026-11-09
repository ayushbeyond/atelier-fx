import { hasDOM } from './core.js';
import { effects } from './effects.js';

export { glass, draw, reveal, foil, spotlight, tilt, curtain, grain, marquee, progress, count, video } from './effects.js';
export { effects };

const registry = new WeakMap(); // element -> Map(effectName -> cleanup)

/**
 * Apply one effect to one element. Returns a cleanup function.
 * Applying the same effect twice to an element is a no-op.
 */
export function apply(el, name, opts) {
  const fx = effects[name];
  if (!fx) {
    if (typeof console !== 'undefined') console.warn(`[atelier-fx] unknown effect "${name}"`);
    return () => {};
  }
  let map = registry.get(el);
  if (!map) registry.set(el, (map = new Map()));
  if (map.has(name)) return map.get(name);
  const undo = fx(el, opts) || (() => {});
  const cleanup = () => {
    undo();
    map.delete(name);
  };
  map.set(name, cleanup);
  return cleanup;
}

/**
 * Find every [data-fx] element under `root` and apply the effects it lists
 * (space separated, e.g. data-fx="tilt spotlight"). Returns one cleanup for all of them.
 */
export function init(root) {
  if (!hasDOM()) return () => {};
  const scope = root || document;
  const nodes = [];
  if (scope.nodeType === 1 && scope.hasAttribute('data-fx')) nodes.push(scope);
  nodes.push(...scope.querySelectorAll('[data-fx]'));
  const cleanups = [];
  for (const el of nodes) {
    for (const name of el.getAttribute('data-fx').trim().split(/\s+/)) {
      if (name) cleanups.push(apply(el, name));
    }
  }
  return () => cleanups.forEach((c) => c());
}

/** Remove every effect from an element (and, optionally, its descendants). */
export function destroy(el, { deep = true } = {}) {
  const targets = [el, ...(deep ? el.querySelectorAll('[data-fx]') : [])];
  for (const t of targets) {
    const map = registry.get(t);
    if (map) [...map.values()].forEach((c) => c());
  }
}

export default { init, apply, destroy, effects };
