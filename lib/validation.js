export function validateCategoryName(name) {
  const trimmed = (name || '').trim();
  if (!trimmed) return { valid: false, error: 'Category name is required' };
  if (trimmed.length > 64) return { valid: false, error: 'Category name too long' };
  return { valid: true, value: trimmed, normalized: trimmed.toLowerCase() };
}

export function validateTaskText(text) {
  const trimmed = (text || '').trim();
  if (!trimmed) return { valid: false, error: 'Task description is required' };
  if (trimmed.length > 500) return { valid: false, error: 'Task description too long' };
  return { valid: true, value: trimmed };
}

export function validateCredentials({ name, email, password }) {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { valid: false, error: 'Invalid email' };
  if (!password || password.length < 6) return { valid: false, error: 'Password too short' };
  if (name !== undefined) {
    const trimmed = (name || '').trim();
    if (!trimmed) return { valid: false, error: 'Name is required' };
    if (trimmed.length > 64) return { valid: false, error: 'Name too long' };
  }
  return { valid: true };
}

