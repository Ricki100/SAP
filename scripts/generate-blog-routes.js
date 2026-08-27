import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const configSource = await fs.readFile(path.join(root, 'CMS/assets/js/supabase-config.js'), 'utf8');
const configMatch = configSource.match(/url:\s*'([^']+)'[\s\S]*?publishableKey:\s*'([^']+)'/);
const url = process.env.SUPABASE_URL || configMatch?.[1];
const key = process.env.SUPABASE_PUBLISHABLE_KEY || configMatch?.[2];
const siteUrl = 'https://www.sapconsultancy.co.uk';

if (!url || !key) throw new Error('Supabase URL and publishable key are required.');

const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
const { data: posts, error } = await supabase
  .from('content_items')
  .select('slug')
  .eq('type', 'blog')
  .eq('status', 'published')
  .order('published_at', { ascending: false });
if (error) throw error;

const blogRoot = path.join(root, 'blog');
const indexTemplate = await fs.readFile(path.join(root, 'CMS/blog/index.html'), 'utf8');
const postTemplate = await fs.readFile(path.join(root, 'CMS/blog/post.html'), 'utf8');

function rewrite(template, depth) {
  const prefix = '../'.repeat(depth);
  return template
    .replaceAll('../../sap.css', `${prefix}sap.css`)
    .replaceAll('../assets/js/', `${prefix}CMS/assets/js/`)
    .replaceAll('homepage-chrome.js', `${prefix}CMS/blog/homepage-chrome.js`)
    .replaceAll('brand-theme.js', `${prefix}CMS/blog/brand-theme.js`)
    .replaceAll('../../sap.js', `${prefix}sap.js`)
    .replaceAll('CMS/blog/post.html', 'blog/')
    .replaceAll('https://ricreations.co.za/blog/', `${siteUrl}/blog/`)
    .replaceAll('https://ricreations.co.za', siteUrl);
}

await fs.rm(blogRoot, { recursive: true, force: true });
await fs.mkdir(blogRoot, { recursive: true });
await fs.writeFile(path.join(blogRoot, 'index.html'), rewrite(indexTemplate, 1));
for (const post of posts || []) {
  const slug = String(post.slug || '').trim();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) continue;
  const route = path.join(blogRoot, slug);
  await fs.mkdir(route, { recursive: true });
  await fs.writeFile(path.join(route, 'index.html'), rewrite(postTemplate, 2));
}

const sitemapPath = path.join(root, 'sitemap.xml');
let sitemap = await fs.readFile(sitemapPath, 'utf8');
sitemap = sitemap.replace(/\n  <!-- BLOG_ROUTES_START -->[\s\S]*?<!-- BLOG_ROUTES_END -->/g, '');
const routes = (posts || []).map(({ slug }) => `  <url>\n    <loc>${siteUrl}/blog/${slug}/</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>`).join('\n');
sitemap = sitemap.replace('</urlset>', `\n  <!-- BLOG_ROUTES_START -->\n${routes}\n  <!-- BLOG_ROUTES_END -->\n</urlset>`);
await fs.writeFile(sitemapPath, sitemap);
console.log(`Generated ${posts?.length || 0} blog routes.`);
