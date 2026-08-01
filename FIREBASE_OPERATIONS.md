# Firebase Data Operations

Project: `dalhousie-cc176`

## Active Application Protection

- Shared Firestore collections: `members`, `faculty`, `fellows`, `progress`, `meetings`, `minutes`, and `resources`.
- Every shared write uses a Firestore transaction and increments `revision`.
- A stale revision aborts instead of silently overwriting newer data.
- Every create, update, soft delete, and restore writes an immutable `auditLogs` document in the same transaction.
- Shared records are soft-deleted with `deletedAt` and `deletedBy`; administrators restore them from **Restore & Audit**.
- Uploaded file metadata is stored in `resources`; file objects use `resources/{resourceId}/{fileName}` in Firebase Storage.

## Security Rules

- Authenticated users can read active programme data.
- Only administrators can change shared programme records or upload files.
- Shared Firestore documents cannot be hard-deleted by the web application.
- Audit records cannot be updated or deleted.
- Storage accepts authenticated reads and administrator-only PDF/Office uploads up to 25 MB.

Deploy both rule files after authenticating the Firebase CLI:

```powershell
npx --yes firebase-tools@latest deploy --only firestore:rules,storage --project dalhousie-cc176
```

## Backups And Point-In-Time Recovery

Firebase Console currently reports this project on the no-cost Spark plan. Storage, scheduled backups, and point-in-time recovery cannot be enabled until the project has a billing-enabled plan.

After the owner intentionally upgrades the project:

1. Open Firestore Database > **Disaster recovery**.
2. Enable point-in-time recovery for the `(default)` database.
3. Add a daily backup schedule and choose a retention period appropriate for the programme's data policy.
4. Add a weekly backup with a longer retention period if required.
5. Test restoration into a separate database before relying on the backup policy.

Do not upgrade billing or change retention without the project owner's approval. Audit logs and soft deletion remain active independently of the paid recovery features.
