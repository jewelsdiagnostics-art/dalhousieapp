/* ============================================
   Faculty Directory — CSV import + manual entry
   ============================================ */

const FacultyPage = (() => {
  const fields = [
    { key:'Name', label:'Full Name', type:'text', placeholder:'Prof. Samuel Owusu' },
    { key:'Title', label:'Title / Role', type:'text', placeholder:'Programme Director' },
    { key:'Department', label:'Department', type:'text', placeholder:'General Psychiatry' },
    { key:'Email', label:'Email', type:'email', placeholder:'s.owusu@dal.ca' },
    { key:'Phone', label:'Phone', type:'text', placeholder:'+233-50-123-4567' },
    { key:'Speciality', label:'Speciality', type:'text', placeholder:'Mood Disorders' },
    { key:'Location', label:'Location', type:'text', placeholder:'Accra' },
    { key:'Fellows', label:'Fellows Supervised', type:'number', placeholder:'4' }
  ];

  /* ---- Called from onclick ---- */
  function saveFaculty() {
    const newEntry = {};
    fields.forEach(f => {
      const el = document.getElementById('fac-'+f.key);
      newEntry[f.key] = el ? el.value.trim() : '';
    });

    if (!newEntry.Name) {
      Notifications.toast('Validation', 'Name is required', 'warning');
      return;
    }

    const existing = CSVImport.getData('faculty');
    const editIdxEl = document.getElementById('fac-edit-idx');
    const editIdx = editIdxEl ? editIdxEl.value : '';

    if (editIdx !== '') {
      existing[parseInt(editIdx)] = newEntry;
      Notifications.toast('Updated', `${newEntry.Name} updated`, 'success');
    } else {
      existing.push(newEntry);
      Notifications.toast('Added', `${newEntry.Name} added to faculty`, 'success');
    }

    CSVImport.importData('faculty', existing);
    App.navigate('faculty');
  }

  function cancelForm() {
    const form = document.getElementById('faculty-form-card');
    if (form) form.style.display = 'none';
  }

  function showAddForm() {
    const form = document.getElementById('faculty-form-card');
    const title = document.getElementById('faculty-form-title');
    const editIdx = document.getElementById('fac-edit-idx');
    if (form) form.style.display = '';
    if (title) title.textContent = 'Add Faculty Member';
    if (editIdx) editIdx.value = '';
    fields.forEach(f => { const el = document.getElementById('fac-'+f.key); if (el) el.value = ''; });
    if (form) form.scrollIntoView({ behavior:'smooth' });
  }

  function editFaculty(idx) {
    const existing = CSVImport.getData('faculty');
    const entry = existing[idx];
    if (!entry) return;

    const form = document.getElementById('faculty-form-card');
    const title = document.getElementById('faculty-form-title');
    const editIdx = document.getElementById('fac-edit-idx');
    if (form) form.style.display = '';
    if (title) title.textContent = `Edit: ${entry.Name}`;
    if (editIdx) editIdx.value = idx;
    fields.forEach(f => {
      const el = document.getElementById('fac-'+f.key);
      if (el) el.value = entry[f.key] || '';
    });
    if (form) form.scrollIntoView({ behavior:'smooth' });
  }

  function deleteFaculty(idx) {
    const existing = CSVImport.getData('faculty');
    const name = existing[idx] ? existing[idx].Name : 'this member';
    if (confirm(`Delete ${name} from faculty directory?`)) {
      existing.splice(idx, 1);
      CSVImport.importData('faculty', existing);
      Notifications.toast('Deleted', `${name} removed`, 'info');
      App.navigate('faculty');
    }
  }

  /* ---- Render ---- */
  function render() {
    const faculty = CSVImport.getData('faculty');

    return `
      <div class="page-content">
        <div class="page-header" style="display:flex;align-items:center;justify-content:space-between;">
          <div>
            <h1 class="page-header__title">Faculty Directory</h1>
            <p class="page-header__subtitle">Programme faculty, supervisors, and mentors</p>
          </div>
          <button class="btn btn--primary" onclick="FacultyPage.showAddForm()">+ Add Faculty</button>
        </div>

        <!-- Manual entry form -->
        <div class="section-card" id="faculty-form-card" style="display:none;margin-bottom:var(--space-5);border:2px solid var(--primary);overflow:visible;">
          <div class="section-card__header">
            <span class="section-card__title" id="faculty-form-title">Add Faculty Member</span>
            <button class="btn btn--ghost btn--sm" onclick="FacultyPage.cancelForm()">✕ Cancel</button>
          </div>
          <div class="section-card__body">
            <input type="hidden" id="fac-edit-idx" value="">
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:var(--space-4);">
              ${fields.map(f => `
                <div class="form-group">
                  <label class="form-label">${f.label}</label>
                  <input type="${f.type}" class="input" id="fac-${f.key}" placeholder="${f.placeholder}">
                </div>
              `).join('')}
            </div>
            <div style="margin-top:var(--space-4);display:flex;gap:var(--space-2);justify-content:flex-end;">
              <button class="btn btn--primary" onclick="FacultyPage.saveFaculty()">💾 Save Faculty</button>
            </div>
          </div>
        </div>

        <div id="csv-upload-faculty-page"></div>

        ${faculty.length === 0 ? `
          <div class="empty-state">
            <div class="empty-state__icon">👨‍🏫</div>
            <div class="empty-state__title">No faculty data yet</div>
            <p style="color:var(--text-muted);">Upload a CSV file or click "+ Add Faculty" to enter manually.</p>
          </div>
        ` : `
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:var(--space-4);" class="stagger" id="faculty-grid">
            ${faculty.map((f, idx) => `
              <div class="card fac-card" data-idx="${idx}">
                <div style="display:flex;align-items:flex-start;gap:var(--space-4);">
                  <div style="width:56px;height:56px;border-radius:var(--radius-xl);background:linear-gradient(135deg,var(--secondary-light),var(--secondary));display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:1.3rem;flex-shrink:0;">
                    ${(f.Name||'').split(' ').map(n=>n[0]||'').join('').slice(0,3)}
                  </div>
                  <div style="flex:1;min-width:0;">
                    <h3 style="font-size:1rem;margin-bottom:2px;">${f.Name||''}</h3>
                    <div style="font-size:0.8rem;color:var(--primary);font-weight:500;">${f.Title||''}</div>
                    <div style="font-size:0.82rem;color:var(--text-secondary);margin-top:2px;">${f.Department||''}</div>
                  </div>
                </div>
                <div style="margin-top:var(--space-4);display:flex;flex-wrap:wrap;gap:var(--space-2);">
                  ${f.Location ? `<span class="badge badge--secondary">📍 ${f.Location}</span>` : ''}
                  ${f.Fellows ? `<span class="badge badge--info">🎓 ${f.Fellows} fellows</span>` : ''}
                  ${f.Speciality ? `<span class="badge badge--accent">${f.Speciality}</span>` : ''}
                </div>
                ${f.Email || f.Phone ? `
                  <div style="margin-top:var(--space-2);font-size:0.78rem;color:var(--text-muted);">
                    ${f.Email ? `📧 ${f.Email}` : ''}${f.Email && f.Phone ? ' · ' : ''}${f.Phone ? `📞 ${f.Phone}` : ''}
                  </div>
                ` : ''}
                <div style="margin-top:var(--space-3);display:flex;gap:var(--space-2);">
                  <button class="btn btn--outline btn--sm" onclick="FacultyPage.editFaculty(${idx})">✏️ Edit</button>
                  <button class="btn btn--ghost btn--sm" onclick="FacultyPage.deleteFaculty(${idx})" style="color:var(--error);">🗑️</button>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `;
  }

  return { render, saveFaculty, cancelForm, showAddForm, editFaculty, deleteFaculty };
})();

App.registerPage('faculty', () => FacultyPage.render(), () => {
  CSVImport.renderUploadUI('csv-upload-faculty-page', 'faculty', () => App.navigate('faculty'));
});
