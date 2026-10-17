const ICON_REMOVE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>';

const itemsEl = $('#items');

function lineHTML(service, term) {
  const termButtons = TERMS
    .map(t => `<button data-t="${t}" class="${t === term ? 'on' : ''}">${t} мес</button>`)
    .join('');
  return `<div class="line" data-id="${service.id}">${iconHTML(service)}
    <div class="info"><div class="n">${service.name}</div><div class="mini">${termButtons}</div></div>
    <div class="sum">${fmt(priceFor(service, term).final)}</div>
    <button class="rm" aria-label="Удалить">${ICON_REMOVE}</button></div>`;
}

function renderCart() {
  const ids = Object.keys(cart);

  [...itemsEl.children].forEach(row => {
    if (!cart[row.dataset.id] && !row.classList.contains('leave')) row.remove();
  });

  ids.forEach(id => {
    const service = SERVICES.find(s => s.id === id);
    const term = cart[id];
    let row = itemsEl.querySelector(`.row[data-id="${id}"]`);

    if (!row) {
      row = document.createElement('div');
      row.className = 'row enter';
      row.dataset.id = id;
      row.innerHTML = `<div>${lineHTML(service, term)}</div>`;
      itemsEl.appendChild(row);
      requestAnimationFrame(() => requestAnimationFrame(() => row.classList.remove('enter')));
    } else {
      row.querySelectorAll('.mini button').forEach(b => b.classList.toggle('on', +b.dataset.t === term));
      row.querySelector('.sum').textContent = fmt(priceFor(service, term).final);
    }
  });

  let full = 0;
  let final = 0;
  ids.forEach(id => {
    const price = priceFor(SERVICES.find(s => s.id === id), cart[id]);
    full += price.full;
    final += price.final;
  });

  tween($('#full'), full, fmt);
  tween($('#saved'), full - final, v => '−' + fmt(v));
  tween($('#total'), final, fmt);

  const count = ids.length;
  [$('#badge'), $('#fabBadge')].forEach(badge => {
    if (+badge.textContent !== count) {
      badge.textContent = count;
      badge.classList.remove('bump');
      void badge.offsetWidth;
      badge.classList.add('bump');
    }
  });

  $('#blank').hidden = count > 0;
  $('#clear').hidden = !count;
  $('#pay').disabled = !count;

  cards.forEach(renderCard);
}

function removeFromCart(id) {
  delete cart[id];
  save();
  const row = itemsEl.querySelector(`.row[data-id="${id}"]`);
  if (row) {
    row.classList.add('leave');
    setTimeout(() => row.remove(), 520);
  }
  renderCart();
}

itemsEl.addEventListener('click', e => {
  const line = e.target.closest('.line');
  if (!line) return;
  const id = line.dataset.id;

  if (e.target.closest('.rm')) { removeFromCart(id); return; }

  const termButton = e.target.closest('.mini button');
  if (termButton) {
    cart[id] = +termButton.dataset.t;
    cardTerm[id] = cart[id];
    save();
    renderCart();
  }
});

$('#clear').addEventListener('click', () => {
  Object.keys(cart).forEach(removeFromCart);
  toast('Корзина очищена');
});

$('#pay').addEventListener('click', () => toast('Итого к оплате: ' + $('#total').textContent));

$('#fab').addEventListener('click', () => $('#cartBox').scrollIntoView({ behavior: 'smooth' }));
