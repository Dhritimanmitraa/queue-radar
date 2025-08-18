# Queue Radar - Android APK Build Instructions

## 🚀 Quick Build Options

Since Android SDK is not installed locally, you have **TWO OPTIONS** to build your APK:

---

## Option 1: Cloud Build with EAS (Recommended - Already Set Up)

### Prerequisites
- EAS CLI is already installed ✅
- Configuration files are ready ✅

### Steps to Build APK:

1. **Login to Expo Account** (if you don't have one, create free at expo.dev):
   ```bash
   eas login
   ```

2. **Configure the project** (first time only):
   ```bash
   eas build:configure
   ```

3. **Build APK for testing**:
   ```bash
   eas build --platform android --profile preview
   ```

4. **Build production APK**:
   ```bash
   eas build --platform android --profile production
   ```

The build will run in the cloud. You'll get a URL to download your APK when complete (takes ~10-15 minutes).

---

## Option 2: Local Build (Requires Android Studio)

If you prefer building locally, you'll need to:

1. **Install Android Studio** from: https://developer.android.com/studio
   - During installation, ensure Android SDK is installed
   - Default location: `C:\Users\dhrit\AppData\Local\Android\Sdk`

2. **After installation**, run:
   ```bash
   cd android
   .\gradlew.bat assembleRelease
   ```

3. **Find your APK** at:
   ```
   android\app\build\outputs\apk\release\app-release.apk
   ```

---

## 📱 Installing the APK on Android Device

### Method 1: Direct Transfer
1. Connect your Android device via USB
2. Enable "Developer Options" and "USB Debugging" on your device
3. Copy the APK file to your device
4. Open the file on your device and install

### Method 2: Using ADB (if Android SDK installed)
```bash
adb install app-release.apk
```

### Method 3: Download from EAS Build URL
1. Open the build URL from EAS on your Android device
2. Download and install directly

---

## 🔐 Keystore Information

Your release keystore has been created with:
- **Location**: `android/app/queue-radar-release.keystore`
- **Alias**: queue-radar
- **Password**: queueradar2024
- **Validity**: 10,000 days

⚠️ **IMPORTANT**: 
- Keep this keystore file safe! You'll need it for all future app updates
- Never commit the keystore to public repositories
- Back up the keystore file securely

---

## 📦 Current App Configuration

- **Package Name**: com.anonymous.queueradar
- **Version**: 1.0.0
- **Version Code**: 1
- **Min SDK**: 24 (Android 7.0)
- **Target SDK**: 35 (Android 14)

---

## 🛠️ Troubleshooting

### If EAS build fails:
1. Ensure you're logged in: `eas whoami`
2. Check your internet connection
3. Verify app.json configuration

### If local build fails:
1. Ensure Android SDK is properly installed
2. Check ANDROID_HOME environment variable
3. Verify local.properties has correct SDK path
4. Run `cd android && .\gradlew.bat clean` before rebuilding

---

## 📝 Next Steps

After successful APK generation:
1. Test the APK on multiple devices
2. Consider setting up automated CI/CD
3. Prepare for Google Play Store submission
4. Set up crash reporting and analytics

---

## 🔗 Useful Links

- [Expo EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Android Developer Documentation](https://developer.android.com/)
- [React Native Signed APK Guide](https://reactnative.dev/docs/signed-apk-android)
