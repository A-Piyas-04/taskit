export function setLoading(show) {
  const el = document.getElementById('loading');
  if (!el) return;
  el.classList.toggle('hidden', !show);
}

