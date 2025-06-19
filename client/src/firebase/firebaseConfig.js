import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAeZZo_VYnPzQ5W8vAeuWKC8vKbnEZ7lZQ",
  authDomain: "dsarena-dd842.firebaseapp.com",
  projectId: "dsarena-dd842",
  storageBucket: "dsarena-dd842.firebasestorage.app",
  messagingSenderId: "220563971310",
  appId: "1:220563971310:web:c5323632ead092cfbea7ff",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };