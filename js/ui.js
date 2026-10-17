const frames = new WeakMap();

function tween(el, to, format) {
  const from = +el.dataset.v || 0;
  el.dataset.v = to;
  cancelAnimationFrame(frames.get(el));

  const start = performance.now();
  const duration = 650;

  (function step(now) {
    const k = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - k, 4);
    el.textContent = format(from + (to - from) * eased);
    if (k < 1) frames.set(el, requestAnimationFrame(step));
  })(start);
}

let toastTimer;

function toast(message) {
  const el = $('#toast');
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 1800);
}

document.addEventListener('error', e => {
  const img = e.target;
  if (!(img instanceof HTMLImageElement)) return;

  if (img.closest('.ico')) {
    const letter = document.createElement('b');
    letter.textContent = img.dataset.letter || '';
    img.replaceWith(letter);
  } else if (img.closest('.incl-l')) {
    img.remove();
  }
}, true);
