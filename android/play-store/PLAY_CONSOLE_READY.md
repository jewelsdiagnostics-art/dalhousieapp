# Play Console Ready Pack

This pack covers the three release-prep items you asked for:

1. Signed AAB creation steps
2. Firebase Android registration details
3. Final Play Store listing fields

## 1. Signed AAB creation

### In Android Studio

1. Open the `android/` folder as a project.
2. Wait for Gradle sync to finish.
3. Confirm `app/google-services.json` is present.
4. Confirm your release signing properties file exists at `android/release-signing.properties`.
5. Go to **Build** -> **Generate Signed Bundle / APK**.
6. Select **Android App Bundle**.
7. Choose the `release` variant.
8. Select your upload keystore.
9. Enter keystore password, key alias, and key password.
10. Finish the wizard and let Android Studio build the bundle.

### Expected output

The signed bundle should be written to:

`android/app/build/outputs/bundle/release/`

### If you need the keystore command

```bash
keytool -genkeypair -v -keystore dalhousie-upload.jks -alias upload -keyalg RSA -keysize 2048 -validity 10000
```

## 2. Firebase Android registration

See `android/play-store/FIREBASE_ANDROID_SETUP.md` for the exact Firebase Console fields and service checklist.

## 3. Play Store listing fields

### App identity

- App name: `Dalhousie Companion`
- Package name: `com.dalhousie.app`
- Category: `Education`
- Contact email: `dfiagbe@gmail.com`

### Short description

Mobile companion for meetings, resources, updates, and faculty notifications.

### Full description

Dalhousie Companion is the native Android companion app for the Dalhousie web portal.

It is designed for quick mobile access to the most important programme information:

- Meetings and notices
- Faculty and profile updates
- Resource downloads
- Notifications and reminders
- Firebase-backed sign in and shared data sync

The app complements the web portal rather than replacing it. The web app remains the full administrative and desktop experience, while the Android app focuses on mobile convenience, timely alerts, and on-the-go access to approved content.

Features:

- Sign in with your existing Dalhousie account
- View synced meetings and shared resources
- Upload approved documents to Firebase Storage
- Receive reminders and notifications
- Stay aligned with the same Firestore data used by the web app

### Store assets

- App icon: 512 x 512 PNG
- Feature graphic: 1024 x 500 PNG
- Screenshots: 4 to 6 PNGs

### Suggested screenshot order

1. Login screen
2. Dashboard with meetings/resources
3. Resource upload flow
4. Notifications screen

### Policy links

- Privacy policy URL: host `android/play-store/PRIVACY_POLICY.md` content on your website or docs site
- Terms of service URL: add your official terms page

### App access

Because the app uses sign-in, provide Google Play with:

- test account instructions
- what users should enter
- any special steps to reach the app home screen

## Verification note

If Play Console is still under account verification, you can finish these steps now and upload the signed AAB as soon as verification clears.
