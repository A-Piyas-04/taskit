import { api } from './modules/api.js';
import { showToast } from './modules/toast.js';
import { openModalCategory, openModalTask, confirmDialog } from './modules/modals.js';
import { createColumnEl, createTaskEl } from './modules/dom.js';

let state = {
  categories: [],
  selectedCategory: null,
};

const board = document.getElementById('board');
const btnNewCategory = document.getElementById('btnNewCategory');
const searchInput = document.getElementById('searchInput');

async function init() {
  await loadCategories();
  bindEvents();
  showToast('Welcome to TaskIt');
}

async function loadCategories() {
  try {
    const categories = await api.getCategories();
    state.categories = categories;
    renderBoard();
  } catch (e) {
    state.categories = [];
    renderBoard();
  }
}

function renderBoard() {
  board.innerHTML = '';
  const query = searchInput.value.trim().toLowerCase();
  state.categories.forEach(cat => {
    const column = createColumnEl(cat, {
      onAddTask: () => onAddTask(cat.name),
      onToggleHidden: async () => {
        cat.hidden = !cat.hidden;
        await api.saveCategory(cat.name, cat);
        renderBoard();
        showToast(`${cat.name} ${cat.hidden ? 'hidden' : 'visible'}`);
      },
      onDeleteCategory: async () => {
        const ok = await confirmDialog(`Delete category '${cat.name}'?`);
        if (!ok) return;
        await api.deleteCategory(cat.name);
        state.categories = state.categories.filter(c => c.name !== cat.name);
        renderBoard();
        showToast(`Deleted ${cat.name}`);
      }
    });

    const tasksContainer = column.querySelector('.tasks');
    (cat.tasks || [])
      .filter(t => (t.title + ' ' + (t.description || '')).toLowerCase().includes(query))
      .forEach(task => {
      const taskEl = createTaskEl(task, {
        onToggleStatus: async () => {
          task.done = !task.done;
          await persistTasks(cat);
          taskEl.querySelector('.status').classList.toggle('done', task.done);
          taskEl.querySelector('.status').classList.toggle('todo', !task.done);
          showToast(task.done ? 'Marked done' : 'Marked todo');
        },
        onToggleHighlight: async () => {
          task.highlight = !task.highlight;
          await persistTasks(cat);
          taskEl.classList.toggle('highlight', task.highlight);
        },
        onEdit: async () => {
          const updated = await openModalTask(task);
          if (updated) {
            task.title = updated.title;
            task.description = updated.description;
            task.due = updated.due;
            await persistTasks(cat);
            renderBoard();
            showToast('Task updated');
          }
        },
        onDelete: async () => {
          const ok = await confirmDialog('Delete task?');
          if (!ok) return;
          cat.tasks = cat.tasks.filter(t => t !== task);
          await persistTasks(cat);
          taskEl.remove();
          showToast('Task deleted');
        },
        onDragStart: () => {},
        onDrop: async (srcId, targetId) => {
          if (srcId === targetId) return;
          const arr = cat.tasks || [];
          const srcIdx = arr.findIndex(t => t.id === srcId);
          const tgtIdx = arr.findIndex(t => t.id === targetId);
          if (srcIdx === -1 || tgtIdx === -1) return;
          const [item] = arr.splice(srcIdx, 1);
          arr.splice(tgtIdx, 0, item);
          cat.tasks = arr;
          await persistTasks(cat);
          renderBoard();
        }
      });
      tasksContainer.appendChild(taskEl);
    });

    board.appendChild(column);
  });
}

async function onAddTask(categoryName) {
  const payload = await openModalTask(null);
  if (!payload) return;
  const cat = state.categories.find(c => c.name === categoryName);
  cat.tasks = cat.tasks || [];
  cat.tasks.unshift({ id: Date.now(), title: payload.title, description: payload.description, due: payload.due, done: false, highlight: false });
  await persistTasks(cat);
  renderBoard();
  showToast('Task added');
}

async function persistTasks(cat) {
  try {
    await api.saveCategory(cat.name, cat);
  } catch (e) {
    showToast('Failed to save. Retrying later.');
  }
}

function bindEvents() {
  btnNewCategory.addEventListener('click', async () => {
    const name = await openModalCategory();
    if (!name) return;
    const exists = state.categories.some(c => c.name.toLowerCase() === name.toLowerCase());
    if (exists) { showToast('Category exists'); return; }
    const cat = { name, hidden: false, tasks: [] };
    await api.createCategory(name, cat);
    state.categories.unshift(cat);
    renderBoard();
    showToast(`Created ${name}`);
  });

  searchInput.addEventListener('input', () => renderBoard());

  document.addEventListener('keydown', async (e) => {
    if (e.altKey && e.code === 'KeyC') { btnNewCategory.click(); e.preventDefault(); }
    if (e.altKey && e.code === 'KeyN') {
      const first = state.categories[0]; if (first) onAddTask(first.name); e.preventDefault();
    }
    if (e.code === 'KeyH') {
      const focused = document.activeElement?.closest('.task');
      if (focused) focused.querySelector('.btn-highlight')?.click();
    }
    if (e.code === 'Enter') {
      const focused = document.activeElement?.closest('.task');
      if (focused) focused.querySelector('.status')?.click();
    }
    if (e.code === 'Delete') {
      const focused = document.activeElement?.closest('.task');
      if (focused) focused.querySelector('.btn-delete')?.click();
    }
  });
}

init();
