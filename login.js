login.js

// Login Form Submission
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    if (!email || !password) {
      alert('Please fill in all fields.');
      return;
    }
    // Redirect to chat page (replace with actual authentication logic)
    window.location.href = 'chat.html';
  });
}