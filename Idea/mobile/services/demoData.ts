import { collection, doc, setDoc, GeoPoint } from 'firebase/firestore';
import { db } from './firebase';

export interface SalonData {
  name: string;
  location: GeoPoint;
  queue: number;
  ownerUid: string;
  lastUpdated: number;
  address?: string;
  phone?: string;
  hours?: string;
  id?: string; // Added for predictable ID
}

// Demo salon data for different cities
export const demoSalons: SalonData[] = [
  {
    id: 'demo-salon-1',           // <── add predictable ID
    name: "Fade Masters",
    location: new GeoPoint(40.7128, -74.0060), // NYC
    queue: 3,
    ownerUid: "demo-owner-1",
    lastUpdated: Date.now(),
    address: "123 Broadway, New York, NY",
    phone: "(555) 123-4567",
    hours: "9 AM - 8 PM"
  },
  {
    name: "The Gentleman's Cut",
    location: new GeoPoint(40.7589, -73.9851), // Times Square
    queue: 0,
    ownerUid: "demo-owner-2",
    lastUpdated: Date.now(),
    address: "456 Times Square, New York, NY",
    phone: "(555) 234-5678",
    hours: "8 AM - 9 PM"
  },
  {
    name: "Quick Clips",
    location: new GeoPoint(40.7282, -73.7949), // Queens
    queue: 7,
    ownerUid: "demo-owner-3",
    lastUpdated: Date.now(),
    address: "789 Queens Blvd, Queens, NY",
    phone: "(555) 345-6789",
    hours: "7 AM - 10 PM"
  },
  {
    name: "Style Central",
    location: new GeoPoint(40.6782, -73.9442), // Brooklyn
    queue: 1,
    ownerUid: "demo-owner-4",
    lastUpdated: Date.now(),
    address: "321 Brooklyn Ave, Brooklyn, NY",
    phone: "(555) 456-7890",
    hours: "10 AM - 7 PM"
  },
  {
    name: "Metro Barber Shop",
    location: new GeoPoint(40.7505, -73.9934), // Midtown
    queue: 5,
    ownerUid: "demo-owner-5",
    lastUpdated: Date.now(),
    address: "654 5th Avenue, New York, NY",
    phone: "(555) 567-8901",
    hours: "9 AM - 8 PM"
  }
];

export async function seedDemoData(): Promise<void> {
  try {
    const salonsCollection = collection(db, 'salons');

    for (const salon of demoSalons) {
      // Use the provided id when it exists, fall back to a random one
      const salonDoc = salon.id
        ? doc(salonsCollection, salon.id)
        : doc(salonsCollection);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...data } = salon;   // Firestore doc ID lives in the path, not the data
      await setDoc(salonDoc, data);
      console.log(`Added demo salon: ${salon.name}`);
    }

    console.log('Demo data seeded successfully!');
  } catch (error) {
    console.error('Error seeding demo data:', error);
  }
}

export const DEMO_SALON_ID = 'demo-salon-1'; // For barber dashboard 