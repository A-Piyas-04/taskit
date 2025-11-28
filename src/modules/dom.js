export function createColumnEl(cat, handlers) {
  const column = document.createElement('section');
  column.className = `column${cat.hidden ? ' hidden' : ''}`;
  column.setAttribute('aria-label', `Category ${cat.name}`);

  const header = document.createElement('div');
  header.className = 'column-header';

  const title = document.createElement('h2');
  title.className = 'column-title';
  title.textContent = cat.name + (cat.hidden ? ' (hidden)' : '');

  const actions = document.createElement('div');
  actions.className = 'column-actions';

  const btnAdd = document.createElement('button');
  btnAdd.className = 'btn neon';
  btnAdd.textContent = 'Add Task';
  btnAdd.addEventListener('click', handlers.onAddTask);

  const btnHide = document.createElement('button');
  btnHide.className = 'btn';
  btnHide.textContent = cat.hidden ? 'Show' : 'Hide';
  btnHide.addEventListener('click', handlers.onToggleHidden);

  const btnDelete = document.createElement('button');
  btnDelete.className = 'btn danger';
  btnDelete.textContent = 'Delete';
  btnDelete.addEventListener('click', handlers.onDeleteCategory);

  actions.append(btnAdd, btnHide, btnDelete);
  header.append(title, actions);

  const tasks = document.createElement('div');
  tasks.className = 'tasks';

  column.append(header, tasks);
  return column;
}

export function createTaskEl(task, handlers) {
  const el = document.createElement('article');
  el.className = `task${task.highlight ? ' highlight' : ''}`;
  el.tabIndex = 0;

  const status = document.createElement('button');
  status.className = `status ${task.done ? 'done' : 'todo'}`;
  status.setAttribute('title', 'Toggle status');
  status.textContent = task.done ? '✓' : '✗';
  status.addEventListener('click', () => {
    handlers.onToggleStatus();
    status.textContent = status.textContent === '✓' ? '✗' : '✓';
  });

  const text = document.createElement('div');
  text.className = 'text';
  text.textContent = task.text;

  const btnHighlight = document.createElement('button');
  btnHighlight.className = 'icon-btn btn-highlight';
  btnHighlight.title = 'Highlight';
  btnHighlight.textContent = '★';
  btnHighlight.addEventListener('click', handlers.onToggleHighlight);

  const btnEdit = document.createElement('button');
  btnEdit.className = 'icon-btn';
  btnEdit.title = 'Edit';
  btnEdit.textContent = '✎';
  btnEdit.addEventListener('click', handlers.onEdit);

  const btnDelete = document.createElement('button');
  btnDelete.className = 'icon-btn btn-delete';
  btnDelete.title = 'Delete';
  btnDelete.textContent = '🗑';
  btnDelete.addEventListener('click', handlers.onDelete);

  el.append(status, text, btnHighlight, btnEdit, btnDelete);
  return el;
}

