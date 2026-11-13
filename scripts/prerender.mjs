// Runs after `react-scripts build`. Writes build/<route>/index.html with the
// route's markup and meta tags baked in. The client still mounts normally.
import { build } from 'esbuild';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'build');
const tmp = join(root, 'node_modules', '.cache', 'prerender');
const SITE = 'https://sushantaryal.com';

const ROUTES = {
  '/': {
    title: 'Sushant Aryal | AI Engineer and CS Student at Southern Miss',
    description:
      'Sushant Aryal is an AI engineer and computer science student at the University of Southern Mississippi. He built DCS for Gift of Life Marrow Registry, shipped PriCycle on the App Store, and co-authored an arXiv paper on LLM vulnerability repair.',
    render: true,
  },
  '/classic': {
    title: 'Sushant Aryal | Experience, Projects and Research',
    description:
      'Portfolio of Sushant Aryal: AI internship at Gift of Life Marrow Registry, Break Through Tech AI Fellowship at Cornell Tech, projects including DCS, PriCycle and HIPAApotamus, research, and hackathon awards.',
    render: true,
  },
  '/interactive': {
    title: 'Sushant Aryal | Interactive 3D Portfolio',
    description:
      'Sushant Aryal’s portfolio as a 3D game: run a robot across floating islands to read his experience, projects, research and awards. Works on phones.',
    render: false,
  },
};

const esc = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function setMeta(html, route, { title, description }) {
  const url = SITE + (route === '/' ? '/' : route);
  return html
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*/, `$1${esc(description)}`)
    .replace(/(<link rel="canonical" href=")[^"]*/, `$1${url}`)
    .replace(/(<meta property="og:url" content=")[^"]*/, `$1${url}`)
    .replace(/(<meta property="og:title" content=")[^"]*/, `$1${esc(title)}`)
    .replace(/(<meta property="og:description" content=")[^"]*/, `$1${esc(description)}`)
    .replace(/(<meta name="twitter:title" content=")[^"]*/, `$1${esc(title)}`)
    .replace(/(<meta name="twitter:description" content=")[^"]*/, `$1${esc(description)}`);
}

await build({
  entryPoints: [join(root, 'scripts', 'prerender-entry.js')],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  jsx: 'automatic',
  loader: { '.js': 'jsx', '.css': 'empty', '.svg': 'empty', '.png': 'empty', '.jpg': 'empty' },
  outfile: join(tmp, 'entry.cjs'),
  logLevel: 'warning',
  define: { 'process.env.NODE_ENV': '"production"' },
});

const { render } = createRequire(import.meta.url)(join(tmp, 'entry.cjs'));
const template = readFileSync(join(out, 'index.html'), 'utf8');

for (const [route, meta] of Object.entries(ROUTES)) {
  let html = setMeta(template, route, meta);
  if (meta.render) html = html.replace('<div id="root"></div>', `<div id="root">${render(route)}</div>`);
  const dir = route === '/' ? out : join(out, route.slice(1));
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html);
  console.log(`prerendered ${route}${meta.render ? '' : ' (meta only)'}`);
}

rmSync(tmp, { recursive: true, force: true });
