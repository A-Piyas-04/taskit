const KEY_CATS = 'taskit:cats';

function readCatsList() {
  try {
    const raw = localStorage.getItem(KEY_CATS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeCatsList(list) {
  localStorage.setItem(KEY_CATS, JSON.stringify(list));
}

function catKey(name) { return `taskit:category:${name}`; }

export const api = {
  async ping() { return { ok: true }; },
  async getCategories() {
    const names = readCatsList();
    const cats = names.map(n => {
      try {
        const raw = localStorage.getItem(catKey(n));
        const obj = raw ? JSON.parse(raw) : null;
        return obj || { name: n, hidden: false, tasks: [] };
      } catch {
        return { name: n, hidden: false, tasks: [] };
      }
    });
    return cats;
  },
  async getCategory(name) {
    try {
      const raw = localStorage.getItem(catKey(name));
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  async saveCategory(name, body) {
    const names = readCatsList();
    if (!names.includes(name)) {
      names.push(name);
      writeCatsList(names);
    }
    localStorage.setItem(catKey(name), JSON.stringify({ name, hidden: !!body.hidden, tasks: Array.isArray(body.tasks) ? body.tasks : [] }));
    return { ok: true };
  },
  async createCategory(name, body) {
    const names = readCatsList();
    if (!names.includes(name)) {
      names.push(name);
      writeCatsList(names);
    }
    localStorage.setItem(catKey(name), JSON.stringify({ name, hidden: !!body.hidden, tasks: Array.isArray(body.tasks) ? body.tasks : [] }));
    return { ok: true };
  },
  async deleteCategory(name) {
    const names = readCatsList().filter(n => n !== name);
    writeCatsList(names);
    localStorage.removeItem(catKey(name));
    return { ok: true };
  },
};
