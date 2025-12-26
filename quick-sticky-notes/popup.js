document.addEventListener('DOMContentLoaded', () => {
  const noteArea = document.getElementById('note-area');
  const saveStatus = document.getElementById('save-status');
  const saveIndicator = document.getElementById('save-indicator');
  const clearBtn = document.getElementById('clear-btn');
  const copyBtn = document.getElementById('copy-btn');

  let typingTimer;
  const doneTypingInterval = 800; // slightly longer for smoother UI

  // Load saved note
  chrome.storage.local.get(['stickyNote'], (result) => {
    if (result.stickyNote) {
      noteArea.value = result.stickyNote;
    }
  });

  // Auto-save logic
  noteArea.addEventListener('input', () => {
    saveStatus.textContent = 'Typing...';
    saveIndicator.classList.add('saving');
    clearTimeout(typingTimer);
    typingTimer = setTimeout(saveNote, doneTypingInterval);
  });

  function saveNote() {
    const noteText = noteArea.value;
    chrome.storage.local.set({ stickyNote: noteText }, () => {
      saveStatus.textContent = 'Saved';
      saveIndicator.classList.remove('saving');
    });
  }

  // Clear functionality
  clearBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all notes?')) {
      noteArea.value = '';
      saveNote();
    }
  });

  // Copy functionality
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(noteArea.value);
      const originalText = copyBtn.textContent;
      copyBtn.textContent = 'Copied!';
      setTimeout(() => {
        copyBtn.textContent = originalText;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  });
});
