const STORAGE_KEY = 'subcalc';

const $ = selector => document.querySelector(selector);

const fmt = n => Math.round(n).toLocaleString('ru-RU').replace(/ /g, ' ') + ' ₽';

const cardTerm = {};

let cart = {};

let filter = 'Все';

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

function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch (e) { }
}

const priceFor = (service, term) => ({
  full: service.price * term,
  final: service.price * term * (1 - DISCOUNT[term]),
});

cart = loadCart();
