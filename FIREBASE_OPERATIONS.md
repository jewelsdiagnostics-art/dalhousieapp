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

## Faculty Login Activation

Faculty directory entries are not automatically authentication accounts. An administrator activates each person from **User Management > Faculty Account Activation**:

1. Select **Prepare Account** beside the faculty member.
2. Keep the prepared directory username unchanged.
3. Leave email blank so Firebase uses the private `username@dalhousie.app` sign-in address.
4. Assign a unique password of at least eight characters and create the user.
5. Give that password directly to the faculty member through an appropriate private channel.

The faculty member then selects their name on the portal and enters the assigned password. Arbitrary passwords do not work, and passwords are stored by Firebase Authentication rather than in GitHub or Firestore.

Deploy both rule files after authenticating the Firebase CLI:

```powershell
npx --yes firebase-tools@latest deploy --only firestore:rules,storage --project dalhousie-cc176
```

## Backups And Point-In-Time Recovery

The project uses the Blaze plan. The following managed recovery settings are active for the `(default)` Firestore database:

- Point-in-time recovery: 7 days.
- Daily backups: 14-day retention.
- Weekly backups: every Sunday with 84-day retention.
- Default Storage bucket: `gs://dalhousie-cc176.firebasestorage.app`.

Review these settings periodically in Firestore Database > **Disaster recovery**. Test restoration into a separate database before relying on the backup policy for an emergency.

Do not change billing or retention without the project owner's approval. Audit logs and soft deletion remain active independently of the managed recovery features.
