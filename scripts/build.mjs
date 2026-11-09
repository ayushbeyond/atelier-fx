import { build, transform } from 'esbuild';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';

const banner = '/*! atelier-fx v' + JSON.parse(await readFile('package.json', 'utf8')).version + ' · MIT · github.com/4yu5hvy45/atelier-fx */';
await mkdir('dist', { recursive: true });

const common = { entryPoints: ['src/index.js'], bundle: true, target: 'es2019', banner: { js: banner } };
await build({ ...common, format: 'esm', outfile: 'dist/atelier-fx.js' });
await build({ ...common, format: 'cjs', outfile: 'dist/atelier-fx.cjs' });
await build({ ...common, entryPoints: ['src/browser.js'], format: 'iife', outfile: 'dist/atelier-fx.min.js', minify: true });

const css = await readFile('src/atelier-fx.css', 'utf8');
await writeFile('dist/atelier-fx.css', css);
const min = await transform(css, { loader: 'css', minify: true });
await writeFile('dist/atelier-fx.min.css', banner + '\n' + min.code);

const js = await readFile('dist/atelier-fx.min.js');
const kb = (b) => (b.length / 1024).toFixed(1) + ' KB';
console.log(`min.js ${kb(js)} (${kb(gzipSync(js))} gzip) · min.css ${kb(Buffer.from(min.code))} (${kb(gzipSync(min.code))} gzip)`);
