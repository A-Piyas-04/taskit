const BASE = '';

async function request(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(await res.text());
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return res.json();
  return res.text();
}

export const api = {
  async ping() { return request('/ping'); },
  async getCategories() { return request('/categories'); },
  async getCategory(name) { return request(`/category/${encodeURIComponent(name)}`); },
  async saveCategory(name, body) {
    return request(`/category/${encodeURIComponent(name)}`, { method: 'PUT', body: JSON.stringify(body) });
  },
  async createCategory(name, body) {
    return request(`/category/${encodeURIComponent(name)}`, { method: 'POST', body: JSON.stringify(body) });
  },
  async deleteCategory(name) {
    return request(`/category/${encodeURIComponent(name)}`, { method: 'DELETE' });
  },
};

