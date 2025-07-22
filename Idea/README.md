# 🚀 Queue Radar - Live Barber Queue Management

**Skip the wait, find your cut!**

Queue Radar is a real-time mobile app that connects customers with nearby barbershops and salons, showing live queue information to help customers avoid long waits while helping barbers manage their queues efficiently.

## ✨ Features

### For Customers 👥
- **Live Map View**: See nearby salons with real-time queue information
- **Color-coded Markers**: Instantly identify wait times (Green = No wait, Orange = Short wait, Red = Long wait)
- **Detailed Salon Info**: View salon details, hours, contact info, and current queue status
- **Navigation Integration**: Direct navigation to selected salons via Google Maps
- **Call Integration**: One-tap calling to salons

### For Barbers 💺
- **Real-time Queue Management**: Simple +/- buttons to update queue length
- **Live Updates**: Changes instantly reflect across all customer devices
- **Demo Data Seeding**: Easy setup with sample salon data
- **Professional Dashboard**: Clean, intuitive interface for queue management

### Technical Features 🛠️
- **Cross-platform**: React Native (iOS, Android, Web)
- **Real-time Sync**: Firebase Firestore with live listeners
- **Offline Support**: Graceful handling of network issues
- **Push Notifications**: Ready for customer alerts (future enhancement)
- **Security**: Firestore rules prevent unauthorized queue modifications

## 🏗️ Architecture

```
Queue Radar/
├── mobile/                    # React Native Expo app
│   ├── components/           # Reusable UI components
│   │   └── SalonMarker.tsx  # Map marker with salon info
│   ├── screens/             # Main app screens
│   │   ├── RoleGate.tsx    # Customer/Barber selection
│   │   ├── CustomerHome.tsx # Map view for customers
│   │   └── BarberDashboard.tsx # Queue management
│   ├── services/            # Business logic & APIs
│   │   ├── firebase.ts     # Firebase configuration
│   │   ├── demoData.ts     # Demo salon data
│   │   ├── location.ts     # Location permissions
│   │   └── notifications.ts # Push notification helpers
│   └── navigation/          # App navigation setup
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Firebase project (for live data)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/queue-radar.git
   cd queue-radar
   ```

2. **Install dependencies**
   ```bash
   cd mobile
   npm install
   ```

3. **Set up Firebase** (Optional - app works with demo data)
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Firestore Database
   - Copy your config from Project Settings > General > Your apps
   - Replace the config in `mobile/services/firebase.ts`

4. **Start the development server**
   ```bash
   npm start
   # or
   expo start
   ```

5. **Run on your preferred platform**
   - **Mobile**: Scan QR code with Expo Go app
   - **iOS Simulator**: Press `i`
   - **Android Emulator**: Press `a`  
   - **Web Browser**: Press `w`

## 📱 Demo Usage

1. **Launch the app** - You'll see the role selection screen
2. **As a Barber**:
   - Tap "I'm a Barber"
   - Use "Seed Demo Data" to create sample salons
   - Use +/- buttons to modify queue length
3. **As a Customer**:
   - Tap "I'm a Customer" 
   - Grant location permission
   - View the map with colored markers showing queue status
   - Tap markers for salon details and actions

## 🔥 Firebase Setup (Production)

### Firestore Collections

**salons** collection structure:
```javascript
{
  name: "Fade Masters",                    // string
  location: GeoPoint(40.7128, -74.0060), // Firestore GeoPoint
  queue: 3,                               // number
  ownerUid: "firebase-auth-uid",          // string
  lastUpdated: 1640995200000,             // timestamp
  address: "123 Broadway, NY",            // string (optional)
  phone: "(555) 123-4567",               // string (optional)
  hours: "9 AM - 8 PM"                   // string (optional)
}
```

### Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /salons/{salonId} {
      allow read: if true;  // Anyone can view queue info
      allow write: if request.auth != null && 
                   request.auth.uid == resource.data.ownerUid;
    }
  }
}
```

## 🛠️ Development

### Project Structure
- **Expo SDK 49**: Latest stable version with TypeScript
- **Firebase v10**: Real-time database and authentication
- **React Navigation 6**: Type-safe navigation
- **React Native Maps**: Google Maps integration
- **Expo Notifications**: Push notification support

### Key Technologies
- **Frontend**: React Native, TypeScript, Expo
- **Backend**: Firebase (Firestore, Auth, Cloud Functions)
- **Maps**: Google Maps SDK
- **State Management**: React hooks + Firebase listeners
- **Styling**: React Native StyleSheet

### Adding Features
1. **Authentication**: Implement barber sign-up/login in `services/firebase.ts`
2. **Geofencing**: Add location-based salon filtering
3. **Appointments**: Extend Firestore schema for booking system
4. **Analytics**: Add Firebase Analytics for usage tracking
5. **Push Notifications**: Use `services/notifications.ts` for alerts

## 📋 Roadmap

- [ ] **Authentication System**: Barber registration and login
- [ ] **Salon Registration**: Address geocoding and verification  
- [ ] **Customer Notifications**: Alerts when queue drops below threshold
- [ ] **Appointment Booking**: Schedule ahead functionality
- [ ] **Analytics Dashboard**: Queue insights for barbers
- [ ] **Multi-language Support**: Internationalization
- [ ] **Dark Mode**: Theme support
- [ ] **Offline Mode**: Local storage and sync

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Expo Team** for the excellent development platform
- **Firebase** for real-time database capabilities  
- **React Native Community** for the maps integration
- **Contributors** who help improve Queue Radar

---

**Built with ❤️ for barbers and customers who value their time**

*Star ⭐ this repo if you found it helpful!* 