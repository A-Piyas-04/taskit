const mCat = document.getElementById('modal-category');
const mTask = document.getElementById('modal-task');
const mConfirm = document.getElementById('modal-confirm');

export function openModalCategory() {
  return new Promise((resolve) => {
    const input = document.getElementById('categoryName');
    input.value = '';
    mCat.showModal();
    const onClose = (e) => {
      mCat.removeEventListener('close', onClose);
      resolve(mCat.returnValue === 'default' && input.value.trim() ? input.value.trim() : null);
    };
    mCat.addEventListener('close', onClose);
    input.focus();
  });
}

export function openModalTask(text = '') {
  return new Promise((resolve) => {
    const input = document.getElementById('taskText');
    const title = document.getElementById('taskModalTitle');
    title.textContent = text ? 'Edit Task' : 'New Task';
    input.value = text || '';
    mTask.showModal();
    const onClose = () => {
      mTask.removeEventListener('close', onClose);
      const val = mTask.returnValue === 'default' ? input.value.trim() : null;
      resolve(val || null);
    };
    mTask.addEventListener('close', onClose);
    input.focus();
  });
}

export function confirmDialog(message) {
  return new Promise((resolve) => {
    const title = document.getElementById('confirmTitle');
    const msg = document.getElementById('confirmMessage');
    title.textContent = 'Confirm';
    msg.textContent = message;
    mConfirm.showModal();
    const onClose = () => {
      mConfirm.removeEventListener('close', onClose);
      resolve(mConfirm.returnValue === 'default');
    };
    mConfirm.addEventListener('close', onClose);
    document.getElementById('confirmProceed').focus();
  });
}

