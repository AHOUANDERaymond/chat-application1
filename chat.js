chat.js

import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { auth } from "./firebase-init.js";

// Chat Functionality
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const chatContainer = document.querySelector('.chat-container');

/* Send Messages */
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

/* Receive Messages */
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
  messageElement.innerHTML = <strong>${sender}:</strong> ${message};
  chatContainer.appendChild(messageElement);
  chatContainer.scrollTop = chatContainer.scrollHeight; // Auto-scroll to the latest message
}

// Function to display user status
function displayUserStatus(user, status) {
  const userStatusElement = document.createElement('div');
  userStatusElement.classList.add('user-status');
  userStatusElement.innerHTML = `
    <span class="username">${user.email}</span>
    <span class="status-dot ${status === 'online' ? 'online' : 'offline'}"></span>
  `;
  chatContainer.appendChild(userStatusElement);
}

// Handle user authentication and status
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('User logged in:', user.email);

    // Fetch and display the user's status
    const userDocRef = doc(db, 'users', user.uid);
    onSnapshot(userDocRef, (doc) => {
      const userData = doc.data();
      if (userData) {
        displayUserStatus(user, userData.status);
      }
    });
  } else {
    console.log('User logged out');
    window.location.href = 'login.html'; // Redirect to login page if not logged in
  }
});

// Profile Dropdown Logic
addEventListener('click', () => {
  if (profileDropdown.style.display === 'block') {
    profileDropdown.style.display = 'none';
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const defaultIcon = document.getElementById('default-icon');
  const profileBtn = document.getElementById('profile-btn');
  const profileDropdown = document.getElementById('profile-dropdown');

  if (defaultIcon) {
    defaultIcon.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent the click from bubbling up
      profileDropdown.classList.toggle('visible');
    });
  }

  if (profileBtn) {
    profileBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent the click from bubbling up
      profileDropdown.classList.toggle('visible');
    });
  }

  // Close dropdown when clicking outside
  document.addEventListener('click', () => {
    if (profileDropdown.classList.contains('visible')) {
      profileDropdown.classList.remove('visible');
    }
  });

  // Prevent dropdown from closing when clicking inside it
  profileDropdown.addEventListener('click', (e) => {
    e.stopPropagation();
  });
});

/* Display the user’s profile information in the chat interface. */
const userProfileElement = document.createElement('div');
userProfileElement.classList.add('user-profile');
userProfileElement.innerHTML = `
  <img src="${profilePictureUrl}" alt="Profile Picture">
  <span class="username">${name}</span>
  <span class="status">${status}</span>
`;
chatContainer.appendChild(userProfileElement);

// Typing Indicators: 
// Track typing status
messageInput.addEventListener('input', async () => {
  const user = auth.currentUser;
  if (user) {
    await updateDoc(doc(db, 'users', user.uid), {
      typing: true,
    });
  }
});

messageInput.addEventListener('blur', async () => {
  const user = auth.currentUser;
  if (user) {
    await updateDoc(doc(db, 'users', user.uid), {
      typing: false,
    });
  }
});

//  Listen for typing status of other users
onSnapshot(doc(db, 'users', otherUserId), (doc) => {
  const userData = doc.data();
  if (userData && userData.typing) {
    displayTypingIndicator(otherUserEmail);
  } else {
    removeTypingIndicator();
  }
});

function displayTypingIndicator(email) {
  const typingIndicator = document.createElement('div');
  typingIndicator.id = 'typing-indicator';
  typingIndicator.textContent = ${email} is typing...;
  chatContainer.appendChild(typingIndicator);
}

function removeTypingIndicator() {
  const typingIndicator = document.getElementById('typing-indicator');
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

//Read receipts
// Update message as read
onSnapshot(messagesQuery, (snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type === 'added') {
      const data = change.doc.data();
      displayMessage(data.text, data.sender, data.read);
      if (!data.read && data.sender !== auth.currentUser.email) {
        updateDoc(change.doc.ref, { read: true });
      }
    }
  });
});

function displayMessage(message, sender, read) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');
  messageElement.innerHTML = `
    <strong>${sender}:</strong> ${message}
    ${read ? '<span class="read-receipt">✓ Read</span>' : ''}
  `;
  chatContainer.appendChild(messageElement);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Emoji Support
import { Picker } from 'emoji-mart';

// Initialize Emoji Picker
const picker = new Picker({
  onEmojiSelect: (emoji) => {
    messageInput.value += emoji.native;
  },
});

document.getElementById('emoji-picker-button').addEventListener('click', () => {
  const emojiPicker = document.getElementById('emoji-picker');
  emojiPicker.style.display = emojiPicker.style.display === 'none' ? 'block' : 'none';
  emojiPicker.appendChild(picker);
});

//File and Media Sharing
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-storage.js";

const storage = getStorage();

document.getElementById('file-upload-button').addEventListener('click', () => {
  document.getElementById('file-input').click();
});

document.getElementById('file-input').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) {
    const storageRef = ref(storage, files/${file.name});
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    // Send file URL as a message
    await addDoc(collection(db, 'messages'), {
      text: downloadURL,
      sender: auth.currentUser.email,
      timestamp: serverTimestamp(),
      type: 'file',
    });
  }
});

//Voice Messages
let mediaRecorder;
let audioChunks = [];

document.getElementById('record-button').addEventListener('click', async () => {
  if (!mediaRecorder || mediaRecorder.state === 'inactive') {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start();

    mediaRecorder.ondataavailable = (e) => {
      audioChunks.push(e.data);
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      const audioFile = new File([audioBlob], 'voice-message.wav');

      // Upload audio to Firebase Storage
      const storageRef = ref(storage, audio/${audioFile.name});
      await uploadBytes(storageRef, audioFile);
      const downloadURL = await getDownloadURL(storageRef);

      // Send audio URL as a message
      await addDoc(collection(db, 'messages'), {
        text: downloadURL,
        sender: auth.currentUser.email,
        timestamp: serverTimestamp(),
        type: 'audio',
      });

      audioChunks = [];
    };
  } else {
    mediaRecorder.stop();
  }
});