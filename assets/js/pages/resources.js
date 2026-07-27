/* ============================================
   Resources page
   ============================================ */

const ProgrammeResources = [
  { name: 'Programme Handbook 2026.pdf', file: 'data/resources/programme-handbook-2026.pdf', type: 'pdf', category: 'Policy', uploaded: '2026-06-15', author: 'Prof. Owusu' },
  { name: 'Clinical Rotation Guidelines.docx', file: 'data/resources/clinical-rotation-guidelines.docx', type: 'doc', category: 'Guidelines', uploaded: '2026-06-20', author: 'Dr. Darko' },
  { name: 'Assessment Rubric - OSCE 2026.xlsx', file: 'data/resources/assessment-rubric-osce-2026.xlsx', type: 'sheet', category: 'Assessment', uploaded: '2026-07-01', author: 'Dr. Adjei' },
  { name: 'Fellowship Application Template.docx', file: 'data/resources/fellowship-application-template.docx', type: 'doc', category: 'Forms', uploaded: '2026-05-10', author: 'Admin' },
  { name: 'Research Ethics Guidelines.pdf', file: 'data/resources/research-ethics-guidelines.pdf', type: 'pdf', category: 'Policy', uploaded: '2026-04-28', author: 'Prof. Nkrumah' },
  { name: 'Monthly Report Template.xlsx', file: 'data/resources/monthly-report-template.xlsx', type: 'sheet', category: 'Forms', uploaded: '2026-06-30', author: 'Admin' },
  { name: 'Psychopharmacology Reference Guide.pdf', file: 'data/resources/psychopharmacology-reference-guide.pdf', type: 'pdf', category: 'Reference', uploaded: '2026-07-05', author: 'Dr. Asare' },
  { name: 'Meeting Minutes - June 2026.docx', file: 'data/resources/meeting-minutes-june-2026.docx', type: 'doc', category: 'Minutes', uploaded: '2026-06-28', author: 'Admin' }
];

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function resourceIcon(type) {
  if (type === 'pdf') return '📕';
  if (type === 'doc') return '📄';
  return '📊';
}

function resourceRow(resource) {
  return `
    <tr data-category="${resource.category}" data-resource-name="${resource.name.toLowerCase()}">
      <td class="cell--name">
        <span style="margin-right:6px;">${resourceIcon(resource.type)}</span>
        ${resource.name}
      </td>
      <td><span class="badge badge--primary">${resource.category}</span></td>
      <td class="cell--muted">${resource.type.toUpperCase()}</td>
      <td class="cell--muted">${resource.size || 'Ready'}</td>
      <td class="cell--muted">${App.formatDate(resource.uploaded)}</td>
      <td>${resource.author}</td>
      <td>
        <div class="table-actions">
          <a class="table-icon-btn" href="${resource.file}" download="${resource.name}" title="Download ${resource.name}" aria-label="Download ${resource.name}">⬇️</a>
          <button class="table-icon-btn resource-share" type="button" data-file="${resource.file}" data-name="${resource.name}" title="Share ${resource.name}" aria-label="Share ${resource.name}">🔗</button>
        </div>
      </td>
    </tr>
  `;
}

App.registerPage('resources', () => {
  const categories = [...new Set(ProgrammeResources.map(resource => resource.category))];

  return `
    <div class="page-content">
      <div class="page-header" style="display:flex;align-items:center;justify-content:space-between;gap:var(--space-4);flex-wrap:wrap;">
        <div>
          <h1 class="page-header__title">Resources & Documents</h1>
          <p class="page-header__subtitle">Access programme materials, templates, and reference documents</p>
        </div>
        <button class="btn btn--primary" id="btn-upload" type="button">📤 Add Local File</button>
      </div>

      <div style="display:flex;gap:var(--space-2);margin-bottom:var(--space-5);flex-wrap:wrap;" id="cat-filters">
        <button class="btn btn--sm btn--secondary res-cat" type="button" data-cat="all">All</button>
        ${categories.map(category => `<button class="btn btn--sm btn--outline res-cat" type="button" data-cat="${category}">${category}</button>`).join('')}
      </div>

      <div class="upload-zone" id="upload-zone" style="margin-bottom:var(--space-6);" role="button" tabindex="0">
        <div class="upload-zone__icon">📁</div>
        <div class="upload-zone__text">Drag and drop files here, or click to browse</div>
        <div class="upload-zone__hint">PDF, DOCX, XLSX and PPTX files up to 25 MB. Local additions last for this browser session.</div>
        <input id="resource-file-input" type="file" accept=".pdf,.docx,.xlsx,.pptx" multiple hidden>
        <div class="file-list" id="file-list"></div>
      </div>

      <div class="table-container">
        <div class="table-toolbar">
          <div class="table-toolbar__left">
            <span class="table-info" id="res-count">${ProgrammeResources.length} resources</span>
          </div>
          <div class="table-toolbar__right">
            <input type="search" class="input" id="res-search" placeholder="Search resources..." style="width:200px;">
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
          <tbody>${ProgrammeResources.map(resourceRow).join('')}</tbody>
        </table>
      </div>
    </div>
  `;
}, () => {
  const tableBody = document.querySelector('#res-table tbody');
  const searchInput = document.getElementById('res-search');
  const fileInput = document.getElementById('resource-file-input');
  const uploadZone = document.getElementById('upload-zone');
  let activeCategory = 'all';

  function applyFilters() {
    const query = searchInput.value.trim().toLowerCase();
    let visible = 0;

    tableBody.querySelectorAll('tr').forEach(row => {
      const categoryMatches = activeCategory === 'all' || row.dataset.category === activeCategory;
      const searchMatches = row.textContent.toLowerCase().includes(query);
      const show = categoryMatches && searchMatches;
      row.style.display = show ? '' : 'none';
      if (show) visible += 1;
    });

    document.getElementById('res-count').textContent = `${visible} resource${visible === 1 ? '' : 's'}`;
  }

  function openPicker() {
    fileInput.click();
  }

  function addLocalFiles(files) {
    [...files].forEach(file => {
      if (file.size > 25 * 1024 * 1024) {
        Notifications.toast('File too large', `${file.name} exceeds the 25 MB limit.`, 'error');
        return;
      }

      const extension = file.name.split('.').pop().toLowerCase();
      const type = extension === 'pdf' ? 'pdf' : extension === 'xlsx' ? 'sheet' : 'doc';
      const resource = {
        name: file.name,
        file: URL.createObjectURL(file),
        type,
        size: formatFileSize(file.size),
        category: 'Local',
        uploaded: new Date().toISOString().slice(0, 10),
        author: 'You'
      };

      tableBody.insertAdjacentHTML('afterbegin', resourceRow(resource));
    });

    if (files.length) {
      Notifications.toast('Files ready', 'Your selected files can now be downloaded from this page.', 'success');
      bindShareButtons();
      applyFilters();
    }
  }

  async function shareResource(button) {
    const absoluteUrl = new URL(button.dataset.file, window.location.href).href;
    const shareData = { title: button.dataset.name, text: button.dataset.name, url: absoluteUrl };

    try {
      if (navigator.share && !absoluteUrl.startsWith('blob:')) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(absoluteUrl);
        Notifications.toast('Link copied', 'The resource link is ready to share.', 'success');
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        Notifications.toast('Unable to share', 'Download the file and share it from your device.', 'error');
      }
    }
  }

  function bindShareButtons() {
    document.querySelectorAll('.resource-share:not([data-bound])').forEach(button => {
      button.dataset.bound = 'true';
      button.addEventListener('click', () => shareResource(button));
    });
  }

  document.querySelectorAll('.res-cat').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.res-cat').forEach(categoryButton => {
        categoryButton.classList.remove('btn--secondary');
        categoryButton.classList.add('btn--outline');
      });
      button.classList.remove('btn--outline');
      button.classList.add('btn--secondary');
      activeCategory = button.dataset.cat;
      applyFilters();
    });
  });

  searchInput.addEventListener('input', applyFilters);
  document.getElementById('btn-upload').addEventListener('click', openPicker);
  uploadZone.addEventListener('click', event => {
    if (event.target !== fileInput) openPicker();
  });
  uploadZone.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openPicker();
    }
  });
  uploadZone.addEventListener('dragover', event => {
    event.preventDefault();
    uploadZone.classList.add('upload-zone--active');
  });
  uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('upload-zone--active'));
  uploadZone.addEventListener('drop', event => {
    event.preventDefault();
    uploadZone.classList.remove('upload-zone--active');
    addLocalFiles(event.dataTransfer.files);
  });
  fileInput.addEventListener('change', () => {
    addLocalFiles(fileInput.files);
    fileInput.value = '';
  });

  bindShareButtons();
});
