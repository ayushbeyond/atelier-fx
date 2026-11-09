---
title: "Building a Liquid Glass Panel with a Cursor-Following Highlight in CSS"
description: "How to build a frosted glass card with a lit edge and a specular highlight that tracks the pointer, using backdrop-filter, a mask trick and two CSS variables."
tags: css, javascript, ui, animation
canonical_url: https://github.com/ayushbeyond/atelier-fx/blob/main/docs/tutorials/liquid-glass.md
---

# Building a Liquid Glass Panel with a Cursor-Following Highlight

Glass interfaces are back, and the good ones share three details that most "glassmorphism" snippets skip:

1. **The edge catches light.** Real glass has a bright rim at the top and a dimmer one at the bottom.
2. **There's a specular highlight**, and it moves when you do.
3. **Depth comes from the shadow**, not from a heavy white fill.

In this tutorial we'll build all three with about 60 lines of CSS and 15 of JavaScript, then make it accessible and touch-friendly. The finished version ships as the `glass` effect in [atelier-fx](https://github.com/ayushbeyond/atelier-fx) if you want to skip ahead.

**What you'll learn:** layered `backdrop-filter`, the mask-composite trick for gradient borders, driving pseudo-elements from CSS custom properties, and degrading gracefully.

---

## 1. The markup

Glass only reads as glass when there's something colourful behind it, so give the panel a backdrop:

```html
<section class="field">
  <article class="glass">
    <p class="eyebrow">Fitting ticket</p>
    <h3>Look 07, second fitting</h3>
  </article>
</section>
```

```css
.field {
  display: grid;
  place-items: center;
  min-height: 360px;
  background:
    radial-gradient(40% 55% at 22% 30%, #7b3f6b, transparent 70%),
    radial-gradient(45% 50% at 80% 75%, #b07b3d, transparent 70%),
    #1a1420;
}
```

## 2. The frosted body

The body is a blur of what's behind it, a whisper of tint and a deep shadow.

```css
.glass {
  position: relative;
  isolation: isolate;          /* keeps our pseudo-elements behind the content */
  padding: 26px;
  border-radius: 24px;
  color: #f6f1f8;
  background:
    linear-gradient(145deg, rgb(255 255 255 / .12), rgb(255 255 255 / .02) 40%, rgb(255 255 255 / .06)),
    rgb(255 255 255 / .07);
  -webkit-backdrop-filter: blur(22px) saturate(160%);
  backdrop-filter: blur(22px) saturate(160%);
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / .18),   /* top lip */
    0 30px 60px -30px rgb(0 0 0 / .55);     /* depth */
}
```

Two details make the difference here:

- **`saturate(160%)`** after the blur. Blurring averages colours toward grey; saturating brings the richness back, which is what makes Apple's materials feel "liquid".
- **The diagonal gradient** in the background is brighter top-left and bottom-right. That uneven fill reads as a curved surface rather than a flat sticker.

## 3. A rim that catches light

A plain `border: 1px solid rgba(255,255,255,.3)` looks like a sticker outline. Real glass is brighter where it faces the light. We want a **gradient border**, and CSS can't do that with `border` and `border-radius` together.

The trick: draw a gradient on a pseudo-element, then mask out everything except a 1px ring.

```css
.glass::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  padding: 1px;                                   /* ring thickness */
  background: linear-gradient(170deg,
    rgb(255 255 255 / .28), transparent 35%,
    transparent 70%, rgb(255 255 255 / .12));
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
          mask-composite: exclude;
  pointer-events: none;
}
```

How it works: the element has two mask layers, one covering the **content box** and one covering the **whole box**. `exclude` keeps only where they don't overlap, which is the 1px padding ring. The gradient shows through just there, bright at the top and faint at the bottom.

## 4. The moving highlight

Now the part people notice. We draw a soft radial highlight on `::after` and position it with two custom properties:

```css
.glass::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  background: radial-gradient(320px circle at var(--mx, 50%) var(--my, 0%),
    rgb(255 255 255 / .22), transparent 60%);
  opacity: 0;
  transition: opacity .5s cubic-bezier(.22, 1, .36, 1);
  pointer-events: none;
}
.glass.is-lit::after { opacity: 1; }
```

JavaScript only has to update two variables. No layout, no re-renders:

```js
const glass = document.querySelector('.glass');

glass.addEventListener('pointermove', (e) => {
  const r = glass.getBoundingClientRect();
  glass.style.setProperty('--mx', `${e.clientX - r.left}px`);
  glass.style.setProperty('--my', `${e.clientY - r.top}px`);
  glass.classList.add('is-lit');
}, { passive: true });

glass.addEventListener('pointerleave', () => glass.classList.remove('is-lit'));
```

Why this is fast: changing a custom property that only feeds a `background` triggers a repaint of that one layer. There's no reflow, and no `requestAnimationFrame` loop is needed because the browser coalesces pointer events per frame anyway.

## 5. Respect people and devices

Two lines of care make this production-ready:

```js
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (fine && !calm) {
  // attach the pointer listeners from step 4
}
```

- **Touch screens** have no hover, so a highlight that appears under a tapping finger and then sticks looks like a bug. Keep the frosted body and rim; skip the tracking.
- **Reduced motion** users get the same calm panel.

And for older browsers without `backdrop-filter`, the tinted background still gives a readable panel. Add a fallback if your backdrop is busy:

```css
@supports not (backdrop-filter: blur(1px)) {
  .glass { background: rgb(30 24 36 / .86); }
}
```

## 6. Make it themeable

Swap the literals for variables and every instance can be tuned inline:

```css
.glass {
  --glass-blur: 22px;
  --glass-sheen: rgb(255 255 255 / .22);
  backdrop-filter: blur(var(--glass-blur)) saturate(160%);
}
```

```html
<article class="glass" style="--glass-sheen: rgb(241 217 167 / .3)">…</article>
```

A champagne sheen on a plum backdrop is a very different mood from a cool white one on blue, with the same component.

---

## The one-line version

All of this, plus cleanup for frameworks, is the `glass` effect in atelier-fx:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/atelier-fx/dist/atelier-fx.min.css">
<script src="https://cdn.jsdelivr.net/npm/atelier-fx" defer></script>

<article data-fx="glass">…</article>
```

It's MIT licensed and dependency-free, with eleven more effects in the same spirit. [Live demo](https://ayushbeyond.github.io/atelier-fx/) · [Source](https://github.com/ayushbeyond/atelier-fx)

*Ayush builds websites for premium brands at [Beyond Branding Media](https://thebeyondbranding.com).*
