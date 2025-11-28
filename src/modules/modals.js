const mCat = document.getElementById('modal-category');
const mTask = document.getElementById('modal-task');
const mConfirm = document.getElementById('modal-confirm');

export function openModalCategory() {
  return new Promise((resolve) => {
    const input = document.getElementById('categoryName');
    const confirmBtn = document.getElementById('confirmCreateCategory');
    input.value = '';
    mCat.showModal();
    const onConfirm = (e) => {
      e.preventDefault();
      mCat.close('default');
    };
    const onClose = (e) => {
      mCat.removeEventListener('close', onClose);
      confirmBtn.removeEventListener('click', onConfirm);
      // validate non-empty trimmed name
      resolve(mCat.returnValue === 'default' && input.value.trim() ? input.value.trim() : null);
    };
    confirmBtn.addEventListener('click', onConfirm);
    mCat.addEventListener('close', onClose);
    input.focus();
  });
}

export function openModalTask(existing = null) {
  return new Promise((resolve) => {
    const tTitle = document.getElementById('taskTitle');
    const tDesc = document.getElementById('taskDesc');
    const tDue = document.getElementById('taskDue');
    const confirmBtn = document.getElementById('confirmSaveTask');
    const title = document.getElementById('taskModalTitle');
    const isEdit = !!existing;
    title.textContent = isEdit ? 'Edit Task' : 'New Task';
    tTitle.value = existing?.title || '';
    tDesc.value = existing?.description || '';
    tDue.value = existing?.due || '';
    mTask.showModal();
    const onConfirm = (e) => {
      e.preventDefault();
      mTask.close('default');
    };
    const onClose = () => {
      mTask.removeEventListener('close', onClose);
      confirmBtn.removeEventListener('click', onConfirm);
      if (mTask.returnValue === 'default') {
        // build payload and require title
        const payload = {
          title: tTitle.value.trim(),
          description: tDesc.value.trim(),
          due: tDue.value || '',
        };
        resolve(payload.title ? payload : null);
      } else {
        resolve(null);
      }
    };
    confirmBtn.addEventListener('click', onConfirm);
    mTask.addEventListener('close', onClose);
    tTitle.focus();
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
