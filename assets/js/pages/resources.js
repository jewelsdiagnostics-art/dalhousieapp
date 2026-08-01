/* ============================================
   Shared Firebase resources
   ============================================ */

window.DalhousieProgrammeResources = [
  { id: 'programme-handbook-2026', name: 'Programme Handbook 2026.pdf', file: 'data/resources/programme-handbook-2026.pdf', type: 'pdf', category: 'Policy', uploaded: '2026-06-15', author: 'Prof. Owusu' },
  { id: 'clinical-rotation-guidelines', name: 'Clinical Rotation Guidelines.docx', file: 'data/resources/clinical-rotation-guidelines.docx', type: 'doc', category: 'Guidelines', uploaded: '2026-06-20', author: 'Dr. Darko' },
  { id: 'assessment-rubric-osce-2026', name: 'Assessment Rubric - OSCE 2026.xlsx', file: 'data/resources/assessment-rubric-osce-2026.xlsx', type: 'sheet', category: 'Assessment', uploaded: '2026-07-01', author: 'Dr. Adjei' },
  { id: 'fellowship-application-template', name: 'Fellowship Application Template.docx', file: 'data/resources/fellowship-application-template.docx', type: 'doc', category: 'Forms', uploaded: '2026-05-10', author: 'Admin' },
  { id: 'research-ethics-guidelines', name: 'Research Ethics Guidelines.pdf', file: 'data/resources/research-ethics-guidelines.pdf', type: 'pdf', category: 'Policy', uploaded: '2026-04-28', author: 'Prof. Nkrumah' },
  { id: 'monthly-report-template', name: 'Monthly Report Template.xlsx', file: 'data/resources/monthly-report-template.xlsx', type: 'sheet', category: 'Forms', uploaded: '2026-06-30', author: 'Admin' },
  { id: 'psychopharmacology-reference-guide', name: 'Psychopharmacology Reference Guide.pdf', file: 'data/resources/psychopharmacology-reference-guide.pdf', type: 'pdf', category: 'Reference', uploaded: '2026-07-05', author: 'Dr. Asare' },
  { id: 'meeting-minutes-june-2026', name: 'Meeting Minutes - June 2026.docx', file: 'data/resources/meeting-minutes-june-2026.docx', type: 'doc', category: 'Minutes', uploaded: '2026-06-28', author: 'Admin' }
];

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function resourceIcon(type) {
  if (type === 'pdf') return 'PDF';
  if (type === 'sheet') return 'XLS';
  return 'DOC';
}

function resourceRow(resource) {
  const canDelete = Auth.isAdmin && Auth.isAdmin();
  const resourceId = resource._id || resource.id;
  const revision = Number(resource._revision || resource.revision || 0);
  return `
    <tr data-category="${resource.category}" data-resource-id="${resourceId}" data-resource-name="${resource.name.toLowerCase()}" data-revision="${revision}">
      <td class="cell--name"><span class="badge badge--neutral" style="margin-right:6px;">${resourceIcon(resource.type)}</span>${resource.name}</td>
      <td><span class="badge badge--primary">${resource.category}</span></td>
      <td class="cell--muted">${String(resource.type || '').toUpperCase()}</td>
      <td class="cell--muted">${resource.size || 'Ready'}</td>
      <td class="cell--muted">${App.formatDate(resource.uploaded)}</td>
      <td>${resource.author || ''}</td>
      <td>
        <div class="table-actions">
          <a class="table-icon-btn" href="${resource.file}" download="${resource.name}" title="Download ${resource.name}" aria-label="Download ${resource.name}">&#8595;</a>
          <button class="table-icon-btn resource-share" type="button" data-file="${resource.file}" data-name="${resource.name}" title="Share ${resource.name}" aria-label="Share ${resource.name}">&#128279;</button>
          ${canDelete ? `<button class="table-icon-btn table-icon-btn--danger resource-delete" type="button" data-id="${resourceId}" data-name="${resource.name}" data-revision="${revision}" title="Delete ${resource.name}" aria-label="Delete ${resource.name}">&#128465;</button>` : ''}
        </div>
      </td>
    </tr>
  `;
}

App.registerPage('resources', () => {
  const resources = SharedData.isReady() ? SharedData.getData('resources') : window.DalhousieProgrammeResources;
  const categories = [...new Set(resources.map(resource => resource.category).filter(Boolean))];
  const canUpload = Auth.isAdmin && Auth.isAdmin();

  return `
    <div class="page-content">
      <div class="page-header">
        <h1 class="page-header__title">Resources &amp; Documents</h1>
        <p class="page-header__subtitle">Shared programme materials stored in Firebase Storage</p>
      </div>

      <div style="display:flex;gap:var(--space-2);margin-bottom:var(--space-5);flex-wrap:wrap;" id="cat-filters">
        <button class="btn btn--sm btn--secondary res-cat" type="button" data-cat="all">All</button>
        ${categories.map(category => `<button class="btn btn--sm btn--outline res-cat" type="button" data-cat="${category}">${category}</button>`).join('')}
      </div>

      <div class="table-container">
        <div class="table-toolbar">
          <div class="table-toolbar__left"><span class="table-info" id="res-count">${resources.length} resources</span></div>
          <div class="table-toolbar__right"><input type="search" class="input" id="res-search" placeholder="Search resources..." style="width:200px;"></div>
        </div>
        <table class="data-table" id="res-table">
          <thead><tr><th>Name</th><th>Category</th><th>Type</th><th>Size</th><th>Uploaded</th><th>Author</th><th>Actions</th></tr></thead>
          <tbody>${resources.map(resourceRow).join('')}</tbody>
        </table>
      </div>

      ${canUpload ? `
        <section class="resource-upload-section" aria-labelledby="resource-upload-title">
          <div class="resource-upload-section__heading">
            <div>
              <span class="faculty-directory__eyebrow">Firebase Storage</span>
              <h2 id="resource-upload-title">Add Shared Resources</h2>
              <p>Files and versioned metadata are available to every authenticated participant.</p>
            </div>
            <button class="btn btn--primary" id="btn-upload" type="button">Add Shared File</button>
          </div>
          <div class="upload-zone" id="upload-zone" role="button" tabindex="0">
            <div class="upload-zone__icon">FILE</div>
            <div class="upload-zone__text">Drag and drop files here, or click to browse</div>
            <div class="upload-zone__hint">PDF, DOCX, XLSX and PPTX files up to 25 MB.</div>
            <input id="resource-file-input" type="file" accept=".pdf,.docx,.xlsx,.pptx" multiple hidden>
          </div>
        </section>
      ` : ''}
    </div>
  `;
}, () => {
  const tableBody = document.querySelector('#res-table tbody');
  const searchInput = document.getElementById('res-search');
  const fileInput = document.getElementById('resource-file-input');
  const uploadZone = document.getElementById('upload-zone');
  const uploadButton = document.getElementById('btn-upload');
  let activeCategory = 'all';

  function applyFilters() {
    const query = searchInput.value.trim().toLowerCase();
    let visible = 0;
    tableBody.querySelectorAll('tr').forEach(row => {
      const show = (activeCategory === 'all' || row.dataset.category === activeCategory)
        && row.textContent.toLowerCase().includes(query);
      row.style.display = show ? '' : 'none';
      if (show) visible += 1;
    });
    document.getElementById('res-count').textContent = `${visible} resource${visible === 1 ? '' : 's'}`;
  }

  async function uploadFiles(files) {
    if (!Auth.isAdmin || !Auth.isAdmin()) return;
    if (!window.FirebaseStorage) {
      Notifications.toast('Storage Unavailable', 'Firebase Storage is not configured yet.', 'error');
      return;
    }

    let uploadedCount = 0;
    let failedCount = 0;
    for (const file of [...files]) {
      if (file.size > 25 * 1024 * 1024) {
        Notifications.toast('File Too Large', `${file.name} exceeds 25 MB.`, 'error');
        continue;
      }
      const extension = file.name.split('.').pop().toLowerCase();
      const type = extension === 'pdf' ? 'pdf' : extension === 'xlsx' ? 'sheet' : 'doc';
      const id = `resource-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, '-');
      const storagePath = `resources/${id}/${safeName}`;

      try {
        const ref = window.FirebaseStorage.ref(storagePath);
        await ref.put(file, { contentType: file.type || 'application/octet-stream' });
        const downloadUrl = await ref.getDownloadURL();
        await SharedData.save('resources', {
          id,
          name: file.name,
          file: downloadUrl,
          storagePath,
          type,
          size: formatFileSize(file.size),
          category: 'Uploaded',
          uploaded: new Date().toISOString().slice(0, 10),
          author: Auth.currentUser().name || Auth.currentUser().username || 'Administrator'
        }, 0);
        uploadedCount += 1;
      } catch (error) {
        failedCount += 1;
        Notifications.toast('Upload Failed', `${file.name}: ${error.message || 'Unable to upload.'}`, 'error');
      }
    }
    if (uploadedCount) {
      Notifications.toast('Upload Complete', `${uploadedCount} shared file${uploadedCount === 1 ? '' : 's'} uploaded successfully.`, 'success');
    } else if (failedCount) {
      Notifications.toast('No Files Uploaded', 'Firebase Storage must be enabled for this project before uploads can succeed.', 'error');
    }
    App.navigate('resources');
  }

  async function shareResource(button) {
    const absoluteUrl = new URL(button.dataset.file, window.location.href).href;
    try {
      if (navigator.share) await navigator.share({ title: button.dataset.name, url: absoluteUrl });
      else await navigator.clipboard.writeText(absoluteUrl);
      Notifications.toast('Link Ready', 'The resource link is ready to share.', 'success');
    } catch (error) {
      if (error.name !== 'AbortError') Notifications.toast('Unable to Share', 'Download the file and share it from your device.', 'error');
    }
  }

  async function deleteResource(button) {
    if (!window.confirm(`Move "${button.dataset.name}" to Restore & Audit?`)) return;
    button.disabled = true;
    try {
      await SharedData.softDelete('resources', button.dataset.id, Number(button.dataset.revision));
      Notifications.toast('Moved to Restore', `${button.dataset.name} can be restored later.`, 'success');
      App.navigate('resources');
    } catch (error) {
      button.disabled = false;
      Notifications.toast('Delete Failed', error.message || 'The resource could not be deleted.', 'error');
    }
  }

  document.querySelectorAll('.res-cat').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('.res-cat').forEach(item => {
      item.classList.remove('btn--secondary');
      item.classList.add('btn--outline');
    });
    button.classList.remove('btn--outline');
    button.classList.add('btn--secondary');
    activeCategory = button.dataset.cat;
    applyFilters();
  }));
  searchInput.addEventListener('input', applyFilters);
  document.querySelectorAll('.resource-share').forEach(button => button.addEventListener('click', () => shareResource(button)));
  document.querySelectorAll('.resource-delete').forEach(button => button.addEventListener('click', () => deleteResource(button)));

  if (uploadButton && fileInput && uploadZone) {
    const openPicker = () => fileInput.click();
    uploadButton.addEventListener('click', openPicker);
    uploadZone.addEventListener('click', event => { if (event.target !== fileInput) openPicker(); });
    uploadZone.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openPicker(); }
    });
    uploadZone.addEventListener('dragover', event => { event.preventDefault(); uploadZone.classList.add('upload-zone--active'); });
    uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('upload-zone--active'));
    uploadZone.addEventListener('drop', async event => {
      event.preventDefault();
      uploadZone.classList.remove('upload-zone--active');
      await uploadFiles(event.dataTransfer.files);
    });
    fileInput.addEventListener('change', async () => {
      await uploadFiles(fileInput.files);
      fileInput.value = '';
    });
  }
});
