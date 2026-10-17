/* ==========================================================================
   ui.js — мелкие интерфейсные утилиты: анимированный счётчик и уведомления
   ========================================================================== */

/** Идентификаторы requestAnimationFrame для каждого счётчика. */
const frames = new WeakMap();

/**
 * Плавно меняет число в элементе от прежнего значения к новому.
 * @param {HTMLElement} el      элемент, в котором показывается сумма
 * @param {number}      to      конечное значение
 * @param {(v:number)=>string} format  как превратить число в текст
 */
function tween(el, to, format) {
  const from = +el.dataset.v || 0;
  el.dataset.v = to;
  cancelAnimationFrame(frames.get(el));

  const start = performance.now();
  const duration = 650;

  (function step(now) {
    const k = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - k, 4); // easeOutQuart
    el.textContent = format(from + (to - from) * eased);
    if (k < 1) frames.set(el, requestAnimationFrame(step));
  })(start);
}

let toastTimer;

/** Показывает всплывающее уведомление на 1,8 секунды. */
function toast(message) {
  const el = $('#toast');
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 1800);
}

/**
 * Если иконка не загрузилась (нет сети или сервис недоступен):
 * у основной иконки показывается первая буква названия,
 * а маленькая иконка в блоке «Входит в подписку» просто убирается.
 * Событие error не всплывает, поэтому слушаем его на этапе перехвата.
 */
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
