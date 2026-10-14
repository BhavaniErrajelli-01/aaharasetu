/**
 * Aahara Setu - Frontend Utilities
 */

document.addEventListener('DOMContentLoaded', function() {
  // 1. Auto dismiss flash alerts after 5 seconds
  const flashAlerts = document.querySelectorAll('.flash-alert');
  flashAlerts.forEach(alert => {
    setTimeout(() => {
      alert.style.opacity = '0';
      alert.style.transform = 'translateY(-6px)';
      alert.style.transition = 'all 250ms ease';
      setTimeout(() => alert.remove(), 250);
    }, 5000);
  });

  // 2. Click outside modal to close
  window.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-backdrop')) {
      e.target.classList.remove('active');
    }
  });

  // 3. Escape key to close modal
  window.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.active').forEach(m => m.classList.remove('active'));
    }
  });
});

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
  }
}
