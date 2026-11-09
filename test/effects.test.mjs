import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';

// A minimal browser: jsdom plus the APIs it lacks.
const nodePerf = globalThis.performance;
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
  globalThis.performance = nodePerf;
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

test('marquee clones content once, hides the clone, and restores on cleanup', () => {
  document.body.innerHTML = '<div id="m"><span>ESPERTI</span><a href="#">Soul AV</a></div>';
  const m = document.getElementById('m');
  const before = m.innerHTML;
  const undo = fx.marquee(m);
  const groups = m.querySelectorAll('.af-marquee__group');
  assert.equal(groups.length, 2);
  assert.equal(groups[1].getAttribute('aria-hidden'), 'true');
  assert.equal(groups[1].querySelector('a').getAttribute('tabindex'), '-1');
  undo();
  assert.equal(m.innerHTML, before);
});

test('count keeps prefix, suffix and separators, and finishes on the real value', async () => {
  document.body.innerHTML = '<span id="c" data-af-duration="0.05">₹1,240+</span>';
  const c = document.getElementById('c');
  fx.count(c);
  assert.equal(c.textContent, '₹0+');
  assert.equal(c.getAttribute('aria-label'), '₹1,240+');
  fireAll();
  await new Promise((r) => setTimeout(r, 200));
  assert.equal(c.textContent, '₹1,240+');
});

test('count keeps Indian lakh grouping', async () => {
  document.body.innerHTML = '<span id="c" data-af-duration="0.05">₹4,80,000</span><span id="d" data-af-duration="0.05">$1,250,000</span>';
  fx.count(document.getElementById('c'));
  fx.count(document.getElementById('d'));
  fireAll();
  await new Promise((r) => setTimeout(r, 200));
  assert.equal(document.getElementById('c').textContent, '₹4,80,000');
  assert.equal(document.getElementById('d').textContent, '$1,250,000');
});

test('count with reduced motion shows the final value straight away', () => {
  setup({ reduced: true });
  document.body.innerHTML = '<span id="c">98.5%</span>';
  fx.count(document.getElementById('c'));
  assert.equal(document.getElementById('c').textContent, '98.5%');
});

test('progress exposes an accessible progressbar', () => {
  document.body.innerHTML = '<div id="p"></div>';
  const p = document.getElementById('p');
  const undo = fx.progress(p);
  assert.equal(p.getAttribute('role'), 'progressbar');
  assert.equal(p.getAttribute('aria-valuenow'), '0');
  undo();
  assert.equal(p.getAttribute('role'), null);
});

test('video plays only in view and stays paused for reduced motion', () => {
  document.body.innerHTML = '<video id="v"></video>';
  const v = document.getElementById('v');
  let played = 0, paused = 0;
  v.play = () => { played++; return Promise.resolve(); };
  v.pause = () => { paused++; };
  fx.video(v);
  assert.ok(v.muted);
  assert.equal(played, 0);
  fireAll();
  assert.equal(played, 1);

  setup({ reduced: true });
  document.body.innerHTML = '<video id="v"></video>';
  const v2 = document.getElementById('v');
  let played2 = 0;
  v2.play = () => { played2++; return Promise.resolve(); };
  v2.pause = () => {};
  fx.video(v2);
  fireAll();
  assert.equal(played2, 0);
});

test('destroy removes effects from descendants', () => {
  document.body.innerHTML = '<section id="s"><p data-fx="foil">a</p><p data-fx="glass">b</p></section>';
  fx.init();
  fx.destroy(document.getElementById('s'));
  assert.equal(document.querySelectorAll('.af-foil, .af-glass').length, 0);
});
