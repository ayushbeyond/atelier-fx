// Builds the demo site from docs/src.html with the library inlined.
//   docs/index.html     full document, for GitHub Pages
//   docs/artifact.html  body-only version, for hosts that add their own <html> skeleton
import { readFile, writeFile } from 'node:fs/promises';

const src = await readFile('docs/src.html', 'utf8');
const css = await readFile('dist/atelier-fx.min.css', 'utf8');
const js = await readFile('dist/atelier-fx.min.js', 'utf8');
const page = src
  .replace('/*__AFX_CSS__*/', () => css)
  .replace('/*__AFX_JS__*/', () => js.replace(/<\/script/gi, '<\\/script'));

await writeFile('docs/artifact.html', page);
await writeFile(
  'docs/index.html',
  '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n' +
    '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n' +
    page.replace(/<\/style>\s*\n\s*<header/, '</style>\n</head>\n<body>\n<header') +
    '\n</body>\n</html>\n'
);
console.log('demo written: docs/index.html, docs/artifact.html');
