import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import robotsTxt from 'astro-robots-txt';
import node from '@astrojs/node';
import mdx from '@astrojs/mdx';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://alberto.masweb.es',
  base: '/',
  output: "static", 
  integrations: [
    mdx(), 
    sitemap({
      filter: (page) => {
        const uri = page.split('/').slice(-2, -1)[0];
        const excludes = ['legal', 'privacidad', 'cookies'];
        return !(excludes.includes(uri));
        }
    }), 
    robotsTxt()], 
  experimental: { 
    contentIntellisense: true,
    // svg: true,
  },
  redirects: {
    '/blog': '/blog/1',
    '/portfolio': '/portfolio/1',
  },
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
});