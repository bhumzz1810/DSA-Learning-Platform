// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAeZZo_VYnPzQ5W8vAeuWKC8vKbnEZ7lZQ",
  authDomain: "dsarena-dd842.firebaseapp.com",
  projectId: "dsarena-dd842",
  storageBucket: "dsarena-dd842.firebasestorage.app",
  messagingSenderId: "220563971310",
  appId: "1:220563971310:web:c5323632ead092cfbea7ff",
  measurementId: "G-S1RH8H68PN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// ✅ Export this correctly
const auth = getAuth(app);
export { auth };
