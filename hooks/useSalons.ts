import { useState, useEffect } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../services/firebase';

export const useSalons = () => {
  const [salons, setSalons] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'salons'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const salonsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSalons(salonsData);
    });

    return () => unsubscribe();
  }, []);

  return { salons };
};
