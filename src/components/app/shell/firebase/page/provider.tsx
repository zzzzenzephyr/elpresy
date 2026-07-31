"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase (prevent multiple initializations in dev)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const database = getDatabase(app);

// Create a context so child components can consume the data
const FirebaseDataContext = createContext<any>(null);

export const useFirebaseData = () => useContext(FirebaseDataContext);

export function Provider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(true);

  useEffect(() => {
    if (!isSubscribed) return;

    // You can adjust this path based on your exact Firebase structure
    const dataRef = ref(database, "/devices/ESP32_METER_01/live_data"); 

    const unsubscribe = onValue(
      dataRef,
      (snapshot) => {
        const val = snapshot.val();
        // Output console data for debugging only
        if (val) {
          // const current = val.current < 7 ? val.current + 2.0 : val.current;
          const calibrated = {
            ...val,
            // current: parseFloat(current.toFixed(2))
          }
          setData(calibrated);
          // console.log("Firebase Realtime Data Updated:", val);
        } else {
          setError("No data found in Firebase.");
          // console.log("No data available in Firebase.");
        }
      },
      (err) => {
        console.error("Firebase subscription error:", err);
        setError("Failed to connect to Firebase.");
      }
    );

    return () => unsubscribe();
  }, [isSubscribed]);

  useEffect(() => {
    if(data) {
      console.log("Firebase Data Updated:", data);
    }
  }, [data]);

  return (
    <FirebaseDataContext.Provider value={{ data, error, isSubscribed, setIsSubscribed }}>
      {children}
    </FirebaseDataContext.Provider>
  );
}
