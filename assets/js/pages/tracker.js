/* ============================================
   Progress Tracker — CSV-driven fellow data
   ============================================ */

App.registerPage('tracker', () => {
  const progressByFellow = new Map(
    CSVImport.getData('progress').map(item => [String(item.FellowId || item.ID || item.Name || ''), item])
  );
  const fellows = CSVImport.getData('fellows').map(fellow => ({
    ...fellow,
    ...(progressByFellow.get(String(fellow.ID || fellow.FellowId || fellow.Name || '')) || {})
  }));

  return `
    <div class="page-content">
      <div class="page-header" style="display:flex;align-items:center;justify-content:space-between;">
        <div>
          <h1 class="page-header__title">Progress Tracker</h1>
          <p class="page-header__subtitle">Monitor fellow progress across rotations, modules, and competencies</p>
        </div>
      </div>

      <div id="csv-upload-tracker"></div>

      ${fellows.length === 0 ? `
        <div class="empty-state">
          <div class="empty-state__icon">📊</div>
          <div class="empty-state__title">No fellow data imported</div>
          <p style="color:var(--text-muted);">Upload a CSV file above to populate the tracker.</p>
        </div>
      ` : `
        <div class="stats-grid stagger" style="margin-bottom:var(--space-5);">
          <div class="stat-card">
            <div class="stat-card__icon stat-card__icon--navy">🎓</div>
            <div class="stat-card__info"><div class="stat-card__label">Active Fellows</div><div class="stat-card__value">${fellows.length}</div></div>
          </div>
          <div class="stat-card">
            <div class="stat-card__icon stat-card__icon--gold">📊</div>
            <div class="stat-card__info"><div class="stat-card__label">Avg. Progress</div><div class="stat-card__value">${Math.round(fellows.reduce((s,f)=>s+(parseInt(f.OverallProgress)||0),0)/fellows.length)}%</div></div>
          </div>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead><tr><th>Fellow</th><th>Cohort</th><th>Rotation</th><th>Modules</th><th>Progress</th><th>Last Activity</th></tr></thead>
            <tbody>
              ${fellows.map(f => `
                <tr>
                  <td class="cell--name">${f.Name||''} <span class="cell--muted">(${f.ID||''})</span></td>
                  <td><span class="badge badge--secondary">${f.Cohort||''}</span></td>
                  <td>${f.Rotation||''}</td>
                  <td>${f.ModulesCompleted||'0'} / ${f.ModulesTotal||'0'}</td>
                  <td>
                    <div style="display:flex;align-items:center;gap:var(--space-2);">
                      <div style="flex:1;height:8px;background:var(--border-light);border-radius:4px;overflow:hidden;">
                        <div style="height:100%;width:${f.OverallProgress||0}%;background:linear-gradient(90deg,var(--primary),var(--accent));border-radius:4px;"></div>
                      </div>
                      <span style="font-weight:600;font-size:0.85rem;">${f.OverallProgress||0}%</span>
                    </div>
                  </td>
                  <td class="cell--muted">${App.formatDate(f.LastActivity)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `}
    </div>
  `;
}, () => {
  CSVImport.renderUploadUI('csv-upload-tracker', 'fellows', () => App.navigate('tracker'));
});
