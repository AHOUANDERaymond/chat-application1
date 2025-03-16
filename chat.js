

import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { auth } from "./firebase-init.js";

// Chat Functionality
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const chatContainer = document.querySelector('.chat-container');

if (sendButton) {
  sendButton.addEventListener('click', async () => {
    const message = messageInput.value.trim();
    if (message === '') return;

    const user = auth.currentUser;
    if (!user) {
      alert('Please log in to send messages.');
      return;
    }

    // Add message to Firestore
    await addDoc(collection(db, 'messages'), {
      text: message,
      sender: user.email,
      timestamp: serverTimestamp(),
    });

    messageInput.value = ''; // Clear input field
  });
}

// Listen for new messages
const messagesQuery = query(collection(db, 'messages'), orderBy('timestamp'));
onSnapshot(messagesQuery, (snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type === 'added') {
      const data = change.doc.data();
      displayMessage(data.text, data.sender);
    }
  });
});

// Display messages in the chat container
function displayMessage(message, sender) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');
  messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chatContainer.appendChild(messageElement);
  chatContainer.scrollTop = chatContainer.scrollHeight; // Auto-scroll to the latest message
}

// Handle user authentication
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('User logged in:', user.email);
  } else {
    console.log('User logged out');
    window.location.href = 'login.html'; // Redirect to login page if not logged in
  }
});

document.addEventListener('DOMContentLoaded', () => {
    const defaultIcon = document.getElementById('default-icon');
    const profileBtn = document.getElementById('profile-btn');
    const profileDropdown = document.getElementById('profile-dropdown');
  
    if (defaultIcon) {
      defaultIcon.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent the click from bubbling up
        profileDropdown.style.display = profileDropdown.style.display === 'block' ? 'none' : 'block';
      });
    }
  
    if (profileBtn) {
      profileBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent the click from bubbling up
        profileDropdown.style.display = profileDropdown.style.display === 'block' ? 'none' : 'block';
      });
    }
  
    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
      if (profileDropdown.style.display === 'block') {
        profileDropdown.style.display = 'none';
      }
    });
  
    // Prevent dropdown from closing when clicking inside it
    profileDropdown.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  });
