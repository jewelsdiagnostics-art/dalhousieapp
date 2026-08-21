# Firebase Android Setup

Use this exact information when adding the Android app in Firebase Console.

## App registration

- Platform: Android
- Android package name: `com.dalhousie.app`
- App nickname: `Dalhousie Companion Android`
- Debug SHA-1: optional for now
- Release SHA-1: add later after you create the upload keystore if needed

## After registration

1. Download the generated `google-services.json`.
2. Save it to:

`android/app/google-services.json`

3. Open Android Studio and sync the project.

## Firebase products to enable

- Authentication
- Firestore
- Storage
- Cloud Messaging

## Suggested Firestore collections

- `users`
- `faculty`
- `meetings`
- `minutes`
- `resources`
- `notifications`
- `auditLogs`

## Suggested Android package behavior

- Sign in with Firebase Authentication
- Load profile data from Firestore
- Read meetings and resources in real time
- Upload files to Firebase Storage
- Save uploaded file metadata back to Firestore
- Receive notifications through FCM

## Notes

- The web app and Android app should use the same Firebase project: `dalhousie-cc176`
- If you use role-based access, keep the Firestore rules aligned across both clients
- Do not hand-write `google-services.json`; Firebase generates it for you

