# Expo Go Customer Side Debugging Guide

## What I've Fixed

### 1. Location Permissions ✅
- Added `ACCESS_COARSE_LOCATION` and `ACCESS_FINE_LOCATION` permissions to Android config
- Added iOS location usage descriptions (`NSLocationWhenInUseUsageDescription`)

### 2. Enhanced Error Logging ✅
- Added comprehensive console logging throughout the location and places fetching process
- Added specific error messages for Firebase connection issues
- Added step-by-step debugging in location service

### 3. Google Maps Configuration ✅
- Added Google Maps API key placeholder in app.json
- Added debugging for API key presence/absence
- Enhanced Places API error reporting

### 4. Firebase Connection Logging ✅
- Added initialization logging for Firebase components
- Added error handling for Firestore queries

## How to Debug

### Step 1: Check Console Logs
When you run the app in Expo Go, open the browser console or Metro logs and look for these specific messages:

**Location Process:**
```
🚀 CustomerHome: Starting location and places fetch...
📍 Getting location...
🔍 getBestEffortPositionAsync: Starting location request...
📋 Requesting location permissions...
📋 Permission status: granted
📍 Getting current position...
✅ Current position obtained: {lat: ..., lng: ..., source: "current", accuracy: ...}
```

**Places API:**
```
🔍 Fetching nearby salons...
🗺️ fetchNearbySalons: Starting places search...
🔑 Google Maps API Key status: Present/Missing
```

**Firebase:**
```
🔥 Initializing Firebase app...
✅ Firebase app initialized
🔐 Initializing Firebase auth...
✅ Firebase auth initialized
🗄️ Initializing Firestore...
✅ Firestore initialized
🔥 Setting up Firebase listener for salons...
✅ Firebase salons loaded: X
```

### Step 2: Common Issues & Solutions

#### Issue: Location Permission Denied
**Symptoms:** Error message "Permission to access location was denied"
**Solution:** 
1. Restart Expo Go completely
2. Clear app data for Expo Go
3. Make sure device location services are enabled
4. Grant location permission when prompted

#### Issue: Google Maps API Key Missing
**Symptoms:** "No Google Maps API key, using OSM fallback"
**Solution:**
1. Get a Google Maps API key from Google Cloud Console
2. Set environment variable: `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here`
3. Or update `app.json` with your actual API key

#### Issue: Firebase Connection Problems
**Symptoms:** "Firebase error: ..." messages
**Solution:**
1. Check if `firebaseConfig.ts` has correct project settings
2. Verify internet connection
3. Check Firebase project status

#### Issue: Map Not Showing
**Symptoms:** Infinite loading spinner
**Solution:**
1. Check if location is being obtained (look for "Location obtained" log)
2. Verify Maps dependencies are properly installed
3. Check for JavaScript errors in console

### Step 3: Environment Variables

## ✅ GOOD NEWS: Your app is working!

Based on the logs, your location and places are working correctly. You just need to:

**Optional: Add Google Maps API Key** (currently using OSM fallback which works fine)
Create a `.env` file in your project root:
```bash
# Get your API key from: https://console.cloud.google.com/
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

**Firebase** (already working with defaults):
```bash
# Optional - only if you want to use your own Firebase project
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
```

### Step 4: Testing Steps

1. **Clean Restart:**
   ```bash
   npm start -- --clear
   ```

2. **Check Metro Logs:**
   Open the Metro bundler console and watch for error messages

3. **Test Location Manually:**
   Try using other location-based apps on the device to ensure location services work

4. **Check Network:**
   Ensure device has internet connection for Firebase and Places API

### Step 5: Emergency Fallbacks

If location still fails, the app will:
1. Try last known location
2. Fall back to New Delhi coordinates (28.6139, 77.2090)
3. Still load the map and Firebase data

## Next Steps

Run the app and check the console for the specific error messages. The enhanced logging will tell you exactly where the failure occurs:

- Location permission issues
- Network connectivity problems  
- API key configuration
- Firebase connection problems
- Map rendering issues

Share the console output and I can help identify the specific issue!
