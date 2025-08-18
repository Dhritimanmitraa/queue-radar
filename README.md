# 🎯 Queue Radar

A modern React Native mobile application that helps users find and track salon queues in real-time, reducing wait times and improving the customer experience.

## 📱 Screenshots

*Screenshots coming soon...*

## ✨ Features

- 🔐 **Firebase Authentication** - Secure user login and registration
- 🗺️ **Interactive Maps** - Real-time salon locations using React Native Maps
- 📍 **Location Services** - Find nearby salons based on your location
- 🔔 **Push Notifications** - Get notified about queue updates
- 👨‍💼 **Role-based Access** - Separate interfaces for customers and barbers
- 📊 **Real-time Queue Management** - Live queue status and wait times
- 🎨 **Modern UI** - Clean, intuitive interface built with React Native

## 🚀 Tech Stack

- **Frontend**: React Native 0.79.5
- **Framework**: Expo SDK 53
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Maps**: React Native Maps
- **Navigation**: React Navigation v6
- **Notifications**: Expo Notifications
- **Location**: Expo Location

## 📋 Prerequisites

Before you begin, ensure you have:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Git](https://git-scm.com/)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Dhritimanmitraa/queue-radar.git
   cd queue-radar
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication and Firestore
   - Copy your Firebase config to `services/firebase.ts`

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on your device**
   - Install [Expo Go](https://expo.dev/client) on your mobile device
   - Scan the QR code from the terminal

## 📦 Building Android APK

You can generate a signed release APK via cloud builds without installing Android Studio. See detailed steps in `BUILD_INSTRUCTIONS.md`.

Quick start with Expo EAS:

```bash
eas login
eas build:configure
eas build --platform android --profile production
```

Alternatively, for a local build (requires Android SDK), run:

```bash
cd android
./gradlew assembleRelease
```

## 📁 Project Structure

```
queue-radar/
├── components/           # Reusable UI components
│   ├── SalonMarker.native.tsx  # Firestore salon marker (native)
│   ├── SalonMarker.web.tsx     # Placeholder (web)
│   └── PlaceMarker.native.tsx  # Google Places salon marker (native)
├── screens/             # App screens
│   ├── AuthLogin.tsx    # Login screen
│   ├── CustomerHome.native.tsx # Customer dashboard (native, with map)
│   ├── CustomerHome.web.tsx    # Customer dashboard (web, Google Map)
│   ├── BarberDashboard.tsx # Barber interface
│   ├── RoleGate.tsx     # Role selection
│   └── SalonList.tsx    # Salon listing
├── services/            # External services
│   ├── firebase.ts      # Firebase configuration
│   ├── location.ts      # Location services
│   ├── notifications.ts # Push notifications
│   ├── demoData.ts      # Sample data
│   └── places.ts        # Google Places nearby search
├── App.native.tsx / App.web.tsx  # Root component
├── package.json         # Dependencies
└── tsconfig.json        # TypeScript config
``` 

## 🌐 Google Maps / Places API Setup

1) Enable APIs in Google Cloud: Places API and Maps JavaScript API (web). Optionally enable Maps SDK for Android/iOS if you plan to use native Google Maps tiles.

2) Set a public environment variable so both web and native fetch can access Google Places:

Windows (PowerShell/CMD):
```
set EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_API_KEY
```

macOS/Linux:
```
export EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_API_KEY
```

3) Start the app after setting the key: `npm start`

## 🗺️ OpenStreetMap (OSM) Fallback

If no `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` is set, the app will automatically:
- Fetch nearby salons with Overpass (OSM) via `services/osm.ts`
- Show native markers in the mobile app using the fetched OSM results
- On web, display a friendly message prompting to add a Google Maps key

This lets you test “nearby salons” without a Google key. For full web mapping tiles and Google Places details (ratings/open-now), provide the Google key.

## 💈 Barber Dashboard

The barber-facing dashboard has been redesigned for speed and clarity:
- Open/Closed toggle with a clear status badge
- Large queue counter with estimated wait (minutes per customer × people waiting)
- Quick actions for common updates: -1, +1, +2, +5, and Clear
- Manual set input and adjustable minutes-per-customer

All updates sync in real time to Firestore. New fields include `isOpen`, `avgMinutesPerCustomer`, and `lastUpdated`.