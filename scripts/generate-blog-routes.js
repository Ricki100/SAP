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
  .select('slug,title,excerpt,body_html,seo_title,seo_description,tags,cover_url,video_url,published_at,updated_at')
  .eq('type', 'blog')
  .eq('status', 'published')
  .order('published_at', { ascending: false });
if (error) throw error;

const publishedPosts = posts || [];
const blogRoot = path.join(root, 'blog');
const indexTemplate = await fs.readFile(path.join(root, 'CMS/blog/index.html'), 'utf8');
const postTemplate = await fs.readFile(path.join(root, 'CMS/blog/post.html'), 'utf8');

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[character]);
}

function safeUrl(value) {
  if (!value) return '';
  try {
    const parsed = new URL(String(value).trim(), `${siteUrl}/`);
    return ['http:', 'https:'].includes(parsed.protocol) ? parsed.href : '';
  } catch (_) { return ''; }
}

function sanitiseRichText(value) {
  let html = String(value || '');
  html = html.replace(/<(script|style|iframe|object|embed|form|input|button)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, '');
  html = html.replace(/<(script|style|iframe|object|embed|form|input|button)\b[^>]*\/?\s*>/gi, '');
  html = html.replace(/\s(?:on[a-z]+|style)\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');
  html = html.replace(/\s(href|src)\s*=\s*(["'])(.*?)\2/gi, (match, attribute, quote, rawUrl) => {
    const cleaned = safeUrl(rawUrl);
    return cleaned ? ` ${attribute.toLowerCase()}=${quote}${escapeHtml(cleaned)}${quote}` : '';
  });
  return html;
}

function firstImage(post) {
  const cover = safeUrl(post.cover_url);
  if (cover) return cover;
  return safeUrl(String(post.body_html || '').match(/<img\b[^>]*\bsrc=["']([^"']+)["']/i)?.[1]);
}

function postUrl(post) { return `${siteUrl}/blog/${post.slug}/`; }

function readableDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? '' : date.toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'
  });
}

function cardMarkup(post) {
  const image = firstImage(post);
  return `<article class="article-card">
        <a href="/blog/${escapeHtml(post.slug)}/">${image ? `<img class="article-card-media" src="${escapeHtml(image)}" alt="${escapeHtml(post.title)}" loading="lazy">` : '<div class="article-card-media cms-media-placeholder" aria-hidden="true"></div>'}</a>
        <div class="article-card-copy"><p class="eyebrow">${escapeHtml(post.tags?.[0] || 'Insight')}</p><h2><a href="/blog/${escapeHtml(post.slug)}/">${escapeHtml(post.title)}</a></h2><p>${escapeHtml(post.excerpt || '')}</p></div>
      </article>`;
}

function articleMarkup(post) {
  const cover = safeUrl(post.cover_url);
  const video = safeUrl(post.video_url);
  const leadMedia = video
    ? `<video class="post-media" controls preload="metadata" playsinline${cover ? ` poster="${escapeHtml(cover)}"` : ''}><source src="${escapeHtml(video)}"></video>`
    : cover ? `<img class="post-media" src="${escapeHtml(cover)}" alt="${escapeHtml(post.title)}">` : '<div class="post-media cms-media-placeholder" aria-hidden="true"></div>';
  const related = publishedPosts.filter((candidate) => candidate.slug !== post.slug).slice(0, 3);
  const relatedMarkup = related.length ? `<aside class="related-posts"><div class="related-posts-header"><h2>Keep reading</h2><a href="/blog/">View all articles</a></div><div class="related-posts-grid">${related.map((item) => {
    const image = firstImage(item);
    return `<a class="related-post-card" href="/blog/${escapeHtml(item.slug)}/">${image ? `<img class="related-post-media" src="${escapeHtml(image)}" alt="${escapeHtml(item.title)}" loading="lazy">` : '<div class="related-post-media cms-media-placeholder" aria-hidden="true"></div>'}<span>${escapeHtml(item.title)}</span></a>`;
  }).join('')}</div></aside>` : '';
  return `<header class="post-header"><p class="eyebrow">${escapeHtml(post.tags?.join(' · ') || 'Insight')}</p><h1>${escapeHtml(post.title)}</h1><p class="post-deck">${escapeHtml(post.excerpt || '')}</p><time datetime="${escapeHtml(post.published_at || '')}">${escapeHtml(readableDate(post.published_at))}</time></header>
        <div class="post-lead-media">${leadMedia}</div>
        <div class="post-body">${sanitiseRichText(post.body_html)}</div>
        ${relatedMarkup}`;
}

function seoHead(post) {
  const title = post.seo_title || post.title;
  const description = post.seo_description || post.excerpt || '';
  const image = firstImage(post);
  const canonical = postUrl(post);
  const schema = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Article', headline: post.title, description,
    image: image ? [image] : undefined, datePublished: post.published_at,
    dateModified: post.updated_at || post.published_at, mainEntityOfPage: canonical,
    author: { '@type': 'Organization', name: 'Supported Accommodation Providers Consultancy', url: siteUrl },
    publisher: { '@type': 'Organization', name: 'Supported Accommodation Providers Consultancy', url: siteUrl }
  }).replace(/</g, '\\u003c');
  return `  <link rel="canonical" href="${escapeHtml(canonical)}">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${escapeHtml(canonical)}">
${image ? `  <meta property="og:image" content="${escapeHtml(image)}">\n` : ''}  <meta name="twitter:card" content="${image ? 'summary_large_image' : 'summary'}">
  <script type="application/ld+json">${schema}</script>\n`;
}

function rewrite(template, depth) {
  const prefix = '../'.repeat(depth);
  return template
    .replaceAll('../../sap.css', `${prefix}sap.css`)
    .replaceAll('href="blog.css"', `href="${prefix}CMS/blog/blog.css"`)
    .replaceAll('href="blog-enhancements.css"', `href="${prefix}CMS/blog/blog-enhancements.css"`)
    .replaceAll('href="media-layout.css', `href="${prefix}CMS/blog/media-layout.css`)
    .replaceAll('href="article-preview-theme.css', `href="${prefix}CMS/blog/article-preview-theme.css`)
    .replaceAll('href="homepage-chrome.css', `href="${prefix}CMS/blog/homepage-chrome.css`)
    .replaceAll('href="theme.css', `href="${prefix}CMS/blog/theme.css`)
    .replaceAll('../assets/js/', `${prefix}CMS/assets/js/`)
    .replaceAll('homepage-chrome.js', `${prefix}CMS/blog/homepage-chrome.js`)
    .replaceAll('brand-theme.js', `${prefix}CMS/blog/brand-theme.js`)
    .replaceAll('../../sap.js', `${prefix}sap.js`)
    .replaceAll('CMS/blog/post.html', 'blog/')
    .replaceAll('https://ricreations.co.za/blog/', `${siteUrl}/blog/`)
    .replaceAll('https://ricreations.co.za', siteUrl);
}

function renderPostPage(post) {
  const title = `${post.seo_title || post.title} | SAPC`;
  const description = post.seo_description || post.excerpt || '';
  return rewrite(postTemplate, 2)
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*">/i, `<meta name="description" content="${escapeHtml(description)}">`)
    .replace('</head>', `${seoHead(post)}</head>`)
    .replace(/<article class="post" data-blog-post>[\s\S]*?<\/article>/i, `<article class="post" data-blog-post data-static-rendered="true">${articleMarkup(post)}</article>`);
}

await fs.rm(blogRoot, { recursive: true, force: true });
await fs.mkdir(blogRoot, { recursive: true });
const staticIndex = rewrite(indexTemplate, 1).replace(
  /<section class="article-grid" data-blog-index>[\s\S]*?<\/section>/i,
  `<section class="article-grid" data-blog-index data-static-rendered="true">${publishedPosts.slice(0, 3).map(cardMarkup).join('') || '<p class="cms-empty">New articles are coming soon.</p>'}</section>`
);
await fs.writeFile(path.join(blogRoot, 'index.html'), staticIndex);
for (const post of publishedPosts) {
  const slug = String(post.slug || '').trim();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) continue;
  const route = path.join(blogRoot, slug);
  await fs.mkdir(route, { recursive: true });
  await fs.writeFile(path.join(route, 'index.html'), renderPostPage(post));
}

const sitemapPath = path.join(root, 'sitemap.xml');
let sitemap = await fs.readFile(sitemapPath, 'utf8');
sitemap = sitemap.replace(/\n  <!-- BLOG_ROUTES_START -->[\s\S]*?<!-- BLOG_ROUTES_END -->/g, '');
const routes = publishedPosts.map((post) => `  <url>\n    <loc>${postUrl(post)}</loc>\n    <lastmod>${String(post.updated_at || post.published_at || '').slice(0, 10)}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>`).join('\n');
sitemap = sitemap.replace('</urlset>', `\n  <!-- BLOG_ROUTES_START -->\n${routes}\n  <!-- BLOG_ROUTES_END -->\n</urlset>`);
await fs.writeFile(sitemapPath, sitemap);
console.log(`Generated ${publishedPosts.length} static blog routes with crawlable content.`);
