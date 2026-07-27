/* ============================================
   User Management - Admin only
   ============================================ */

App.registerPage('users', () => {
  if (!Auth.isAdmin()) {
    return `<div class="page-content"><div class="empty-state"><div class="empty-state__icon">LOCK</div><div class="empty-state__title">Access Denied</div><p>Only administrators can manage users.</p></div></div>`;
  }

  const users = Auth.getUsers();

  return `
    <div class="page-content">
      <div class="page-header">
        <h1 class="page-header__title">User Management</h1>
        <p class="page-header__subtitle">Create, manage, and reset passwords for system users</p>
      </div>

      <!-- Add user form -->
      <div class="section-card" id="user-form-card" style="margin-bottom:var(--space-5);overflow:visible;">
        <div class="section-card__header">
          <span class="section-card__title" id="user-form-title">Add New User</span>
        </div>
        <div class="section-card__body">
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:var(--space-4);margin-bottom:var(--space-4);">
            <div class="form-group">
              <label class="form-label">Full Name</label>
              <input type="text" class="input" id="new-user-name" placeholder="Dr. Jane Doe">
            </div>
            <div class="form-group">
              <label class="form-label">Username</label>
              <input type="text" class="input" id="new-user-username" placeholder="jane.doe">
            </div>
            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input type="email" class="input" id="new-user-email" placeholder="jane.doe@example.com">
            </div>
            <div class="form-group">
              <label class="form-label">Institution Name</label>
              <input type="text" class="input" id="new-user-institution" placeholder="Training institution">
            </div>
            <div class="form-group">
              <label class="form-label">Contact Number</label>
              <input type="text" class="input" id="new-user-contact" placeholder="+233-24-000-0000">
            </div>
            <div class="form-group">
              <label class="form-label">Password</label>
              <input type="password" class="input" id="new-user-password" placeholder="Min. 8 characters">
            </div>
            <div class="form-group">
              <label class="form-label">Role</label>
              <select class="input" id="new-user-role">
                <option value="faculty">Faculty</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div style="margin-bottom:var(--space-4);">
            <div class="form-label" style="margin-bottom:var(--space-2);">Main Topics and Tutorials</div>
            <div id="user-teaching-selections">
              ${TutorialCatalog.renderSelectionGroups('admin')}
            </div>
          </div>

          <div id="user-form-error" style="display:none;color:var(--error);font-size:0.8rem;margin-top:var(--space-2);"></div>
          <div style="margin-top:var(--space-4);">
            <button class="btn btn--primary" onclick="UsersPage.createUser()">+ Create User</button>
          </div>
        </div>
      </div>

      <!-- User list -->
      <div class="table-container">
        <table class="data-table">
          <thead><tr><th>Name</th><th>Username</th><th>Email</th><th>Role</th><th>Institution</th><th>Selection</th><th>Actions</th></tr></thead>
          <tbody>
            ${users.map(u => `
              <tr>
                <td class="cell--name">${u.name || u.username}</td>
                <td>${u.username}</td>
                <td>${u.email || ''}</td>
                <td><span class="badge badge--${u.role==='admin'?'error':'info'}">${u.role}</span></td>
                <td>${u.institution || ''}</td>
                <td>
                  <div style="display:flex;flex-wrap:wrap;gap:0.35rem;">
                    <span class="badge badge--secondary">${(u.mainTopics || []).length} topics</span>
                    <span class="badge badge--primary">${(u.tutorials || []).length} tutorials</span>
                  </div>
                </td>
                <td>
                  <div class="table-actions">
                    <button class="btn btn--outline btn--sm" onclick="UsersPage.showReset('${u.username}')">Reset Password</button>
                    ${u.username !== 'admin' ? `<button class="btn btn--ghost btn--sm" onclick="UsersPage.deleteUser('${u.username}')" style="color:var(--error);">Delete</button>` : ''}
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Reset password modal -->
      <div id="reset-modal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:200;align-items:center;justify-content:center;" onclick="if(event.target===this)this.style.display='none'">
        <div class="card" style="width:380px;max-width:90vw;overflow:visible;" onclick="event.stopPropagation()">
          <h3 style="margin-bottom:var(--space-3);">Send Password Reset Email</h3>
          <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:var(--space-3);">Send a reset email for <strong id="reset-username-label"></strong></p>
          <div class="form-group">
            <label class="form-label">New Password</label>
            <input type="password" class="input" id="reset-new-password" placeholder="Enter a placeholder password">
          </div>
          <div id="reset-error" style="display:none;color:var(--error);font-size:0.8rem;margin-bottom:var(--space-2);"></div>
          <div style="display:flex;gap:var(--space-2);justify-content:flex-end;">
            <button class="btn btn--outline btn--sm" onclick="document.getElementById('reset-modal').style.display='none'">Cancel</button>
            <button class="btn btn--primary btn--sm" onclick="UsersPage.resetPassword()">Send Email</button>
          </div>
        </div>
      </div>
    </div>
  `;
});

/* ---- Global functions for onclick handlers ---- */
const UsersPage = {
  _resetTarget: '',

  _collectSelections() {
    const selectedMainTopics = [...document.querySelectorAll('.admin-group-master:checked')].map(el => el.dataset.groupId);
    let selectedTutorials = [...document.querySelectorAll('.admin-tutorial:checked')].map(el => el.dataset.tutorialId);

    if (selectedMainTopics.length && selectedTutorials.length === 0) {
      selectedMainTopics.forEach(groupId => {
        TutorialCatalog.getTutorialsForGroup(groupId).forEach(t => {
          if (!selectedTutorials.includes(t.id)) selectedTutorials.push(t.id);
        });
      });
    }

    if (selectedTutorials.length && selectedMainTopics.length === 0) {
      selectedMainTopics.push(
        ...new Set(selectedTutorials.map(id => TutorialCatalog.getTutorial(id)?.groupId).filter(Boolean))
      );
    }

    return {
      selectedMainTopics: [...new Set(selectedMainTopics)],
      selectedTutorials: [...new Set(selectedTutorials)]
    };
  },

  async createUser() {
    const name = document.getElementById('new-user-name').value.trim();
    const username = document.getElementById('new-user-username').value.trim();
    const email = document.getElementById('new-user-email').value.trim();
    const institution = document.getElementById('new-user-institution').value.trim();
    const contactNumber = document.getElementById('new-user-contact').value.trim();
    const password = document.getElementById('new-user-password').value.trim();
    const role = document.getElementById('new-user-role').value;
    const errEl = document.getElementById('user-form-error');
    const selections = this._collectSelections();

    if (!username || !password) {
      errEl.textContent = 'Username and password are required';
      errEl.style.display = '';
      return;
    }

    const result = await Auth.addUser(username, password, role, name || username, {
      email,
      institution,
      contactNumber,
      selectedMainTopics: selections.selectedMainTopics,
      selectedTutorials: selections.selectedTutorials
    });

    if (result.success) {
      errEl.style.display = 'none';
      Notifications.toast('User Created', `${username} added as ${role}`, 'success');
      App.navigate('users');
    } else {
      errEl.textContent = result.error;
      errEl.style.display = '';
    }
  },

  showReset(username) {
    this._resetTarget = username;
    document.getElementById('reset-username-label').textContent = username;
    document.getElementById('reset-new-password').value = '';
    document.getElementById('reset-error').style.display = 'none';
    document.getElementById('reset-modal').style.display = 'flex';
  },

  async resetPassword() {
    const newPass = document.getElementById('reset-new-password').value.trim();
    const errEl = document.getElementById('reset-error');

    if (!newPass || newPass.length < 8) {
      errEl.textContent = 'Password must be at least 8 characters';
      errEl.style.display = '';
      return;
    }

    const result = await Auth.resetPassword(this._resetTarget, newPass);
    if (result.success) {
      document.getElementById('reset-modal').style.display = 'none';
      Notifications.toast('Reset Email Sent', `Password reset email sent to ${this._resetTarget}`, 'success');
    } else {
      errEl.textContent = result.error;
      errEl.style.display = '';
    }
  },

  deleteUser(username) {
    if (confirm(`Delete user "${username}"? This cannot be undone.`)) {
      const result = Auth.deleteUser(username);
      if (result.success) {
        Notifications.toast('Deleted', `${username} removed`, 'info');
        App.navigate('users');
      } else {
        Notifications.toast('Error', result.error, 'error');
      }
    }
  }
};

(function bindAdminSelectionSync() {
  if (window.__adminSelectionSyncBound) return;
  window.__adminSelectionSyncBound = true;

  document.body.addEventListener('change', e => {
    if (e.target && e.target.classList.contains('admin-group-master')) {
      const groupId = e.target.dataset.groupId;
      document.querySelectorAll(`.admin-tutorial[data-group-id="${groupId}"]`).forEach(child => {
        child.checked = e.target.checked;
      });
    }
  });

  document.body.addEventListener('change', e => {
    if (e.target && e.target.classList.contains('admin-tutorial')) {
      const groupId = e.target.dataset.groupId;
      const childChecks = document.querySelectorAll(`.admin-tutorial[data-group-id="${groupId}"]`);
      const master = document.querySelector(`.admin-group-master[data-group-id="${groupId}"]`);
      if (master) {
        master.checked = [...childChecks].some(child => child.checked);
      }
    }
  });
})();
