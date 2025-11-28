async function run() {
  const base = 'http://localhost:3000/api';
  const j = (path, init) => fetch(base + path, { headers: { 'Content-Type': 'application/json' }, ...init }).then(r => r.json());

  const name = 'TestCat';
  console.log('Create category');
  let res = await j(`/category/${name}`, { method: 'POST', body: JSON.stringify({ name, hidden: false, tasks: [] }) });
  console.log(res);

  console.log('List categories');
  let cats = await j('/categories');
  console.log(cats.map(c => c.name));

  console.log('Add tasks and save');
  let cat = { name, hidden: false, tasks: [{ id: Date.now(), text: 'Hello', done: false, highlight: false }] };
  res = await j(`/category/${name}`, { method: 'PUT', body: JSON.stringify(cat) });
  console.log(res);

  console.log('Read back');
  const back = await j(`/category/${name}`);
  console.log(back.tasks.length);

  console.log('Delete');
  res = await j(`/category/${name}`, { method: 'DELETE' });
  console.log(res);
}

run().catch(err => { console.error(err); process.exitCode = 1; });

