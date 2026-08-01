/* ============================================
   auth.js — Firebase-backed login, session, role-based access, user management
   ============================================ */

const Auth = (() => {
  const USERS_COLLECTION = 'users';
  const ADMIN_EMAIL = 'admin@dalhousie.app';
  const FACULTY_SESSION_KEY = 'dalhousie-faculty-session';
  let _currentUser = null;
  let _users = [];
  let _bootstrapPromise = null;
  let _readyResolve = null;
  let _readySettled = false;
  let _authBound = false;

  const _readyPromise = new Promise(resolve => {
    _readyResolve = resolve;
  });

  function _hasFirebase() {
    return !!(window.firebase && window.FirebaseAuth && window.FirebaseDb && window.FirebaseConfig);
  }

  function _auth() {
    return window.FirebaseAuth;
  }

  function _db() {
    return window.FirebaseDb;
  }

  function _normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function _isConfiguredAdmin(user) {
    return !!user && _normalize(user.email) === ADMIN_EMAIL;
  }

  function _asAdminProfile(user, profile) {
    const defaults = _curriculumDefaults();
    return {
      ...(profile || {}),
      uid: user.uid,
      username: 'admin',
      usernameLower: 'admin',
      email: user.email || ADMIN_EMAIL,
      name: 'Administrator',
      fullName: 'Administrator',
      role: 'admin',
      user_status: 'ACTIVE',
      institution: (profile && profile.institution) || '',
      contactNumber: (profile && profile.contactNumber) || '',
      mainTopics: (profile && Array.isArray(profile.mainTopics)) ? profile.mainTopics : defaults.groups,
      tutorials: (profile && Array.isArray(profile.tutorials)) ? profile.tutorials : defaults.tutorials
    };
  }

  function _slugify(value) {
    return String(value || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function _uuid() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
    return `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
  }

  function _generateTempPassword() {
    return `Gcps!${_uuid().replace(/-/g, '').slice(0, 10)}A1`;
  }

  function _validEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
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

  function _wait(ms) {
    return new Promise(resolve => window.setTimeout(resolve, ms));
  }

  function _curriculumDefaults() {
    return (typeof TutorialCatalog !== 'undefined' && TutorialCatalog.allSelectionIds)
      ? TutorialCatalog.allSelectionIds()
      : { groups: [], tutorials: [] };
  }

  function _facultyProfiles() {
    return Array.isArray(window.DalhousieFacultyProfiles) ? window.DalhousieFacultyProfiles : [];
  }

  function _facultyProfileById(profileId) {
    return _facultyProfiles().find(profile => profile.id === String(profileId || '').trim()) || null;
  }

  function _createLocalFacultyProfile(source, savedProfile = null) {
    const defaults = _curriculumDefaults();
    return {
      uid: `faculty:${source.id}`,
      profileId: source.id,
      username: source.id,
      usernameLower: source.id,
      email: source.email || '',
      name: source.name,
      fullName: source.name,
      role: 'faculty',
      user_status: 'ACTIVE',
      institution: 'Dalhousie-GCPS Faculty',
      position: 'Faculty Participant',
      interests: '',
      mainTopics: savedProfile && Array.isArray(savedProfile.mainTopics)
        ? savedProfile.mainTopics
        : defaults.groups,
      tutorials: savedProfile && Array.isArray(savedProfile.tutorials)
        ? savedProfile.tutorials
        : defaults.tutorials,
      localProfile: true,
      createdAt: (savedProfile && savedProfile.createdAt) || new Date().toISOString(),
      updatedAt: (savedProfile && savedProfile.updatedAt) || new Date().toISOString()
    };
  }

  function _readLocalFacultySession() {
    try {
      const saved = JSON.parse(localStorage.getItem(FACULTY_SESSION_KEY) || 'null');
      const source = saved && _facultyProfileById(saved.profileId);
      return source ? _createLocalFacultyProfile(source, saved) : null;
    } catch (error) {
      return null;
    }
  }

  function _saveLocalFacultySession(profile) {
    localStorage.setItem(FACULTY_SESSION_KEY, JSON.stringify(profile));
  }

  function _usersRef() {
    return _db().collection(USERS_COLLECTION);
  }

  function _userDoc(uid) {
    return _usersRef().doc(uid);
  }

  function _profileFromDoc(docSnap) {
    if (!docSnap || !docSnap.exists) return null;
    const data = docSnap.data() || {};
    const username = data.username || _slugify(data.email || '');
    const fullName = data.fullName || data.name || username;
    return {
      uid: data.uid || docSnap.id,
      username,
      usernameLower: _normalize(data.usernameLower || username),
      email: data.email || '',
      name: fullName,
      fullName,
      role: data.role || 'faculty',
      user_status: data.user_status || 'ACTIVE',
      institution: data.institution || '',
      contactNumber: data.contactNumber || '',
      mainTopics: Array.isArray(data.mainTopics) ? data.mainTopics : [],
      tutorials: Array.isArray(data.tutorials) ? data.tutorials : [],
      revision: Number(data.revision || 0),
      createdAt: data.createdAt || null,
      updatedAt: data.updatedAt || null
    };
  }

  async function _loadProfileByUid(uid) {
    const snap = await _userDoc(uid).get();
    return _profileFromDoc(snap);
  }

  async function _loadProfileByUsername(username) {
    const lookup = _normalize(username);
    if (!lookup) return null;

    let snap = await _usersRef().where('usernameLower', '==', lookup).limit(1).get();
    if (!snap.empty) return _profileFromDoc(snap.docs[0]);

    // Fallback for legacy profiles that may not have usernameLower indexed yet.
    snap = await _usersRef().where('username', '==', String(username || '').trim()).limit(1).get();
    if (!snap.empty) return _profileFromDoc(snap.docs[0]);

    return null;
  }

  async function _loadAllProfiles() {
    const snap = await _usersRef().get();
    return snap.docs.map(_profileFromDoc).filter(Boolean);
  }

  async function _saveProfile(profile) {
    const basePayload = {
      uid: profile.uid,
      username: profile.username || _slugify(profile.email || ''),
      usernameLower: _normalize(profile.usernameLower || profile.username || _slugify(profile.email || '')),
      email: profile.email || '',
      name: profile.name || profile.fullName || profile.username || '',
      fullName: profile.fullName || profile.name || profile.username || '',
      role: profile.role || 'faculty',
      user_status: profile.user_status || 'ACTIVE',
      institution: profile.institution || '',
      contactNumber: profile.contactNumber || '',
      mainTopics: Array.isArray(profile.mainTopics) ? profile.mainTopics : [],
      tutorials: Array.isArray(profile.tutorials) ? profile.tutorials : [],
      updatedAt: new Date().toISOString()
    };
    const userRef = _userDoc(basePayload.uid);
    const auditRef = _db().collection('auditLogs').doc();
    let savedPayload;

    await _db().runTransaction(async transaction => {
      const snapshot = await transaction.get(userRef);
      const before = snapshot.exists ? snapshot.data() : null;
      const currentRevision = Number((before && before.revision) || 0);
      const expectedRevision = Number(profile.revision || 0);
      const hasExpectedRevision = profile.revision !== undefined && profile.revision !== null;
      if (snapshot.exists && hasExpectedRevision && expectedRevision !== currentRevision) {
        throw new Error(`This user profile changed from revision ${expectedRevision} to ${currentRevision}. Reload and try again.`);
      }

      const revision = currentRevision + 1;
      const actor = _auth().currentUser;
      const actorProfile = _currentUser || {};
      savedPayload = {
        ...basePayload,
        revision,
        createdAt: before && before.createdAt ? before.createdAt : (profile.createdAt || new Date().toISOString())
      };

      transaction.set(userRef, savedPayload);
      transaction.set(auditRef, {
        entityType: 'users',
        entityId: basePayload.uid,
        action: snapshot.exists ? 'update' : 'create',
        revision,
        actorId: actor.uid,
        actorName: actorProfile.name || actorProfile.username || actor.email || 'User',
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        before,
        after: savedPayload
      });
    });

    return _profileFromDoc({ exists: true, id: savedPayload.uid, data: () => savedPayload });
  }

  async function _disableProfile(uid) {
    const profile = await _loadProfileByUid(uid);
    if (!profile) throw new Error('User not found');
    await _saveProfile({ ...profile, user_status: 'DELETED' });
  }

  function _secondaryAuth() {
    const appName = '__dalhousie_secondary__';
    const existing = firebase.apps.find(app => app.name === appName);
    const app = existing || firebase.initializeApp(window.FirebaseConfig, appName);
    return firebase.auth(app);
  }

  async function _refreshUsersCache() {
    if (isAdmin()) {
      try {
        _users = (await _loadAllProfiles()).filter(user => _normalize(user.user_status) !== 'deleted');
      } catch (error) {
        console.warn('User management data is not available yet:', error && error.message ? error.message : error);
        _users = _currentUser ? [_currentUser] : [];
      }
      return _users;
    }
    _users = _currentUser ? [_currentUser] : [];
    return _users;
  }

  async function _hydrateFirebaseUser(user) {
    if (!user) {
      _currentUser = null;
      _users = [];
      return null;
    }

    let profile = null;
    try {
      profile = await Promise.race([
        _loadProfileByUid(user.uid),
        _wait(1800).then(() => null)
      ]);
    } catch (error) {
      profile = null;
    }

    if (_isConfiguredAdmin(user)) {
      profile = _asAdminProfile(user, profile);
    }

    if (!profile) {
      profile = {
        uid: user.uid,
        username: _slugify(user.displayName || user.email || user.uid),
        usernameLower: _normalize(_slugify(user.displayName || user.email || user.uid)),
        email: user.email || '',
        name: user.displayName || _slugify(user.email || user.uid),
        fullName: user.displayName || _slugify(user.email || user.uid),
        role: 'faculty',
        user_status: 'ACTIVE',
        institution: '',
        contactNumber: '',
        mainTopics: _curriculumDefaults().groups,
        tutorials: _curriculumDefaults().tutorials
      };
      try {
        profile = await _saveProfile(profile);
      } catch (error) {
        console.warn('Profile sync skipped during hydrate:', error && error.message ? error.message : error);
      }
    }

    if (_normalize(profile.user_status) === 'deleted') {
      await _auth().signOut();
      throw new Error('This account has been disabled');
    }

    _currentUser = profile;
    await _refreshUsersCache();
    return profile;
  }

  async function _bootstrap() {
    if (_bootstrapPromise) return _bootstrapPromise;

    _bootstrapPromise = (async () => {
      // Shared records require a real Firebase identity; legacy local-only
      // faculty sessions are deliberately not restored.
      localStorage.removeItem(FACULTY_SESSION_KEY);

      if (!_hasFirebase()) {
        console.warn('Firebase is not available yet.');
        if (!_readySettled) {
          _readySettled = true;
          _readyResolve();
        }
        return;
      }

      await _auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

      if (!_authBound) {
        _authBound = true;
        _auth().onAuthStateChanged(async user => {
          try {
            if (user) {
              localStorage.removeItem(FACULTY_SESSION_KEY);
              await _hydrateFirebaseUser(user);
            } else {
              _currentUser = null;
              _users = [];
            }
          } catch (error) {
            console.warn(error.message || error);
            _currentUser = null;
            _users = [];
          } finally {
            if (!_readySettled) {
              _readySettled = true;
              _readyResolve();
            }
          }
        });
      }

      const current = _auth().currentUser;
      if (current) {
        try {
          await _hydrateFirebaseUser(current);
        } catch (error) {
          console.warn(error.message || error);
        }
      }

      if (!_readySettled) {
        _readySettled = true;
        _readyResolve();
      }
    })();

    return _bootstrapPromise;
  }

  async function init() {
    return _bootstrap();
  }

  async function ready() {
    await _bootstrap();
    return _readyPromise;
  }

  async function login(identifier, password) {
    await ready();

    const loginName = String(identifier || '').trim();
    const secret = String(password || '');
    if (!loginName || !secret) {
      return { success: false, error: 'Invalid username or password' };
    }

    let email = loginName;
    if (!loginName.includes('@')) {
      if (_normalize(loginName) === 'admin') {
        email = 'admin@dalhousie.app';
      } else {
        const profile = await Promise.race([
          _loadProfileByUsername(loginName),
          _wait(1800).then(() => null)
        ]).catch(() => null);
        if (!profile || _normalize(profile.user_status) === 'deleted') {
          return {
            success: false,
            error: 'Username lookup is taking too long right now. Try signing in with your email address instead.'
          };
        }
        email = profile.email;
      }
    }

    try {
      const credential = await _auth().signInWithEmailAndPassword(email, secret);
      const user = credential && credential.user ? await _hydrateFirebaseUser(credential.user) : null;
      if (!user) return { success: false, error: 'Invalid username or password' };
      return { success: true, user };
    } catch (error) {
      console.error('Auth.login error', error);
      return { success: false, error: error && error.message ? error.message : 'Invalid username or password' };
    }
  }

  async function loginFacultyProfile(profileId, password) {
    await ready();

    const source = _facultyProfileById(profileId);
    if (!source || !String(password || '').trim()) {
      return { success: false, error: 'Select your name and enter a password.' };
    }

    try {
      const savedProfile = await _loadProfileByUsername(source.id);
      if (!savedProfile || !savedProfile.email) {
        return { success: false, error: 'This faculty account has not been activated by the administrator yet.' };
      }
      const credential = await _auth().signInWithEmailAndPassword(savedProfile.email, String(password));
      const profile = await _hydrateFirebaseUser(credential.user);
      return { success: true, user: profile };
    } catch (error) {
      return { success: false, error: error.message || 'Invalid faculty password.' };
    }
  }

  async function registerAccount(payload) {
    await ready();

    const rawFullName = String(payload.fullName || '').trim();
    const rawEmail = String(payload.email || '').trim();
    const rawInstitution = String(payload.institution || '').trim();
    const rawContact = String(payload.contactNumber || '').trim();
    const rawPassword = String(payload.password || '');
    const username = _slugify(payload.username || rawFullName || rawEmail || `faculty-${Date.now()}`) || `faculty-${Date.now()}`;
    const email = _validEmail(rawEmail) ? rawEmail : `${username}@dalhousie.app`;
    const password = rawPassword || _generateTempPassword();
    const strength = _validatePasswordStrength(password);
    const selections = _curriculumDefaults();
    const selectedMainTopics = Array.isArray(payload.selectedMainTopics) && payload.selectedMainTopics.length
      ? payload.selectedMainTopics
      : selections.groups;
    const selectedTutorials = Array.isArray(payload.selectedTutorials) && payload.selectedTutorials.length
      ? payload.selectedTutorials
      : selections.tutorials;

    if (!strength.ok) {
      return { success: false, error: strength.message };
    }

    try {
      const credential = await _auth().createUserWithEmailAndPassword(email, password);
      const profile = {
        uid: credential.user.uid,
        username,
        usernameLower: _normalize(username),
        email,
        name: rawFullName || 'New Faculty',
        fullName: rawFullName || 'New Faculty',
        role: 'faculty',
        user_status: 'ACTIVE',
        institution: rawInstitution || 'GCPS',
        contactNumber: rawContact || '0000000000',
        mainTopics: [...new Set(selectedMainTopics)],
        tutorials: [...new Set(selectedTutorials)]
      };
      const savedProfile = await _saveProfile(profile);
      _currentUser = savedProfile;
      await _refreshUsersCache();
      return {
        success: true,
        user: savedProfile,
        generatedPassword: !rawPassword,
        tempPassword: !rawPassword ? password : ''
      };
    } catch (error) {
      return { success: false, error: error.message || 'Unable to create account' };
    }
  }

  async function addUser(username, password, role, name, profile = {}) {
    await ready();
    if (!isAdmin()) return { success: false, error: 'Only admin can create users' };

    const safeUsername = _slugify(username || profile.email || name || `user-${Date.now()}`);
    const email = _validEmail(profile.email) ? profile.email : `${safeUsername}@dalhousie.app`;
    const safePassword = String(password || '').trim() || _generateTempPassword();
    const strength = _validatePasswordStrength(safePassword);
    if (!strength.ok) return { success: false, error: strength.message };

    const selections = _curriculumDefaults();
    const selectedMainTopics = Array.isArray(profile.selectedMainTopics) && profile.selectedMainTopics.length
      ? profile.selectedMainTopics
      : selections.groups;
    const selectedTutorials = Array.isArray(profile.selectedTutorials) && profile.selectedTutorials.length
      ? profile.selectedTutorials
      : selections.tutorials;

    try {
      const secondary = _secondaryAuth();
      const credential = await secondary.createUserWithEmailAndPassword(email, safePassword);
      const newProfile = await _saveProfile({
        uid: credential.user.uid,
        username: safeUsername,
        usernameLower: _normalize(safeUsername),
        email,
        name: String(name || profile.fullName || safeUsername).trim() || safeUsername,
        fullName: String(name || profile.fullName || safeUsername).trim() || safeUsername,
        role: role || 'faculty',
        user_status: 'ACTIVE',
        institution: String(profile.institution || '').trim(),
        contactNumber: String(profile.contactNumber || '').trim(),
        mainTopics: [...new Set(selectedMainTopics)],
        tutorials: [...new Set(selectedTutorials)]
      });
      if (secondary.currentUser) await secondary.signOut();
      await _refreshUsersCache();
      return {
        success: true,
        user: newProfile,
        generatedPassword: !String(password || '').trim(),
        tempPassword: !String(password || '').trim() ? safePassword : ''
      };
    } catch (error) {
      return { success: false, error: error.message || 'Unable to create user' };
    }
  }

  async function deleteUser(username) {
    await ready();
    if (!isAdmin()) return { success: false, error: 'Only admin can delete users' };

    const lookup = String(username || '').trim();
    const profile = await _loadProfileByUsername(lookup) || await _loadProfileByUsername(_slugify(lookup));
    if (!profile) return { success: false, error: 'User not found' };
    if (_normalize(profile.username) === 'admin') {
      return { success: false, error: 'Cannot delete the default admin' };
    }

    await _disableProfile(profile.uid);
    if (_currentUser && _currentUser.uid === profile.uid) {
      await _auth().signOut();
    }
    await _refreshUsersCache();
    return { success: true };
  }

  async function resetPassword(username, newPassword) {
    await ready();
    if (!isAdmin()) return { success: false, error: 'Only admin can reset passwords' };

    const lookup = String(username || '').trim();
    const target = lookup.includes('@')
      ? await _loadProfileByUsername(_slugify(lookup.split('@')[0]))
      : await _loadProfileByUsername(lookup);
    if (!target) return { success: false, error: 'User not found' };

    try {
      await _auth().sendPasswordResetEmail(target.email);
      return { success: true, message: `Password reset email sent to ${target.email}` };
    } catch (error) {
      return { success: false, error: error.message || 'Unable to send reset email' };
    }
  }

  async function updateSelections(username, { mainTopics = [], tutorials = [] } = {}) {
    await ready();

    const lookup = String(username || '').trim();
    const profile = (_currentUser && (
      _normalize(_currentUser.username) === _normalize(lookup) ||
      _normalize(_currentUser.email) === _normalize(lookup)
    ))
      ? _currentUser
      : await _loadProfileByUsername(lookup) || await _loadProfileByUsername(_slugify(lookup));

    if (!profile) return { success: false, error: 'User not found' };

    const nextProfile = {
      ...profile,
      mainTopics: [...new Set(mainTopics)],
      tutorials: [...new Set(tutorials)],
      updatedAt: new Date().toISOString()
    };

    if (nextProfile.localProfile) {
      _saveLocalFacultySession(nextProfile);
      _currentUser = nextProfile;
      _users = [nextProfile];
      return { success: true, user: nextProfile };
    }

    const savedProfile = await _saveProfile(nextProfile);
    if (_currentUser && _currentUser.uid === nextProfile.uid) {
      _currentUser = savedProfile;
    }
    await _refreshUsersCache();
    return { success: true, user: savedProfile };
  }

  function currentUser() {
    return _currentUser;
  }

  function isLoggedIn() {
    return !!_currentUser;
  }

  function isAdmin() {
    return _currentUser && _normalize(_currentUser.role) === 'admin' && _normalize(_currentUser.user_status) !== 'deleted';
  }

  function isFaculty() {
    return _currentUser && _normalize(_currentUser.role) === 'faculty' && _normalize(_currentUser.user_status) !== 'deleted';
  }

  function userRole() {
    return _currentUser ? _currentUser.role : null;
  }

  function getUsers() {
    return _users.slice();
  }

  async function logout() {
    localStorage.removeItem(FACULTY_SESSION_KEY);
    _currentUser = null;
    _users = [];
    if (_hasFirebase() && _auth().currentUser) {
      await _auth().signOut();
    }
  }

  function getPasswordStrength(password) {
    return _validatePasswordStrength(password);
  }

  init();

  const api = {
    init,
    ready,
    login,
    loginFacultyProfile,
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

  if (typeof window !== 'undefined') {
    window.Auth = api;
  }

  return api;
})();
