# atelier-fx

**Crafted motion for premium websites.** Seven hand-finished effects (liquid glass, self-drawing line art, masked reveals, foil text, spotlight, tilt and curtain transitions) that you switch on with one HTML attribute.

- **2.5 KB** of JavaScript and **1.4 KB** of CSS, gzipped
- **No dependencies.** Works with plain HTML, Vite, Next.js, Astro, Webflow embeds, anything
- **Kind to every visitor.** Reduced-motion users see the finished page instantly; touch devices skip cursor effects
- **Fast.** Only `transform` and `opacity` animate, and nothing runs until it is on screen
- **Out of your way.** Effects add classes and CSS variables only, so your styles stay in charge

[**Live demo →**](https://4yu5hvy45.github.io/atelier-fx/)

## Install

```bash
npm i atelier-fx
```

```js
import { init } from 'atelier-fx';
import 'atelier-fx/style.css';

init(); // finds every [data-fx] on the page
```

Or straight from a CDN, no build step. The script initialises itself:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/atelier-fx/dist/atelier-fx.min.css">
<script src="https://cdn.jsdelivr.net/npm/atelier-fx" defer></script>
```

Add `data-manual` to the script tag if you'd rather call `AtelierFX.init()` yourself.

## Effects

Add `data-fx` to any element. List several to combine them: `data-fx="tilt spotlight"`.
Tune each effect with `data-af-*` attributes or CSS custom properties.

| Effect | What it does | Options |
| --- | --- | --- |
| `glass` | Frosted panel with a bright edge and a highlight that follows the cursor | `--af-glass-blur`, `--af-glass-tint`, `--af-glass-sheen`, `--af-glass-radius` |
| `draw` | SVG line art draws itself stroke by stroke in view | `data-af-stagger`, `data-af-duration` (seconds) |
| `reveal` | Text rises out of a mask, word by word or letter by letter | `data-af-split="words\|chars"`, `data-af-stagger`, `--af-reveal-duration` |
| `foil` | Slow metallic sweep across text | `--af-foil-shine`, `--af-foil-deep`, `--af-foil-speed` |
| `spotlight` | Soft light follows the cursor across a section | `--af-spot-color`, `--af-spot-size` |
| `tilt` | Card leans toward the cursor with a magnetic pull | `data-af-tilt` (deg), `data-af-pull` (px), `data-af-ease` |
| `curtain` | Panel pulls away to unveil media, which settles from a zoom | `data-af-direction="up\|down\|left\|right"`, `data-af-trigger="view\|load"`, `--af-curtain-color` |

```html
<h1 data-fx="reveal">Every seam finished <em>by hand.</em></h1>

<svg data-fx="draw" data-af-stagger="0.12">…</svg>

<p data-fx="foil" style="--af-foil-shine:#f1d9a7">Couture</p>

<section data-fx="spotlight">
  <div data-fx="tilt" data-af-tilt="8">…</div>
</section>

<figure data-fx="curtain" data-af-direction="left">
  <img src="look-07.jpg" alt="…">
</figure>
```

## JavaScript API

```js
import { init, apply, destroy, reveal } from 'atelier-fx';

const stop = init(container);              // scan a subtree; returns one cleanup
const undo = apply(el, 'tilt', { tilt: 10 }); // one effect, one element
const off  = reveal(el, { split: 'chars' }); // effects are also exported directly

destroy(el);                               // remove every effect from el and its children
```

Every function returns a cleanup that puts the DOM back exactly as it was, which makes atelier-fx safe in React, Vue and Svelte components:

```jsx
useEffect(() => init(ref.current), []);
```

TypeScript types are included.

## Browser support

Current Chrome, Edge, Safari and Firefox. Liquid glass uses `backdrop-filter`; browsers without it get a tinted panel instead.

## Contributing

New effects, fixes and demos are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md). Good first issues are labelled on the [issue tracker](https://github.com/4yu5hvy45/atelier-fx/issues).

## Licence

MIT © [Beyond Branding Media](https://beyondbranding.media)
