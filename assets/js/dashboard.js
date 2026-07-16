/* ============================================
   dashboard.js â€” Dashboard with CSV-driven stats
   ============================================ */

App.registerPage('dashboard', () => {
  const members = CSVImport.getData('members');
  const fellows = CSVImport.getData('fellows');
  const meetings = CSVImport.getData('meetings');
  const faculty = CSVImport.getData('faculty');
  const users = Auth.getUsers ? Auth.getUsers() : [];
  const currentUser = Auth.currentUser ? Auth.currentUser() : null;
  const curriculumIds = TutorialCatalog.allSelectionIds ? TutorialCatalog.allSelectionIds() : { groups: [], tutorials: [] };

  function _topicLabel(id) {
    const label = TutorialCatalog.getGroupLabel(id);
    return label !== id ? label : id;
  }

  function _tutorialLabel(id) {
    const label = TutorialCatalog.getTutorialLabel(id);
    return label !== id ? label : id;
  }

  function _hasFullSelection(ids, allIds) {
    return Array.isArray(ids) && allIds.length > 0 && allIds.every(id => ids.includes(id));
  }

  function _renderBadges(ids, kind) {
    if (!Array.isArray(ids) || ids.length === 0) {
      return kind === 'group'
        ? '<span class="badge badge--neutral">No main topics selected</span>'
        : '<span class="badge badge--neutral">No tutorials selected</span>';
    }

    return ids.map(id => {
      const label = kind === 'group' ? _topicLabel(id) : _tutorialLabel(id);
      const badgeClass = kind === 'group' ? 'badge--secondary' : 'badge--primary';
      return `<span class="badge ${badgeClass}">${label}</span>`;
    }).join('');
  }

  const teachingProfiles = users.filter(u =>
    u && u.role !== 'admin' && (
      (Array.isArray(u.mainTopics) && u.mainTopics.length > 0) ||
      (Array.isArray(u.tutorials) && u.tutorials.length > 0)
    )
  );

  const topicCounts = {};
  const tutorialCounts = {};
  teachingProfiles.forEach(user => {
    (user.mainTopics || []).forEach(id => {
      topicCounts[id] = (topicCounts[id] || 0) + 1;
    });
    (user.tutorials || []).forEach(id => {
      tutorialCounts[id] = (tutorialCounts[id] || 0) + 1;
    });
  });

  const stats = {
    totalMembers: members.length || 0,
    activeFellows: fellows.filter(f => (f.OverallProgress || '0') < '100').length || 0,
    upcomingMeetings: meetings.filter(m => (m.Status || '').toLowerCase() === 'upcoming').length || 0,
    totalFaculty: faculty.length || 0
  };

  const totalFellows = fellows.length || 0;
  const avgProgress = totalFellows > 0
    ? Math.round(fellows.reduce((s, f) => s + (parseInt(f.OverallProgress) || 0), 0) / totalFellows)
    : 0;

  const hasAnyData = members.length > 0 || fellows.length > 0 || meetings.length > 0 || faculty.length > 0;
  const currentUserHasAllTopics = currentUser && currentUser.role === 'faculty' && _hasFullSelection(currentUser.mainTopics || [], curriculumIds.groups);
  const currentUserHasAllTutorials = currentUser && currentUser.role === 'faculty' && _hasFullSelection(currentUser.tutorials || [], curriculumIds.tutorials);

  return `
    <div class="page-content">
      <div class="page-header">
        <h1 class="page-header__title">Dashboard</h1>
        <p class="page-header__subtitle">Dalhousie-GCPS Psychiatry Programme Overview</p>
      </div>

      <!-- Stat Cards -->
      <div class="stats-grid stagger">
        <div class="stat-card">
          <div class="stat-card__icon stat-card__icon--gold">MB</div>
          <div class="stat-card__info">
            <div class="stat-card__label">Members</div>
            <div class="stat-card__value count-up">${stats.totalMembers}</div>
            <div class="stat-card__change">${stats.totalMembers > 0 ? 'From CSV import' : 'No data imported'}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-card__icon stat-card__icon--navy">FG</div>
          <div class="stat-card__info">
            <div class="stat-card__label">Active Fellows</div>
            <div class="stat-card__value count-up">${stats.activeFellows}</div>
            <div class="stat-card__change">${totalFellows > 0 ? `Avg. progress ${avgProgress}%` : 'No data imported'}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-card__icon stat-card__icon--blue">MT</div>
          <div class="stat-card__info">
            <div class="stat-card__label">Upcoming Meetings</div>
            <div class="stat-card__value count-up">${stats.upcomingMeetings}</div>
            <div class="stat-card__change">${meetings.length > 0 ? meetings.length + ' total recorded' : 'No data imported'}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-card__icon stat-card__icon--green">FC</div>
          <div class="stat-card__info">
            <div class="stat-card__label">Faculty</div>
            <div class="stat-card__value count-up">${stats.totalFaculty}</div>
            <div class="stat-card__change">${stats.totalFaculty > 0 ? 'From CSV import' : 'No data imported'}</div>
          </div>
        </div>
      </div>

      ${!hasAnyData ? `
        <div class="section-card" style="margin-bottom:var(--space-5);border:2px dashed var(--primary);background:var(--primary-bg);">
          <div class="section-card__body" style="text-align:center;padding:var(--space-8);">
            <div style="font-size:2.5rem;margin-bottom:var(--space-3);">NO DATA</div>
            <h3 style="margin-bottom:var(--space-2);">No Data Imported Yet</h3>
            <p style="color:var(--text-secondary);margin-bottom:var(--space-4);">Upload CSV files below to populate the dashboard with your real data.</p>
          </div>
        </div>
      ` : ''}

      ${currentUser ? `
        <div class="section-card" style="margin-bottom:var(--space-5);">
          <div class="section-card__header">
            <span class="section-card__title">My Teaching Profile</span>
            <span class="badge badge--accent">${currentUser.role === 'admin' ? 'Administrator' : 'Faculty'}</span>
          </div>
          <div class="section-card__body">
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:var(--space-4);margin-bottom:var(--space-4);">
              <div class="card" style="padding:var(--space-4);">
                <div style="font-size:0.72rem;text-transform:uppercase;letter-spacing:0.08em;color:var(--text-muted);margin-bottom:0.3rem;">Account</div>
                <div style="font-weight:700;margin-bottom:0.25rem;">${currentUser.name || currentUser.username}</div>
                <div style="font-size:0.82rem;color:var(--text-secondary);">${currentUser.email || currentUser.username}</div>
              </div>
              <div class="card" style="padding:var(--space-4);">
                <div style="font-size:0.72rem;text-transform:uppercase;letter-spacing:0.08em;color:var(--text-muted);margin-bottom:0.3rem;">Institution</div>
                <div style="font-weight:700;margin-bottom:0.25rem;">${currentUser.institution || 'Not provided'}</div>
                <div style="font-size:0.82rem;color:var(--text-secondary);">${currentUser.contactNumber || 'No contact number saved'}</div>
              </div>
            </div>
            <div style="margin-bottom:var(--space-3);">
              <div style="font-size:0.78rem;font-weight:700;color:var(--primary-dark);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:0.5rem;">Main Topics</div>
              <div style="display:flex;flex-wrap:wrap;gap:var(--space-2);">
                ${currentUserHasAllTopics
                  ? '<span class="badge badge--success">All main topics active</span>'
                  : _renderBadges(currentUser.mainTopics || [], 'group')}
              </div>
            </div>
            <div>
              <div style="font-size:0.78rem;font-weight:700;color:var(--primary-dark);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:0.5rem;">Tutorials</div>
              <div style="display:flex;flex-wrap:wrap;gap:var(--space-2);">
                ${currentUserHasAllTutorials
                  ? '<span class="badge badge--success">All tutorials active</span>'
                  : _renderBadges(currentUser.tutorials || [], 'tutorial')}
              </div>
            </div>
          </div>
        </div>
      ` : ''}

      ${teachingProfiles.length > 0 ? `
        <div class="section-card" style="margin-bottom:var(--space-5);">
          <div class="section-card__header">
            <span class="section-card__title">Faculty Tutorial Selections</span>
            <span class="badge badge--info">${teachingProfiles.length} profiles</span>
          </div>
          <div class="section-card__body">
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:var(--space-4);">
              ${teachingProfiles.map(user => `
                <div class="card" style="padding:var(--space-4);border-left:4px solid var(--secondary);">
                  <div style="font-weight:700;margin-bottom:0.25rem;">${user.name || user.username}</div>
                  <div style="font-size:0.8rem;color:var(--text-secondary);margin-bottom:0.75rem;">${user.institution || 'Institution not set'}</div>
                  <div style="display:flex;flex-wrap:wrap;gap:0.4rem;margin-bottom:0.75rem;">
                    ${(user.mainTopics || []).slice(0, 3).map(id => `<span class="badge badge--secondary">${TutorialCatalog.getGroupLabel(id)}</span>`).join('')}
                  </div>
                  <div style="display:flex;flex-wrap:wrap;gap:0.4rem;">
                    ${(user.tutorials || []).slice(0, 4).map(id => `<span class="badge badge--primary">${TutorialCatalog.getTutorialLabel(id)}</span>`).join('')}
                    ${(user.tutorials || []).length > 4 ? `<span class="badge badge--neutral">+${(user.tutorials || []).length - 4} more</span>` : ''}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      ` : ''}

      ${(Object.keys(topicCounts).length || Object.keys(tutorialCounts).length) ? `
        <div class="section-card" style="margin-bottom:var(--space-5);">
          <div class="section-card__header"><span class="section-card__title">Selection Summary</span></div>
          <div class="section-card__body">
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:var(--space-4);">
              <div>
                <div style="font-size:0.78rem;font-weight:700;color:var(--primary-dark);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:0.5rem;">Main Topics Across Faculty</div>
                <div style="display:flex;flex-wrap:wrap;gap:var(--space-2);">
                  ${Object.keys(topicCounts).length
                    ? Object.entries(topicCounts).map(([id, count]) => `<span class="badge badge--secondary">${TutorialCatalog.getGroupLabel(id)} (${count})</span>`).join('')
                    : '<span class="badge badge--neutral">No topic selections</span>'}
                </div>
              </div>
              <div>
                <div style="font-size:0.78rem;font-weight:700;color:var(--primary-dark);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:0.5rem;">Tutorials Across Faculty</div>
                <div style="display:flex;flex-wrap:wrap;gap:var(--space-2);">
                  ${Object.keys(tutorialCounts).length
                    ? Object.entries(tutorialCounts).map(([id, count]) => `<span class="badge badge--primary">${TutorialCatalog.getTutorialLabel(id)} (${count})</span>`).join('')
                    : '<span class="badge badge--neutral">No tutorial selections</span>'}
                </div>
              </div>
            </div>
          </div>
        </div>
      ` : ''}

      <!-- Quick Actions -->
      <div class="section-card" style="margin-bottom:var(--space-5);">
        <div class="section-card__header"><span class="section-card__title">Quick Actions</span></div>
        <div class="section-card__body">
          <div class="quick-actions">
            <a class="quick-action" data-page="membership" href="#"><div class="quick-action__icon">M</div><span class="quick-action__label">Membership Curriculum</span></a>
            <a class="quick-action" data-page="fellowship" href="#"><div class="quick-action__icon">F</div><span class="quick-action__label">Fellowship Curriculum</span></a>
            <a class="quick-action" data-page="tracker" href="#"><div class="quick-action__icon">T</div><span class="quick-action__label">Progress Tracker</span></a>
            <a class="quick-action" data-page="meetings" href="#"><div class="quick-action__icon">M</div><span class="quick-action__label">Meetings</span></a>
            <a class="quick-action" data-page="faculty" href="#"><div class="quick-action__icon">D</div><span class="quick-action__label">Faculty Directory</span></a>
            <a class="quick-action" data-page="resources" href="#"><div class="quick-action__icon">R</div><span class="quick-action__label">Resources</span></a>
          </div>
        </div>
      </div>

      <!-- CSV Import Section -->
      <div class="section-card" style="margin-bottom:var(--space-5);">
        <div class="section-card__header">
          <span class="section-card__title">Import Data via CSV</span>
          <span class="badge badge--info">Templates available</span>
        </div>
        <div class="section-card__body">
          <p style="font-size:0.82rem;color:var(--text-muted);margin-bottom:var(--space-4);">
            Download the template CSV for each data type, fill in your records, and upload below. Data persists in your browser.
          </p>
          <div id="csv-import-members"></div>
          <div id="csv-import-fellows"></div>
          <div id="csv-import-faculty"></div>
          <div id="csv-import-meetings"></div>
          <div id="csv-import-minutes"></div>
        </div>
      </div>

      ${members.length > 0 ? `
        <div class="section-card" style="margin-bottom:var(--space-5);">
          <div class="section-card__header"><span class="section-card__title">Recent Members</span><span class="badge badge--primary">${members.length} total</span></div>
          <div class="section-card__body">
            <table class="data-table">
              <thead><tr><th>Name</th><th>Role</th><th>Department</th><th>Status</th><th>Joined</th></tr></thead>
              <tbody>
                ${members.slice(-5).reverse().map(m => `
                  <tr>
                    <td class="cell--name">${m.Name || ''}</td>
                    <td>${m.Role || ''}</td>
                    <td>${m.Department || ''}</td>
                    <td><span class="badge badge--${(m.Status||'').toLowerCase()==='active'?'success':'neutral'}">${m.Status || ''}</span></td>
                    <td class="cell--muted">${App.formatDate(m.JoinDate)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      ` : ''}

      ${meetings.length > 0 ? `
        <div class="section-card">
          <div class="section-card__header"><span class="section-card__title">Upcoming Meetings</span><span class="badge badge--info">${stats.upcomingMeetings} upcoming</span></div>
          <div class="section-card__body">
            <ul class="activity-list">
              ${meetings.filter(m => (m.Status || '').toLowerCase() === 'upcoming').slice(0, 5).map(m => `
                <li class="activity-item">
                  <span class="activity-item__dot activity-item__dot--primary"></span>
                  <div class="activity-item__content">
                    <div class="activity-item__text"><strong>${m.Title || ''}</strong> â€” ${m.Location || ''}</div>
                    <div class="activity-item__time">${App.formatDate(m.Date)} Â· ${m.Time || ''}</div>
                  </div>
                </li>
              `).join('')}
              ${stats.upcomingMeetings === 0 ? '<li class="activity-item"><div class="activity-item__text" style="color:var(--text-muted);">No upcoming meetings</div></li>' : ''}
            </ul>
          </div>
        </div>
      ` : ''}
    </div>
  `;
}, () => {
  // Quick action links
  document.querySelectorAll('.quick-action[data-page]').forEach(el => {
    el.addEventListener('click', (e) => { e.preventDefault(); App.navigate(el.dataset.page); });
  });

  // Render CSV upload UIs
  CSVImport.renderUploadUI('csv-import-members', 'members', () => App.navigate('dashboard'));
  CSVImport.renderUploadUI('csv-import-fellows', 'fellows', () => App.navigate('dashboard'));
  CSVImport.renderUploadUI('csv-import-faculty', 'faculty', () => App.navigate('dashboard'));
  CSVImport.renderUploadUI('csv-import-meetings', 'meetings', () => App.navigate('dashboard'));
  CSVImport.renderUploadUI('csv-import-minutes', 'minutes', () => App.navigate('dashboard'));
});
