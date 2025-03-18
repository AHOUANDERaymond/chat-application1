main.js

// Hamburger Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('hamburger-menu').addEventListener('click', function () {
      const dropdownMenu = document.getElementById('dropdown-menu');
      dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    });
  });

  // Profile Dropdown
  const profileBtn = document.getElementById('profile-btn');
  const profileDropdown = document.getElementById('profile-dropdown');
  
  if (profileBtn) {
    profileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      profileDropdown.style.display = profileDropdown.style.display === 'block' ? 'none' : 'block';
    });
  }
  
  // Close dropdown when clicking outside
  document.addEventListener('click', () => {
    if (profileDropdown.style.display === 'block') {
      profileDropdown.style.display = 'none';
    }
  });