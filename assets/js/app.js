/* ============================================
   app.js — Application shell, routing, page loader
   ============================================ */

const App = (() => {
  /* ---- State ---- */
  let _currentPage = 'dashboard';
  let _pages = {};
  let _dataCache = {};

  /* ---- Init ---- */
  function init() {
    Sidebar.init();
    Theme.init();
    Notifications.init();
    Search.init();
    _bindGlobalEvents();
    navigate('dashboard');
  }

  /* ---- Page registry ---- */
  function registerPage(name, renderFn, initFn) {
    _pages[name] = { render: renderFn, init: initFn || (() => {}) };
  }

  /* ---- Navigate ---- */
  async function navigate(pageName, data) {
    if (!_pages[pageName]) {
      console.warn(`Page "${pageName}" not registered.`);
      return;
    }
    _currentPage = pageName;
    const mainEl = document.getElementById('main-content');
    if (!mainEl) return;

    mainEl.innerHTML = '<div class="page-content" style="display:flex;align-items:center;justify-content:center;min-height:300px;"><div class="spinner"></div></div>';

    const page = _pages[pageName];
    let renderData = data;

    if (!renderData) {
      const dataFile = pageName === 'dashboard' ? null :
        pageName === 'membership' ? 'membership' :
        pageName === 'fellowship' ? 'fellowship' :
        pageName === 'meetings' ? 'meetings' : null;

      if (dataFile && !_dataCache[dataFile]) {
        try {
          const resp = await fetch(`data/${dataFile}.json`);
          if (resp.ok) _dataCache[dataFile] = await resp.json();
        } catch (e) { /* use demo data */ }
      }
      renderData = _dataCache[dataFile] || null;
    }

    mainEl.innerHTML = page.render(renderData);

    if (page.init) {
      setTimeout(() => page.init(renderData), 50);
    }

    Sidebar.setActive(pageName);
    _updateBreadcrumb(pageName);

    // Scroll to top
    mainEl.scrollTop = 0;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function _updateBreadcrumb(pageName) {
    const bc = document.getElementById('breadcrumb-current');
    if (!bc) return;
    const labels = {
      dashboard: 'Dashboard',
      membership: 'Membership Curriculum',
      fellowship: 'Fellowship Curriculum',
      meetings: 'Meetings',
      tracker: 'Progress Tracker',
      faculty: 'Faculty Directory',
      resources: 'Resources'
    };
    bc.textContent = labels[pageName] || pageName;
  }

  /* ---- Global events ---- */
  function _bindGlobalEvents() {
    // Click-outside for panels
    document.addEventListener('click', (e) => {
      const notifPanel = document.getElementById('notif-panel');
      const notifBtn = document.getElementById('btn-notifications');
      if (notifPanel && notifBtn && !notifBtn.contains(e.target) && !notifPanel.contains(e.target)) {
        notifPanel.classList.remove('notif-panel--open');
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('global-search');
        if (searchInput) searchInput.focus();
      }
      if (e.key === 'Escape') {
        const notifPanel = document.getElementById('notif-panel');
        if (notifPanel) notifPanel.classList.remove('notif-panel--open');
      }
    });
  }

  /* ---- Data helpers ---- */
  function getData(key) { return _dataCache[key]; }
  function setData(key, val) { _dataCache[key] = val; }

  /* ---- Utility ---- */
  function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 30) return `${days}d ago`;
    return formatDate(dateStr);
  }

  /* ---- Expose ---- */
  return {
    init,
    navigate,
    registerPage,
    getData,
    setData,
    formatDate,
    timeAgo
  };
})();

// Init is now called by the login flow in index.html — not automatically

