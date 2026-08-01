/* ============================================
   Administrator restore and audit history
   ============================================ */

const RestorePage = (() => {
  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function recordName(record) {
    return record.Name || record.name || record.Title || record.MeetingTitle || record.ID || record._id;
  }

  function formatTimestamp(value) {
    if (!value) return 'Pending server timestamp';
    const milliseconds = value.seconds ? value.seconds * 1000 : Date.parse(value);
    if (!Number.isFinite(milliseconds)) return 'Recorded';
    return new Date(milliseconds).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });
  }

  function auditSummary(item) {
    const source = item.after || item.before || {};
    return recordName(source) || `${item.entityType} record`;
  }

  async function restoreRecord(type, id, revision) {
    try {
      await SharedData.restore(type, id, Number(revision));
      Notifications.toast('Record Restored', 'The record is active again for all users.', 'success');
      App.navigate('restore');
    } catch (error) {
      Notifications.toast('Restore Failed', error.message || 'The record could not be restored.', 'error');
    }
  }

  function render() {
    if (!Auth.isAdmin || !Auth.isAdmin()) {
      return '<div class="page-content"><div class="empty-state"><div class="empty-state__title">Administrator access required</div></div></div>';
    }

    const removed = SharedData.getAllDeleted();
    const history = SharedData.getAudit();
    return `
      <div class="page-content restore-page">
        <div class="page-header">
          <span class="faculty-directory__eyebrow">Data protection</span>
          <h1 class="page-header__title">Restore &amp; Audit</h1>
          <p class="page-header__subtitle">Recover soft-deleted records and review immutable change history</p>
        </div>

        <div class="stats-grid" style="margin-bottom:var(--space-6);">
          <div class="stat-card"><div class="stat-card__info"><div class="stat-card__label">Restorable Records</div><div class="stat-card__value">${removed.length}</div></div></div>
          <div class="stat-card"><div class="stat-card__info"><div class="stat-card__label">Recent Audit Events</div><div class="stat-card__value">${history.length}</div></div></div>
          <div class="stat-card"><div class="stat-card__info"><div class="stat-card__label">Storage Mode</div><div class="stat-card__value" style="font-size:1rem;">${SharedData.isCloud() ? 'Firestore' : 'Local fallback'}</div></div></div>
        </div>

        <section class="section-card" style="margin-bottom:var(--space-6);">
          <div class="section-card__header"><span class="section-card__title">Cloud Recovery</span><span class="badge badge--success">Active</span></div>
          <div class="section-card__body">
            <p style="margin:0;color:var(--text-secondary);">Point-in-time recovery retains seven days of versions. Daily backups are retained for 14 days, and Sunday weekly backups are retained for 84 days. Audit history and administrator restoration remain available in this portal.</p>
          </div>
        </section>

        <section class="section-card" style="margin-bottom:var(--space-6);">
          <div class="section-card__header"><span class="section-card__title">Deleted Records</span><span class="badge badge--warning">Soft deletion</span></div>
          <div class="section-card__body" style="padding:0;">
            ${removed.length ? `
              <div class="table-container" style="border:0;box-shadow:none;border-radius:0;">
                <table class="data-table">
                  <thead><tr><th>Record</th><th>Collection</th><th>Revision</th><th>Deleted</th><th>Action</th></tr></thead>
                  <tbody>${removed.map(record => `
                    <tr>
                      <td class="cell--name">${escapeHtml(recordName(record))}</td>
                      <td><span class="badge badge--secondary">${escapeHtml(record._type)}</span></td>
                      <td>${record._revision || 0}</td>
                      <td class="cell--muted">${escapeHtml(formatTimestamp(record.deletedAt))}</td>
                      <td><button class="btn btn--primary btn--sm" type="button" onclick="RestorePage.restoreRecord('${escapeHtml(record._type)}','${escapeHtml(record._id)}',${Number(record._revision || 0)})">Restore</button></td>
                    </tr>
                  `).join('')}</tbody>
                </table>
              </div>
            ` : '<div class="empty-state"><div class="empty-state__title">No deleted records</div><p>Soft-deleted records will appear here.</p></div>'}
          </div>
        </section>

        <section class="section-card">
          <div class="section-card__header"><span class="section-card__title">Recent Audit History</span><span class="badge badge--success">Append-only</span></div>
          <div class="section-card__body restore-audit-list">
            ${history.length ? history.map(item => `
              <article class="restore-audit-item">
                <span class="restore-audit-item__action restore-audit-item__action--${escapeHtml(item.action)}">${escapeHtml(item.action)}</span>
                <div>
                  <strong>${escapeHtml(auditSummary(item))}</strong>
                  <p>${escapeHtml(item.entityType)} / revision ${Number(item.revision || 0)} / ${escapeHtml(item.actorName || item.actorId || 'Unknown user')}</p>
                </div>
                <time>${escapeHtml(formatTimestamp(item.timestamp))}</time>
              </article>
            `).join('') : '<div class="empty-state"><div class="empty-state__title">No audit events loaded</div><p>Events will appear after shared records are changed.</p></div>'}
          </div>
        </section>
      </div>
    `;
  }

  return { render, restoreRecord };
})();

App.registerPage('restore', () => RestorePage.render());
