import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAe3EB8c6MghGdDRg8kvK863HUJIXFwpvE",
  authDomain: "eventmanagement-d27f3.firebaseapp.com",
  projectId: "eventmanagement-d27f3",
  storageBucket: "eventmanagement-d27f3.firebasestorage.app",
  messagingSenderId: "1019046897052",
  appId: "1:1019046897052:web:c833d3667aa7ee244c9459"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
