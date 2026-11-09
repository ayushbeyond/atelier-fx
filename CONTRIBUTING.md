# Contributing to atelier-fx

Thanks for helping. atelier-fx stays small on purpose, so a few house rules keep it that way.

## Getting set up

```bash
git clone https://github.com/4yu5hvy45/atelier-fx.git
cd atelier-fx
npm install
npm test        # unit tests (Node + jsdom)
npm run demo    # builds dist/ and the demo site in docs/
```

Open `docs/index.html` in a browser to try your change.

## What makes a good effect

1. **One attribute to use it.** `data-fx="name"`, tuned with `data-af-*` or CSS custom properties.
2. **Only transform and opacity animate.** No layout thrashing, no scroll listeners when an IntersectionObserver will do.
3. **Reduced motion shows the finished state.** Never hide content from people who turn motion off.
4. **Touch devices degrade gracefully.** Cursor-driven effects switch off on coarse pointers.
5. **Cleanup restores the DOM exactly.** Every effect returns a function that undoes it; add a test that proves it.
6. **No dependencies.** If you need a library, it's probably a different project.

New effects live in `src/effects.js` with their styles in `src/atelier-fx.css`, a type in `types/index.d.ts`, a row in the README table and a section on the demo page.

## Pull requests

- Keep each PR to one change.
- Run `npm test` and `npm run build` before pushing; CI runs both.
- Include a short screen recording for anything visual.
- Note the size change the build prints.

## Reporting bugs

Open an issue with the browser and version, a minimal HTML snippet that shows the problem, and what you expected to see.

## Code of conduct

Be kind and assume good intent. Harassment of any kind isn't tolerated; maintainers may remove comments or contributors who don't follow this.
