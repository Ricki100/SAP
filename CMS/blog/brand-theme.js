(() => {
  'use strict';

  const root = document.documentElement;
  const config = window.RICREATIONS_SUPABASE || {};
  const defaults = {
    theme_mode: 'light',
    light_background: '#ffffff',
    light_text: '#111827',
    light_link: '#004d62',
    dark_background: '#004d62',
    dark_text: '#ffffff',
    dark_link: '#f99d1c'
  };

  function applyTheme(values) {
    const mode = values.theme_mode === 'system'
      ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : values.theme_mode;
    const background = values[`${mode}_background`];
    const text = values[`${mode}_text`];
    const accent = values[`${mode}_link`];
    const muted = `color-mix(in srgb, ${text} 66%, ${background})`;
    const line = `color-mix(in srgb, ${text} 16%, ${background})`;
    const surface = `color-mix(in srgb, ${text} 6%, ${background})`;

    root.dataset.theme = mode;
    root.style.setProperty('--theme-bg', background);
    root.style.setProperty('--theme-surface', surface);
    root.style.setProperty('--theme-text', text);
    root.style.setProperty('--theme-muted', muted);
    root.style.setProperty('--theme-line', line);
    root.style.setProperty('--theme-accent', accent);
    root.style.setProperty('--theme-media', surface);
    root.style.setProperty('--article-bg', background);
    root.style.setProperty('--article-surface', surface);
    root.style.setProperty('--article-text', text);
    root.style.setProperty('--article-muted', muted);
    root.style.setProperty('--article-line', line);
    root.style.setProperty('--article-accent', accent);
    root.style.setProperty('--ink', text);
    root.style.setProperty('--paper', background);
    root.style.setProperty('--blue', accent);
    root.style.setProperty('--gold', accent);
    root.style.setProperty('--line', line);
    root.style.setProperty('--muted', muted);
  }

  applyTheme(defaults);
  if (window.supabase?.createClient && config.url && config.publishableKey) {
    const client = window.supabase.createClient(config.url, config.publishableKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
    });
    client.from(config.brandSettingsTable || 'blog_brand_settings').select('*').eq('id', 'default').maybeSingle()
      .then(({ data }) => { if (data) applyTheme({ ...defaults, ...data }); })
      .catch(() => {});
  }
})();
