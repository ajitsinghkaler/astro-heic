import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import analogjsangular from "@analogjs/astro-angular";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: 'https://onlineheicconvert.com', 
  integrations: [tailwind(), analogjsangular(), sitemap({
    customFilename: 'sitemap.xml', // Ensures the sitemap is named sitemap.xml
  })]
});