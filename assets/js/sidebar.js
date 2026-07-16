/* ============================================
   sidebar.js — Navigation, collapse, mobile drawer
   ============================================ */

const Sidebar = (() => {
  let _collapsed = false;

  function init() {
    const hamburger = document.getElementById('btn-hamburger');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const app = document.getElementById('app');

    if (hamburger && app) {
      hamburger.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          sidebar.classList.toggle('sidebar--open');
          overlay.classList.toggle('sidebar__overlay--visible');
        } else {
          _collapsed = !_collapsed;
          app.classList.toggle('app--collapsed', _collapsed);
          localStorage.setItem('sidebar-collapsed', _collapsed);
        }
      });
    }

    if (overlay) {
      overlay.addEventListener('click', () => {
        sidebar.classList.remove('sidebar--open');
        overlay.classList.remove('sidebar__overlay--visible');
      });
    }

    // Restore state
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved === 'true' && window.innerWidth > 768) {
      _collapsed = true;
      app.classList.add('app--collapsed');
    }

    // Bind nav items
    document.querySelectorAll('.nav-item[data-page]').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const page = item.dataset.page;
        App.navigate(page);
        // Close mobile sidebar
        if (window.innerWidth <= 768) {
          sidebar.classList.remove('sidebar--open');
          overlay.classList.remove('sidebar__overlay--visible');
        }
      });
    });

    // Handle window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth <= 768) {
        app.classList.remove('app--collapsed');
      } else if (_collapsed) {
        app.classList.add('app--collapsed');
      }
    });
  }

  function setActive(pageName) {
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.toggle('nav-item--active', item.dataset.page === pageName);
    });
  }

  return { init, setActive };
})();
