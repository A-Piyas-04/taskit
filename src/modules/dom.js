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
  el.draggable = true;

  const status = document.createElement('button');
  status.className = `status ${task.done ? 'done' : 'todo'}`;
  status.setAttribute('title', 'Toggle status');
  status.textContent = task.done ? '✓' : '✗';
  status.addEventListener('click', () => {
    handlers.onToggleStatus();
    status.textContent = status.textContent === '✓' ? '✗' : '✓';
  });

  const content = document.createElement('div');
  content.className = 'text';
  const title = document.createElement('div');
  title.textContent = task.title;
  const meta = document.createElement('div');
  meta.style.fontSize = '12px';
  meta.style.color = '#8aa0c8';
  meta.textContent = [task.description, task.due ? `Due: ${task.due}` : ''].filter(Boolean).join(' • ');
  content.append(title, meta);

  const due = document.createElement('div');
  due.textContent = task.due ? task.due : '';

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

  el.append(status, content, btnHighlight, btnEdit, btnDelete);

  el.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/task-id', String(task.id));
    handlers.onDragStart && handlers.onDragStart(task);
  });
  el.addEventListener('dragover', (e) => {
    e.preventDefault();
  });
  el.addEventListener('drop', (e) => {
    e.preventDefault();
    const srcId = Number(e.dataTransfer.getData('text/task-id'));
    handlers.onDrop && handlers.onDrop(srcId, task.id);
  });

  return el;
}
