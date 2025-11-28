// File System Access API helpers for exporting/importing category data to .txt
// Requires user gesture; supported in Chromium-based browsers and some others.

export async function exportCategoryToTxt(cat) {
  const blob = new Blob([JSON.stringify(cat, null, 2)], { type: 'text/plain' });
  const name = `${cat.name}.txt`;
  try {
    if (window.showSaveFilePicker) {
      const handle = await window.showSaveFilePicker({
        suggestedName: name,
        types: [{ description: 'Text', accept: { 'text/plain': ['.txt'] } }],
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      return true;
    } else {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      return true;
    }
  } catch (e) {
    throw e;
  }
}

export async function importCategoryFromTxt() {
  try {
    if (window.showOpenFilePicker) {
      const [handle] = await window.showOpenFilePicker({ types: [{ description: 'Text', accept: { 'text/plain': ['.txt'] } }] });
      const file = await handle.getFile();
      const text = await file.text();
      return JSON.parse(text);
    } else {
      return new Promise((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.txt,text/plain';
        input.onchange = async () => {
          const file = input.files[0];
          if (!file) return reject(new Error('No file selected'));
          const text = await file.text();
          resolve(JSON.parse(text));
        };
        input.click();
      });
    }
  } catch (e) {
    throw e;
  }
}

