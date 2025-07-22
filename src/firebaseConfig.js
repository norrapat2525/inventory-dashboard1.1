// src/firebaseConfig.js

// 1. Import functions from the Firebase SDK
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 2. Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBA8FKybuEIbeVf_Ovw-XomG5GuiwYjuV8",
  authDomain: "inventory-dashboard-b7bc8.firebaseapp.com",
  projectId: "inventory-dashboard-b7bc8",
  storageBucket: "inventory-dashboard-b7bc8.appspot.com",
  messagingSenderId: "375921255743",
  appId: "1:375921255743:web:a8e5a6554f883c98b45f8a",
  measurementId: "G-ZGL96HZD5F"
};

// 3. Initialize Firebase
const app = initializeApp(firebaseConfig);

// 4. Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// 5. Export the database instance so we can use it in other parts of our app
export { db };
