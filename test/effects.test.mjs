import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';

// A minimal browser: jsdom plus the APIs it lacks.
let observed;
function setup({ reduced = false, fine = true } = {}) {
  const dom = new JSDOM('<!doctype html><body></body>', { pretendToBeVisual: true });
  const w = dom.window;
  w.matchMedia = (q) => ({
    matches: q.includes('reduced-motion') ? reduced : q.includes('pointer: fine') ? fine : false,
  });
  observed = [];
  w.IntersectionObserver = class {
    constructor(cb) { this.cb = cb; observed.push(this); }
    observe(el) { this.el = el; }
    disconnect() { this.off = true; }
    fire() { if (!this.off) this.cb([{ isIntersecting: true, target: this.el }]); }
  };
  w.requestAnimationFrame = (f) => setTimeout(f, 0);
  w.cancelAnimationFrame = (id) => clearTimeout(id);
  globalThis.window = w;
  globalThis.document = w.document;
  globalThis.IntersectionObserver = w.IntersectionObserver;
  globalThis.requestAnimationFrame = w.requestAnimationFrame;
  globalThis.cancelAnimationFrame = w.cancelAnimationFrame;
  return w;
}
const fireAll = () => observed.forEach((o) => o.fire());
const fx = await import('../src/index.js');

beforeEach(() => setup());

test('init applies every effect listed in data-fx and cleanup restores the DOM', () => {
  document.body.innerHTML = `
    <div id="a" data-fx="glass tilt spotlight"></div>
    <h1 id="b" data-fx="reveal">Made <em>by hand</em></h1>
    <p id="c" data-fx="foil">Gold</p>`;
  const before = document.body.innerHTML;
  const undo = fx.init();
  const a = document.getElementById('a');
  assert.ok(a.classList.contains('af-glass'));
  assert.ok(a.classList.contains('af-tilt'));
  assert.ok(a.classList.contains('af-spotlight'));
  assert.ok(document.getElementById('c').classList.contains('af-foil'));
  undo();
  assert.equal(document.body.innerHTML.replace(/ class=""/g, '').replace(/ style=""/g, ''), before);
});

test('reveal splits words, keeps inline markup, and stays readable for screen readers', () => {
  document.body.innerHTML = '<h1 id="h">Made <em>by hand</em></h1>';
  const h = document.getElementById('h');
  fx.reveal(h);
  assert.equal(h.querySelectorAll('.af-piece').length, 3);
  assert.ok(h.querySelector('em .af-piece'), 'em survives');
  assert.equal(h.getAttribute('aria-label'), 'Made by hand');
  assert.ok(!h.classList.contains('af-in'), 'waits for view');
  fireAll();
  assert.ok(h.classList.contains('af-in'));
});

test('reveal chars mode makes one piece per character', () => {
  document.body.innerHTML = '<h2 id="h" data-af-split="chars">Luxe</h2>';
  fx.reveal(document.getElementById('h'));
  assert.equal(document.querySelectorAll('.af-piece').length, 4);
});

test('draw normalises stroke lengths and reveals in view', () => {
  document.body.innerHTML = '<svg id="s"><path d="M0 0L10 10"/><circle r="4" pathLength="2"/></svg>';
  const s = document.getElementById('s');
  const undo = fx.draw(s);
  assert.equal(s.querySelector('path').getAttribute('pathLength'), '1');
  assert.equal(s.querySelector('circle').getAttribute('pathLength'), '2', 'author value kept');
  fireAll();
  assert.ok(s.classList.contains('af-in'));
  undo();
  assert.equal(s.querySelector('path').getAttribute('pathLength'), null);
  assert.equal(s.querySelector('circle').getAttribute('pathLength'), '2');
});

test('curtain adds a panel and removes it on cleanup', () => {
  document.body.innerHTML = '<figure id="f"><img alt=""></figure>';
  const f = document.getElementById('f');
  const undo = fx.curtain(f, { direction: 'left' });
  assert.ok(f.querySelector('.af-curtain__panel'));
  assert.ok(f.classList.contains('af-curtain--left'));
  undo();
  assert.equal(f.querySelector('.af-curtain__panel'), null);
});

test('reduced motion: content shows immediately and tilt is skipped', () => {
  setup({ reduced: true });
  document.body.innerHTML = '<h1 id="h">Hello there</h1><div id="t"></div>';
  fx.reveal(document.getElementById('h'));
  fx.tilt(document.getElementById('t'));
  assert.ok(document.getElementById('h').classList.contains('af-in'));
  assert.ok(!document.getElementById('t').classList.contains('af-tilt'));
});

test('touch devices: glass keeps its look but skips pointer tracking', () => {
  setup({ fine: false });
  document.body.innerHTML = '<div id="g"></div>';
  const g = document.getElementById('g');
  fx.glass(g);
  g.dispatchEvent(new window.Event('pointermove'));
  assert.ok(g.classList.contains('af-glass'));
  assert.ok(!g.classList.contains('af-glass--lit'));
});

test('applying an effect twice is a no-op; unknown effects warn instead of throwing', () => {
  document.body.innerHTML = '<h1 id="h">Once only</h1>';
  const h = document.getElementById('h');
  fx.apply(h, 'reveal');
  fx.apply(h, 'reveal');
  assert.equal(h.querySelectorAll('.af-piece').length, 2);
  const warn = console.warn; let warned = false; console.warn = () => (warned = true);
  fx.apply(h, 'sparkles');
  console.warn = warn;
  assert.ok(warned);
});

test('destroy removes effects from descendants', () => {
  document.body.innerHTML = '<section id="s"><p data-fx="foil">a</p><p data-fx="glass">b</p></section>';
  fx.init();
  fx.destroy(document.getElementById('s'));
  assert.equal(document.querySelectorAll('.af-foil, .af-glass').length, 0);
});
