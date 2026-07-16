/* ============================================
   Resources page
   ============================================ */

App.registerPage('resources', () => {
  const resources = [
    { name: 'Programme Handbook 2026.pdf', type: 'pdf', size: '4.2 MB', category: 'Policy', uploaded: '2026-06-15', author: 'Prof. Owusu' },
    { name: 'Clinical Rotation Guidelines.docx', type: 'doc', size: '1.8 MB', category: 'Guidelines', uploaded: '2026-06-20', author: 'Dr. Darko' },
    { name: 'Assessment Rubric — OSCE 2026.xlsx', type: 'sheet', size: '890 KB', category: 'Assessment', uploaded: '2026-07-01', author: 'Dr. Adjei' },
    { name: 'Fellowship Application Template.docx', type: 'doc', size: '650 KB', category: 'Forms', uploaded: '2026-05-10', author: 'Admin' },
    { name: 'Research Ethics Guidelines.pdf', type: 'pdf', size: '2.3 MB', category: 'Policy', uploaded: '2026-04-28', author: 'Prof. Nkrumah' },
    { name: 'Monthly Report Template.xlsx', type: 'sheet', size: '420 KB', category: 'Forms', uploaded: '2026-06-30', author: 'Admin' },
    { name: 'Psychopharmacology Reference Guide.pdf', type: 'pdf', size: '6.7 MB', category: 'Reference', uploaded: '2026-07-05', author: 'Dr. Asare' },
    { name: 'Meeting Minutes — June 2026.docx', type: 'doc', size: '1.1 MB', category: 'Minutes', uploaded: '2026-06-28', author: 'Admin' }
  ];

  const categories = [...new Set(resources.map(r => r.category))];

  return `
    <div class="page-content">
      <div class="page-header" style="display:flex;align-items:center;justify-content:space-between;">
        <div>
          <h1 class="page-header__title">Resources & Documents</h1>
          <p class="page-header__subtitle">Access programme materials, templates, and reference documents</p>
        </div>
        <button class="btn btn--primary" id="btn-upload">📤 Upload File</button>
      </div>

      <div style="display:flex;gap:var(--space-2);margin-bottom:var(--space-5);flex-wrap:wrap;" id="cat-filters">
        <button class="btn btn--sm btn--secondary res-cat" data-cat="all">All</button>
        ${categories.map(c => `<button class="btn btn--sm btn--outline res-cat" data-cat="${c}">${c}</button>`).join('')}
      </div>

      <!-- Upload Zone -->
      <div class="upload-zone" id="upload-zone" style="margin-bottom:var(--space-6);">
        <div class="upload-zone__icon">📁</div>
        <div class="upload-zone__text">Drag & drop files here, or click to browse</div>
        <div class="upload-zone__hint">Supports PDF, DOCX, XLSX, PPTX up to 25MB</div>
        <div class="file-list" id="file-list"></div>
      </div>

      <div class="table-container">
        <div class="table-toolbar">
          <div class="table-toolbar__left">
            <span class="table-info" id="res-count">${resources.length} resources</span>
          </div>
          <div class="table-toolbar__right">
            <input type="text" class="input" id="res-search" placeholder="Search resources…" style="width:200px;">
          </div>
        </div>

        <table class="data-table" id="res-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Type</th>
              <th>Size</th>
              <th>Uploaded</th>
              <th>Author</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${resources.map(r => `
              <tr data-category="${r.category}">
                <td class="cell--name">
                  <span style="margin-right:6px;">${r.type === 'pdf' ? '📕' : r.type === 'doc' ? '📄' : '📊'}</span>
                  ${r.name}
                </td>
                <td><span class="badge badge--primary">${r.category}</span></td>
                <td class="cell--muted">${r.type.toUpperCase()}</td>
                <td class="cell--muted">${r.size}</td>
                <td class="cell--muted">${App.formatDate(r.uploaded)}</td>
                <td>${r.author}</td>
                <td>
                  <div class="table-actions">
                    <button class="table-icon-btn" title="Download">⬇️</button>
                    <button class="table-icon-btn" title="Share">🔗</button>
                    <button class="table-icon-btn" title="Delete">🗑️</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}, () => {
  // Category filter
  const rows = document.querySelectorAll('#res-table tbody tr');
  document.querySelectorAll('.res-cat').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.res-cat').forEach(b => {
        b.classList.remove('btn--secondary');
        b.classList.add('btn--outline');
      });
      btn.classList.remove('btn--outline');
      btn.classList.add('btn--secondary');

      const cat = btn.dataset.cat;
      let visible = 0;
      rows.forEach(row => {
        const match = cat === 'all' || row.dataset.category === cat;
        row.style.display = match ? '' : 'none';
        if (match) visible++;
      });
      document.getElementById('res-count').textContent = `${visible} resources`;
    });
  });

  // Search
  document.getElementById('res-search').addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    let visible = 0;
    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      const match = text.includes(q);
      row.style.display = match ? '' : 'none';
      if (match) visible++;
    });
    document.getElementById('res-count').textContent = `${visible} resources`;
  });

  // Upload
  document.getElementById('btn-upload').addEventListener('click', () => {
    Notifications.toast('Upload', 'Select files to upload…', 'info');
  });
});
