// localStorage keys and helpers
const KEY_CATS = 'taskit:cats';

// read the category name list
function readCatsList() {
  try {
    const raw = localStorage.getItem(KEY_CATS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// write the category name list
function writeCatsList(list) {
  localStorage.setItem(KEY_CATS, JSON.stringify(list));
}

// per-category storage key
function catKey(name) { return `taskit:category:${name}`; }

export const api = {
  async ping() { return { ok: true }; },
  async getCategories() {
    // load all categories using the name list
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
    // upsert a category and ensure it's tracked in the name list
    const names = readCatsList();
    if (!names.includes(name)) {
      names.push(name);
      writeCatsList(names);
    }
    localStorage.setItem(catKey(name), JSON.stringify({ name, hidden: !!body.hidden, tasks: Array.isArray(body.tasks) ? body.tasks : [] }));
    return { ok: true };
  },
  async createCategory(name, body) {
    // create category (same as save) and track in name list
    const names = readCatsList();
    if (!names.includes(name)) {
      names.push(name);
      writeCatsList(names);
    }
    localStorage.setItem(catKey(name), JSON.stringify({ name, hidden: !!body.hidden, tasks: Array.isArray(body.tasks) ? body.tasks : [] }));
    return { ok: true };
  },
  async deleteCategory(name) {
    // remove from localStorage and name list
    const names = readCatsList().filter(n => n !== name);
    writeCatsList(names);
    localStorage.removeItem(catKey(name));
    return { ok: true };
  },
};
