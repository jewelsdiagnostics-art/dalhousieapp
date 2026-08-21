# Dalhousie Companion Android App

This folder is a native Android companion app scaffold for the Dalhousie web application.

It is intentionally separate from the web app and is meant to complement it, not replace it.

## Included structure

- Jetpack Compose UI shell
- Firebase Authentication hooks
- Firestore repository stubs for shared data sync
- Firebase Storage upload stubs
- Firebase Cloud Messaging service stub
- Periodic sync worker stub
- Release signing placeholders

## Recommended stack

- Kotlin
- Jetpack Compose
- Firebase Auth
- Cloud Firestore
- Cloud Storage
- Firebase Cloud Messaging

## Next steps

1. Open this folder in Android Studio as a new project.
2. Add your Firebase Android app configuration file to `app/google-services.json`.
3. Replace the repository stubs with the exact collections and roles you already use on the web app.
4. Create your app icon, splash assets, and Play Store listing assets.
5. Set up release signing before your first Play upload.
6. Sync the same Firebase project ID used by the web app so both apps share authentication and data.

## Build notes

- The project is configured to compile as soon as Android Studio can resolve dependencies.
- Firebase wiring is conditional on `app/google-services.json` being present.
- Release signing is optional during development and becomes active when `release-signing.properties` is created.
- The login screen uses Firebase Authentication and the app shell listens to Firestore streams for meetings and resources.
- Resource uploads use Firebase Storage first, then save the resulting metadata back to Firestore.

## Project layout

- `app/src/main/java/com/dalhousie/app/ui`: Compose screens and theme
- `app/src/main/java/com/dalhousie/app/data`: Firebase repositories
- `app/src/main/java/com/dalhousie/app/services`: Firebase Messaging
- `app/src/main/java/com/dalhousie/app/workers`: background sync jobs

## Signing

See `release-signing.properties.example` for the fields you will need when creating a release keystore.

## Play Console ready pack

For the exact steps to build the signed AAB, register the Android app in Firebase, and fill the Play Store listing fields, open:

- `android/play-store/PLAY_CONSOLE_READY.md`
