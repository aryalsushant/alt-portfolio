// Server entry for scripts/prerender.mjs. Renders a route to static HTML so
// crawlers and AI tools get the page text without running JavaScript.
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import Home from '../src/pages/Home';
import ClassicPortfolio from '../src/pages/ClassicPortfolio';

const PAGES = { '/': Home, '/classic': ClassicPortfolio };

export function render(url) {
  const Page = PAGES[url];
  return renderToString(
    <StaticRouter location={url}>
      <Page />
    </StaticRouter>
  );
}
