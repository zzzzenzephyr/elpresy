"use client";

import { useEffect } from "react";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, get, child } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export function DatabaseLogger() {
  useEffect(() => {
    // Initialize Firebase if not already initialized
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    const db = getDatabase(app);
    const dbRef = ref(db);

    const interval = setInterval(async () => {
      try {
        const snapshot = await get(child(dbRef, `/`));
        if (snapshot.exists()) {
          console.log("Firebase Realtime Database Data (Polling):", snapshot.val());
        } else {
          console.log("No data available in Firebase Realtime Database.");
        }
      } catch (error) {
        console.error("Firebase DB Polling Error:", error);
      }
    }, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  return null; // This component does not render any visible UI
}
