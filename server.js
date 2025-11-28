const http = require('http');
const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, 'data');

async function ensureDir(dir) {
  try { await fsp.mkdir(dir, { recursive: true }); } catch {}
}

function send(res, status, body, headers = {}) {
  const isObj = typeof body === 'object';
  const data = isObj ? JSON.stringify(body) : body;
  res.writeHead(status, { 'Content-Type': isObj ? 'application/json' : 'text/plain', ...headers });
  res.end(data);
}

function serveStatic(req, res) {
  const parsed = url.parse(req.url);
  let pathname = parsed.pathname === '/' ? '/index.html' : parsed.pathname;
  const file = path.join(ROOT, pathname);

  fs.stat(file, (err, stat) => {
    if (err || !stat.isFile()) return false;
    const ext = path.extname(file).slice(1);
    const types = { html: 'text/html', css: 'text/css', js: 'application/javascript' };
    const ct = types[ext] || 'application/octet-stream';
    fs.readFile(file, (e, buf) => {
      if (e) return send(res, 500, 'Failed to read file');
      send(res, 200, buf, { 'Content-Type': ct });
    });
    return true;
  });
}

async function readCategory(name) {
  const file = path.join(DATA_DIR, `${name}.txt`);
  try {
    const content = await fsp.readFile(file, 'utf-8');
    return JSON.parse(content || '{}');
  } catch (e) {
    if (e.code === 'ENOENT') return null;
    throw e;
  }
}

async function writeCategory(name, obj) {
  const file = path.join(DATA_DIR, `${name}.txt`);
  await ensureDir(DATA_DIR);
  const json = JSON.stringify(obj, null, 2);
  await fsp.writeFile(file, json, 'utf-8');
}

async function listCategories() {
  await ensureDir(DATA_DIR);
  const files = await fsp.readdir(DATA_DIR);
  const txts = files.filter(f => f.endsWith('.txt'));
  const cats = [];
  for (const f of txts) {
    try {
      const content = await fsp.readFile(path.join(DATA_DIR, f), 'utf-8');
      const obj = JSON.parse(content || '{}');
      if (obj && obj.name) cats.push({ name: obj.name, hidden: !!obj.hidden, tasks: Array.isArray(obj.tasks) ? obj.tasks : [] });
    } catch {}
  }
  return cats;
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (d) => chunks.push(d));
    req.on('end', () => {
      try { resolve(JSON.parse(Buffer.concat(chunks).toString() || '{}')); }
      catch (e) { reject(e); }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true);
  const method = req.method || 'GET';

  if (parsed.pathname === '/api/ping' && method === 'GET') return send(res, 200, { ok: true });

  if (parsed.pathname === '/api/categories' && method === 'GET') {
    try {
      const cats = await listCategories();
      return send(res, 200, cats);
    } catch (e) {
      return send(res, 500, { error: 'Failed to list categories' });
    }
  }

  const match = parsed.pathname.match(/^\/api\/category\/(.+)$/);
  if (match) {
    const name = decodeURIComponent(match[1]);
    if (method === 'GET') {
      try {
        const cat = await readCategory(name);
        if (!cat) return send(res, 404, { error: 'Not found' });
        return send(res, 200, cat);
      } catch (e) { return send(res, 500, { error: 'Read failed' }); }
    }
    if (method === 'POST') {
      try {
        const body = await parseBody(req);
        const initial = { name, hidden: !!body.hidden, tasks: Array.isArray(body.tasks) ? body.tasks : [] };
        await writeCategory(name, initial);
        return send(res, 201, { ok: true });
      } catch (e) { return send(res, 500, { error: 'Create failed' }); }
    }
    if (method === 'PUT') {
      try {
        const body = await parseBody(req);
        const updated = { name, hidden: !!body.hidden, tasks: Array.isArray(body.tasks) ? body.tasks : [] };
        await writeCategory(name, updated);
        return send(res, 200, { ok: true });
      } catch (e) { return send(res, 500, { error: 'Save failed' }); }
    }
    if (method === 'DELETE') {
      try {
        const file = path.join(DATA_DIR, `${name}.txt`);
        await fsp.unlink(file);
        return send(res, 200, { ok: true });
      } catch (e) {
        if (e.code === 'ENOENT') return send(res, 404, { error: 'Not found' });
        return send(res, 500, { error: 'Delete failed' });
      }
    }
  }

  if (serveStatic(req, res) === false) {
    send(res, 404, 'Not found');
  }
});

server.listen(PORT, async () => {
  await ensureDir(DATA_DIR);
  console.log(`TaskIt server running at http://localhost:${PORT}`);
});

