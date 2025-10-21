### Product Requirement Document (PRD) — Queue Radar

- Version: 1.0  
- Owners: Team  
- Status: Draft  
- Last updated: Today

## Overview
Queue Radar is a cross-platform mobile and web application that helps customers discover nearby salons and view real-time queue status and estimated wait times. Barbers manage their live queues, opening/closing status, and average minutes per customer, with all updates synced to the cloud.

## Goals and Non-Goals
- **Goals**:
  - **Discover nearby salons**: Map and list, with distance and basic details.
  - **Real-time queues**: Show queue count and estimated wait time.
  - **Barber controls**: Open/Closed, increment/decrement, quick-set and manual set, adjust minutes-per-customer.
  - **Notifications**: Inform customers about significant queue changes or openings.
  - **Cross-platform**: Native (iOS/Android via Expo) and web.
- **Non-Goals**:
  - **Payments**: No booking or payment processing.
  - **Advanced CRM**: No inventory or staff management in MVP.
  - **Offline-first**: Not required beyond basic caching.

## Target Users and Personas
- **Customer**: Finds salons, compares queues, decides where to go.
- **Barber/Owner**: Updates live queue and open status; seeks throughput and clarity.
- **Admin (future)**: Oversees data, moderation, analytics.

## Key Use Cases
- **Customer**:
  - Open app → grant location → view nearby salons on map/list.
  - Tap salon → see queue count and ETA; optionally receive notifications.
- **Barber**:
  - Sign in → Barber Dashboard.
  - Toggle Open/Closed; adjust queue via quick actions or manual set; tune minutes-per-customer.
  - Changes sync to Firestore and reflect to customers within seconds.
- **Web**:
  - Hash-based routing to customer, barber, and role gate views.

## Functional Requirements
- **Authentication**
  - Email/password auth via Firebase.
  - Session persistence.
- **Role Gate**
  - Role selection screen: Customer or Barber.
  - Route to `CustomerHome` or `BarberDashboard`.
- **Customer Experience**
  - Foreground location permission and retrieval.
  - Nearby discovery using Google Places (when API key present) or OSM/Overpass fallback.
  - Map markers and alternate list view; basic salon details and ETA.
- **Barber Experience**
  - Open/Closed toggle with visible status badge.
  - Quick actions: -1, +1, +2, +5, Clear; manual set; adjust `avgMinutesPerCustomer`.
  - Real-time Firestore sync: `isOpen`, `queueCount`, `avgMinutesPerCustomer`, `lastUpdated`.
- **Notifications**
  - Request permissions (outside Expo Go).
  - Register device token; support sending basic queue/open status updates (MVP can be per-device).
- **Web Routing**
  - Hash-based: `/customer`, `/barber`, default role gate.

## Non-Functional Requirements
- **Performance**: Map interactions under 100ms; initial map render < 3s on mid-range devices.
- **Reliability**: Real-time update latency < 2s for 90th percentile.
- **Security**: Firebase rules to restrict writes to barbers; read access for customers.
- **Accessibility**: Adequate contrast; large touch targets; readable fonts.
- **Compatibility**: iOS/Android via Expo; modern desktop/mobile browsers.
- **Observability (post-MVP)**: Minimal analytics for core flows.

## Architecture and Tech Stack
- **Client**: TypeScript, React Native 0.79.5, Expo SDK 53, React Navigation (native), hash routing (web).
- **Services**: Firebase Auth, Firestore, Expo Notifications, Expo Location.
- **Maps**: React Native Maps (native), Google Maps JS (web), OSM/Overpass fallback.
- **Android**: Gradle project with Kotlin entry points.

## Data Model (Initial)
- **Collection: `salons`**
  - `id`: string  
  - `name`: string  
  - `location`: { `lat`: number, `lng`: number, `address`?: string }  
  - `isOpen`: boolean  
  - `queueCount`: number  
  - `avgMinutesPerCustomer`: number  
  - `lastUpdated`: timestamp
- **Collection: `users`**
  - `uid`: string  
  - `role`: 'customer' | 'barber'  
  - `favorites`: string[] (salon ids)  
  - `notificationToken`?: string

## Integrations and Contracts
- **Firebase Auth**: Email/password sign-in/up.
- **Firestore**: `salons/{id}` documents observed by customers; barber writes with rules.
- **Google Places (optional)**: Nearby search for richer details when API key is present.
- **OSM/Overpass (fallback)**: Geofenced POI discovery for salons when no Google key.
- **Notifications**: Register token and send updates on queue/open status changes.

## User Flows
- **Native**
  - Initialize Firebase → Role Gate → Route → Request notifications permissions (outside Expo Go).
- **Web**
  - Read `window.location.hash` → Render matching view (Customer, Barber, RoleGate).

## Screens and Components
- **Screens**: `AuthLogin`, `RoleGate(.native)`, `CustomerHome(.native|.web)`, `BarberDashboard`, `SalonList`.
- **Components**: `SalonMarker(.native|.web)`, `PlaceMarker.native`.
- **Hooks/Services**: `useSalons`, `firebase(.web)`, `location`, `notifications`, `places`, `osm`.

## Permissions
- **Location**: Foreground location access.
- **Notifications**: Alerts/badges/sounds as supported by platform.

## Success Metrics
- **Time-to-first-map** < 3s (mid-range device).  
- **Propagation** Barber update → Customer view < 2s (p90).  
- **Stability** Crash-free sessions > 99.5% (rolling 7 days).  
- **Engagement** DAU retention targets to be defined post-MVP.

## Risks and Mitigations
- **Missing Google API key**: OSM fallback preserves core discovery features.
- **Notification deliverability**: Start per-device; upgrade to topics later.
- **Firestore costs**: Efficient queries and document shapes; caching where appropriate.
- **Web parity**: Graceful messaging when native-only features are unavailable.

## Release Plan
- **MVP (v1.0)**
  - Customer map/list + basic details.  
  - Barber dashboard with queue controls.  
  - Firebase Auth + Firestore sync.  
  - Notifications permission and basic sends.
- **Post-MVP**
  - Favorites & notifications for favorites.  
  - Ratings/reviews and richer metadata.  
  - Admin tools and analytics.

## Acceptance Criteria (MVP)
- Customer sees at least 10 nearby salons within ~5km on map or list.
- Barber can toggle open/closed and adjust queue; customers see changes within 2s.
- App functions without Google key using OSM on native.
- Notifications permission flow completes successfully on native builds.

## Dependencies
- Expo 53; React Native 0.79.5; Firebase SDK; Expo modules; Android build tools; optional Google Places key.

## Open Questions
- Finalize Firestore security rules for role-based writes.
- Decide notification routing (topics vs per-device) for salon updates.
- Extend salon metadata (hours, pricing, services) and data sources.


