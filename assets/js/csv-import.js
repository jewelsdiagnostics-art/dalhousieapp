/* ============================================
   csv-import.js — CSV parser, upload UI, data store
   ============================================ */

const CSVImport = (() => {
  const STORE_KEY = 'gcps_csv_data';
  let _store = {};

  /* ---- Init: load from localStorage ---- */
  function init() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) _store = JSON.parse(raw);
    } catch (e) { _store = {}; }
  }

  function _save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(_store)); } catch (e) {}
  }

  /* ---- Parse CSV string to array of objects ---- */
  function parseCSV(text) {
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) return [];

    const headers = _splitRow(lines[0]);
    const rows = [];

    for (let i = 1; i < lines.length; i++) {
      const vals = _splitRow(lines[i]);
      if (vals.length === 0 || (vals.length === 1 && vals[0].trim() === '')) continue;
      const obj = {};
      headers.forEach((h, j) => {
        obj[h.trim()] = (vals[j] || '').trim();
      });
      rows.push(obj);
    }
    return rows;
  }

  function _splitRow(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += ch;
      }
    }
    result.push(current);
    return result;
  }

  /* ---- Import data for a type ---- */
  async function importData(type, rows) {
    if (!_store[type]) _store[type] = [];
    _store[type] = rows;
    _save();
    if (typeof SharedData !== 'undefined' && SharedData.isReady()) {
      await SharedData.replaceCollection(type, rows);
      _store[type] = SharedData.getData(type);
      _save();
    }
    return _store[type];
  }

  function getData(type) {
    if (typeof SharedData !== 'undefined' && SharedData.isReady()) {
      return SharedData.getData(type);
    }
    return _store[type] || [];
  }

  function hasData(type) {
    const d = _store[type];
    return d && d.length > 0;
  }

  async function clearData(type) {
    if (typeof SharedData !== 'undefined' && SharedData.isReady()) {
      await SharedData.replaceCollection(type, []);
    }
    delete _store[type];
    _save();
  }

  /* ---- Render upload UI into a container ---- */
  function renderUploadUI(containerId, type, onImported) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Role check: faculty cannot see CSV upload sections
    if (typeof Auth !== 'undefined' && Auth.isFaculty()) {
      container.innerHTML = '';
      return;
    }

    const templates = {
      members: { label: 'Members', file: 'members_template.csv', headers: 'Name,Role,Department,Status,JoinDate,Email,Phone' },
      fellows: { label: 'Fellows', file: 'fellows_template.csv', headers: 'Name,ID,Cohort,Rotation,OverallProgress,ModulesTotal,ModulesCompleted,LastActivity' },
      faculty: { label: 'Faculty', file: 'faculty_template.csv', headers: 'Name,Title,Department,Email,Phone,Speciality,Location,Fellows' },
      meetings: { label: 'Meeting Schedule', file: 'meetings_template.csv', headers: 'Date,Title,Type,Time,Location,Status,Attendees' },
      minutes: { label: 'Meeting Minutes', file: 'minutes_template.csv', headers: 'MeetingTitle,Date,Chair,ChairTitle,ChairInstitution,Scribe,ScribeTitle,AttendeesPresent,AttendeesAbsent,Agenda,Proceedings,ActionItems,AdjournmentNotes' }
    };

    const t = templates[type] || { label: type, file: '', headers: '' };
    const existingCount = getData(type).length;

    container.innerHTML = `
      <div class="csv-upload" id="csv-upload-${type}">
        <div class="csv-upload__header">
          <span class="csv-upload__title">📥 ${t.label} Data</span>
          ${existingCount > 0 ? `<span class="badge badge--success">${existingCount} records loaded</span>` : `<span class="badge badge--neutral">No data</span>`}
        </div>
        <div class="csv-upload__zone" id="csv-dropzone-${type}">
          <div class="csv-upload__icon">📁</div>
          <div class="csv-upload__text">Drop a CSV file here or click to browse</div>
          <div class="csv-upload__hint">Expected columns: ${t.headers}</div>
          <input type="file" accept=".csv" id="csv-input-${type}" style="display:none;">
        </div>
        <div class="csv-upload__actions">
          <a href="data/templates/${t.file}" download class="btn btn--outline btn--sm">📋 Download Template</a>
          ${existingCount > 0 ? `<button class="btn btn--ghost btn--sm csv-clear-btn" data-type="${type}" style="color:var(--error);">🗑️ Clear Data</button>` : ''}
        </div>
        <div id="csv-preview-${type}" class="csv-preview" style="display:none;"></div>
      </div>
    `;

    /* ---- File input ---- */
    const dropzone = document.getElementById('csv-dropzone-' + type);
    const fileInput = document.getElementById('csv-input-' + type);

    dropzone.addEventListener('click', () => fileInput.click());

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('csv-upload__zone--dragover');
    });
    dropzone.addEventListener('dragleave', () => {
      dropzone.classList.remove('csv-upload__zone--dragover');
    });
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('csv-upload__zone--dragover');
      const file = e.dataTransfer.files[0];
      if (file) _handleFile(file, type, onImported);
    });

    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      if (file) _handleFile(file, type, onImported);
    });

    /* ---- Clear button ---- */
    const clearBtn = container.querySelector('.csv-clear-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', async () => {
        clearBtn.disabled = true;
        await clearData(type);
        if (onImported) onImported([]);
        renderUploadUI(containerId, type, onImported);
      });
    }
  }

  function _handleFile(file, type, onImported) {
    if (!file.name.endsWith('.csv')) {
      Notifications.toast('Invalid File', 'Please upload a .csv file', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const rows = parseCSV(e.target.result);
      if (rows.length === 0) {
        Notifications.toast('Empty File', 'No data rows found in CSV', 'warning');
        return;
      }

      try {
        await importData(type, rows);
      } catch (error) {
        Notifications.toast('Import Failed', error.message || 'The shared data could not be updated.', 'error');
        return;
      }
      Notifications.toast('Import Successful', `${rows.length} ${type} records imported`, 'success');

      // Show preview
      const preview = document.getElementById('csv-preview-' + type);
      if (preview && rows.length > 0) {
        const headers = Object.keys(rows[0]);
        preview.style.display = '';
        preview.innerHTML = `
          <div class="csv-preview__header">Preview (${rows.length} records)</div>
          <table class="data-table" style="font-size:0.75rem;">
            <thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
            <tbody>
              ${rows.slice(0, 5).map(r => `<tr>${headers.map(h => `<td>${r[h] || ''}</td>`).join('')}</tr>`).join('')}
              ${rows.length > 5 ? `<tr><td colspan="${headers.length}" style="text-align:center;color:var(--text-muted);">… and ${rows.length - 5} more rows</td></tr>` : ''}
            </tbody>
          </table>
        `;
      }

      if (onImported) await onImported(rows);
    };
    reader.readAsText(file);
  }

  /* ---- Init on load ---- */
  init();

  return { parseCSV, importData, getData, hasData, clearData, renderUploadUI, init };
})();

/* ---- CSS injected here ---- */
const csvStyles = document.createElement('style');
csvStyles.textContent = `
  .csv-upload {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    overflow: hidden;
    margin-bottom: var(--space-5);
  }
  .csv-upload__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-3) var(--space-5);
    border-bottom: 1px solid var(--border);
    background: var(--surface-hover);
  }
  .csv-upload__title {
    font-weight: 600;
    font-size: 0.85rem;
  }
  .csv-upload__zone {
    border: 2px dashed var(--border);
    border-radius: var(--radius-lg);
    margin: var(--space-4);
    padding: var(--space-6) var(--space-4);
    text-align: center;
    cursor: pointer;
    transition: all var(--transition);
    background: var(--surface-hover);
  }
  .csv-upload__zone:hover,
  .csv-upload__zone--dragover {
    border-color: var(--primary);
    background: var(--primary-bg);
  }
  .csv-upload__icon { font-size: 2rem; margin-bottom: var(--space-2); color: var(--text-muted); }
  .csv-upload__text { font-size: 0.875rem; color: var(--text-secondary); }
  .csv-upload__hint { font-size: 0.72rem; color: var(--text-muted); margin-top: var(--space-1); font-family: var(--font-mono); }
  .csv-upload__actions {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: 0 var(--space-4) var(--space-4);
    justify-content: flex-end;
  }
  .csv-preview {
    padding: 0 var(--space-4) var(--space-4);
  }
  .csv-preview__header {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-secondary);
    margin-bottom: var(--space-2);
  }
`;
document.head.appendChild(csvStyles);
