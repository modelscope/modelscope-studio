window.addEventListener('error', (e) => {
  window.parent.postMessage({
    type: 'sandbox-error',
    message: e.message,
  });
});

window.addEventListener('DOMContentLoaded', () => {
  window.parent.postMessage({
    type: 'sandbox-ready',
  });
});
