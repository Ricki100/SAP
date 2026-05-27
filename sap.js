/* ==============================
   SAPC GLOBAL JS SYSTEM
   ============================== */

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// ==============================
// RESPONSIVE CSS — injected once, covers all 15 pages
// ==============================
(function injectResponsiveCSS() {
  const style = document.createElement('style');
  style.textContent = `
    html { scrollbar-gutter: stable; }
    .sapc-hamburger { display:none; }
    .sapc-book-cta  { display:inline-flex; }

    /* ── Mobile + Tablet ≤ 1023px ── */
    @media (max-width:1023px) {
      .sapc-hamburger { display:flex !important; }
      .sapc-book-cta  { display:none !important; }

      [style*="grid-template-columns:1fr 1fr"] {
        grid-template-columns:1fr !important;
        gap:28px !important;
      }
      [style*="grid-template-columns:repeat(4,1fr)"] {
        grid-template-columns:repeat(2,1fr) !important;
        gap:16px !important;
      }
      [style*="grid-template-columns:repeat(3,1fr)"] {
        grid-template-columns:1fr !important;
      }
      [style*="grid-column:2"] { grid-column:auto !important; }

      [style*="padding:80px 48px"]   { padding:48px 20px !important; }
      [style*="padding:64px 48px"]   { padding:48px 20px !important; }
      [style*="padding:32px 48px"]   { padding:20px 20px !important; }
      section[style*="padding:80px"] { padding:48px 20px !important; }
      section[style*="padding:64px"] { padding:48px 20px !important; }

      h1 { font-size:28px !important; line-height:1.2 !important; }
      h2 { font-size:24px !important; line-height:1.25 !important; }

      /* Hide hero right-col image on mobile */
      section[style*="background:#004d62"] > div > div:nth-child(2) { display:none !important; }

      [style*="display:flex;gap:14px;justify-content:center"] {
        flex-direction:column !important;
        align-items:center !important;
        gap:10px !important;
      }
      [style*="grid-template-columns:1fr 1fr;gap:16px"] {
        grid-template-columns:1fr !important;
      }
      [style*="font:400 20px/1.7"] { font-size:15px !important; }
      [style*="font:800 64px"]     { font-size:40px !important; }
      [style*="height:340px"] { height:220px !important; }
      [style*="height:360px"] { height:220px !important; }
      [style*="height:380px"] { height:220px !important; }
    }

    /* ── Tablet 768–1023px (layout only) ── */
    @media (min-width:768px) and (max-width:1023px) {
      [style*="grid-template-columns:repeat(3,1fr)"] {
        grid-template-columns:repeat(2,1fr) !important;
      }
      [style*="grid-column:2"] { grid-column:auto !important; }
      [style*="grid-template-columns:repeat(4,1fr)"] {
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
    }

    /* ── Laptop 1024–1279px ── */
    @media (min-width:1024px) and (max-width:1279px) {
      [style*="padding:80px 48px"] { padding:72px 40px !important; }
      [style*="padding:64px 48px"] { padding:56px 40px !important; }
      [style*="gap:80px"] { gap:56px !important; }
    }

    /* ── Widescreen ≥1440px ── */
    @media (min-width:1440px) {
      [style*="max-width:1200px"] { max-width:1360px !important; }
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
// AOS CSS — load early
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
const getNavbar = () => document.querySelector('.sapc-navbar');
window.addEventListener('scroll', () => {
  const nav = getNavbar();
  if (!nav) return;
  nav.style.boxShadow = window.scrollY > 50 ? '0 2px 16px rgba(0,0,0,0.1)' : '0 1px 4px rgba(0,0,0,0.06)';
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

// Contact form — Web3Forms (https://web3forms.com). Free tier: sign up, add your site domain,
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

        <a href="index.html" style="flex-shrink:0;line-height:0;">
          <img src="logo@2x.png" alt="Supported Accommodation Providers Consultancy" style="height:32px;width:auto;">
        </a>

        <!-- Desktop links -->
        <div id="sapc-desktop-nav" style="display:flex;align-items:center;gap:32px;">
          <a href="index.html" class="sapc-navlink" style="font:600 13px/1 'Manrope',sans-serif;color:#4b5563;text-decoration:none;transition:color 0.2s;">Home</a>
          <a href="about-us.html" class="sapc-navlink" style="font:600 13px/1 'Manrope',sans-serif;color:#4b5563;text-decoration:none;transition:color 0.2s;">About Us</a>

          <div class="sapc-dropdown" id="sapc-svc-wrapper">
            <button class="sapc-svc-btn" id="sapc-svc-btn" aria-haspopup="true" aria-expanded="false">
              Services
              <span class="material-symbols-outlined sapc-chev" id="sapc-chev">expand_more</span>
            </button>
            <div class="sapc-dd-menu" id="sapc-dd-menu" role="menu">
              <a href="mock-inspections.html">Ofsted Mock Inspections</a>
              <a href="registration-support.html">Ofsted Registration Support</a>
              <a href="post-inspection.html">Post-Ofsted Inspection Support</a>
              <a href="monthly-monitoring.html">Monthly Monitoring Visits</a>
              <a href="case-file-audits.html">Case File Audits</a>
              <div class="dd-divider"></div>
              <a href="location-risk-assessments.html">Location Risk Assessments</a>
              <a href="risk-assessment-support-plans.html">Risk Assessment &amp; Support Plan Reviews</a>
              <a href="coaching-mentoring.html">Coaching &amp; Mentoring</a>
              <a href="professional-supervision.html">Professional Supervision</a>
              <a href="recording-templates.html">Recording Templates Development</a>
            </div>
          </div>

          <a href="our-approach.html" class="sapc-navlink" style="font:600 13px/1 'Manrope',sans-serif;color:#4b5563;text-decoration:none;transition:color 0.2s;">Our Approach</a>
          <a href="ofsted-updates.html" class="sapc-navlink" style="font:600 13px/1 'Manrope',sans-serif;color:#4b5563;text-decoration:none;transition:color 0.2s;">Ofsted Updates</a>
          <a href="useful-links.html" class="sapc-navlink" style="font:600 13px/1 'Manrope',sans-serif;color:#4b5563;text-decoration:none;transition:color 0.2s;">Useful Links</a>
          <a href="contact.html" class="sapc-navlink" style="font:600 13px/1 'Manrope',sans-serif;color:#4b5563;text-decoration:none;transition:color 0.2s;">Contact</a>
        </div>

        <div style="display:flex;align-items:center;gap:12px;">
          <a href="contact.html" class="sapc-book-cta" style="background:#f99d1c;color:#111827;padding:10px 22px;border-radius:8px;font:700 13px/1 'Manrope',sans-serif;text-decoration:none;white-space:nowrap;transition:background 0.2s;" onmouseover="this.style.background='#e08a0d'" onmouseout="this.style.background='#f99d1c'">
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
          <a href="index.html">Home</a>
          <a href="about-us.html">About Us</a>
          <span class="sapc-mob-label">Services</span>
          <a href="mock-inspections.html" class="sapc-mob-service">Ofsted Mock Inspections</a>
          <a href="registration-support.html" class="sapc-mob-service">Ofsted Registration Support</a>
          <a href="post-inspection.html" class="sapc-mob-service">Post-Ofsted Inspection Support</a>
          <a href="monthly-monitoring.html" class="sapc-mob-service">Monthly Monitoring Visits</a>
          <a href="case-file-audits.html" class="sapc-mob-service">Case File Audits</a>
          <a href="location-risk-assessments.html" class="sapc-mob-service">Location Risk Assessments</a>
          <a href="risk-assessment-support-plans.html" class="sapc-mob-service">Risk Assessment &amp; Support Plans</a>
          <a href="coaching-mentoring.html" class="sapc-mob-service">Coaching &amp; Mentoring</a>
          <a href="professional-supervision.html" class="sapc-mob-service">Professional Supervision</a>
          <a href="recording-templates.html" class="sapc-mob-service">Recording Templates</a>
          <a href="our-approach.html">Our Approach</a>
          <a href="ofsted-updates.html">Ofsted Updates</a>
          <a href="useful-links.html">Useful Links</a>
          <a href="contact.html">Contact</a>
          <a href="contact.html" class="sapc-mob-cta">Book Consultation</a>
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
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('#shared-navbar .sapc-navlink').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
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
            <a href="index.html" style="display:inline-block;margin-bottom:20px;line-height:0;">
              <img src="logo@2x.png" alt="Supported Accommodation Providers Consultancy" style="height:36px;width:auto;">
            </a>
            <p style="font:400 13px/1.7 'Manrope',sans-serif;color:#94a3b8;margin:0;">Empowering providers with precision consultancy and specialised compliance strategies for the supported accommodation sector across England.</p>
          </div>
          <div>
            <h4 style="font:700 11px/1 'Manrope',sans-serif;letter-spacing:0.12em;text-transform:uppercase;color:#fff;margin:0 0 20px;">Our Services</h4>
            <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:12px;">
              <li><a href="mock-inspections.html" style="font:400 13px/1 'Manrope',sans-serif;color:#94a3b8;text-decoration:none;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#94a3b8'">Mock Inspections</a></li>
              <li><a href="registration-support.html" style="font:400 13px/1 'Manrope',sans-serif;color:#94a3b8;text-decoration:none;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#94a3b8'">Ofsted Registration Support</a></li>
              <li><a href="post-inspection.html" style="font:400 13px/1 'Manrope',sans-serif;color:#94a3b8;text-decoration:none;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#94a3b8'">Post-Ofsted Inspection Support</a></li>
              <li><a href="monthly-monitoring.html" style="font:400 13px/1 'Manrope',sans-serif;color:#94a3b8;text-decoration:none;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#94a3b8'">Monthly Monitoring</a></li>
              <li><a href="case-file-audits.html" style="font:400 13px/1 'Manrope',sans-serif;color:#94a3b8;text-decoration:none;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#94a3b8'">Case File Audits</a></li>
              <li><a href="location-risk-assessments.html" style="font:400 13px/1 'Manrope',sans-serif;color:#94a3b8;text-decoration:none;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#94a3b8'">Location Risk Assessments</a></li>
              <li><a href="risk-assessment-support-plans.html" style="font:400 13px/1 'Manrope',sans-serif;color:#94a3b8;text-decoration:none;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#94a3b8'">Risk Assessment &amp; Support Plans</a></li>
              <li><a href="coaching-mentoring.html" style="font:400 13px/1 'Manrope',sans-serif;color:#94a3b8;text-decoration:none;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#94a3b8'">Coaching &amp; Mentoring</a></li>
              <li><a href="professional-supervision.html" style="font:400 13px/1 'Manrope',sans-serif;color:#94a3b8;text-decoration:none;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#94a3b8'">Professional Supervision</a></li>
              <li><a href="recording-templates.html" style="font:400 13px/1 'Manrope',sans-serif;color:#94a3b8;text-decoration:none;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#94a3b8'">Recording Templates</a></li>
            </ul>
          </div>
          <div>
            <h4 style="font:700 11px/1 'Manrope',sans-serif;letter-spacing:0.12em;text-transform:uppercase;color:#fff;margin:0 0 20px;">Company</h4>
            <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:12px;">
              <li><a href="about-us.html" style="font:400 13px/1 'Manrope',sans-serif;color:#94a3b8;text-decoration:none;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#94a3b8'">About Us</a></li>
              <li><a href="our-approach.html" style="font:400 13px/1 'Manrope',sans-serif;color:#94a3b8;text-decoration:none;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#94a3b8'">Our Approach</a></li>
              <li><a href="ofsted-updates.html" style="font:400 13px/1 'Manrope',sans-serif;color:#94a3b8;text-decoration:none;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#94a3b8'">Ofsted Updates</a></li>
              <li><a href="useful-links.html" style="font:400 13px/1 'Manrope',sans-serif;color:#94a3b8;text-decoration:none;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#94a3b8'">Useful Links</a></li>
              <li><a href="contact.html" style="font:400 13px/1 'Manrope',sans-serif;color:#94a3b8;text-decoration:none;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#94a3b8'">Contact Us</a></li>
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
          <span style="font:400 11px/1 'Manrope',sans-serif;letter-spacing:0.1em;text-transform:uppercase;color:#475569;">© 2025 Supported Accommodation Providers Consultancy. All rights reserved.</span>
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

    showFeedback('sending', 'Sending your enquiry…', 'Please wait a moment.');

    try {
      const fullName = (formData.get('fullName') || '').toString().trim();
      const organisation = (formData.get('organisation') || '').toString().trim();
      const email = (formData.get('email') || '').toString().trim();
      const phone = (formData.get('phone') || '').toString().trim();
      const serviceRequired = (formData.get('serviceRequired') || '').toString().trim();
      const message = (formData.get('message') || '').toString().trim();

      const messageBody = [
        `Organisation: ${organisation || '—'}`,
        `Phone: ${phone || '—'}`,
        `Service: ${serviceRequired || '—'}`,
        '',
        message
      ].join('\n');

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          access_key: SAPC_WEB3FORMS_ACCESS_KEY,
          subject: `Supported Accommodation Providers Consultancy website enquiry — ${serviceRequired || 'General'}`,
          name: fullName,
          email,
          message: messageBody,
          botcheck: false
        })
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success !== true) {
        throw new Error(result.message || 'Unable to send your enquiry. Please try again or phone us.');
      }

      form.reset();
      showFeedback(
        'success',
        'Message sent',
        'Your enquiry was delivered. We will be in touch within 24 hours.'
      );
    } catch (error) {
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

// ==============================
// BOOT
// ==============================

// ── JSON-LD SCHEMA MARKUP ──────────────────────────────────────────────────
(function injectSchema() {
  const page = window.location.pathname.split('/').pop() || 'index.html';

  // Organisation schema on every page
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Supported Accommodation Providers Consultancy",
    "alternateName": "SAPC",
    "url": "https://www.sapconsultancy.co.uk",
    "logo": "https://www.sapconsultancy.co.uk/logo.svg",
    "description": "Expert Ofsted compliance consultancy for supported accommodation providers across England. Registration support, mock inspections, monthly monitoring and more.",
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
      "name": "United Kingdom"
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
    'mock-inspections.html': { name: 'Ofsted Mock Inspections', desc: 'Rigorous Ofsted mock inspections for supported accommodation providers with detailed action plans and Reg 32 reports.' },
    'registration-support.html': { name: 'Ofsted Registration Support', desc: 'Expert support navigating the Ofsted registration process for supported accommodation providers under SA Regulations 2023.' },
    'post-inspection.html': { name: 'Post-Ofsted Inspection Support', desc: 'Strategic support for supported accommodation providers following an Ofsted inspection, focused on achieving Outcome 1.' },
    'monthly-monitoring.html': { name: 'Monthly Monitoring Visits', desc: 'Regular compliance monitoring visits to keep supported accommodation providers inspection-ready year-round.' },
    'case-file-audits.html': { name: 'Case File Audits', desc: 'Professional case file audits ensuring documentation meets Ofsted SA Regulations 2023 standards.' },
    'location-risk-assessments.html': { name: 'Location Risk Assessments', desc: 'Expert property suitability assessments required for Ofsted supported accommodation registration.' },
    'risk-assessment-support-plans.html': { name: 'Risk Assessment & Support Plan Reviews', desc: 'Robust, Ofsted-compliant risk assessments and support plans for young people aged 16-17.' },
    'coaching-mentoring.html': { name: 'Coaching & Mentoring', desc: 'Leadership coaching and mentoring for supported accommodation Registered Managers and senior staff.' },
    'professional-supervision.html': { name: 'Professional Supervision', desc: 'Structured professional supervision for supported accommodation staff as required under SA Regulations 2023.' },
    'recording-templates.html': { name: 'Recording Templates Development', desc: 'Bespoke Ofsted-compliant recording templates built for supported accommodation providers.' },
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
      "areaServed": { "@type": "Country", "name": "United Kingdom" },
      "serviceType": "Ofsted Compliance Consultancy"
    });
  }

  // Breadcrumb schema
  const breadcrumbMap = {
    'index.html': [{ name: 'Home', url: '/' }],
    'about-us.html': [{ name: 'Home', url: '/' }, { name: 'About Us', url: '/about-us.html' }],
    'our-approach.html': [{ name: 'Home', url: '/' }, { name: 'Our Approach', url: '/our-approach.html' }],
    'contact.html': [{ name: 'Home', url: '/' }, { name: 'Contact', url: '/contact.html' }],
    'ofsted-updates.html': [{ name: 'Home', url: '/' }, { name: 'Ofsted Updates', url: '/ofsted-updates.html' }],
  };
  if (serviceSchemas[page]) {
    breadcrumbMap[page] = [{ name: 'Home', url: '/' }, { name: 'Services', url: '/index.html#services' }, { name: serviceSchemas[page].name, url: '/' + page }];
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

window.addEventListener('load', () => {
  renderSharedNavbar();
  renderSharedFooter();
  initAOS();
  initContactForm();
});
