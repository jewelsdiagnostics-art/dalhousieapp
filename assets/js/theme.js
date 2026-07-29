/* ============================================
   theme.js - Dark/light mode toggle
   ============================================ */

const Theme = (() => {
  const STORAGE_KEY = 'theme';
  let _initialized = false;

  function _readSavedTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      return null;
    }
  }

  function _saveTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      console.warn('Theme preference could not be saved.');
    }
  }

  function init() {
    const btn = document.getElementById('btn-theme');
    if (!btn) return;

    const saved = _readSavedTheme();
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    _apply(saved || (mediaQuery.matches ? 'dark' : 'light'));

    if (_initialized) return;
    _initialized = true;

    btn.addEventListener('click', (event) => {
      event.preventDefault();
      toggle();
    });

    const handleSystemTheme = (event) => {
      if (!_readSavedTheme()) {
        _apply(event.matches ? 'dark' : 'light');
      }
    };

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleSystemTheme);
    } else if (typeof mediaQuery.addListener === 'function') {
      mediaQuery.addListener(handleSystemTheme);
    }
  }

  function _apply(theme) {
    const activeTheme = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', activeTheme);

    const icon = document.getElementById('theme-icon');
    const label = document.getElementById('theme-label');
    const button = document.getElementById('btn-theme');
    const nextMode = activeTheme === 'dark' ? 'light' : 'dark';
    const nextModeLabel = `${nextMode[0].toUpperCase()}${nextMode.slice(1)}`;

    if (icon) icon.textContent = activeTheme === 'dark' ? '\u2600' : '\u263E';
    if (label) label.textContent = `Switch to ${nextModeLabel} Mode`;
    if (button) button.setAttribute('aria-label', `Switch to ${nextMode} mode`);
  }

  function toggle() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    _apply(next);
    _saveTheme(next);
  }

  return { init, toggle };
})();
