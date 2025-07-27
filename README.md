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

## 📁 Project Structure

```
queue-radar/
├── components/           # Reusable UI components
│   └── SalonMarker.tsx  # Map marker component
├── screens/             # App screens
│   ├── AuthLogin.tsx    # Login screen
│   ├── CustomerHome.tsx # Customer dashboard
│   ├── BarberDashboard.tsx # Barber interface
│   ├── RoleGate.tsx     # Role selection
│   └── SalonList.tsx    # Salon listing
├── services/            # External services
│   ├── firebase.ts      # Firebase configuration
│   ├── location.ts      # Location services
│   ├── notifications.ts # Push notifications
│   └── demoData.ts      # Sample data
├── App.tsx              # Root component
├── package.json         # Dependencies
└── tsconfig.json        # TypeScript config
``` 