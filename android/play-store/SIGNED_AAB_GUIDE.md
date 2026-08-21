# Signed AAB Guide

This is the release path for the Dalhousie Companion Android app.

## 1. Add the Firebase Android app

1. Open Firebase Console for project `dalhousie-cc176`.
2. Register a new Android app using the package name `com.dalhousie.app`.
3. Download `google-services.json`.
4. Place it at `android/app/google-services.json`.

## 2. Create the upload keystore

Run the Android Studio terminal or your local JDK `keytool`:

```bash
keytool -genkeypair -v -keystore dalhousie-upload.jks -alias upload -keyalg RSA -keysize 2048 -validity 10000
```

Keep the keystore and passwords private.

## 3. Create the signing properties file

Copy [`release-signing.properties.example`](../release-signing.properties.example) to:

`android/release-signing.properties`

Fill in:

- `storeFile`
- `storePassword`
- `keyAlias`
- `keyPassword`

## 4. Open the project in Android Studio

1. Open the `android/` folder as a project.
2. Wait for Gradle sync.
3. Make sure the Firebase dependencies resolve.
4. Confirm the app runs on an emulator or device.

## 5. Build the release AAB

In Android Studio:

1. Go to **Build**.
2. Choose **Generate Signed Bundle / APK**.
3. Select **Android App Bundle**.
4. Pick the `release` build variant.
5. Enter the keystore credentials.
6. Finish the wizard.

The bundle will be placed under:

`android/app/build/outputs/bundle/release/`

## 6. Upload to Play Console

1. Open Play Console.
2. Select your Dalhousie app.
3. Go to **Internal testing** first.
4. Upload the `.aab`.
5. Complete the release notes.
6. Review the pre-launch report.
7. Promote to closed testing or production when stable.

## Common issues

- If Firebase classes cannot be resolved, confirm `google-services.json` is in `android/app/`.
- If release signing fails, check the keystore path and passwords in `release-signing.properties`.
- If Play Console rejects the bundle, confirm the applicationId is still `com.dalhousie.app`.

