

// Hamburger Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('hamburger-menu').addEventListener('click', function () {
      const dropdownMenu = document.getElementById('dropdown-menu');
      dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    });
  });

  // Tab Switching Logic
  /* document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
      button.classList.add('active');
    });
  });
   */
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