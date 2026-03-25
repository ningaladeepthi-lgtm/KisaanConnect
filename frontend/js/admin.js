document.addEventListener('DOMContentLoaded', () => {
  // Add active state to current nav item based on URL
  const currentPath = window.location.pathname.split('/').pop() || 'admin-dashboard.html';
  const navItems = document.querySelectorAll('.nav-item');
  
  navItems.forEach(item => {
    item.classList.remove('active');
    const href = item.getAttribute('href');
    if (href === currentPath) {
      item.classList.add('active');
    }
  });

  // Simple mock functionality for interactive buttons
  const deleteBtns = document.querySelectorAll('.btn-outline.text-danger');
  deleteBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if(confirm('Are you sure you want to perform this action?')) {
        const row = e.target.closest('tr');
        if(row) {
          row.style.opacity = '0.5';
          setTimeout(() => row.remove(), 300);
        }
      }
    });
  });

  // Approve requests mock
  const approveBtns = document.querySelectorAll('.btn-approve');
  approveBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const badge = e.target.closest('tr').querySelector('.badge');
      if (badge) {
        badge.className = 'badge badge-success';
        badge.textContent = 'Approved';
        e.target.remove();
      }
    });
  });
});
