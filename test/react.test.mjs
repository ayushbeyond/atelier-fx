import { test } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><body><div id="root"></div></body>', { pretendToBeVisual: true });
const w = dom.window;
w.matchMedia = (q) => ({ matches: q.includes('pointer: fine') });
w.IntersectionObserver = class { observe() {} disconnect() {} };
for (const k of ['window', 'document', 'navigator', 'HTMLElement', 'IntersectionObserver']) {
  Object.defineProperty(globalThis, k, { value: k === 'window' ? w : w[k], configurable: true, writable: true });
}
globalThis.requestAnimationFrame = (f) => setTimeout(f, 0);
globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const React = (await import('react')).default;
const { createRoot } = await import('react-dom/client');
const { act } = React;
const { FX } = await import('../dist/react.js');

test('<FX> applies effects on mount and cleans up on unmount', async () => {
  const root = createRoot(document.getElementById('root'));
  await act(async () => {
    root.render(React.createElement(FX, { as: 'section', fx: 'glass tilt', id: 'card' }, 'Hi'));
  });
  const el = document.getElementById('card');
  assert.equal(el.tagName, 'SECTION');
  assert.ok(el.classList.contains('af-glass'));
  assert.ok(el.classList.contains('af-tilt'));
  await act(async () => root.unmount());
  assert.equal(document.getElementById('card'), null);
});
