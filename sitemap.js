const fs = require('fs');
const { SitemapStream, streamToPromise } = require('sitemap');
const { Readable } = require('stream');

// Function to add trailing slash to URLs if not present
function addTrailingSlash(url) {
    return url.endsWith('/') ? url : `${url}/`;
}

// Function to load URLs from JSON
function loadUrls() {
    const data = fs.readFileSync('dist/prerendered-routes.json', 'utf8');
    const urls = JSON.parse(data).routes;
    // Modify URLs and set priorities and changefreq
    return urls.map(url => {
        url = addTrailingSlash(url);
        if (url === '/privacy/' || url === '/tos/') {
            return { url, priority: 0.5 };
        } else if (url === '/blog/') {
            return { url, changefreq: 'weekly', priority: 0.7 };
        } else if (url === '/') {
            return { url, priority: 1 };
        } else if (url.startsWith("/heic-to")) {
            return { url, priority: 0.8 };
        }
        return { url, priority: 0.7 };
    });
}

// Function to generate sitemap.xml
async function generateSitemap() {
    const urls = loadUrls();
    const smStream = new SitemapStream({ hostname: 'https://onlineheicconvert.com' });
    const readable = Readable.from(urls);
    const sitemapOutput = await streamToPromise(readable.pipe(smStream)).then(data => data.toString());

    fs.writeFileSync('dist/browser/sitemap.xml', sitemapOutput);
    console.log('Sitemap generated successfully!');
}

generateSitemap().catch(console.error);