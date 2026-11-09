# atelier-fx launch kit

## Order of launch (one week)

1. **Day 0:** repo public, npm published, demo live on GitHub Pages. Pin the repo on your GitHub profile.
2. **Day 1:** X/Twitter thread + Instagram reel.
3. **Day 2:** Reddit (r/webdev Showoff Saturday, r/javascript, r/web_design). One subreddit per day, never the same text twice.
4. **Day 4:** Product Hunt (Tuesday–Thursday, 12:01 am PT ≈ 12:31 pm IST).
5. **Ongoing:** reply to every issue within 24 hours; ship a v0.2 effect within 3 weeks.

Record a 15-second screen capture of the demo page (hover the glass ticket, scroll the line art, hit Replay on the curtain). It is the asset for every channel.

---

## X / Twitter thread

**1/** I kept rebuilding the same premium effects for every client site, so I cut them into a tiny open-source library.

atelier-fx: liquid glass, self-drawing line art, masked reveals, foil text, spotlight, tilt and curtain transitions.

One HTML attribute. 2.5 KB. No dependencies. 🧵 [video]

**2/** Usage is one attribute:

`<h1 data-fx="reveal">Every seam finished by hand.</h1>`

Combine them: `data-fx="tilt spotlight"`

**3/** It's kind to every visitor. Reduced-motion users see the finished page instantly, touch devices skip cursor effects, and only transform and opacity ever animate.

**4/** Works with plain HTML, Vite, Next, Astro, even Webflow embeds. Every effect returns a cleanup, so it's safe in React components.

**5/** MIT licensed. Demo, docs and source: [link]
Effect requests and PRs very welcome. What should I add next?

---

## Reddit (r/webdev, Showoff Saturday)

**Title:** I open-sourced the luxury-site effects I keep rebuilding for clients (2.5 KB, no dependencies)

I run a small studio building websites for premium brands, and I noticed I was hand-writing the same effects on every project: frosted "liquid glass" panels, SVG illustrations that draw themselves, headings that rise out of a mask, foil-shimmer text, cursor spotlights, tilt cards and curtain reveals.

So I packaged them as **atelier-fx**. You add `data-fx="reveal"` (or glass, draw, foil, spotlight, tilt, curtain) to an element and that's it.

Things I cared about:
- 2.5 KB JS + 1.4 KB CSS gzipped, zero dependencies
- prefers-reduced-motion shows the finished state, touch devices skip pointer effects
- only transform/opacity animate; observers instead of scroll listeners
- every effect returns a cleanup that restores the DOM exactly

Demo: [link] · GitHub: [link]

Would love feedback, especially on which effects you'd want next.

---

## Product Hunt

**Name:** atelier-fx
**Tagline:** Premium website effects with one HTML attribute
**Description:** Seven hand-finished effects for luxury and editorial websites: liquid glass, self-drawing line art, masked text reveals, foil text, spotlight, tilt and curtain transitions. 2.5 KB, no dependencies, accessible by default. Free and open source.
**First comment:** Hi Product Hunt! I'm Ayush from Beyond Branding Media. We design websites for premium brands, and these are the effects clients ask for most, cleaned up and made reusable. Tell me which effect you want in v0.2.

---

## Instagram (@thebeyondbranding)

**Reel:** screen capture of the demo, one effect per beat, 1.5 s each, end on the install command.
**Caption:** We open-sourced our signature website effects. 🪡 Liquid glass, line art that draws itself, foil type and more, free for any developer. Link in bio. #webdesign #opensource #uidesign #frontend #creativedevelopment

---

## Contributing to other projects

Pick issues in libraries you already use. These were open when this kit was written (Nov 2026); check each is still open and unclaimed, and comment before starting.

**Lenis** (you use it on 10 of your sites)
- [#552](https://github.com/darkroomengineering/lenis/issues/552) `lock()` does not stop the keyboard, unlike v1 `stop()`
- [#553](https://github.com/darkroomengineering/lenis/issues/553) An `undefined` key in an option group replaces the default
- [#560](https://github.com/darkroomengineering/lenis/issues/560) `lenis/react` type declarations break type checking with `skipLibCheck: false`

**Locomotive Scroll**
- [#630](https://github.com/locomotivemtl/locomotive-scroll/issues/630) Next.js example unavailable (a good first docs PR)
- [#600](https://github.com/locomotivemtl/locomotive-scroll/issues/600) Bump Lenis to 1.3.18

**anime.js**
- [#1192](https://github.com/juliangarnier/anime/issues/1192) `onScroll` never refreshes the window height after a vertical-only resize
- [#1199](https://github.com/juliangarnier/anime/issues/1199) hsl() colours with 0% saturation convert to near-black

**AOS**
- [#832](https://github.com/michalsnik/aos/issues/832) horizontal scrollbar caused by AOS (well-discussed, needs a fix)

Aim for one real fix a week. Small, correct and well-tested beats many tiny PRs.

---

# Marketing Beyond Branding with atelier-fx

## Positioning line (use everywhere)
"Beyond Branding Media, the studio behind atelier-fx, the open-source motion library used by developers worldwide."
Only say "used by developers worldwide" once there are real installs; until then: "the studio behind atelier-fx, our open-source motion library."

Where it goes: thebeyondbranding.com footer (done on the `add-atelier-fx` branch), LinkedIn headline, proposal cover pages, email signature, Instagram bio.

## In pitches
- Open every website pitch (HYBEC, MergerOne, Rich By Fifty…) with a 20-second screen recording of the client's own hero using `reveal`, `curtain` and `glass`. It takes about 15 minutes with the CDN tags.
- Proposal line: "Your site will use atelier-fx, our open-source motion system, so every effect is tested, accessible and fast."

## Instagram content calendar (@thebeyondbranding), 4 weeks

| Week | Reel | Carousel |
| --- | --- | --- |
| 1 | "We open-sourced our signature effects" (demo montage) | 7 effects, 1 slide each |
| 2 | Liquid glass: before → after on a real client hero | How liquid glass works (from the tutorial) |
| 3 | Haveli template walk-through (Brand My Stay tie-in) | "Why your homestay needs its own website" |
| 4 | Behind the build: code on one side, the effect on the other | v0.2: five new finishes |

Repurpose each reel for @brandmystay (week 3) and LinkedIn.

## Articles and features
1. Publish `docs/tutorials/liquid-glass.md` on dev.to and Hashnode (canonical link to GitHub).
2. Pitch Codrops: email with the live demo and tutorial outline. They take original technique write-ups with demos.
3. Next tutorials: "Self-drawing SVG line art with pathLength=1", "A seamless marquee without JavaScript measuring".

## Showcase and awards
- Submit thebeyondbranding.com and the Haveli template to Awwwards (Honorable Mention), CSS Design Awards, Godly, and One Page Love (Haveli fits perfectly).
- Every client site built with atelier-fx goes on the demo-site showcase, with the client's permission.

## Pro template revenue
- List Haveli on Gumroad (listing copy in the atelier-fx-pro README).
- Link "Pro templates" from the demo-site footer once the listing is live.
- Offer setup as an upsell: template + branding + launch = a Brand My Stay package.
