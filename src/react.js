// React bindings: `import { FX, useFX } from 'atelier-fx/react'`.
// React is a peer dependency and is not bundled.
import { createElement, forwardRef, useCallback, useEffect, useRef } from 'react';
import { apply } from './index.js';

const names = (fx) => (Array.isArray(fx) ? fx : String(fx || '').trim().split(/\s+/)).filter(Boolean);

/**
 * Attach one or more effects to an element.
 *   const ref = useFX('reveal', { split: 'chars' });
 *   return <h1 ref={ref}>Hello</h1>;
 */
export function useFX(fx, options) {
  const ref = useRef(null);
  const key = names(fx).join(' ') + '|' + JSON.stringify(options || {});
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const undo = names(fx).map((n) => apply(el, n, options));
    return () => undo.forEach((u) => u());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return ref;
}

/**
 * Component form.
 *   <FX as="h1" fx="reveal">Every seam finished by hand.</FX>
 *   <FX fx="tilt spotlight" options={{ tilt: 8 }}>…</FX>
 */
export const FX = forwardRef(function FX({ as = 'div', fx, options, ...rest }, forwarded) {
  const local = useFX(fx, options);
  const setRef = useCallback(
    (node) => {
      local.current = node;
      if (typeof forwarded === 'function') forwarded(node);
      else if (forwarded) forwarded.current = node;
    },
    [forwarded, local]
  );
  return createElement(as, { ...rest, ref: setRef });
});
