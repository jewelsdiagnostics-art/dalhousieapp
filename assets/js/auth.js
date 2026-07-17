/* ============================================
   auth.js â€” Login, session, role-based access, user management
   ============================================ */

const Auth = (() => {
  const SESSION_KEY = 'gcps_auth_session';
  const USERS_KEY = 'gcps_auth_users';
  const DEFAULT_ADMIN_SALT = 'gcps-admin-salt';
  const DEFAULT_ADMIN_HASH = 'b2006f3a3f83ea4a58ca5dd5e641b3cb72ed6f55ebafe85b055d37182fd2aa9e';

  let _currentUser = null;

  /* ---- Default users ---- */
  const DEFAULT_USERS = [
    {
      username: 'admin',
      email: 'admin',
      role: 'admin',
      name: 'Administrator',
      institution: 'GCPS',
      contactNumber: '',
      mainTopics: [],
      tutorials: [],
      salt: DEFAULT_ADMIN_SALT,
      passwordHash: DEFAULT_ADMIN_HASH,
      sessionToken: ''
    },
    {
      username: 'faculty',
      email: 'faculty@dalhousie.app',
      role: 'faculty',
      name: 'Demo Faculty',
      institution: 'GCPS',
      contactNumber: '',
      mainTopics: [],
      tutorials: [],
      salt: 'gcps-demo-salt',
      passwordHash: '756a12b15ae0d07ce572861eb57d81327ee419705e53270dd600f8070688c761',
      sessionToken: ''
    }
  ];

  /* ---- Helpers ---- */
  function _normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function _loadUsers() {
    try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
    catch (e) { return []; }
  }

  function _saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function _loadSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)); }
    catch (e) { return null; }
  }

  function _saveSession(user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({
      username: user.username,
      sessionToken: user.sessionToken
    }));
  }

  function _clearSession() {
    localStorage.removeItem(SESSION_KEY);
    _currentUser = null;
  }

  function _uuid() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
    return `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
  }

  function _newSalt() {
    return _uuid().replace(/-/g, '');
  }

  function _newSessionToken() {
    return _uuid().replace(/-/g, '');
  }

  async function _hashPassword(password, salt) {
    const data = new TextEncoder().encode(`${salt}::${password}`);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function _ensureUserShape(user) {
    if (!user) return user;
    const username = user.username || user.email || '';
    const email = user.email || user.username || '';
    const curriculumDefaults = (typeof TutorialCatalog !== 'undefined' && TutorialCatalog.allSelectionIds)
      ? TutorialCatalog.allSelectionIds()
      : { groups: [], tutorials: [] };
    const mainTopics = Array.isArray(user.mainTopics) ? user.mainTopics : [];
    const tutorials = Array.isArray(user.tutorials) ? user.tutorials : [];
    const shouldDefaultCurriculum = (user.role || 'faculty') === 'faculty';
    return {
      ...user,
      username,
      email,
      name: user.name || username,
      institution: user.institution || '',
      contactNumber: user.contactNumber || '',
      mainTopics: mainTopics.length || !shouldDefaultCurriculum ? mainTopics : curriculumDefaults.groups,
      tutorials: tutorials.length || !shouldDefaultCurriculum ? tutorials : curriculumDefaults.tutorials
    };
  }

  function _validatePasswordStrength(password) {
    const issues = [];
    if ((password || '').length < 8) issues.push('at least 8 characters');
    if (!/[a-z]/.test(password)) issues.push('a lowercase letter');
    if (!/[A-Z]/.test(password)) issues.push('an uppercase letter');
    if (!/\d/.test(password)) issues.push('a number');
    if (!/[^\w\s]/.test(password)) issues.push('a symbol');
    return {
      ok: issues.length === 0,
      issues,
      message: issues.length === 0 ? '' : `Password must include ${issues.join(', ')}.`
    };
  }

  async function _upgradeLegacyUser(user, plainPassword) {
    const salt = _newSalt();
    user.salt = salt;
    user.passwordHash = await _hashPassword(plainPassword, salt);
    delete user.password;
    return user;
  }

  function _persistUserUpdate(updatedUser) {
    const users = _loadUsers().map(_ensureUserShape);
    const idx = users.findIndex(u => _normalize(u.username) === _normalize(updatedUser.username));
    if (idx >= 0) {
      users[idx] = { ...users[idx], ...updatedUser };
    } else {
      users.push(updatedUser);
    }
    _saveUsers(users);
  }

  /* ---- Init ---- */
  function init() {
    let users = _loadUsers().map(_ensureUserShape);
    if (users.length === 0) {
      users = DEFAULT_USERS.map(_ensureUserShape);
      _saveUsers(users);
    }

    const session = _loadSession();
    if (session) {
      const user = users.find(u =>
        _normalize(u.username) === _normalize(session.username) &&
        (session.sessionToken ? u.sessionToken === session.sessionToken : true)
      );
      if (user) {
        _currentUser = user;
      } else {
        _clearSession();
      }
    }
  }

  /* ---- Login ---- */
  async function login(identifier, password) {
    const users = _loadUsers().map(_ensureUserShape);
    const lookup = _normalize(identifier);
    const user = users.find(u =>
      _normalize(u.username) === lookup || _normalize(u.email) === lookup
    );
    if (!user) return { success: false, error: 'Invalid username or password' };

    let isMatch = false;
    if (user.passwordHash && user.salt) {
      const hashed = await _hashPassword(password, user.salt);
      isMatch = hashed === user.passwordHash;
    } else if (user.password) {
      isMatch = user.password === password;
      if (isMatch) {
        await _upgradeLegacyUser(user, password);
        _saveUsers(users.map(u => _normalize(u.username) === _normalize(user.username) ? user : u));
      }
    }

    if (!isMatch) return { success: false, error: 'Invalid username or password' };

    user.sessionToken = _newSessionToken();
    _currentUser = { ...user };
    _persistUserUpdate(user);
    _saveSession(user);
    return { success: true, user: _currentUser };
  }

  /* ---- Register self-service account ---- */
  async function registerAccount(payload) {
    const rawFullName = String(payload.fullName || '').trim();
    const rawEmail = String(payload.email || '').trim();
    const rawInstitution = String(payload.institution || '').trim();
    const rawContactNumber = String(payload.contactNumber || '').trim();
    const password = String(payload.password || '');
    const curriculumDefaults = (typeof TutorialCatalog !== 'undefined' && TutorialCatalog.allSelectionIds)
      ? TutorialCatalog.allSelectionIds()
      : { groups: [], tutorials: [] };
    const selectedMainTopics = Array.isArray(payload.selectedMainTopics) && payload.selectedMainTopics.length
      ? payload.selectedMainTopics
      : curriculumDefaults.groups;
    const selectedTutorials = Array.isArray(payload.selectedTutorials) && payload.selectedTutorials.length
      ? payload.selectedTutorials
      : curriculumDefaults.tutorials;

    const fallbackEmail = `faculty-${Date.now()}@dalhousie.app`;
    const email = rawEmail || fallbackEmail;
    const fullName = rawFullName || 'New Faculty';
    const institution = rawInstitution || 'GCPS';
    const contactNumber = rawContactNumber || '0000000000';
    const safePassword = password || 'Faculty123!';

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { success: false, error: 'Please enter a valid email address' };
    }
    const strength = _validatePasswordStrength(safePassword);
    if (!strength.ok) return { success: false, error: strength.message };
    const users = _loadUsers().map(_ensureUserShape);
    const username = _normalize(email);
    if (users.some(u => _normalize(u.username) === username || _normalize(u.email) === username)) {
      return { success: false, error: 'An account already exists for that email address' };
    }

    const salt = _newSalt();
    const passwordHash = await _hashPassword(safePassword, salt);
    const sessionToken = _newSessionToken();
    const newUser = {
      username,
      email,
      name: fullName,
      institution,
      contactNumber,
      role: 'faculty',
      mainTopics: [...new Set(selectedMainTopics)],
      tutorials: [...new Set(selectedTutorials)],
      salt,
      passwordHash,
      sessionToken,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    _saveUsers(users);
    _currentUser = { ...newUser };
    _saveSession(newUser);
    return { success: true, user: _currentUser };
  }

  /* ---- Logout ---- */
  function logout() {
    _clearSession();
  }

  /* ---- Current user ---- */
  function currentUser() { return _currentUser; }
  function isLoggedIn() { return !!_currentUser; }
  function isAdmin() { return _currentUser && _currentUser.role === 'admin'; }
  function isFaculty() { return _currentUser && _currentUser.role === 'faculty'; }
  function userRole() { return _currentUser ? _currentUser.role : null; }

  /* ---- User storage ---- */
  function getUsers() {
    return _loadUsers().map(_ensureUserShape);
  }

  async function addUser(username, password, role, name, profile = {}) {
    if (!isAdmin()) return { success: false, error: 'Only admin can create users' };

    const users = _loadUsers().map(_ensureUserShape);
    const loginName = _normalize(username || profile.email || '');
    const email = String(profile.email || username || '').trim();
    const fullName = String(name || profile.fullName || email || loginName).trim();
    const institution = String(profile.institution || '').trim();
    const contactNumber = String(profile.contactNumber || '').trim();
    const curriculumDefaults = (typeof TutorialCatalog !== 'undefined' && TutorialCatalog.allSelectionIds)
      ? TutorialCatalog.allSelectionIds()
      : { groups: [], tutorials: [] };
    const selectedMainTopics = Array.isArray(profile.selectedMainTopics) && profile.selectedMainTopics.length
      ? profile.selectedMainTopics
      : curriculumDefaults.groups;
    const selectedTutorials = Array.isArray(profile.selectedTutorials) && profile.selectedTutorials.length
      ? profile.selectedTutorials
      : curriculumDefaults.tutorials;

    if (!loginName) {
      return { success: false, error: 'Username or email is required' };
    }
    if (users.find(u => _normalize(u.username) === loginName || _normalize(u.email) === _normalize(email))) {
      return { success: false, error: 'Username already exists' };
    }
    if (!password) {
      return { success: false, error: 'Password is required' };
    }
    const strength = _validatePasswordStrength(password);
    if (!strength.ok) return { success: false, error: strength.message };

    const salt = _newSalt();
    const passwordHash = await _hashPassword(password, salt);
    const user = {
      username: loginName,
      email: email || loginName,
      name: fullName,
      institution,
      contactNumber,
      role: role || 'faculty',
      mainTopics: [...new Set(selectedMainTopics)],
      tutorials: [...new Set(selectedTutorials)],
      salt,
      passwordHash,
      sessionToken: '',
      createdAt: new Date().toISOString()
    };

    users.push(user);
    _saveUsers(users);
    return { success: true, user };
  }

  function deleteUser(username) {
    if (!isAdmin()) return { success: false, error: 'Only admin can delete users' };
    if (_normalize(username) === 'admin') return { success: false, error: 'Cannot delete the default admin' };
    let users = _loadUsers().map(_ensureUserShape);
    const before = users.length;
    users = users.filter(u => _normalize(u.username) !== _normalize(username));
    if (users.length === before) return { success: false, error: 'User not found' };
    _saveUsers(users);
    return { success: true };
  }

  async function resetPassword(username, newPassword) {
    if (!isAdmin()) return { success: false, error: 'Only admin can reset passwords' };
    if (!newPassword) return { success: false, error: 'New password is required' };
    const strength = _validatePasswordStrength(newPassword);
    if (!strength.ok) return { success: false, error: strength.message };

    const users = _loadUsers().map(_ensureUserShape);
    const user = users.find(u => _normalize(u.username) === _normalize(username));
    if (!user) return { success: false, error: 'User not found' };

    const salt = _newSalt();
    user.salt = salt;
    user.passwordHash = await _hashPassword(newPassword, salt);
    if (_currentUser && _normalize(_currentUser.username) === _normalize(user.username)) {
      user.sessionToken = _currentUser.sessionToken || _newSessionToken();
      _currentUser = { ..._currentUser, ...user };
      _saveSession(_currentUser);
    }
    _saveUsers(users);
    return { success: true };
  }

  function updateSelections(username, { mainTopics = [], tutorials = [] } = {}) {
    const users = _loadUsers().map(_ensureUserShape);
    const user = users.find(u => _normalize(u.username) === _normalize(username));
    if (!user) return { success: false, error: 'User not found' };
    user.mainTopics = [...mainTopics];
    user.tutorials = [...tutorials];
    _saveUsers(users);
    if (_currentUser && _normalize(_currentUser.username) === _normalize(user.username)) {
      _currentUser = { ..._currentUser, ...user };
    }
    return { success: true, user };
  }

  function getPasswordStrength(password) {
    return _validatePasswordStrength(password);
  }

  /* ---- Init on load ---- */
  init();

  return {
    init,
    login,
    logout,
    currentUser,
    isLoggedIn,
    isAdmin,
    isFaculty,
    userRole,
    getUsers,
    addUser,
    deleteUser,
    resetPassword,
    registerAccount,
    updateSelections,
    getPasswordStrength
  };
})();
