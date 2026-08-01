/* ============================================
   Shared Firestore data, revisions, and audit history
   ============================================ */

const SharedData = (() => {
  const TYPES = ['members', 'faculty', 'fellows', 'progress', 'meetings', 'minutes', 'resources'];
  const LOCAL_KEY = 'gcps_csv_data';
  const cache = Object.fromEntries(TYPES.map(type => [type, []]));
  const deleted = Object.fromEntries(TYPES.map(type => [type, []]));
  let audit = [];
  let ready = false;
  let cloud = false;

  function db() { return window.FirebaseDb; }
  function serverTimestamp() { return firebase.firestore.FieldValue.serverTimestamp(); }
  function user() { return typeof Auth !== 'undefined' ? Auth.currentUser() : null; }
  function isAdmin() { return Boolean(Auth && Auth.isAdmin && Auth.isAdmin()); }

  function clone(value) {
    return value == null ? value : JSON.parse(JSON.stringify(value));
  }

  function clean(value) {
    if (Array.isArray(value)) return value.map(clean);
    if (!value || typeof value !== 'object') return value;
    return Object.fromEntries(Object.entries(value)
      .filter(([, item]) => item !== undefined)
      .map(([key, item]) => [key, clean(item)]));
  }

  function slug(value) {
    return String(value || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 90);
  }

  function recordId(type, record, index = 0) {
    if (record && (record._id || record.id)) return String(record._id || record.id);
    const candidates = {
      members: [record.ID, record.Email, record.Name],
      faculty: [record.Email, record.Name],
      fellows: [record.ID, record.Email, record.Name],
      progress: [record.FellowId, record.ID, record.Name],
      meetings: [record.Date, record.Title],
      minutes: [record.Date, record.MeetingTitle],
      resources: [record.name, record.file]
    };
    const base = (candidates[type] || [record.Name, record.Title]).filter(Boolean).join('-');
    return slug(base) || `${type}-${Date.now()}-${index}`;
  }

  function localSnapshot() {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_KEY) || '{}') || {};
    } catch (error) {
      return {};
    }
  }

  function saveLocal(type, rows) {
    const snapshot = localSnapshot();
    snapshot[type] = rows.map(row => {
      const copy = { ...row };
      delete copy._id;
      delete copy._revision;
      return copy;
    });
    localStorage.setItem(LOCAL_KEY, JSON.stringify(snapshot));
  }

  function fromDoc(doc) {
    const data = doc.data() || {};
    return { ...data, _id: doc.id, _revision: Number(data.revision || 0) };
  }

  function stripMeta(record) {
    const value = { ...(record || {}) };
    delete value._id;
    delete value._revision;
    delete value.revision;
    delete value.createdAt;
    delete value.createdBy;
    delete value.updatedAt;
    delete value.updatedBy;
    delete value.deletedAt;
    delete value.deletedBy;
    return clean(value);
  }

  function refreshType(type, rows) {
    cache[type] = rows.filter(row => !row.deletedAt);
    deleted[type] = rows.filter(row => Boolean(row.deletedAt));
    saveLocal(type, cache[type]);
  }

  async function loadType(type) {
    if (!cloud) {
      const rows = localSnapshot()[type] || [];
      refreshType(type, rows.map((row, index) => ({ ...row, _id: recordId(type, row, index), _revision: 0 })));
      return;
    }
    const snapshot = await db().collection(type).get();
    refreshType(type, snapshot.docs.map(fromDoc));
  }

  async function loadAudit() {
    if (!cloud || !isAdmin()) {
      audit = [];
      return;
    }
    try {
      const snapshot = await db().collection('auditLogs').orderBy('timestamp', 'desc').limit(150).get();
      audit = snapshot.docs.map(doc => ({ ...doc.data(), _id: doc.id }));
    } catch (error) {
      console.warn('Audit history is not available yet:', error.message || error);
      audit = [];
    }
  }

  async function transact(type, id, action, nextValue, expectedRevision) {
    if (!TYPES.includes(type)) throw new Error(`Unsupported data type: ${type}`);
    if (!cloud) {
      const rows = cache[type].slice();
      const index = rows.findIndex(row => row._id === id);
      if (action === 'delete') {
        if (index >= 0) rows.splice(index, 1);
      } else if (index >= 0) {
        rows[index] = { ...nextValue, _id: id, _revision: Number(rows[index]._revision || 0) + 1 };
      } else {
        rows.push({ ...nextValue, _id: id, _revision: 1 });
      }
      refreshType(type, rows);
      return rows.find(row => row._id === id) || null;
    }

    if (!isAdmin()) throw new Error('Administrator access is required to change shared records.');
    const actor = user();
    const ref = db().collection(type).doc(id);
    const auditRef = db().collection('auditLogs').doc();

    await db().runTransaction(async transaction => {
      const snapshot = await transaction.get(ref);
      const before = snapshot.exists ? fromDoc(snapshot) : null;
      const currentRevision = before ? Number(before._revision || 0) : 0;
      if (expectedRevision != null && Number(expectedRevision) !== currentRevision) {
        throw new Error(`Conflict: this ${type} record changed from revision ${expectedRevision} to ${currentRevision}. Reload and try again.`);
      }

      const revision = currentRevision + 1;
      const now = serverTimestamp();
      let after;
      if (action === 'delete') {
        after = {
          ...stripMeta(before || {}),
          revision,
          createdAt: before && before.createdAt ? before.createdAt : now,
          createdBy: before && before.createdBy ? before.createdBy : actor.uid,
          updatedAt: now,
          updatedBy: actor.uid,
          deletedAt: now,
          deletedBy: actor.uid
        };
      } else if (action === 'restore') {
        after = {
          ...stripMeta(before || {}),
          revision,
          createdAt: before && before.createdAt ? before.createdAt : now,
          createdBy: before && before.createdBy ? before.createdBy : actor.uid,
          updatedAt: now,
          updatedBy: actor.uid,
          deletedAt: null,
          deletedBy: null
        };
      } else {
        after = {
          ...stripMeta(nextValue),
          revision,
          createdAt: before && before.createdAt ? before.createdAt : now,
          createdBy: before && before.createdBy ? before.createdBy : actor.uid,
          updatedAt: now,
          updatedBy: actor.uid,
          deletedAt: null,
          deletedBy: null
        };
      }

      transaction.set(ref, after);
      transaction.set(auditRef, {
        entityType: type,
        entityId: id,
        action,
        revision,
        actorId: actor.uid,
        actorName: actor.name || actor.username || actor.email || 'Administrator',
        timestamp: now,
        before: before ? stripMeta(before) : null,
        after: action === 'delete' ? null : stripMeta(after)
      });
    });

    await Promise.all([loadType(type), loadAudit()]);
    return cache[type].find(row => row._id === id) || deleted[type].find(row => row._id === id) || null;
  }

  async function save(type, record, expectedRevision = null) {
    const id = recordId(type, record);
    const exists = cache[type].find(row => row._id === id) || deleted[type].find(row => row._id === id);
    const revision = expectedRevision == null && exists ? exists._revision : expectedRevision;
    return transact(type, id, exists ? 'update' : 'create', record, revision);
  }

  async function softDelete(type, id, expectedRevision) {
    return transact(type, id, 'delete', null, expectedRevision);
  }

  async function restore(type, id, expectedRevision) {
    return transact(type, id, 'restore', null, expectedRevision);
  }

  async function replaceCollection(type, rows) {
    if (!Array.isArray(rows)) throw new Error('Imported data must be an array.');
    const incomingIds = new Set();
    for (let index = 0; index < rows.length; index += 1) {
      const row = rows[index];
      const id = recordId(type, row, index);
      incomingIds.add(id);
      const existing = cache[type].find(item => item._id === id) || deleted[type].find(item => item._id === id);
      await transact(type, id, existing ? 'update' : 'create', row, existing ? existing._revision : 0);
    }
    for (const existing of cache[type].slice()) {
      if (!incomingIds.has(existing._id)) {
        await softDelete(type, existing._id, existing._revision);
      }
    }

    if (type === 'fellows') {
      const progressRows = rows.map(row => ({
        FellowId: row.ID || row.FellowId || row.Name,
        Name: row.Name || '',
        OverallProgress: row.OverallProgress || '0',
        ModulesTotal: row.ModulesTotal || '0',
        ModulesCompleted: row.ModulesCompleted || '0',
        LastActivity: row.LastActivity || ''
      }));
      await replaceCollection('progress', progressRows);
    }
    return getData(type);
  }

  async function seedIfEmpty(type, rows) {
    if (!isAdmin() || cache[type].length || deleted[type].length || !rows || !rows.length) return;
    await replaceCollection(type, rows);
  }

  async function init() {
    const firebaseUser = window.FirebaseAuth && window.FirebaseAuth.currentUser;
    cloud = Boolean(window.FirebaseDb && firebaseUser);
    await Promise.all(TYPES.map(loadType));

    if (cloud && isAdmin()) {
      const local = localSnapshot();
      for (const type of TYPES) {
        if (!cache[type].length && !deleted[type].length && Array.isArray(local[type]) && local[type].length) {
          await replaceCollection(type, local[type]);
        }
      }
      await seedIfEmpty('faculty', window.DalhousieFacultyDirectory || []);
      await seedIfEmpty('resources', window.DalhousieProgrammeResources || []);
      await loadAudit();
    }
    ready = true;
    return true;
  }

  function getData(type) { return clone(cache[type] || []); }
  function getDeleted(type) { return clone(deleted[type] || []); }
  function getAllDeleted() {
    return TYPES.flatMap(type => (deleted[type] || []).map(record => ({ ...clone(record), _type: type })));
  }
  function getAudit() { return clone(audit); }
  function isReady() { return ready; }
  function isCloud() { return cloud; }
  function types() { return TYPES.slice(); }

  return {
    init,
    isReady,
    isCloud,
    types,
    getData,
    getDeleted,
    getAllDeleted,
    getAudit,
    save,
    softDelete,
    restore,
    replaceCollection,
    seedIfEmpty,
    recordId
  };
})();

window.SharedData = SharedData;
