import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import angular from "@analogjs/astro-angular";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: 'https://onlineheicconvert.com',
  prefetch: {
    prefetchAll: true
  },
  integrations: [tailwind(), angular(), sitemap({
    filter: page => !/^\/404(?:\.html|\/)?$/.test(new URL(page).pathname),
    serialize: route => {
      if (route.url === 'https://onlineheicconvert.com/privacy/' || route.url === 'https://onlineheicconvert.com/tos/') {
        route.priority = 0.5;
      } else {
        route.priority = 1;
      }
      return route;
    }
  })]
});
