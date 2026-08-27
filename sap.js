/* ==============================
   SAPC GLOBAL JS SYSTEM
   ============================== */

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

function injectPremiumFonts() {
  if (document.querySelector('link[data-sapc-premium-fonts]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap';
  link.dataset.sapcPremiumFonts = 'true';
  document.head.appendChild(link);
}

injectPremiumFonts();

const SAPC_ASSET_BASE = (() => {
  if (window.location.protocol === 'file:') {
    const script = Array.from(document.scripts).find((item) => /sap\.js(?:\?.*)?$/i.test(item.src));
    if (script && script.src) {
      return script.src.replace(/sap\.js(?:\?.*)?$/i, '');
    }
  }
  return '/';
})();

function sapcLocalHref(href) {
  if (window.location.protocol !== 'file:' || !href || !href.startsWith('/')) return href;

  const [pathAndQuery, hash = ''] = href.split('#');
  const hashPart = hash ? `#${hash}` : '';
  const [pathOnly, query = ''] = pathAndQuery.split('?');
  const queryPart = query ? `?${query}` : '';
  const cleanPath = pathOnly.replace(/^\/+|\/+$/g, '');

  if (!cleanPath) return `${SAPC_ASSET_BASE}index.html${queryPart}${hashPart}`;
  return `${SAPC_ASSET_BASE}${cleanPath}/index.html${queryPart}${hashPart}`;
}

function applyLocalPreviewLinks(root = document) {
  if (window.location.protocol !== 'file:') return;
  root.querySelectorAll('a[href^="/"]').forEach((link) => {
    link.setAttribute('href', sapcLocalHref(link.getAttribute('href')));
  });
}

function cleanLegacyUrl() {
  if (window.location.protocol === 'file:') return;

  const { pathname, search, hash } = window.location;
  let cleanPath = pathname;

  if (/\/CMS\/blog\/post\.html$/i.test(cleanPath)) return;
  if (/\/index\.html$/i.test(cleanPath)) {
    cleanPath = cleanPath.replace(/\/index\.html$/i, '/');
  } else if (/\.html$/i.test(cleanPath)) {
    cleanPath = cleanPath.replace(/\.html$/i, '/');
  }

  if (cleanPath !== pathname) {
    window.history.replaceState(null, document.title, `${cleanPath}${search}${hash}`);
  }
}

cleanLegacyUrl();

function getCurrentSlug() {
  const path = window.location.pathname.replace(/\/+$/g, '');
  const last = path.split('/').pop() || '';
  return (last || 'index').replace(/\.html$/i, '');
}

// ==============================
// RESPONSIVE CSS - injected once, covers all 15 pages
// ==============================
(function injectResponsiveCSS() {
  const style = document.createElement('style');
  style.textContent = `
    :root {
      --sapc-font-body: "Inter", "Segoe UI", Arial, sans-serif;
      --sapc-font-display: "Plus Jakarta Sans", "Inter", "Segoe UI", Arial, sans-serif;
    }
    body,
    body *:not(.material-symbols-outlined) {
      font-family: var(--sapc-font-body) !important;
      letter-spacing: 0 !important;
    }
    h1, h2, h3,
    [style*="font:800"],
    [style*="font:700"] {
      font-family: var(--sapc-font-display) !important;
    }
    html {
      scrollbar-gutter: stable;
      overflow-x: hidden;
      text-size-adjust: 100%;
      -webkit-text-size-adjust: 100%;
    }
    body {
      width: 100%;
      max-width: 100%;
      overflow-x: hidden;
    }
    section,
    header,
    footer,
    main,
    div,
    article,
    nav {
      min-width: 0;
    }
    img,
    iframe,
    video {
      max-width: 100%;
    }
    p,
    h1,
    h2,
    h3,
    h4,
    span,
    a,
    label {
      overflow-wrap: break-word;
    }
    h1,
    h2,
    h3 {
      word-break: normal !important;
      hyphens: none !important;
    }
    .sapc-hamburger { display:none; }
    .sapc-book-cta  { display:inline-flex; }

    /* Mobile + tablet <= 1023px */
    @media (max-width:1023px) {
      .sapc-hamburger { display:flex !important; }
      .sapc-book-cta  { display:none !important; }

      [style*="max-width:1200px"] {
        width:min(100% - 40px, 1200px) !important;
        max-width:1200px !important;
        margin-left:auto !important;
        margin-right:auto !important;
      }
      [style*="grid-template-columns:1fr 1fr"] {
        grid-template-columns:1fr !important;
        gap:28px !important;
      }
      [style*="grid-template-columns:repeat(4,1fr)"] {
        grid-template-columns:repeat(2,1fr) !important;
        gap:16px !important;
      }
      .home-stats-inner {
        grid-template-columns:1fr !important;
      }
      [style*="grid-template-columns:repeat(5,1fr)"] {
        grid-template-columns:1fr !important;
        gap:16px !important;
      }
      [style*="grid-template-columns:repeat(3,1fr)"] {
        grid-template-columns:1fr !important;
      }
      [style*="grid-column:2"] { grid-column:auto !important; }

      [style*="padding:80px 48px"]   { padding:52px 0 !important; }
      [style*="padding:64px 48px"]   { padding:48px 0 !important; }
      [style*="padding:32px 48px"]   { padding:24px 0 !important; }
      section[style*="padding:80px"] { padding:52px 20px !important; }
      section[style*="padding:64px"] { padding:48px 20px !important; }
      [style*="gap:80px"] { gap:34px !important; }
      [style*="gap:64px"] { gap:30px !important; }
      [style*="gap:48px"] { gap:28px !important; }

      h1,
      [style*="font:800 48px"],
      [style*="font:800 56px"],
      [style*="font:800 64px"] {
        font-size:clamp(32px, 10vw, 44px) !important;
        line-height:1.08 !important;
      }
      h2,
      [style*="font:800 40px"],
      [style*="font:800 48px/1.15"] {
        font-size:clamp(26px, 7.2vw, 36px) !important;
        line-height:1.14 !important;
      }
      p,
      [style*="font:400 15px"],
      [style*="font:400 16px"] {
        font-size:15px !important;
        line-height:1.7 !important;
      }

      section[style*="background:#004d62"] > div > div:nth-child(2) {
        display:block !important;
        width:100% !important;
      }
      section[style*="background:#004d62"] > div > div:nth-child(2)[style*="height"] {
        height:auto !important;
        min-height:0 !important;
      }
      section[style*="background:#004d62"] img,
      section[style*="background:#004d62"] iframe {
        width:100% !important;
      }
      section[style*="background:#004d62"] iframe {
        aspect-ratio:16 / 9 !important;
        height:auto !important;
      }

      [style*="display:flex;gap:14px;justify-content:center"] {
        flex-direction:column !important;
        align-items:center !important;
        gap:10px !important;
      }
      [style*="display:flex;gap:12px"],
      [style*="display:flex;gap:14px"] {
        gap:12px !important;
      }
      [style*="display:inline-flex"][style*="padding:12px 24px"],
      [style*="display:inline-flex"][style*="padding:14px 28px"],
      button[style*="padding:15px 28px"] {
        min-height:48px !important;
        justify-content:center !important;
      }
      [style*="grid-template-columns:1fr 1fr;gap:16px"] {
        grid-template-columns:1fr !important;
      }
      [style*="font:400 20px/1.7"] { font-size:15px !important; }
      [style*="font:800 64px"]     { font-size:40px !important; }
      [style*="height:340px"] { height:220px !important; }
      [style*="height:360px"] { height:220px !important; }
      [style*="height:380px"] { height:220px !important; }
      .home-hero-inner {
        box-sizing:border-box !important;
        width:min(100%, 390px) !important;
        max-width:390px !important;
        margin-left:0 !important;
        margin-right:0 !important;
        padding-left:24px !important;
        padding-right:24px !important;
        overflow:hidden !important;
      }
      .home-hero-inner p,
      .home-hero-actions a,
      .home-video-frame {
        box-sizing:border-box !important;
        max-width:100% !important;
      }
      .home-hero-inner p {
        max-width:100% !important;
        font-size:14px !important;
      }
      section[style*="background:#004d62"] > div[style*="grid-template-columns:1fr 1fr"],
      section[style*="border-bottom"] > div[style*="grid-template-columns:repeat(4,1fr)"] {
        box-sizing:border-box !important;
        width:min(100%, 390px) !important;
        max-width:390px !important;
        margin-left:0 !important;
        margin-right:0 !important;
        padding-left:24px !important;
        padding-right:24px !important;
        overflow:hidden !important;
      }
      section[style*="border-bottom"] > div[style*="grid-template-columns:repeat(4,1fr)"] {
        grid-template-columns:1fr !important;
      }
    }

    @media (max-width:480px) {
      .sapc-navbar {
        max-width:none !important;
        width:100% !important;
        padding:0 20px !important;
        height:72px !important;
      }
      .sapc-navbar img {
        height:34px !important;
      }
      .sapc-hamburger {
        width:44px !important;
        height:44px !important;
        align-items:center !important;
      }
      .home-hero-section {
        width:100vw !important;
        max-width:100vw !important;
        overflow:hidden !important;
      }
      .home-hero-inner,
      [style*="max-width:1200px"][style*="grid-template-columns"] {
        box-sizing:border-box !important;
        width:min(100%, 390px) !important;
        max-width:390px !important;
        margin-left:0 !important;
        margin-right:0 !important;
        padding-left:24px !important;
        padding-right:24px !important;
        overflow:hidden !important;
      }
      .home-hero-inner > div {
        width:100% !important;
        max-width:100% !important;
        min-width:0 !important;
      }
      .home-hero-inner h1 {
        font-size:clamp(28px, 8.4vw, 32px) !important;
        line-height:1.12 !important;
        max-width:100% !important;
        word-break:normal !important;
        overflow-wrap:anywhere !important;
        text-wrap:balance !important;
      }
      .home-hero-inner p {
        max-width:100% !important;
        font-size:14px !important;
        line-height:1.65 !important;
        overflow-wrap:break-word !important;
      }
      .home-hero-actions {
        flex-direction:column !important;
        align-items:stretch !important;
      }
      .home-hero-actions a,
      section[style*="background:#f99d1c"] a,
      section[style*="background:#004d62"] a {
        box-sizing:border-box !important;
        width:100% !important;
        max-width:100% !important;
        justify-content:center !important;
      }
      .home-video-frame {
        width:100% !important;
        max-width:100% !important;
        box-sizing:border-box !important;
        margin-top:8px !important;
        border-radius:16px !important;
        box-shadow:0 18px 48px rgba(0,0,0,0.22) !important;
      }
      .home-stats-inner {
        box-sizing:border-box !important;
        width:min(100%, 390px) !important;
        max-width:390px !important;
        margin-left:0 !important;
        margin-right:0 !important;
        grid-template-columns:1fr !important;
        gap:18px !important;
        padding:30px 24px !important;
        overflow:hidden !important;
      }
      .home-stats-inner > div {
        min-width:0 !important;
        max-width:100% !important;
      }
      .home-stats-inner > div > div:first-child {
        font-size:clamp(22px, 7vw, 28px) !important;
        line-height:1.05 !important;
        overflow-wrap:anywhere !important;
      }
      .home-stats-inner > div > div:last-child {
        font-size:12px !important;
      }
      .pathway-card {
        border-radius:16px !important;
        padding:22px !important;
      }
      .pathway-card__title {
        font-size:22px !important;
      }
      [style*="height:160px"] {
        height:190px !important;
      }
      [style*="padding:20px 24px 24px"] {
        padding:22px !important;
      }
      #newsletter [style*="display:flex;gap:20px"] {
        flex-direction:column !important;
        gap:12px !important;
      }
      #newsletter form > div[style*="grid-template-columns:1fr 1fr"] {
        grid-template-columns:1fr !important;
      }
    }

    @media (max-width:767px) {
      .sapc-navbar {
        box-sizing:border-box !important;
        width:min(100%, 390px) !important;
        max-width:390px !important;
        margin-left:0 !important;
        margin-right:0 !important;
        padding:0 24px !important;
        justify-content:space-between !important;
      }
      .sapc-navbar img {
        height:34px !important;
      }
      .sapc-hamburger {
        display:flex !important;
        flex-shrink:0 !important;
      }
    }

    /* Tablet 768-1023px (layout only) */
    @media (min-width:768px) and (max-width:1023px) {
      [style*="max-width:1200px"] {
        width:min(100% - 64px, 1200px) !important;
      }
      [style*="grid-template-columns:repeat(3,1fr)"] {
        grid-template-columns:repeat(2,1fr) !important;
      }
      [style*="grid-column:2"] { grid-column:auto !important; }
      [style*="grid-template-columns:repeat(4,1fr)"] {
        grid-template-columns:repeat(2,1fr) !important;
      }
      [style*="grid-template-columns:repeat(5,1fr)"] {
        grid-template-columns:repeat(2,1fr) !important;
      }
      [style*="padding:80px 48px"]   { padding:60px 32px !important; }
      [style*="padding:64px 48px"]   { padding:48px 32px !important; }
      [style*="padding:32px 48px"]   { padding:24px 32px !important; }
      section[style*="padding:80px 48px"] { padding:60px 32px !important; }
      [style*="gap:80px"] { gap:48px !important; }
      [style*="gap:64px"] { gap:36px !important; }
      h1 { font-size:36px !important; }
      h2 { font-size:30px !important; }
      section[style*="background:#004d62"] > div > div:nth-child(2) {
        display:block !important;
      }
      section[style*="background:#004d62"] iframe {
        width:100% !important;
        aspect-ratio:16 / 9 !important;
        height:auto !important;
      }
      .home-hero-inner {
        grid-template-columns:1fr !important;
        width:min(100% - 64px, 1200px) !important;
        max-width:1200px !important;
        margin-left:auto !important;
        margin-right:auto !important;
      }
      section[style*="background:#004d62"] > div[style*="grid-template-columns:1fr 1fr"],
      section[style*="border-bottom"] > div[style*="grid-template-columns:repeat(4,1fr)"] {
        width:min(100% - 64px, 1200px) !important;
        max-width:1200px !important;
        margin-left:auto !important;
        margin-right:auto !important;
      }
      section[style*="border-bottom"] > div[style*="grid-template-columns:repeat(4,1fr)"] {
        grid-template-columns:repeat(2,1fr) !important;
      }
    }

    /* Laptop 1024-1279px */
    @media (min-width:1024px) and (max-width:1279px) {
      [style*="padding:80px 48px"] { padding:72px 40px !important; }
      [style*="padding:64px 48px"] { padding:56px 40px !important; }
      [style*="gap:80px"] { gap:56px !important; }
      [style*="max-width:1200px"] { width:min(100% - 64px, 1200px) !important; }
      #sapc-desktop-nav { gap:22px !important; }
      .sapc-navlink,
      .sapc-svc-btn {
        font-size:12px !important;
      }
      .sapc-book-cta {
        padding:10px 18px !important;
      }
    }

    /* Tablet landscape / small laptop */
    @media (min-width:1024px) and (max-width:1180px) {
      .sapc-navbar {
        padding:0 28px !important;
      }
      #sapc-desktop-nav {
        gap:18px !important;
      }
      .sapc-navbar img {
        height:30px !important;
      }
    }

    /* Widescreen >=1440px */
    @media (min-width:1440px) {
      [style*="max-width:1200px"] { max-width:1360px !important; }
    }

    @media (min-width:1680px) {
      [style*="max-width:1200px"] { max-width:1440px !important; }
      .home-hero-inner {
        gap:72px !important;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      *,
      *::before,
      *::after {
        animation-duration:0.01ms !important;
        animation-iteration-count:1 !important;
        scroll-behavior:auto !important;
        transition-duration:0.01ms !important;
      }
    }

    /* Mobile menu */
    .sapc-mobile-menu { display:none; }
    .sapc-mobile-menu.open {
      display:block !important;
      animation:menuSlideDown 0.22s ease;
    }
    @keyframes menuSlideDown {
      from { opacity:0; transform:translateY(-8px); }
      to   { opacity:1; transform:translateY(0); }
    }
    .sapc-hamburger.open .sapc-ham-1 { transform:translateY(7px) rotate(45deg); }
    .sapc-hamburger.open .sapc-ham-2 { opacity:0; }
    .sapc-hamburger.open .sapc-ham-3 { transform:translateY(-7px) rotate(-45deg); }

    .sapc-mobile-menu a {
      display:block; padding:14px 0;
      font:600 14px/1 'Manrope',sans-serif; color:#374151;
      text-decoration:none; border-bottom:1px solid #f3f4f6;
      transition:color 0.15s;
    }
    .sapc-mobile-menu a:hover { color:#0a94b2; }
    .sapc-mob-label {
      font:700 11px/1 'Manrope',sans-serif; letter-spacing:0.1em;
      text-transform:uppercase; color:#9ca3af;
      padding:18px 0 8px; display:block;
    }
    .sapc-mob-service {
      padding:11px 0 11px 14px !important;
      font-size:13px !important; color:#6b7280 !important;
      border-bottom:1px solid #f9fafb !important;
    }
    .sapc-mob-cta {
      display:block !important; margin-top:20px;
      padding:14px 0 !important; border-radius:8px;
      background:#f99d1c; color:#111827 !important;
      text-align:center; font:700 14px/1 'Manrope',sans-serif;
      border-bottom:none !important;
    }
  `;
  document.head.appendChild(style);
})();

// ==============================
// AOS CSS - load early
// ==============================
(function () {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://unpkg.com/aos@2.3.1/dist/aos.css';
  document.head.appendChild(link);
})();

// ==============================
// NAVBAR SCROLL EFFECT
// ==============================
const getNavbarHeader = () => document.querySelector('#shared-navbar header');
window.addEventListener('scroll', () => {
  const header = getNavbarHeader();
  if (!header) return;
  header.style.boxShadow = window.scrollY > 50 ? '0 2px 16px rgba(0,0,0,0.1)' : '0 1px 4px rgba(0,0,0,0.06)';
});

// ==============================
// SMOOTH SCROLL
// ==============================
document.addEventListener('click', function(e) {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const target = document.querySelector(link.getAttribute('href'));
  if (!target) return;
  e.preventDefault();
  target.scrollIntoView({ behavior:'smooth' });
});

// ==============================
// FAQ ACCORDION
// ==============================
$$('.faq-item').forEach(item => {
  const header = item.querySelector('.faq-question');
  if (!header) return;
  header.addEventListener('click', () => item.classList.toggle('active'));
});

// ==============================
// REVEAL ON SCROLL (legacy)
// ==============================
const revealElements = $$('.reveal');
const revealOnScroll = () => {
  const trigger = window.innerHeight * 0.85;
  revealElements.forEach(el => {
    if (el.getBoundingClientRect().top < trigger) el.classList.add('active');
  });
};
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// ==============================
// BUTTON RIPPLE
// ==============================
$$('.btn').forEach(button => {
  button.addEventListener('click', function(e) {
    const circle = document.createElement('span');
    const d = Math.max(this.clientWidth, this.clientHeight);
    circle.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX-this.offsetLeft-d/2}px;top:${e.clientY-this.offsetTop-d/2}px;`;
    circle.classList.add('ripple');
    const old = this.querySelector('.ripple');
    if (old) old.remove();
    this.appendChild(circle);
  });
});

// ==============================
// GLOBAL CONFIG
// ==============================
const SAPC_CONFIG = { spacingScale:1, animationSpeed:1, enableAnimations:true };

// Contact form - Web3Forms (https://web3forms.com). Free tier: sign up, add your site domain,
// choose the inbox email, then paste the Access Key here (one line).
const SAPC_WEB3FORMS_ACCESS_KEY = '3f6f8ffc-83e9-4b15-8035-3ef81319a4e0';

// ==============================
// SHARED NAVBAR
// ==============================
function renderSharedNavbar() {
  const placeholder = document.querySelector('#shared-navbar');
  if (!placeholder) return;

  placeholder.innerHTML = `
    <style>
      .sapc-dropdown { position:relative; }
      .sapc-dd-menu {
        display:none; position:absolute; top:calc(100% + 12px); left:50%;
        transform:translateX(-50%); background:#fff; border-radius:12px;
        box-shadow:0 12px 40px rgba(0,0,0,0.14); border:1px solid #e5e7eb;
        min-width:285px; z-index:200; padding:8px 0; white-space:nowrap;
      }
      .sapc-dd-menu.open { display:block; animation:ddFade 0.15s ease; }
      @keyframes ddFade {
        from { opacity:0; transform:translateX(-50%) translateY(-6px); }
        to   { opacity:1; transform:translateX(-50%) translateY(0); }
      }
      .sapc-dd-menu::before {
        content:''; position:absolute; top:-6px; left:50%;
        width:12px; height:12px; background:#fff;
        border-left:1px solid #e5e7eb; border-top:1px solid #e5e7eb;
        transform:translateX(-50%) rotate(45deg);
      }
      .sapc-dd-menu a {
        display:block; padding:11px 20px;
        font:600 13px/1 'Manrope',sans-serif; color:#374151;
        text-decoration:none; transition:background 0.15s,color 0.15s;
      }
      .sapc-dd-menu a:hover { background:#f0f9fb; color:#0a94b2; }
      .sapc-dd-menu .dd-divider { height:1px; background:#f0f0f0; margin:6px 0; }
      .sapc-svc-btn {
        display:flex; align-items:center; gap:3px; cursor:pointer;
        background:none; border:none; padding:4px 0;
        font:600 13px/1 'Manrope',sans-serif; color:#4b5563; transition:color 0.2s;
      }
      .sapc-svc-btn:hover,
      .sapc-svc-btn.open { color:#0a94b2; }
      .sapc-chev { font-size:18px; transition:transform 0.2s; display:inline-block; }
      .sapc-chev.rotated { transform:rotate(180deg); }
    </style>

    <header style="position:sticky;top:0;left:0;right:0;z-index:50;background:rgba(255,255,255,0.97);backdrop-filter:blur(10px);border-bottom:1px solid #f1f5f9;box-shadow:0 1px 4px rgba(0,0,0,0.06);">
      <nav class="sapc-navbar" style="display:flex;justify-content:space-between;align-items:center;max-width:1200px;margin:0 auto;padding:0 48px;height:72px;">

        <a href="/" style="flex-shrink:0;line-height:0;">
          <img src="${SAPC_ASSET_BASE}logo@2x.png" alt="Supported Accommodation Providers Consultancy" style="height:32px;width:auto;">
        </a>

        <!-- Desktop links -->
        <div id="sapc-desktop-nav" style="display:flex;align-items:center;gap:32px;">
          <a href="/" class="sapc-navlink" style="font:600 13px/1 'Manrope',sans-serif;color:#4b5563;text-decoration:none;transition:color 0.2s;">Home</a>
          <a href="/about-us/" class="sapc-navlink" style="font:600 13px/1 'Manrope',sans-serif;color:#4b5563;text-decoration:none;transition:color 0.2s;">About Us</a>

          <div class="sapc-dropdown" id="sapc-svc-wrapper">
            <button class="sapc-svc-btn" id="sapc-svc-btn" aria-haspopup="true" aria-expanded="false">
              Services
              <span class="material-symbols-outlined sapc-chev" id="sapc-chev">expand_more</span>
            </button>
            <div class="sapc-dd-menu" id="sapc-dd-menu" role="menu">
              <a href="/mock-inspections/">Ofsted Mock Inspections</a>
              <a href="/registration-support/">Ofsted Registration Support</a>
              <a href="/post-inspection/">Post-Ofsted Inspection Support</a>
              <a href="/monthly-monitoring/">Monthly Monitoring Visits</a>
              <a href="/case-file-audits/">Case File Audits</a>
              <div class="dd-divider"></div>
              <a href="/location-risk-assessments/">Location Risk Assessments</a>
              <a href="/risk-assessment-support-plans/">Risk Assessment &amp; Support Plan Reviews</a>
              <a href="/coaching-mentoring/">Coaching &amp; Mentoring</a>
              <a href="/nominated-individual-registered-service-manager-mentoring/">Nominated Individual &amp; RSM Mentoring</a>
              <a href="/professional-supervision/">Professional Supervision</a>
              <a href="/recording-templates/">Recording Templates Development</a>
              <a href="/digital-marketing-automation/">Digital Marketing &amp; Automation</a>
            </div>
          </div>

          <a href="/our-approach/" class="sapc-navlink" style="font:600 13px/1 'Manrope',sans-serif;color:#4b5563;text-decoration:none;transition:color 0.2s;">Our Approach</a>
          <a href="/ofsted-updates/" class="sapc-navlink" style="font:600 13px/1 'Manrope',sans-serif;color:#4b5563;text-decoration:none;transition:color 0.2s;">Ofsted Updates</a>
          <a href="/useful-links/" class="sapc-navlink" style="font:600 13px/1 'Manrope',sans-serif;color:#4b5563;text-decoration:none;transition:color 0.2s;">Useful Links</a>
          <a href="/contact/" class="sapc-navlink" style="font:600 13px/1 'Manrope',sans-serif;color:#4b5563;text-decoration:none;transition:color 0.2s;">Contact</a>
        </div>

        <div style="display:flex;align-items:center;gap:12px;">
          <a href="/contact/" class="sapc-book-cta" style="background:#f99d1c;color:#111827;padding:10px 22px;border-radius:8px;font:700 13px/1 'Manrope',sans-serif;text-decoration:none;white-space:nowrap;transition:background 0.2s;" onmouseover="this.style.background='#e08a0d'" onmouseout="this.style.background='#f99d1c'">
            Book Consultation
          </a>
          <button class="sapc-hamburger" id="sapc-hamburger" aria-label="Toggle menu" style="flex-direction:column;justify-content:center;align-items:flex-end;gap:5px;cursor:pointer;background:none;border:none;padding:6px;width:40px;height:40px;">
            <span class="sapc-ham-1" style="display:block;width:22px;height:2px;background:#111827;border-radius:2px;transition:transform 0.3s,opacity 0.3s;transform-origin:center;"></span>
            <span class="sapc-ham-2" style="display:block;width:22px;height:2px;background:#111827;border-radius:2px;transition:transform 0.3s,opacity 0.3s;"></span>
            <span class="sapc-ham-3" style="display:block;width:22px;height:2px;background:#111827;border-radius:2px;transition:transform 0.3s,opacity 0.3s;transform-origin:center;"></span>
          </button>
        </div>
      </nav>

      <!-- Mobile menu -->
      <div class="sapc-mobile-menu" id="sapc-mobile-menu" style="position:absolute;left:0;right:0;background:#fff;border-top:1px solid #e5e7eb;box-shadow:0 12px 40px rgba(0,0,0,0.1);max-height:calc(100vh - 72px);overflow-y:auto;z-index:49;">
        <div style="padding:8px 24px 32px;">
          <a href="/">Home</a>
          <a href="/about-us/">About Us</a>
          <span class="sapc-mob-label">Services</span>
          <a href="/mock-inspections/" class="sapc-mob-service">Ofsted Mock Inspections</a>
          <a href="/registration-support/" class="sapc-mob-service">Ofsted Registration Support</a>
          <a href="/post-inspection/" class="sapc-mob-service">Post-Ofsted Inspection Support</a>
          <a href="/monthly-monitoring/" class="sapc-mob-service">Monthly Monitoring Visits</a>
          <a href="/case-file-audits/" class="sapc-mob-service">Case File Audits</a>
          <a href="/location-risk-assessments/" class="sapc-mob-service">Location Risk Assessments</a>
          <a href="/risk-assessment-support-plans/" class="sapc-mob-service">Risk Assessment &amp; Support Plans</a>
          <a href="/coaching-mentoring/" class="sapc-mob-service">Coaching &amp; Mentoring</a>
          <a href="/nominated-individual-registered-service-manager-mentoring/" class="sapc-mob-service">Nominated Individual &amp; RSM Mentoring</a>
          <a href="/professional-supervision/" class="sapc-mob-service">Professional Supervision</a>
          <a href="/recording-templates/" class="sapc-mob-service">Recording Templates</a>
          <a href="/digital-marketing-automation/" class="sapc-mob-service">Digital Marketing &amp; Automation</a>
          <a href="/our-approach/">Our Approach</a>
          <a href="/ofsted-updates/">Ofsted Updates</a>
          <a href="/useful-links/">Useful Links</a>
          <a href="/contact/">Contact</a>
          <a href="/contact/" class="sapc-mob-cta">Book Consultation</a>
        </div>
      </div>
    </header>

    <style>
      @media (max-width:1023px) {
        #sapc-desktop-nav { display:none !important; }
      }
      @media (min-width:1024px) {
        .sapc-mobile-menu { display:none !important; }
        #sapc-hamburger { display:none !important; }
      }
      .sapc-navlink:hover { color:#0a94b2 !important; }
    </style>
  `;

  // Desktop dropdown
  const svcBtn  = document.getElementById('sapc-svc-btn');
  const ddMenu  = document.getElementById('sapc-dd-menu');
  const chev    = document.getElementById('sapc-chev');

  const openDD  = () => { ddMenu.classList.add('open'); chev.classList.add('rotated'); svcBtn.setAttribute('aria-expanded','true'); svcBtn.classList.add('open'); };
  const closeDD = () => { ddMenu.classList.remove('open'); chev.classList.remove('rotated'); svcBtn.setAttribute('aria-expanded','false'); svcBtn.classList.remove('open'); };

  svcBtn.addEventListener('click', e => { e.stopPropagation(); ddMenu.classList.contains('open') ? closeDD() : openDD(); });
  document.addEventListener('click', e => { const w = document.getElementById('sapc-svc-wrapper'); if (w && !w.contains(e.target)) closeDD(); });
  document.addEventListener('keydown', e => { if (e.key==='Escape') closeDD(); });

  // Mobile hamburger
  const hamburger  = document.getElementById('sapc-hamburger');
  const mobileMenu = document.getElementById('sapc-mobile-menu');

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Active page highlight
  const currentPage = getCurrentSlug();
  const normaliseHref = (href) => {
    const path = (href || '').split('#')[0].replace(/^https?:\/\/[^/]+/, '');
    const slug = path.replace(/^\/+|\/+$/g, '').replace(/\.html$/,'');
    return slug || 'index';
  };
  document.querySelectorAll('#shared-navbar .sapc-navlink').forEach(link => {
    if (normaliseHref(link.getAttribute('href')) === currentPage) {
      link.style.color = '#0a94b2';
      link.style.borderBottom = '2px solid #f99d1c';
      link.style.paddingBottom = '3px';
    }
  });
}

// ==============================
// SHARED FOOTER
// ==============================
function renderSharedFooter() {
  const placeholder = document.querySelector('#shared-footer');
  if (!placeholder) return;

  placeholder.innerHTML = `
    <footer style="background:#0f172a;color:#fff;padding:64px 32px 40px;">
      <div style="max-width:1200px;margin:0 auto;">
        <div class="sapc-footer-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:48px;margin-bottom:48px;">
          <div>
            <a href="/" style="display:inline-block;margin-bottom:20px;line-height:0;">
              <img src="${SAPC_ASSET_BASE}logo@2x.png" alt="Supported Accommodation Providers Consultancy" style="height:36px;width:auto;">
            </a>
            <p style="font:400 13px/1.7 'Manrope',sans-serif;color:#94a3b8;margin:0;">Empowering providers with precision consultancy and specialised compliance strategies for the supported accommodation sector across England.</p>
          </div>
          <div>
            <h4 style="font:700 11px/1 'Manrope',sans-serif;letter-spacing:0.12em;text-transform:uppercase;color:#fff;margin:0 0 20px;">Our Services</h4>
            <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:12px;">
              <li><a href="/mock-inspections/" style="font:400 13px/1 'Manrope',sans-serif;color:#94a3b8;text-decoration:none;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#94a3b8'">Mock Inspections</a></li>
              <li><a href="/registration-support/" style="font:400 13px/1 'Manrope',sans-serif;color:#94a3b8;text-decoration:none;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#94a3b8'">Ofsted Registration Support</a></li>
              <li><a href="/post-inspection/" style="font:400 13px/1 'Manrope',sans-serif;color:#94a3b8;text-decoration:none;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#94a3b8'">Post-Ofsted Inspection Support</a></li>
              <li><a href="/monthly-monitoring/" style="font:400 13px/1 'Manrope',sans-serif;color:#94a3b8;text-decoration:none;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#94a3b8'">Monthly Monitoring</a></li>
              <li><a href="/case-file-audits/" style="font:400 13px/1 'Manrope',sans-serif;color:#94a3b8;text-decoration:none;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#94a3b8'">Case File Audits</a></li>
              <li><a href="/location-risk-assessments/" style="font:400 13px/1 'Manrope',sans-serif;color:#94a3b8;text-decoration:none;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#94a3b8'">Location Risk Assessments</a></li>
              <li><a href="/risk-assessment-support-plans/" style="font:400 13px/1 'Manrope',sans-serif;color:#94a3b8;text-decoration:none;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#94a3b8'">Risk Assessment &amp; Support Plans</a></li>
              <li><a href="/coaching-mentoring/" style="font:400 13px/1 'Manrope',sans-serif;color:#94a3b8;text-decoration:none;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#94a3b8'">Coaching &amp; Mentoring</a></li>
              <li><a href="/nominated-individual-registered-service-manager-mentoring/" style="font:400 13px/1 'Manrope',sans-serif;color:#94a3b8;text-decoration:none;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#94a3b8'">Nominated Individual &amp; RSM Mentoring</a></li>
              <li><a href="/professional-supervision/" style="font:400 13px/1 'Manrope',sans-serif;color:#94a3b8;text-decoration:none;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#94a3b8'">Professional Supervision</a></li>
              <li><a href="/recording-templates/" style="font:400 13px/1 'Manrope',sans-serif;color:#94a3b8;text-decoration:none;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#94a3b8'">Recording Templates</a></li>
              <li><a href="/digital-marketing-automation/" style="font:400 13px/1 'Manrope',sans-serif;color:#94a3b8;text-decoration:none;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#94a3b8'">Digital Marketing &amp; Automation</a></li>
            </ul>
          </div>
          <div>
            <h4 style="font:700 11px/1 'Manrope',sans-serif;letter-spacing:0.12em;text-transform:uppercase;color:#fff;margin:0 0 20px;">Company</h4>
            <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:12px;">
              <li><a href="/about-us/" style="font:400 13px/1 'Manrope',sans-serif;color:#94a3b8;text-decoration:none;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#94a3b8'">About Us</a></li>
              <li><a href="/our-approach/" style="font:400 13px/1 'Manrope',sans-serif;color:#94a3b8;text-decoration:none;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#94a3b8'">Our Approach</a></li>
              <li><a href="/ofsted-updates/" style="font:400 13px/1 'Manrope',sans-serif;color:#94a3b8;text-decoration:none;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#94a3b8'">Ofsted Updates</a></li>
              <li><a href="/useful-links/" style="font:400 13px/1 'Manrope',sans-serif;color:#94a3b8;text-decoration:none;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#94a3b8'">Useful Links</a></li>
              <li><a href="/contact/" style="font:400 13px/1 'Manrope',sans-serif;color:#94a3b8;text-decoration:none;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#94a3b8'">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h4 style="font:700 11px/1 'Manrope',sans-serif;letter-spacing:0.12em;text-transform:uppercase;color:#fff;margin:0 0 20px;">Get in Touch</h4>
            <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:16px;">
              <li style="display:flex;align-items:center;gap:10px;"><span class="material-symbols-outlined" style="font-size:18px;color:#f99d1c;flex-shrink:0;">mail</span><span style="font:400 13px/1.4 'Manrope',sans-serif;color:#94a3b8;">support@sapconsultancy.co.uk</span></li>
              <li style="display:flex;align-items:center;gap:10px;"><span class="material-symbols-outlined" style="font-size:18px;color:#f99d1c;flex-shrink:0;">language</span><span style="font:400 13px/1.4 'Manrope',sans-serif;color:#94a3b8;">www.sapconsultancy.co.uk</span></li>
              <li style="display:flex;align-items:center;gap:10px;"><span class="material-symbols-outlined" style="font-size:18px;color:#f99d1c;flex-shrink:0;">phone</span><span style="font:400 13px/1.4 'Manrope',sans-serif;color:#94a3b8;">+44 7833 905183</span></li>
              <li style="display:flex;align-items:flex-start;gap:10px;"><span class="material-symbols-outlined" style="font-size:18px;color:#f99d1c;flex-shrink:0;margin-top:2px;">location_on</span><span style="font:400 13px/1.4 'Manrope',sans-serif;color:#94a3b8;">Suite B, Sapphire House,<br>Roundtree Way, Norwich, NR7 8SQ</span></li>
            </ul>
          </div>
        </div>
        <div style="border-top:1px solid rgba(255,255,255,0.08);padding-top:28px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;">
          <span style="font:400 11px/1 'Manrope',sans-serif;letter-spacing:0.1em;text-transform:uppercase;color:#475569;">(c) 2025 Supported Accommodation Providers Consultancy. All rights reserved.</span>
          <div style="display:flex;gap:24px;flex-wrap:wrap;">
            <a href="#" style="font:400 11px/1 'Manrope',sans-serif;letter-spacing:0.1em;text-transform:uppercase;color:#64748b;text-decoration:none;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#64748b'">Privacy Policy</a>
            <a href="#" style="font:400 11px/1 'Manrope',sans-serif;letter-spacing:0.1em;text-transform:uppercase;color:#64748b;text-decoration:none;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#64748b'">Terms &amp; Conditions</a>
            <a href="#" style="font:400 11px/1 'Manrope',sans-serif;letter-spacing:0.1em;text-transform:uppercase;color:#64748b;text-decoration:none;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#64748b'">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
    <style>
      @media (max-width:1023px) {
        .sapc-footer-grid { grid-template-columns:1fr !important; gap:32px !important; }
      }
      @media (min-width:768px) and (max-width:1023px) {
        .sapc-footer-grid { grid-template-columns:repeat(2,1fr) !important; gap:32px !important; }
      }
    </style>
  `;
}

// ==============================
// AOS ANIMATIONS
// ==============================
function applyAnimations() {
  const sections = [...document.querySelectorAll('section')];
  if (!sections.length) return;

  sections.forEach(section => {
    if ((section.getAttribute('style')||'').includes('border-bottom')) {
      section.querySelectorAll('[style*="grid-template-columns:repeat(4,1fr)"] > div').forEach((el,i) => {
        if (!el.hasAttribute('data-aos')) { el.setAttribute('data-aos','zoom-in'); el.setAttribute('data-aos-delay',String(i*100)); }
      });
    }
  });

  sections.slice(1).forEach(section => {
    section.querySelectorAll('[style*="text-align:center;margin-bottom"]').forEach(el => {
      if (!el.hasAttribute('data-aos')) el.setAttribute('data-aos','fade-up');
    });
    section.querySelectorAll('h2').forEach(el => {
      if (!el.hasAttribute('data-aos')) { el.setAttribute('data-aos','fade-up'); el.setAttribute('data-aos-duration','600'); }
    });
    section.querySelectorAll('[style*="grid-template-columns:1fr 1fr"]').forEach(grid => {
      const kids = [...grid.children];
      if (kids[0] && !kids[0].hasAttribute('data-aos')) kids[0].setAttribute('data-aos','fade-right');
      if (kids[1] && !kids[1].hasAttribute('data-aos')) kids[1].setAttribute('data-aos','fade-left');
    });
    section.querySelectorAll('[style*="grid-template-columns:repeat(3,1fr)"] > *, [style*="grid-template-columns:repeat(4,1fr)"] > *').forEach((el,i) => {
      if (!el.hasAttribute('data-aos')) { el.setAttribute('data-aos','fade-up'); el.setAttribute('data-aos-delay',String((i%4)*100)); }
    });
    section.querySelectorAll('[style*="display:flex;align-items:flex-start;gap:12px"]').forEach((el,i) => {
      if (!el.hasAttribute('data-aos')) { el.setAttribute('data-aos','fade-up'); el.setAttribute('data-aos-delay',String((i%6)*70)); }
    });
    section.querySelectorAll('.faq-item').forEach((el,i) => {
      if (!el.hasAttribute('data-aos')) { el.setAttribute('data-aos','fade-up'); el.setAttribute('data-aos-delay',String(i*60)); }
    });
    if ((section.getAttribute('style')||'').includes('background:#004d62')) {
      const inner = section.querySelector('div');
      if (inner && !inner.hasAttribute('data-aos')) inner.setAttribute('data-aos','fade-up');
    }
  });

  document.querySelectorAll('section[style*="background:#f99d1c"]').forEach(section => {
    const inner = section.querySelector('[style*="position:relative"]');
    if (inner && !inner.hasAttribute('data-aos')) inner.setAttribute('data-aos','fade-up');
  });
}

function initAOS() {
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/aos@2.3.1/dist/aos.js';
  script.onload = () => { applyAnimations(); AOS.init({ duration:650, easing:'ease-out-cubic', once:true, offset:60 }); };
  document.body.appendChild(script);
}

// ==============================
// CONTACT FORM
// ==============================
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const submitButton = document.getElementById('contact-form-submit');
  const feedbackBox = document.getElementById('contact-form-feedback');
  const feedbackIcon = document.getElementById('contact-form-feedback-icon');
  const feedbackTitle = document.getElementById('contact-form-feedback-title');
  const feedbackDetail = document.getElementById('contact-form-feedback-detail');

  const showFeedback = (kind, title, detail = '') => {
    if (!feedbackBox || !feedbackTitle || !feedbackDetail) return;
    feedbackBox.hidden = false;
    feedbackBox.style.display = 'flex';
    feedbackBox.removeAttribute('aria-hidden');
    feedbackBox.style.alignItems = 'flex-start';
    feedbackTitle.textContent = title;
    feedbackDetail.textContent = detail || '';
    feedbackDetail.style.display = detail ? 'block' : 'none';

    if (kind === 'success') {
      feedbackBox.style.borderColor = '#86efac';
      feedbackBox.style.background = '#ecfdf5';
      if (feedbackIcon) {
        feedbackIcon.textContent = 'check_circle';
        feedbackIcon.style.color = '#059669';
      }
      feedbackTitle.style.color = '#065f46';
      feedbackBox.setAttribute('role', 'status');
      feedbackBox.setAttribute('aria-live', 'polite');
    } else if (kind === 'error') {
      feedbackBox.style.borderColor = '#fecaca';
      feedbackBox.style.background = '#fef2f2';
      if (feedbackIcon) {
        feedbackIcon.textContent = 'error';
        feedbackIcon.style.color = '#dc2626';
      }
      feedbackTitle.style.color = '#991b1b';
      feedbackBox.setAttribute('role', 'alert');
      feedbackBox.setAttribute('aria-live', 'assertive');
    } else if (kind === 'sending') {
      feedbackBox.style.borderColor = '#bae6fd';
      feedbackBox.style.background = '#f0f9ff';
      if (feedbackIcon) {
        feedbackIcon.textContent = 'hourglass_top';
        feedbackIcon.style.color = '#0284c7';
      }
      feedbackTitle.style.color = '#0c4a6e';
      feedbackBox.setAttribute('role', 'status');
      feedbackBox.setAttribute('aria-live', 'polite');
    }

    feedbackBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  const sentFromRedirect = new URLSearchParams(window.location.search).get('sent') === '1';
  if (sentFromRedirect) {
    showFeedback(
      'success',
      'Message sent',
      'Your enquiry was delivered. We will be in touch within 24 hours.'
    );
  }

  return;

  const submitNativeFallback = () => {
    if (form.dataset.nativeSubmitting === 'true') return false;
    form.dataset.nativeSubmitting = 'true';
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.style.opacity = '0.7';
      submitButton.style.cursor = 'not-allowed';
      submitButton.textContent = 'OPENING SECURE SUBMISSION...';
    }
    HTMLFormElement.prototype.submit.call(form);
    return true;
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (!SAPC_WEB3FORMS_ACCESS_KEY || SAPC_WEB3FORMS_ACCESS_KEY === 'YOUR_WEB3FORMS_ACCESS_KEY') {
      showFeedback('error', 'Form not configured', 'Add your Web3Forms access key in sap.js.');
      return;
    }

    const formData = new FormData(form);
    const honeypot = (formData.get('botcheck') || '').toString().trim();
    if (honeypot !== '') {
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.style.opacity = '0.7';
      submitButton.style.cursor = 'not-allowed';
      submitButton.textContent = 'SENDING...';
    }

    showFeedback('sending', 'Sending your enquiry...', 'Please wait a moment.');

    try {
      const fullName = (formData.get('name') || formData.get('fullName') || '').toString().trim();
      const organisation = (formData.get('organisation') || '').toString().trim();
      const email = (formData.get('email') || '').toString().trim();
      const phone = (formData.get('phone') || '').toString().trim();
      const serviceRequired = (formData.get('serviceRequired') || '').toString().trim();
      const message = (formData.get('message') || '').toString().trim();

      const messageBody = [
        `Organisation: ${organisation || '-'}`,
        `Phone: ${phone || '-'}`,
        `Service: ${serviceRequired || '-'}`,
        '',
        message
      ].join('\n');

      const submissionData = new FormData();
      submissionData.append('access_key', SAPC_WEB3FORMS_ACCESS_KEY);
      submissionData.append('subject', `Supported Accommodation Providers Consultancy website enquiry - ${serviceRequired || 'General'}`);
      submissionData.append('from_name', fullName);
      submissionData.append('name', fullName);
      submissionData.append('email', email);
      submissionData.append('organisation', organisation);
      submissionData.append('phone', phone);
      submissionData.append('service_required', serviceRequired);
      submissionData.append('message', messageBody);

      const formResponse = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: submissionData
      });

      const formResponseText = await formResponse.text();
      let formResult = {};
      try {
        formResult = JSON.parse(formResponseText);
      } catch {
        formResult = {};
      }

      if (!formResponse.ok || formResult.success !== true) {
        const providerBlocked = /enable javascript|cloudflare|just a moment/i.test(formResponseText);
        throw new Error(
          formResult.message ||
          (providerBlocked
            ? 'The form provider blocked this request. Please email support@sapconsultancy.co.uk or call +44 7833 905183.'
            : 'Unable to send your enquiry. Please try again or phone us.')
        );
      }

      form.reset();
      showFeedback(
        'success',
        'Message sent',
        'Your enquiry was delivered. We will be in touch within 24 hours.'
      );
    } catch (error) {
      if (submitNativeFallback()) {
        return;
      }

      showFeedback(
        'error',
        'Message not sent',
        error.message || 'Something went wrong. Please try again or call +44 7833 905183.'
      );
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.style.opacity = '1';
        submitButton.style.cursor = 'pointer';
        submitButton.textContent = 'SUBMIT ENQUIRY';
      }
    }
  });
}

function initPathwayLotties(attempt = 0) {
  const containers = document.querySelectorAll('[data-pathway-lottie]');
  if (!containers.length) return;

  if (!window.lottie) {
    if (attempt < 10) setTimeout(() => initPathwayLotties(attempt + 1), 250);
    return;
  }

  const colors = {
    launch: '#0a94b2',
    inspection: '#f97316',
    monitoring: '#475569',
    leadership: '#16a34a',
    recovery: '#e11d48'
  };

  const hexToRgb = (hex) => {
    const clean = hex.replace('#', '');
    return [
      parseInt(clean.slice(0, 2), 16) / 255,
      parseInt(clean.slice(2, 4), 16) / 255,
      parseInt(clean.slice(4, 6), 16) / 255,
      1
    ];
  };

  const animated = (start, end, mid = null) => {
    const frames = [
      { t: 0, s: start, e: mid || end },
      { t: 45, s: mid || end, e: end },
      { t: 90, s: end }
    ];
    return {
      a: 1,
      k: frames.map((frame) => ({
        ...frame,
        i: { x: [0.42], y: [1] },
        o: { x: [0.58], y: [0] }
      }))
    };
  };

  const makeAnimation = (hex, name) => {
    const color = hexToRgb(hex);
    return {
      v: '5.12.2',
      fr: 30,
      ip: 0,
      op: 90,
      w: 96,
      h: 96,
      nm: `SAPC ${name} pathway icon`,
      ddd: 0,
      assets: [],
      layers: [
        {
          ddd: 0,
          ind: 1,
          ty: 4,
          nm: 'rotating accent dot',
          sr: 1,
          ks: {
            o: { a: 0, k: 100 },
            r: animated([0], [360], [180]),
            p: { a: 0, k: [48, 48, 0] },
            a: { a: 0, k: [0, 0, 0] },
            s: { a: 0, k: [100, 100, 100] }
          },
          ao: 0,
          shapes: [{
            ty: 'gr',
            it: [
              { ty: 'el', p: { a: 0, k: [0, -31] }, s: { a: 0, k: [11, 11] }, d: 1 },
              { ty: 'fl', c: { a: 0, k: color }, o: { a: 0, k: 96 }, r: 1, bm: 0 },
              { ty: 'tr', p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
            ],
            nm: 'dot',
            bm: 0
          }],
          ip: 0,
          op: 90,
          st: 0,
          bm: 0
        },
        {
          ddd: 0,
          ind: 2,
          ty: 4,
          nm: 'breathing halo',
          sr: 1,
          ks: {
            o: animated([22], [8], [4]),
            r: { a: 0, k: 0 },
            p: { a: 0, k: [48, 48, 0] },
            a: { a: 0, k: [0, 0, 0] },
            s: animated([80, 80, 100], [118, 118, 100], [104, 104, 100])
          },
          ao: 0,
          shapes: [{
            ty: 'gr',
            it: [
              { ty: 'el', p: { a: 0, k: [0, 0] }, s: { a: 0, k: [54, 54] }, d: 1 },
              { ty: 'fl', c: { a: 0, k: color }, o: { a: 0, k: 100 }, r: 1, bm: 0 },
              { ty: 'tr', p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
            ],
            nm: 'halo',
            bm: 0
          }],
          ip: 0,
          op: 90,
          st: 0,
          bm: 0
        },
        {
          ddd: 0,
          ind: 3,
          ty: 4,
          nm: 'soft ring',
          sr: 1,
          ks: {
            o: { a: 0, k: 78 },
            r: animated([0], [-360], [-180]),
            p: { a: 0, k: [48, 48, 0] },
            a: { a: 0, k: [0, 0, 0] },
            s: { a: 0, k: [100, 100, 100] }
          },
          ao: 0,
          shapes: [{
            ty: 'gr',
            it: [
              { ty: 'el', p: { a: 0, k: [0, 0] }, s: { a: 0, k: [66, 66] }, d: 1 },
              { ty: 'st', c: { a: 0, k: color }, o: { a: 0, k: 54 }, w: { a: 0, k: 5 }, lc: 2, lj: 2, ml: 4, bm: 0 },
              { ty: 'tm', s: { a: 0, k: 8 }, e: { a: 0, k: 72 }, o: { a: 0, k: 0 }, m: 1 },
              { ty: 'tr', p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
            ],
            nm: 'ring',
            bm: 0
          }],
          ip: 0,
          op: 90,
          st: 0,
          bm: 0
        }
      ]
    };
  };

  containers.forEach((container) => {
    if (container.dataset.lottieReady === 'true') return;
    const key = container.dataset.pathwayLottie;
    container.dataset.lottieReady = 'true';
    window.lottie.loadAnimation({
      container,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: makeAnimation(colors[key] || '#0a94b2', key || 'default')
    });
  });
}

// ==============================
// BOOT
// ==============================
(function injectSchema() {
  const page = getCurrentSlug();

  // Organisation schema on every page
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Supported Accommodation Providers Consultancy",
    "alternateName": "SAPC",
    "url": "https://www.sapconsultancy.co.uk",
    "logo": "https://www.sapconsultancy.co.uk/logo.svg",
    "description": "Specialist Ofsted compliance, mock inspection and service-improvement consultancy for supported accommodation providers across England.",
    "telephone": "+44 7833 905183",
    "email": "support@sapconsultancy.co.uk",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Suite B, Sapphire House, Roundtree Way",
      "addressLocality": "Norwich",
      "postalCode": "NR7 8SQ",
      "addressCountry": "GB"
    },
    "areaServed": {
      "@type": "Country",
      "name": "England"
    },
    "sameAs": [],
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
      "opens": "09:00",
      "closes": "17:30"
    }
  };

  // Service schemas per page
  const serviceSchemas = {
    'mock-inspections': { name: 'Ofsted Mock Inspections', desc: 'Rigorous Ofsted mock inspections for supported accommodation providers with detailed action plans and Reg 32 reports.' },
    'registration-support': { name: 'Ofsted Registration Support', desc: 'Expert support navigating the Ofsted registration process for supported accommodation providers under SA Regulations 2023.' },
    'post-inspection': { name: 'Post-Ofsted Inspection Support', desc: 'Strategic support for supported accommodation providers following an Ofsted inspection, focused on achieving Outcome 1.' },
    'monthly-monitoring': { name: 'Monthly Monitoring Visits', desc: 'Regular compliance monitoring visits to keep supported accommodation providers inspection-ready year-round.' },
    'case-file-audits': { name: 'Case File Audits', desc: 'Professional case file audits ensuring documentation meets Ofsted SA Regulations 2023 standards.' },
    'location-risk-assessments': { name: 'Location Risk Assessments', desc: 'Expert property suitability assessments required for Ofsted supported accommodation registration.' },
    'risk-assessment-support-plans': { name: 'Risk Assessment & Support Plan Reviews', desc: 'Robust, Ofsted-compliant risk assessments and support plans for young people aged 16-17.' },
    'coaching-mentoring': { name: 'Coaching & Mentoring', desc: 'Leadership coaching and mentoring for supported accommodation Registered Managers and senior staff.' },
    'nominated-individual-registered-service-manager-mentoring': { name: 'Nominated Individual & Registered Service Manager Mentoring Programme', desc: 'A practical 12-week mentoring programme for supported accommodation leaders new to managing an Ofsted-registered service.' },
    'professional-supervision': { name: 'Professional Supervision', desc: 'Structured professional supervision for supported accommodation staff as required under SA Regulations 2023.' },
    'recording-templates': { name: 'Recording Templates Development', desc: 'Bespoke Ofsted-compliant recording templates built for supported accommodation providers.' },
    'digital-marketing-automation': { name: 'Digital Marketing & Automation', desc: 'Web development, email marketing, design, Google Business Profile marketing and automated lead workflow support for supported accommodation providers.' },
  };

  function addSchema(obj) {
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.text = JSON.stringify(obj);
    document.head.appendChild(s);
  }

  addSchema(orgSchema);

  if (serviceSchemas[page]) {
    addSchema({
      "@context": "https://schema.org",
      "@type": "Service",
      "name": serviceSchemas[page].name,
      "description": serviceSchemas[page].desc,
      "provider": { "@type": "Organization", "name": "Supported Accommodation Providers Consultancy" },
      "areaServed": { "@type": "Country", "name": "England" },
      "serviceType": "Ofsted Compliance Consultancy"
    });
  }

  // Breadcrumb schema
  const breadcrumbMap = {
    'index': [{ name: 'Home', url: '/' }],
    'about-us': [{ name: 'Home', url: '/' }, { name: 'About Us', url: '/about-us/' }],
    'our-approach': [{ name: 'Home', url: '/' }, { name: 'Our Approach', url: '/our-approach/' }],
    'contact': [{ name: 'Home', url: '/' }, { name: 'Contact', url: '/contact/' }],
    'ofsted-updates': [{ name: 'Home', url: '/' }, { name: 'Ofsted Updates', url: '/ofsted-updates/' }],
  };
  if (serviceSchemas[page]) {
    breadcrumbMap[page] = [{ name: 'Home', url: '/' }, { name: 'Services', url: '/#services' }, { name: serviceSchemas[page].name, url: '/' + page + '/' }];
  }
  if (breadcrumbMap[page]) {
    addSchema({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbMap[page].map((item, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "name": item.name,
        "item": "https://www.sapconsultancy.co.uk" + item.url
      }))
    });
  }
})();

function initSapcSharedLayout() {
  if (window.__sapcSharedLayoutReady) return;
  window.__sapcSharedLayoutReady = true;
  renderSharedNavbar();
  renderSharedFooter();
  applyLocalPreviewLinks(document);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSapcSharedLayout);
} else {
  initSapcSharedLayout();
}

window.addEventListener('load', () => {
  initSapcSharedLayout();
  initAOS();
  initPathwayLotties();
  initContactForm();
  initNewsletterPopup();
});
//  NEWSLETTER POPUP - appears on every page
function initNewsletterPopup() {
  if (document.getElementById('contact-form')) return;
  if (window.matchMedia('(max-width: 1279px)').matches) return;

  // Don't show if already subscribed or dismissed today
  const dismissed = localStorage.getItem('sapc_nl_dismissed');
  const subscribed = localStorage.getItem('sapc_nl_subscribed');
  if (subscribed) return;
  if (dismissed && (Date.now() - parseInt(dismissed)) < 24 * 60 * 60 * 1000) return;

  const MAKE_NEWSLETTER_WEBHOOK_URL = 'https://hook.eu1.make.com/zo5d8tdps58d29y91ddsrh3odcvtqgyp';
  const style = document.createElement('style');
  style.textContent = `
    #sapc-nl-overlay {
      position:fixed;inset:0;background:rgba(0,0,0,0.65);z-index:9999;
      display:flex;align-items:center;justify-content:center;padding:20px;
      opacity:0;visibility:hidden;pointer-events:none;transition:opacity 0.35s ease, visibility 0.35s ease;
    }
    #sapc-nl-overlay.visible { opacity:1;visibility:visible;pointer-events:auto; }
    #sapc-nl-modal {
      background:#fff;border-radius:20px;overflow:hidden;
      max-width:780px;width:100%;position:relative;
      display:grid;grid-template-columns:1fr 1fr;
      box-shadow:0 24px 80px rgba(0,0,0,0.3);
      transform:translateY(24px) scale(0.97);
      transition:transform 0.35s ease;
    }
    #sapc-nl-overlay.visible #sapc-nl-modal { transform:translateY(0) scale(1); }
    #sapc-nl-left {
      background:#004d62;padding:44px 36px;display:flex;flex-direction:column;justify-content:center;
    }
    #sapc-nl-right { padding:44px 36px;display:flex;flex-direction:column;justify-content:center; }
    #sapc-nl-close {
      position:absolute;top:16px;right:16px;width:32px;height:32px;border-radius:50%;
      background:rgba(255,255,255,0.15);border:none;cursor:pointer;color:#fff;
      font-size:18px;line-height:1;display:flex;align-items:center;justify-content:center;
      transition:background 0.2s;z-index:2;font-family:'Manrope',sans-serif;
    }
    #sapc-nl-close:hover { background:rgba(255,255,255,0.28); }
    .nl-input {
      width:100%;padding:11px 14px;border-radius:8px;border:1.5px solid #e5e7eb;
      font:400 13px/1 'Manrope',sans-serif;color:#111827;outline:none;
      box-sizing:border-box;transition:border-color 0.2s;margin-bottom:10px;
    }
    .nl-input:focus { border-color:#004d62; }
    .nl-select {
      width:100%;padding:11px 14px;border-radius:8px;border:1.5px solid #e5e7eb;
      font:400 13px/1 'Manrope',sans-serif;color:#6b7280;outline:none;
      box-sizing:border-box;background:#fff;cursor:pointer;margin-bottom:10px;
    }
    #sapc-nl-submit {
      width:100%;padding:13px;border-radius:8px;background:#f99d1c;
      color:#111827;font:700 14px/1 'Manrope',sans-serif;border:none;
      cursor:pointer;transition:background 0.2s;margin-top:4px;
    }
    #sapc-nl-submit:hover { background:#e08a0a; }
    #sapc-nl-submit:disabled { opacity:0.6;cursor:not-allowed; }
    #sapc-nl-fb { display:none;padding:10px 14px;border-radius:8px;font:600 12px/1.5 'Manrope',sans-serif;margin-top:8px; }
    .nl-pill { display:inline-flex;align-items:center;gap:6px;font:600 11px/1 'Manrope',sans-serif;color:rgba(255,255,255,0.55);margin-bottom:8px; }
    .nl-pill span { width:6px;height:6px;border-radius:50%;background:#f99d1c;flex-shrink:0; }
    @media(max-width:640px) {
      #sapc-nl-modal { grid-template-columns:1fr !important; }
      #sapc-nl-left { padding:36px 28px 24px; }
      #sapc-nl-right { padding:24px 28px 36px; }
    }
  `;
  document.head.appendChild(style);
  const overlay = document.createElement('div');
  overlay.id = 'sapc-nl-overlay';
  overlay.setAttribute('role','dialog');
  overlay.setAttribute('aria-modal','true');
  overlay.setAttribute('aria-label','Subscribe to the SAPC Newsletter');
  overlay.innerHTML = `
    <div id="sapc-nl-modal">
      <button id="sapc-nl-close" aria-label="Close">x</button>

      <!-- Left panel -->
      <div id="sapc-nl-left">
        <p style="font:700 10px/1 'Manrope',sans-serif;letter-spacing:0.12em;text-transform:uppercase;color:#f99d1c;margin:0 0 14px;">Free Resource</p>
        <h2 style="font:800 26px/1.2 'Manrope',sans-serif;color:#fff;margin:0 0 14px;">Stay Ofsted-Ready.</h2>
        <p style="font:400 13px/1.65 'Manrope',sans-serif;color:rgba(255,255,255,0.65);margin:0 0 24px;">
          Join supported accommodation providers across England who get our free monthly compliance insights, Ofsted updates, and sector news.
        </p>
        <div style="display:flex;flex-direction:column;gap:8px;">
          <div class="nl-pill"><span></span> Practical Ofsted compliance tips</div>
          <div class="nl-pill"><span></span> Regulation updates & sector news</div>
          <div class="nl-pill"><span></span> Mock inspection checklists</div>
          <div class="nl-pill"><span></span> No spam - unsubscribe anytime</div>
        </div>
        <div style="margin-top:28px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.1);">
          <p style="font:700 22px/1 'Manrope',sans-serif;color:#fff;margin:0 0 4px;">Free</p>
          <p style="font:400 12px/1 'Manrope',sans-serif;color:rgba(255,255,255,0.45);margin:0;">Monthly newsletter - cancel anytime</p>
        </div>
      </div>

      <!-- Right panel -->
      <div id="sapc-nl-right">
        <p style="font:700 10px/1 'Manrope',sans-serif;letter-spacing:0.1em;text-transform:uppercase;color:#6b7280;margin:0 0 6px;">Get Started</p>
        <h3 style="font:800 20px/1.2 'Manrope',sans-serif;color:#111827;margin:0 0 20px;">Subscribe in 30 seconds</h3>

        <form id="sapc-nl-popup-form" novalidate>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
            <input class="nl-input" id="nlp-fname" type="text" placeholder="First name" autocomplete="given-name"/>
            <input class="nl-input" id="nlp-lname" type="text" placeholder="Last name" autocomplete="family-name"/>
          </div>
          <input class="nl-input" id="nlp-email" type="email" placeholder="Email address *" required autocomplete="email"/>
          <select class="nl-select" id="nlp-role">
            <option value="">Your role (optional)</option>
            <option value="Registered Manager">Registered Manager</option>
            <option value="Nominated Individual">Nominated Individual</option>
            <option value="Director / Owner">Director / Owner</option>
            <option value="Operations Manager">Operations Manager</option>
            <option value="Support Worker">Support Worker</option>
            <option value="Other">Other</option>
          </select>
          <div style="display:flex;gap:8px;align-items:flex-start;margin-bottom:10px;">
            <input type="checkbox" id="nlp-consent" style="margin-top:3px;width:15px;height:15px;accent-color:#004d62;cursor:pointer;flex-shrink:0;"/>
            <label for="nlp-consent" style="font:400 11px/1.6 'Manrope',sans-serif;color:#6b7280;cursor:pointer;">
              I agree to receive the SAPC newsletter and can unsubscribe anytime. See our <a href="/privacy-policy/" style="color:#004d62;text-decoration:underline;">Privacy Policy</a>.
            </label>
          </div>
          <button type="submit" id="sapc-nl-submit">Subscribe Free</button>
          <div id="sapc-nl-fb"></div>
        </form>

        <p style="font:400 11px/1.5 'Manrope',sans-serif;color:#9ca3af;margin:14px 0 0;text-align:center;">
          Already subscribed? <a href="#" id="sapc-nl-already" style="color:#004d62;text-decoration:underline;">Click here</a>
        </p>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  setTimeout(() => overlay.classList.add('visible'), 30000);
  document.addEventListener('mouseleave', function onExit(e) {
    if (e.clientY < 10) {
      overlay.classList.add('visible');
      document.removeEventListener('mouseleave', onExit);
    }
  });
  function closePopup() {
    overlay.classList.remove('visible');
    setTimeout(() => overlay.remove(), 350);
    localStorage.setItem('sapc_nl_dismissed', Date.now().toString());
  }

  document.getElementById('sapc-nl-close').addEventListener('click', closePopup);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closePopup(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePopup(); });
  document.getElementById('sapc-nl-already').addEventListener('click', (e) => {
    e.preventDefault(); closePopup();
  });
  document.getElementById('sapc-nl-popup-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const btn     = document.getElementById('sapc-nl-submit');
    const fb      = document.getElementById('sapc-nl-fb');
    const email   = document.getElementById('nlp-email').value.trim();
    const fname   = document.getElementById('nlp-fname').value.trim();
    const lname   = document.getElementById('nlp-lname').value.trim();
    const role    = document.getElementById('nlp-role').value;
    const consent = document.getElementById('nlp-consent').checked;

    if (!email || !/\S+@\S+\.\S+/.test(email)) { showFb('Please enter a valid email address.', false); return; }
    if (!consent) { showFb('Please tick the consent checkbox to continue.', false); return; }

    btn.disabled = true;
    btn.textContent = 'Subscribing...';

    try {
      const body = new FormData();
      body.append('email', email);
      body.append('first_name', fname);
      body.append('last_name', lname);
      body.append('role', role);
      body.append('consent', consent ? 'yes' : 'no');
      body.append('source', 'newsletter_popup');
      body.append('page', window.location.href);
      body.append('submitted_at', new Date().toISOString());

      await fetch(MAKE_NEWSLETTER_WEBHOOK_URL, {
        method:'POST',
        mode:'no-cors',
        body
      });

      showFb('Welcome! You\'re now subscribed.', true);
      localStorage.setItem('sapc_nl_subscribed','1');
      setTimeout(closePopup, 2200);
    } catch(err) {
      showFb('Network error - please try again shortly.', false);
      btn.disabled = false; btn.textContent = 'Subscribe Free';
    }

    function showFb(msg, ok) {
      fb.style.display = 'block';
      fb.style.background = ok ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)';
      fb.style.color = ok ? '#15803d' : '#dc2626';
      fb.style.border = ok ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(239,68,68,0.3)';
      fb.textContent = msg;
    }
  });
}
