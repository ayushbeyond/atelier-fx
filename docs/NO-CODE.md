# atelier-fx in Webflow, Framer and WordPress

atelier-fx works anywhere you can add two lines to the page head and a custom attribute to an element.

The two lines, used in every guide below:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/atelier-fx@0.2/dist/atelier-fx.min.css">
<script src="https://cdn.jsdelivr.net/npm/atelier-fx@0.2" defer></script>
```

## Webflow

1. **Site settings → Custom code → Head code.** Paste the two lines and publish.
2. Select an element in the Designer, open **Element settings (the cog) → Custom attributes**, and add:
   - Name: `data-fx`
   - Value: `reveal` (or `glass`, `tilt spotlight`, `marquee`, …)
3. Options are more custom attributes, e.g. `data-af-split` = `chars`.
4. Publish. Effects don't run inside the Designer canvas, only on the published or preview site.

**Tip:** for `marquee`, put the attribute on a Div Block whose direct children are your logos or words.

## Framer

1. **Site settings → General → Custom code → End of `<head>` tag.** Paste the two lines.
2. Select a layer, open the right panel's **Attributes** (under the layer settings), and add `data-fx` with your effect name.
3. Publish. Framer re-renders on page changes, so effects re-apply automatically when you navigate.

Framer's own animations and atelier-fx can live on the same page; just don't put both on the same layer.

## WordPress

**Block editor (Gutenberg)**
1. Add the two lines to your theme head with a plugin like *WPCode* (Header section) or in `header.php` before `</head>`.
2. Select a block, open **Advanced → HTML anchor / Additional CSS class**. Gutenberg doesn't edit custom attributes directly, so either:
   - use a **Custom HTML** block: `<h2 data-fx="reveal">Your heading</h2>`, or
   - install *Block Attributes* (free) and add `data-fx` in the block sidebar.

**Elementor**
1. Add the two lines under **Elementor → Custom code** (Pro) or with *WPCode*.
2. Select a widget, then **Advanced → Attributes** and enter `data-fx|reveal` (Pro).

## Shopify

1. **Online Store → Themes → Edit code → `layout/theme.liquid`.** Paste the two lines just before `</head>`.
2. In any section's custom Liquid or HTML block, add `data-fx="…"` to your elements.

## Anywhere else

If your builder lets you add a `<script>` and an attribute, it works. If it only allows classes, add this after the two lines and use classes like `fx-reveal`:

```html
<script>
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[class*="fx-"]').forEach((el) => {
    const names = [...el.classList].filter((c) => c.startsWith('fx-')).map((c) => c.slice(3));
    names.forEach((n) => AtelierFX.apply(el, n));
  });
});
</script>
```
