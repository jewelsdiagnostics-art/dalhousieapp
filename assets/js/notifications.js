/* ============================================
   notifications.js — Toast messages + notification panel
   ============================================ */

const Notifications = (() => {
  let _notifications = [];

  function init() {
    // Create toast container if not exists
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    // Notification bell toggle
    const btn = document.getElementById('btn-notifications');
    const panel = document.getElementById('notif-panel');
    if (btn && panel) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        panel.classList.toggle('notif-panel--open');
        if (panel.classList.contains('notif-panel--open')) {
          _markAllRead();
        }
      });
    }

    // Load demo notifications
    _notifications = [
      { id: 1, text: 'New membership application from Dr. Mensah', time: '2026-07-08T09:30:00', unread: true, icon: '👤', color: 'info' },
      { id: 2, text: 'Meeting minutes uploaded for July 5th session', time: '2026-07-07T16:45:00', unread: true, icon: '📄', color: 'accent' },
      { id: 3, text: 'Fellowship module "Child Psychiatry" updated', time: '2026-07-06T11:20:00', unread: false, icon: '📘', color: 'primary' },
      { id: 4, text: 'Faculty review due for Dr. Adjei by July 15', time: '2026-07-05T08:00:00', unread: false, icon: '⏰', color: 'warning' }
    ];
    _renderPanel();
    _updateBadge();
  }

  /* Toast */
  function toast(title, message, type = 'info', duration = 4000) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    const toastEl = document.createElement('div');
    toastEl.className = `toast toast--${type}`;
    toastEl.innerHTML = `
      <span class="toast__icon">${icons[type] || icons.info}</span>
      <div class="toast__body">
        <div class="toast__title">${title}</div>
        ${message ? `<div class="toast__msg">${message}</div>` : ''}
      </div>
      <button class="toast__close">&times;</button>
    `;

    toastEl.querySelector('.toast__close').addEventListener('click', () => _removeToast(toastEl));
    container.appendChild(toastEl);

    if (duration > 0) {
      setTimeout(() => _removeToast(toastEl), duration);
    }
  }

  function _removeToast(el) {
    el.classList.add('toast--removing');
    setTimeout(() => el.remove(), 300);
  }

  /* Notification panel */
  function _renderPanel() {
    const list = document.getElementById('notif-list');
    if (!list) return;

    if (_notifications.length === 0) {
      list.innerHTML = '<div class="empty-state" style="padding:2rem;"><div class="empty-state__title">No notifications</div></div>';
      return;
    }

    list.innerHTML = _notifications.slice(0, 10).map(n => `
      <div class="notif-item ${n.unread ? 'notif-item--unread' : ''}" data-id="${n.id}">
        <div class="notif-item__icon" style="background:var(--${n.color}-bg); color:var(--${n.color});">${n.icon}</div>
        <div class="notif-item__content">
          <div class="notif-item__text">${n.text}</div>
          <div class="notif-item__time">${App.timeAgo(n.time)}</div>
        </div>
      </div>
    `).join('');
  }

  function _markAllRead() {
    _notifications.forEach(n => n.unread = false);
    _updateBadge();
    _renderPanel();
  }

  function _updateBadge() {
    const dot = document.getElementById('notif-dot');
    const badge = document.getElementById('notif-badge');
    const count = _notifications.filter(n => n.unread).length;

    if (dot) dot.style.display = count > 0 ? 'block' : 'none';
    if (badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
  }

  /* Add notification programmatically */
  function add(text, icon = '📌', color = 'info') {
    _notifications.unshift({
      id: Date.now(),
      text,
      time: new Date().toISOString(),
      unread: true,
      icon,
      color
    });
    _renderPanel();
    _updateBadge();
  }

  return { init, toast, add };
})();
