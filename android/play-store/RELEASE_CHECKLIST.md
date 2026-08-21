# Release Checklist

## Before first upload

- Create a Google Play developer account with `dfiagbe@gmail.com`
- Complete developer verification
- Pay the one-time registration fee if using full distribution
- Register the Android app package in Firebase and download `google-services.json`
- Create the release keystore and fill in `release-signing.properties`
- Build a signed Android App Bundle (`.aab`)

## Testing path

- Install the app on a real Android device
- Run the app in Android Studio emulator
- Upload the bundle to internal testing first
- Add test account credentials in Play Console pre-launch settings if needed
- Fix any issues found in the pre-launch report
- Move to closed testing after internal QA is stable
- Promote to production when ready

## Required Play Console data

- App name
- Short description
- Full description
- App icon
- Screenshots
- Feature graphic
- Privacy policy URL
- Data safety answers
- App access instructions if sign-in is required

## Build commands

Open the `android/` folder in Android Studio and generate:

- Debug build for development
- Release AAB for Play Console upload

