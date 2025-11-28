const toast = document.getElementById('toast');

export function showToast(message, timeout = 2000) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => toast.classList.remove('show'), timeout);
}

