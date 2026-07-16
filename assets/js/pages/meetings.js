/* ============================================
   Meetings — Schedule + Full Minutes
   ============================================ */

App.registerPage('meetings', () => {
  const meetings = CSVImport.getData('meetings');
  const minutes = CSVImport.getData('minutes');
  const upcoming = meetings.filter(m => (m.Status || '').toLowerCase() === 'upcoming');
  const completed = meetings.filter(m => (m.Status || '').toLowerCase() === 'completed');

  function _findMinutes(meetingTitle, meetingDate) {
    if (!minutes.length) return null;
    return minutes.find(m =>
      (m.MeetingTitle || '').toLowerCase() === (meetingTitle || '').toLowerCase() &&
      (m.Date || '') === (meetingDate || '')
    ) || null;
  }

  return `
    <div class="page-content">
      <div class="page-header">
        <h1 class="page-header__title">Meetings & Minutes</h1>
        <p class="page-header__subtitle">Schedule meetings and record official minutes per GCPS/Dalhousie standards</p>
      </div>

      ${upcoming.length === 0 && completed.length === 0 && minutes.length === 0 ? `
        <div class="section-card" style="margin-bottom:var(--space-5);border:2px dashed var(--primary);background:var(--primary-bg);">
          <div class="section-card__body" style="text-align:center;padding:var(--space-8);">
            <div style="font-size:2.5rem;margin-bottom:var(--space-3);">📋</div>
            <h3 style="margin-bottom:var(--space-2);">No Meetings or Minutes Yet</h3>
            <p style="color:var(--text-secondary);margin-bottom:var(--space-4);">Upload CSV files below to populate meeting schedules and minutes.</p>
          </div>
        </div>
      ` : ''}

      <!-- Meeting Schedule -->
      ${meetings.length > 0 ? `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-5);margin-bottom:var(--space-5);" class="mtg-grid">
          <div class="section-card">
            <div class="section-card__header"><span class="section-card__title">🔜 Upcoming Meetings</span><span class="badge badge--info">${upcoming.length}</span></div>
            <div class="section-card__body">
              ${upcoming.length === 0 ? '<div class="empty-state" style="padding:2rem;"><div class="empty-state__title">No upcoming meetings</div></div>' : `
                <ul class="timeline" style="padding-left:var(--space-6);">
                  ${upcoming.map(m => `
                    <li class="timeline-item timeline-item--upcoming">
                      <div class="timeline-item__marker"></div>
                      <div class="timeline-item__card">
                        <div class="timeline-item__date">${App.formatDate(m.Date)} · ${m.Time||''}</div>
                        <div class="timeline-item__title">${m.Title||''}</div>
                        <div class="timeline-item__desc">📍 ${m.Location||''} · 👥 ${m.Attendees||'0'} attendees</div>
                        <div class="timeline-item__tags"><span class="badge badge--primary">${m.Type||'Meeting'}</span></div>
                      </div>
                    </li>
                  `).join('')}
                </ul>
              `}
            </div>
          </div>
          <div class="section-card">
            <div class="section-card__header"><span class="section-card__title">✅ Past Meetings</span><span class="badge badge--success">${completed.length}</span></div>
            <div class="section-card__body">
              ${completed.length === 0 ? '<div class="empty-state" style="padding:2rem;"><div class="empty-state__title">No past meetings</div></div>' : `
                <ul class="timeline" style="padding-left:var(--space-6);">
                  ${completed.map(m => {
                    const mRec = _findMinutes(m.Title, m.Date);
                    return `
                    <li class="timeline-item timeline-item--done">
                      <div class="timeline-item__marker"></div>
                      <div class="timeline-item__card" style="cursor:${mRec?'pointer':'default'};" data-mtg-title="${(m.Title||'').replace(/"/g,'&quot;')}" data-mtg-date="${m.Date||''}">
                        <div class="timeline-item__date">${App.formatDate(m.Date)} · ${m.Time||''}</div>
                        <div class="timeline-item__title">${m.Title||''}</div>
                        <div class="timeline-item__desc">📍 ${m.Location||''} · 👥 ${m.Attendees||'0'} attendees</div>
                        <div class="timeline-item__tags">
                          <span class="badge badge--accent">${m.Type||'Meeting'}</span>
                          ${mRec ? '<span class="badge badge--success">📄 Minutes Available</span>' : '<span class="badge badge--neutral">No minutes yet</span>'}
                        </div>
                      </div>
                    </li>
                  `}).join('')}
                </ul>
              `}
            </div>
          </div>
        </div>
      ` : ''}

      <!-- Full Minutes Display -->
      ${minutes.length > 0 ? `
        <div class="section-card" style="margin-bottom:var(--space-5);">
          <div class="section-card__header"><span class="section-card__title">📄 Recorded Meeting Minutes</span><span class="badge badge--accent">${minutes.length} on file</span></div>
          <div class="section-card__body" style="padding:0;">
            ${minutes.map((m, i) => `
              <div class="minutes-card" id="minutes-card-${i}" style="border-bottom:1px solid var(--border);${i===minutes.length-1?'border-bottom:none;':''}">
                <div class="minutes-card__summary" style="padding:var(--space-4) var(--space-5);cursor:pointer;display:flex;justify-content:space-between;align-items:center;">
                  <div>
                    <div style="font-weight:600;font-size:0.9rem;">${m.MeetingTitle||''}</div>
                    <div style="font-size:0.78rem;color:var(--text-muted);margin-top:2px;">
                      ${App.formatDate(m.Date)} · Chair: ${m.Chair||''}${m.ChairTitle?', '+m.ChairTitle:''} · Scribe: ${m.Scribe||''}
                    </div>
                  </div>
                  <span style="font-size:0.8rem;color:var(--primary);">View Minutes ▾</span>
                </div>
                <div class="minutes-card__detail" style="display:none;padding:0 var(--space-5) var(--space-5);">
                  ${_renderFullMinutes(m)}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Import Section -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-5);" class="mtg-grid">
        <div id="csv-upload-meetings-page"></div>
        <div id="csv-upload-minutes-page"></div>
      </div>
    </div>
  `;
}, () => {
  /* ---- Upload UIs ---- */
  CSVImport.renderUploadUI('csv-upload-meetings-page', 'meetings', () => App.navigate('meetings'));
  CSVImport.renderUploadUI('csv-upload-minutes-page', 'minutes', () => App.navigate('meetings'));

  /* ---- Minutes accordion toggle ---- */
  document.querySelectorAll('.minutes-card__summary').forEach(summary => {
    summary.addEventListener('click', function() {
      const detail = this.parentElement.querySelector('.minutes-card__detail');
      const arrow = this.querySelector('span:last-child');
      if (detail.style.display === 'none') {
        detail.style.display = '';
        arrow.textContent = 'Hide ▴';
      } else {
        detail.style.display = 'none';
        arrow.textContent = 'View Minutes ▾';
      }
    });
  });

  /* ---- Click completed meeting to jump to its minutes ---- */
  document.querySelectorAll('.timeline-item__card[data-mtg-title]').forEach(card => {
    card.addEventListener('click', function(e) {
      if (e.target.closest('button')) return;
      const title = this.dataset.mtgTitle;
      const date = this.dataset.mtgDate;
      // Find matching minutes entry and scroll to it
      const minutes = CSVImport.getData('minutes');
      const idx = minutes.findIndex(m =>
        (m.MeetingTitle||'') === title && (m.Date||'') === date
      );
      if (idx >= 0) {
        const target = document.getElementById('minutes-card-' + idx);
        if (target) {
          target.scrollIntoView({ behavior:'smooth', block:'center' });
          const detail = target.querySelector('.minutes-card__detail');
          if (detail && detail.style.display === 'none') {
            detail.style.display = '';
            const summary = target.querySelector('.minutes-card__summary span:last-child');
            if (summary) summary.textContent = 'Hide ▴';
          }
          target.style.boxShadow = '0 0 0 3px var(--primary)';
          setTimeout(() => { target.style.boxShadow = ''; }, 2000);
        }
      }
    });
  });
});

/* ---- Render full minutes in official format ---- */
function _renderFullMinutes(m) {
  const attendPresent = (m.AttendeesPresent||'').split(';').filter(s=>s.trim());
  const attendAbsent = (m.AttendeesAbsent||'').split(';').filter(s=>s.trim());
  const agenda = (m.Agenda||'').split(';').filter(s=>s.trim());
  const proceedings = (m.Proceedings||'').split(';').filter(s=>s.trim());
  const actionItems = (m.ActionItems||'').split(';').filter(s=>s.trim());

  return `
    <div class="minutes-document">
      <!-- Title -->
      <div style="text-align:center;margin-bottom:var(--space-5);padding-bottom:var(--space-4);border-bottom:2px solid var(--border);">
        <h2 style="font-size:1.2rem;margin-bottom:var(--space-1);">Minutes of Meeting</h2>
        <p style="font-size:0.82rem;color:var(--text-secondary);">${m.MeetingTitle||''}</p>
      </div>

      <!-- Meta -->
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:var(--space-4);margin-bottom:var(--space-5);font-size:0.85rem;">
        <div><strong style="color:var(--text-muted);">Date:</strong><br>${App.formatDate(m.Date)}</div>
        <div><strong style="color:var(--text-muted);">Chair:</strong><br>${m.Chair||''}${m.ChairTitle?', '+m.ChairTitle:''}${m.ChairInstitution?'<br><span style="font-size:0.75rem;color:var(--text-muted);">'+m.ChairInstitution+'</span>':''}</div>
        <div><strong style="color:var(--text-muted);">Scribe:</strong><br>${m.Scribe||''}${m.ScribeTitle?', '+m.ScribeTitle:''}</div>
      </div>

      <!-- Attendance -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-5);margin-bottom:var(--space-5);">
        <div>
          <h4 style="color:var(--accent);font-size:0.8rem;text-transform:uppercase;margin-bottom:var(--space-2);">Present</h4>
          <ul style="padding-left:1.2rem;font-size:0.83rem;color:var(--text-secondary);line-height:1.8;">
            ${attendPresent.length > 0 ? attendPresent.map(a=>`<li>${a.trim()}</li>`).join('') : '<li style="color:var(--text-muted);">None recorded</li>'}
          </ul>
        </div>
        <div>
          <h4 style="color:var(--error);font-size:0.8rem;text-transform:uppercase;margin-bottom:var(--space-2);">Absent (with apologies)</h4>
          <ul style="padding-left:1.2rem;font-size:0.83rem;color:var(--text-secondary);line-height:1.8;">
            ${attendAbsent.length > 0 ? attendAbsent.map(a=>`<li>${a.trim()}</li>`).join('') : '<li style="color:var(--text-muted);">None recorded</li>'}
          </ul>
        </div>
      </div>

      <!-- Agenda -->
      <div style="margin-bottom:var(--space-5);">
        <h4 style="color:var(--secondary);font-size:0.8rem;text-transform:uppercase;margin-bottom:var(--space-2);">Agenda</h4>
        <ol style="padding-left:1.2rem;font-size:0.83rem;color:var(--text-secondary);line-height:1.9;">
          ${agenda.length > 0 ? agenda.map((a,i)=>`<li>${a.trim()}</li>`).join('') : '<li style="color:var(--text-muted);">No agenda recorded</li>'}
        </ol>
      </div>

      <!-- Proceedings -->
      <div style="margin-bottom:var(--space-5);">
        <h4 style="color:var(--secondary);font-size:0.8rem;text-transform:uppercase;margin-bottom:var(--space-2);">Proceedings</h4>
        ${proceedings.length > 0 ? proceedings.map((p,i) => `
          <div style="margin-bottom:var(--space-3);font-size:0.83rem;color:var(--text-primary);line-height:1.7;padding-left:var(--space-2);border-left:2px solid var(--border-light);">
            ${p.trim()}
          </div>
        `).join('') : '<p style="color:var(--text-muted);font-size:0.83rem;">No proceedings recorded</p>'}
      </div>

      <!-- Action Items -->
      <div style="margin-bottom:var(--space-5);background:var(--warning-bg);border:1px solid rgba(217,119,6,0.15);border-radius:var(--radius-lg);padding:var(--space-4);">
        <h4 style="color:var(--warning);font-size:0.8rem;text-transform:uppercase;margin-bottom:var(--space-2);">Action Items</h4>
        <ul style="padding-left:1.2rem;font-size:0.83rem;color:var(--text-secondary);line-height:1.9;">
          ${actionItems.length > 0 ? actionItems.map(a=>`<li><strong>${a.trim()}</strong></li>`).join('') : '<li style="color:var(--text-muted);">No action items recorded</li>'}
        </ul>
      </div>

      <!-- Adjournment -->
      <div style="margin-bottom:var(--space-5);padding:var(--space-3);border-left:3px solid var(--primary);">
        <h4 style="color:var(--text-muted);font-size:0.75rem;text-transform:uppercase;margin-bottom:var(--space-1);">Adjournment</h4>
        <p style="font-size:0.83rem;color:var(--text-secondary);margin-bottom:0;">${m.AdjournmentNotes||'No adjournment notes recorded'}</p>
      </div>

      <!-- Signature Block -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-5);padding-top:var(--space-4);border-top:1px solid var(--border);font-size:0.8rem;color:var(--text-muted);">
        <div>
          <strong>Minutes Prepared By:</strong><br>
          ${m.Scribe||'_______________'}${m.ScribeTitle?', '+m.ScribeTitle:''}
        </div>
        <div>
          <strong>Chair:</strong><br>
          ${m.Chair||'_______________'}${m.ChairTitle?', '+m.ChairTitle:''}${m.ChairInstitution?'<br>'+m.ChairInstitution:''}
        </div>
      </div>
    </div>
  `;
}
