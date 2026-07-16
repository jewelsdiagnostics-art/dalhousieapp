/* ============================================
   theme.js — Dark/light mode toggle
   ============================================ */

const Theme = (() => {
  function init() {
    const btn = document.getElementById('btn-theme');
    if (!btn) return;

    // Load saved preference
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');
    _apply(theme);

    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      _apply(next);
      localStorage.setItem('theme', next);
    });

    // Listen for system changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        _apply(e.matches ? 'dark' : 'light');
      }
    });
  }

  function _apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const icon = document.getElementById('theme-icon');
    if (icon) {
      icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }

  function toggle() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    _apply(current === 'dark' ? 'light' : 'dark');
  }

  return { init, toggle };
})();
