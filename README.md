# TaskIt (File Protocol Edition)

TaskIt is a single-page task manager that runs directly from the filesystem. Open `file:///E:/Projects/Taskit/index.html` (adjust path as needed) — no server required.

## Features

- Categories: create, show/hide, delete, visible indicators
- Tasks: title, description, due date, status toggle, highlight, edit, delete
- Drag-and-drop reordering within a category
- Keyboard shortcuts: `Alt+C` new category, `Alt+N` new task, `H` highlight, `Enter` toggle status, `Delete` delete
- Cyberpunk dark neon theme; responsive columns; accessible dialogs

## Persistence

- Uses `localStorage` with keys `taskit:cats` (category list) and `taskit:category:<name>` (category data)
- Data persists across sessions per browser profile

## Setup

1. Clone or copy the folder to a local path
2. Open `index.html` via the `file://` protocol
3. Begin creating categories and tasks

## Known Limitations

- Data is stored per browser (no sync across browsers or machines)
- `localStorage` quotas vary; extremely large datasets may hit limits
- Some browsers restrict cross-file imports; this project uses relative ES modules, tested on Chrome/Edge/Firefox

## Testing

- Verify CRUD: create, edit, delete categories and tasks
- Check persistence: reload the page and confirm data remains
- Responsive: resize window and verify column layout
- Accessibility: use keyboard to navigate tasks and dialogs

## Notes

- If you need server-based storage, use the `server.js` implementation and switch `api.js` to network calls

