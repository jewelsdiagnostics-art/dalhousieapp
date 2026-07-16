/* ============================================
   search.js — Global search with overlay results
   ============================================ */

const Search = (() => {
  let _searchIndex = [];

  function init() {
    _buildIndex();
    const input = document.getElementById('global-search');
    if (!input) return;

    let overlay = document.getElementById('search-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'search-overlay';
      overlay.className = 'search-overlay';
      overlay.innerHTML = '<div class="search-overlay__results" id="search-results"></div>';
      document.body.appendChild(overlay);
    }

    input.addEventListener('input', (e) => {
      const q = e.target.value.trim().toLowerCase();
      if (q.length < 2) {
        overlay.classList.remove('search-overlay--open');
        return;
      }
      _showResults(q, overlay);
    });

    input.addEventListener('focus', () => {
      if (input.value.trim().length >= 2) {
        overlay.classList.add('search-overlay--open');
      }
    });

    document.addEventListener('click', (e) => {
      if (!input.contains(e.target) && !overlay.contains(e.target)) {
        overlay.classList.remove('search-overlay--open');
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        overlay.classList.remove('search-overlay--open');
        input.blur();
      }
    });
  }

  function _buildIndex() {
    _searchIndex = [
      { title: 'Membership Applications', page: 'membership', keywords: 'member application register applicant' },
      { title: 'Fellowship Curriculum', page: 'fellowship', keywords: 'fellowship curriculum module rotation competency' },
      { title: 'Meetings & Minutes', page: 'meetings', keywords: 'meeting minutes agenda schedule calendar' },
      { title: 'Progress Tracker', page: 'tracker', keywords: 'tracker progress resident fellow evaluation' },
      { title: 'Faculty Directory', page: 'faculty', keywords: 'faculty directory professor supervisor staff' },
      { title: 'Resources & Documents', page: 'resources', keywords: 'resources documents upload files library' },
      { title: 'Dashboard', page: 'dashboard', keywords: 'dashboard overview home stats statistics' }
    ];
  }

  function _showResults(query, overlay) {
    const results = _searchIndex.filter(item =>
      item.title.toLowerCase().includes(query) ||
      item.keywords.toLowerCase().includes(query)
    );

    const container = document.getElementById('search-results');
    if (!container) return;

    if (results.length === 0) {
      container.innerHTML = '<div class="search-overlay__empty">No results found</div>';
    } else {
      container.innerHTML = results.map(r => `
        <div class="search-result-item" data-page="${r.page}">
          <span class="search-result-item__icon">📄</span>
          <div>
            <div class="search-result-item__title">${r.title}</div>
            <div class="search-result-item__hint">Go to ${r.page} page</div>
          </div>
        </div>
      `).join('');

      container.querySelectorAll('.search-result-item').forEach(el => {
        el.addEventListener('click', () => {
          App.navigate(el.dataset.page);
          overlay.classList.remove('search-overlay--open');
          const input = document.getElementById('global-search');
          if (input) input.value = '';
        });
      });
    }
    overlay.classList.add('search-overlay--open');
  }

  return { init };
})();

/* Search overlay styles (injected here to keep it self-contained) */
const searchStyles = document.createElement('style');
searchStyles.textContent = `
  .search-overlay {
    position: fixed;
    top: calc(var(--header-height) + 4px);
    left: 50%;
    transform: translateX(-50%);
    width: 420px;
    max-width: calc(100vw - 2rem);
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-xl);
    z-index: 160;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease, transform 0.2s ease;
    transform: translateX(-50%) translateY(-8px);
  }
  .search-overlay--open {
    opacity: 1;
    pointer-events: auto;
    transform: translateX(-50%) translateY(0);
  }
  .search-overlay__results {
    max-height: 320px;
    overflow-y: auto;
    padding: var(--space-2);
  }
  .search-overlay__empty {
    padding: var(--space-6);
    text-align: center;
    color: var(--text-muted);
    font-size: 0.875rem;
  }
  .search-result-item {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-3);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: background var(--transition-fast);
  }
  .search-result-item:hover { background: var(--surface-hover); }
  .search-result-item__icon { font-size: 1.2rem; }
  .search-result-item__title { font-weight: 500; font-size: 0.875rem; }
  .search-result-item__hint { font-size: 0.75rem; color: var(--text-muted); }
`;
document.head.appendChild(searchStyles);
