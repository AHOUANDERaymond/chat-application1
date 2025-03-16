

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyD-XSpFD6zXeM3eIh9xnMmHyvyxdJBhIEU",
  authDomain: "lovenett-ec1aa.firebaseapp.com",
  projectId: "lovenett-ec1aa",
  storageBucket: "lovenett-ec1aa.firebasestorage.app",
  messagingSenderId: "933622260517",
  appId: "1:933622260517:web:4bec5a2443a11f2ee330cc",
  measurementId: "G-17ZPHEDBW6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Make db and auth globally available
window.db = db;
window.auth = auth;