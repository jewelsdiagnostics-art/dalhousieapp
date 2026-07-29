/* ============================================
   Faculty Directory - workbook data + admin tools
   ============================================ */

const FacultyPage = (() => {
  const SEED_KEY = 'dalhousie_faculty_directory_seed_v1';
  const fields = [
    { key: 'Name', label: 'Full Name', type: 'text', placeholder: 'Prof. Samuel Owusu' },
    { key: 'Title', label: 'Position / Rank', type: 'text', placeholder: 'Consultant Psychiatrist' },
    { key: 'Institution', label: 'Institution', type: 'text', placeholder: 'GCPS' },
    { key: 'Email', label: 'Email', type: 'email', placeholder: 'name@example.com' },
    { key: 'Speciality', label: 'Interest Areas / Specialization', type: 'text', placeholder: 'Global Mental Health' }
  ];

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function identity(entry) {
    return String(entry.Email || entry.Name || '').trim().toLowerCase();
  }

  function normalizeEntry(entry) {
    return {
      Name: String(entry.Name || '').trim(),
      Title: String(entry.Title || entry.Role || '').trim(),
      Institution: String(entry.Institution || entry.Department || '').trim(),
      Email: String(entry.Email || '').trim(),
      Speciality: String(entry.Speciality || entry.Specialization || '').trim()
    };
  }

  function ensureDirectoryData() {
    const defaults = (window.DalhousieFacultyDirectory || []).map(normalizeEntry);

    try {
      if (localStorage.getItem(SEED_KEY) === 'complete') {
        return CSVImport.getData('faculty').map(normalizeEntry);
      }

      const existing = CSVImport.getData('faculty').map(normalizeEntry);
      const merged = [];
      const seen = new Set();

      defaults.concat(existing).forEach(entry => {
        const key = identity(entry);
        if (!entry.Name || seen.has(key)) return;
        seen.add(key);
        merged.push(entry);
      });

      CSVImport.importData('faculty', merged);
      localStorage.setItem(SEED_KEY, 'complete');
      return merged;
    } catch (error) {
      return defaults;
    }
  }

  function getFaculty() {
    return ensureDirectoryData();
  }

  function saveFaculty() {
    if (!Auth.isAdmin || !Auth.isAdmin()) return;

    const newEntry = {};
    fields.forEach(field => {
      const input = document.getElementById('fac-' + field.key);
      newEntry[field.key] = input ? input.value.trim() : '';
    });

    if (!newEntry.Name) {
      Notifications.toast('Validation', 'Name is required', 'warning');
      return;
    }

    const existing = getFaculty();
    const editInput = document.getElementById('fac-edit-idx');
    const editIndex = editInput ? editInput.value : '';

    if (editIndex !== '') {
      existing[Number(editIndex)] = newEntry;
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
    if (form) form.hidden = true;
  }

  function showAddForm() {
    if (!Auth.isAdmin || !Auth.isAdmin()) return;
    const form = document.getElementById('faculty-form-card');
    const title = document.getElementById('faculty-form-title');
    const editInput = document.getElementById('fac-edit-idx');

    if (form) form.hidden = false;
    if (title) title.textContent = 'Add Faculty Member';
    if (editInput) editInput.value = '';
    fields.forEach(field => {
      const input = document.getElementById('fac-' + field.key);
      if (input) input.value = '';
    });
    if (form) form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function editFaculty(index) {
    if (!Auth.isAdmin || !Auth.isAdmin()) return;
    const entry = getFaculty()[index];
    if (!entry) return;

    showAddForm();
    document.getElementById('faculty-form-title').textContent = `Edit: ${entry.Name}`;
    document.getElementById('fac-edit-idx').value = index;
    fields.forEach(field => {
      const input = document.getElementById('fac-' + field.key);
      if (input) input.value = entry[field.key] || '';
    });
  }

  function deleteFaculty(index) {
    if (!Auth.isAdmin || !Auth.isAdmin()) return;
    const existing = getFaculty();
    const name = existing[index] ? existing[index].Name : 'this member';

    if (confirm(`Delete ${name} from the faculty directory?`)) {
      existing.splice(index, 1);
      CSVImport.importData('faculty', existing);
      Notifications.toast('Deleted', `${name} removed`, 'info');
      App.navigate('faculty');
    }
  }

  function initials(name) {
    return String(name || '')
      .replace(/\b(Dr|Prof)\.?\s*/gi, '')
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part.charAt(0).toUpperCase())
      .join('');
  }

  function renderCard(entry, index, isAdmin) {
    const name = escapeHtml(entry.Name);
    const title = escapeHtml(entry.Title);
    const institution = escapeHtml(entry.Institution);
    const speciality = escapeHtml(entry.Speciality);
    const email = escapeHtml(entry.Email);

    return `
      <article class="faculty-card" data-search="${escapeHtml(
        [entry.Name, entry.Title, entry.Institution, entry.Speciality, entry.Email].join(' ').toLowerCase()
      )}" data-institution="${institution}">
        <div class="faculty-card__top">
          <div class="faculty-card__avatar" aria-hidden="true">${escapeHtml(initials(entry.Name))}</div>
          <div class="faculty-card__identity">
            <h2 class="faculty-card__name">${name}</h2>
            <p class="faculty-card__title">${title || 'Faculty member'}</p>
          </div>
        </div>
        ${institution ? `<p class="faculty-card__institution"><span aria-hidden="true">&#9679;</span>${institution}</p>` : ''}
        ${speciality ? `
          <div class="faculty-card__section">
            <span class="faculty-card__label">Interest areas</span>
            <p>${speciality}</p>
          </div>
        ` : ''}
        <div class="faculty-card__footer">
          ${email ? `<a class="faculty-card__email" href="mailto:${email}">${email}</a>` : '<span></span>'}
          ${isAdmin ? `
            <div class="faculty-card__actions">
              <button class="btn btn--outline btn--sm" type="button" onclick="FacultyPage.editFaculty(${index})">Edit</button>
              <button class="btn btn--ghost btn--sm faculty-card__delete" type="button" onclick="FacultyPage.deleteFaculty(${index})">Delete</button>
            </div>
          ` : ''}
        </div>
      </article>
    `;
  }

  function filterDirectory() {
    const queryInput = document.getElementById('faculty-search');
    const institutionSelect = document.getElementById('faculty-institution-filter');
    const query = queryInput ? queryInput.value.trim().toLowerCase() : '';
    const institution = institutionSelect ? institutionSelect.value : '';
    let visible = 0;

    document.querySelectorAll('.faculty-card').forEach(card => {
      const matchesQuery = !query || card.dataset.search.includes(query);
      const matchesInstitution = !institution || card.dataset.institution === institution;
      card.hidden = !(matchesQuery && matchesInstitution);
      if (!card.hidden) visible += 1;
    });

    const result = document.getElementById('faculty-results');
    if (result) result.textContent = `${visible} faculty member${visible === 1 ? '' : 's'}`;

    const empty = document.getElementById('faculty-filter-empty');
    if (empty) empty.hidden = visible !== 0;
  }

  function render() {
    const faculty = getFaculty();
    const isAdmin = Boolean(Auth.isAdmin && Auth.isAdmin());
    const institutions = [...new Set(faculty.map(entry => entry.Institution).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b));

    return `
      <div class="page-content faculty-directory">
        <div class="faculty-directory__header">
          <div>
            <span class="faculty-directory__eyebrow">Programme community</span>
            <h1 class="page-header__title">Faculty Directory</h1>
            <p class="page-header__subtitle">Dalhousie University and Ghana College of Physicians and Surgeons faculty</p>
          </div>
          ${isAdmin ? `<button class="btn btn--primary" type="button" onclick="FacultyPage.showAddForm()">+ Add Faculty</button>` : ''}
        </div>

        ${isAdmin ? `
          <div class="section-card faculty-form" id="faculty-form-card" hidden>
            <div class="section-card__header">
              <span class="section-card__title" id="faculty-form-title">Add Faculty Member</span>
              <button class="btn btn--ghost btn--sm" type="button" onclick="FacultyPage.cancelForm()">Cancel</button>
            </div>
            <div class="section-card__body">
              <input type="hidden" id="fac-edit-idx" value="">
              <div class="faculty-form__grid">
                ${fields.map(field => `
                  <div class="form-group">
                    <label class="form-label" for="fac-${field.key}">${field.label}</label>
                    <input type="${field.type}" class="input" id="fac-${field.key}" placeholder="${field.placeholder}">
                  </div>
                `).join('')}
              </div>
              <div class="faculty-form__actions">
                <button class="btn btn--primary" type="button" onclick="FacultyPage.saveFaculty()">Save Faculty</button>
              </div>
            </div>
          </div>
          <div id="csv-upload-faculty-page"></div>
        ` : ''}

        <div class="faculty-toolbar" role="search">
          <label class="faculty-search">
            <span class="faculty-search__icon" aria-hidden="true">&#128269;</span>
            <span class="sr-only">Search faculty</span>
            <input id="faculty-search" type="search" placeholder="Search by name, role, institution, or interest..." oninput="FacultyPage.filterDirectory()">
          </label>
          <label class="faculty-filter">
            <span class="sr-only">Filter by institution</span>
            <select id="faculty-institution-filter" onchange="FacultyPage.filterDirectory()">
              <option value="">All institutions</option>
              ${institutions.map(item => `<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`).join('')}
            </select>
          </label>
          <span class="faculty-toolbar__count" id="faculty-results">${faculty.length} faculty members</span>
        </div>

        <div class="faculty-grid stagger" id="faculty-grid">
          ${faculty.map((entry, index) => renderCard(entry, index, isAdmin)).join('')}
        </div>
        <div class="empty-state" id="faculty-filter-empty" hidden>
          <div class="empty-state__title">No matching faculty found</div>
          <p>Try a different name, institution, or interest area.</p>
        </div>
      </div>
    `;
  }

  return {
    render,
    saveFaculty,
    cancelForm,
    showAddForm,
    editFaculty,
    deleteFaculty,
    filterDirectory
  };
})();

App.registerPage('faculty', () => FacultyPage.render(), () => {
  if (Auth.isAdmin && Auth.isAdmin()) {
    CSVImport.renderUploadUI('csv-upload-faculty-page', 'faculty', () => App.navigate('faculty'));
  }
});
