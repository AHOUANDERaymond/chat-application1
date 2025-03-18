firebase-init.js

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

// Update user status to "online" when they log in
onAuthStateChanged(auth, async (user) => {
  if (user) {
    await updateDoc(doc(db, 'users', user.uid), {
      status: 'online',
      lastActive: serverTimestamp(),
    });
  } else {
    // Update user status to "offline" when they log out
    const currentUser = auth.currentUser;
    if (currentUser) {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        status: 'offline',
        lastActive: serverTimestamp(),
      });
    }
  }
});

const messagesQuery = query(collection(db, 'messages'), orderBy('timestamp'));
onSnapshot(messagesQuery, (snapshot) => {
  snapshot.forEach((doc) => {
    const data = doc.data();
    displayMessage(data.text, data.sender);
  });
});

// Edit message
document.querySelector('.edit-button').addEventListener('click', async () => {
  const newText = prompt('Edit your message:', message);
  if (newText) {
    await updateDoc(doc(db, 'messages', messageId), {
      text: newText,
    });
  }
});

// Delete message
document.querySelector('.delete-button').addEventListener('click', async () => {
  await deleteDoc(doc(db, 'messages', messageId));
});

/* Update the user’s profile  */
document.getElementById('save-profile').addEventListener('click', async () => {
  const name = document.getElementById('name').value;
  const status = document.getElementById('status').value;
  const user = auth.currentUser;

  if (user) {
    await updateDoc(doc(db, 'users', user.uid), {
      name: name,
      status: status,
    });
    alert('Profile updated successfully!');
  }
});



//Read Receipts