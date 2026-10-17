/* ==========================================================================
   catalog.js — карточки сервисов, поиск и фильтр по категориям
   ========================================================================== */

const ICON_PLUS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>';
const ICON_CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7"/></svg>';

const grid = $('#grid');

/** Разметка иконки сервиса; запасной вариант (буква) подставляется в ui.js. */
function iconHTML(service) {
  const cls = service.isFav ? 'fav' : '';
  return `<div class="ico"><img src="${service.icon}" alt="" loading="lazy" referrerpolicy="no-referrer" class="${cls}" data-letter="${service.name[0]}"></div>`;
}

/** Блок «Входит в подписку» для сервисов с полем includes (например, Яндекс Плюс). */
function includesHTML(service) {
  if (!service.includes) return '';
  const items = service.includes
    .map(([name, domain]) => `<span><img src="${fav(domain)}" alt="" loading="lazy">${name}</span>`)
    .join('');
  return `<div class="incl"><div class="incl-t">Входит в подписку</div><div class="incl-l">${items}</div></div>`;
}

/** Разметка одной карточки; цены и кнопки заполняет renderCard. */
function cardHTML(service, index) {
  const termButtons = TERMS.map(t => `<button data-t="${t}">${t} мес</button>`).join('');
  return `<article class="card" data-id="${service.id}" style="--i:${index}">
    <div class="top">${iconHTML(service)}<div><div class="name">${service.name}</div><div class="cat">${service.cat}</div></div></div>
    <div class="price"><span class="big"></span><span class="per">₽ / мес</span><span class="old"></span><span class="save"></span></div>
    ${includesHTML(service)}
    <div class="seg" style="--k:0"><span class="thumb"></span>${termButtons}</div>
    <button class="add"></button>
  </article>`;
}

grid.innerHTML = SERVICES.map((service, i) => {
  cardTerm[service.id] = cart[service.id] || 1;
  return cardHTML(service, i);
}).join('');

const cards = [...grid.children];

/** Обновляет цену, скидку, переключатель срока и кнопку на одной карточке. */
function renderCard(card) {
  const service = SERVICES.find(s => s.id === card.dataset.id);
  const term = cardTerm[service.id];
  const price = priceFor(service, term);
  const discount = DISCOUNT[term];

  card.querySelector('.big').textContent = Math.round(price.final / term).toLocaleString('ru-RU');

  const oldPrice = card.querySelector('.old');
  oldPrice.style.opacity = discount ? 1 : 0;
  oldPrice.textContent = service.price + ' ₽';

  const badge = card.querySelector('.save');
  badge.textContent = '−' + Math.round(discount * 100) + '%';
  badge.classList.toggle('zero', !discount);

  card.querySelector('.seg').style.setProperty('--k', TERMS.indexOf(term));
  card.querySelectorAll('.seg button').forEach(b => b.classList.toggle('on', +b.dataset.t === term));

  const inCart = cart[service.id];
  const addButton = card.querySelector('.add');
  card.classList.toggle('in', !!inCart);
  addButton.classList.toggle('added', !!inCart && inCart === term);
  addButton.innerHTML = !inCart
    ? `${ICON_PLUS}В корзину · ${fmt(price.final)}`
    : inCart === term
      ? `${ICON_CHECK}В корзине`
      : `Изменить срок · ${fmt(price.final)}`;
}

cards.forEach(renderCard);

/* ---------- события карточек ---------- */

grid.addEventListener('click', e => {
  const card = e.target.closest('.card');
  if (!card) return;
  const id = card.dataset.id;

  const termButton = e.target.closest('.seg button');
  if (termButton) {
    cardTerm[id] = +termButton.dataset.t;
    renderCard(card);
    return;
  }

  if (e.target.closest('.add')) {
    const term = cardTerm[id];
    const previous = cart[id];
    if (previous === term) { removeFromCart(id); return; }
    cart[id] = term;
    save();
    renderCard(card);
    renderCart();
    toast(previous ? 'Срок обновлён' : 'Добавлено в корзину');
  }
});

/** Подсветка карточки следует за курсором (значения читает CSS). */
grid.addEventListener('pointermove', e => {
  const card = e.target.closest('.card');
  if (!card) return;
  const rect = card.getBoundingClientRect();
  card.style.setProperty('--mx', e.clientX - rect.left + 'px');
  card.style.setProperty('--my', e.clientY - rect.top + 'px');
});

/* ---------- фильтры ---------- */

const chips = $('#chips');
const pill = chips.querySelector('.pill');

CATS.forEach(category => {
  const chip = document.createElement('button');
  chip.className = 'chip' + (category === filter ? ' on' : '');
  chip.textContent = category;
  chips.appendChild(chip);
});

/** Двигает белую «таблетку» под активную категорию. */
function movePill() {
  const active = chips.querySelector('.chip.on');
  pill.style.width = active.offsetWidth + 'px';
  pill.style.transform = `translateX(${active.offsetLeft - 4}px)`;
}

chips.addEventListener('click', e => {
  const chip = e.target.closest('.chip');
  if (!chip) return;
  chips.querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c === chip));
  filter = chip.textContent;
  movePill();
  applyFilter();
});

$('#q').addEventListener('input', applyFilter);

/** Показывает только карточки, подходящие под категорию и строку поиска. */
function applyFilter() {
  const query = $('#q').value.trim().toLowerCase();
  let visible = 0;

  cards.forEach(card => {
    const service = SERVICES.find(s => s.id === card.dataset.id);
    const match = (filter === 'Все' || service.cat === filter)
      && service.name.toLowerCase().includes(query);

    if (!match) {
      card.classList.add('hide');
      return;
    }
    if (card.classList.contains('hide')) {
      // заново запускаем анимацию появления
      card.classList.remove('hide');
      card.style.animation = 'none';
      void card.offsetHeight;
      card.style.animation = '';
      card.style.setProperty('--i', visible % 8);
    }
    visible++;
  });

  $('#empty').classList.toggle('show', !visible);
}
