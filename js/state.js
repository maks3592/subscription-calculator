/* ==========================================================================
   state.js — состояние приложения, хранение корзины и расчёт цены
   ========================================================================== */

const STORAGE_KEY = 'subcalc';

/** Короткий селектор: $('#id'). */
const $ = selector => document.querySelector(selector);

/** Форматирует сумму в рублях: 7670 → «7 670 ₽» (обычный пробел вместо неразрывного). */
const fmt = n => Math.round(n).toLocaleString('ru-RU').replace(/ /g, ' ') + ' ₽';

/** Срок, выбранный на карточке каталога: id → месяцы. */
const cardTerm = {};

/** Корзина: id сервиса → срок в месяцах. */
let cart = {};

/** Активная категория фильтра. */
let filter = 'Все';

/** Читает корзину из localStorage; всё, чего нет в каталоге, отбрасывается. */
function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return Object.fromEntries(
      Object.entries(saved).filter(([id, term]) =>
        SERVICES.some(s => s.id === id) && TERMS.includes(term))
    );
  } catch (e) {
    return {};
  }
}

/** Сохраняет корзину. Ошибки (например, приватный режим) молча игнорируются. */
function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch (e) { /* без сохранения */ }
}

/** Цена сервиса за срок: full — без скидки, final — со скидкой. */
const priceFor = (service, term) => ({
  full: service.price * term,
  final: service.price * term * (1 - DISCOUNT[term]),
});

cart = loadCart();
