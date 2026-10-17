/* ---------- каталог и фильтры ---------- */
/* ---------- иконка с запасным вариантом ---------- */
function iconHTML(s){
  return `<div class="ico"><img src="${s.icon}" alt="" loading="lazy" referrerpolicy="no-referrer" class="${s.isFav?'fav':''}" onerror="this.replaceWith(Object.assign(document.createElement('b'),{textContent:'${s.name[0]}'}))"></div>`;
}

/* ---------- каталог ---------- */
const grid=$('#grid');
grid.innerHTML=SERVICES.map((s,i)=>{
  cardTerm[s.id]=cart[s.id]||1;
  return `<article class="card" data-id="${s.id}" style="--i:${i}">
    <div class="top">${iconHTML(s)}<div><div class="name">${s.name}</div><div class="cat">${s.cat}</div></div></div>
    <div class="price"><span class="big"></span><span class="per">₽ / мес</span><span class="old"></span><span class="save"></span></div>
    <div class="seg" style="--k:0"><span class="thumb"></span>${TERMS.map(t=>`<button data-t="${t}">${t} мес</button>`).join('')}</div>
    <button class="add"></button>
  </article>`}).join('');

const PLUS='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>';
const CHECK='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7"/></svg>';

function renderCard(card){
  const s=SERVICES.find(x=>x.id===card.dataset.id), t=cardTerm[s.id], p=priceFor(s,t), per=p.final/t;
  card.querySelector('.big').textContent=Math.round(per).toLocaleString('ru-RU');
  const old=card.querySelector('.old'), sv=card.querySelector('.save');
  old.style.opacity=DISCOUNT[t]?1:0; old.textContent=s.price+' ₽';
  sv.textContent='−'+Math.round(DISCOUNT[t]*100)+'%'; sv.classList.toggle('zero',!DISCOUNT[t]);
  card.querySelector('.seg').style.setProperty('--k',TERMS.indexOf(t));
  card.querySelectorAll('.seg button').forEach(b=>b.classList.toggle('on',+b.dataset.t===t));
  const inCart=cart[s.id], add=card.querySelector('.add');
  card.classList.toggle('in',!!inCart);
  add.classList.toggle('added',!!inCart && inCart===t);
  add.innerHTML = !inCart ? `${PLUS}В корзину · ${fmt(p.final)}`
    : inCart===t ? `${CHECK}В корзине` : `Изменить срок · ${fmt(p.final)}`;
}
const cards=[...grid.children];
cards.forEach(renderCard);

grid.addEventListener('click',e=>{
  const card=e.target.closest('.card'); if(!card) return;
  const id=card.dataset.id;
  const tb=e.target.closest('.seg button');
  if(tb){cardTerm[id]=+tb.dataset.t; renderCard(card); return}
  if(e.target.closest('.add')){
    const t=cardTerm[id], was=cart[id];
    if(was===t){removeFromCart(id);return}
    cart[id]=t; save(); renderCard(card); renderCart(was?null:id);
    toast(was?'Срок обновлён':'Добавлено в корзину');
  }
});
grid.addEventListener('pointermove',e=>{
  const c=e.target.closest('.card'); if(!c) return;
  const r=c.getBoundingClientRect(); c.style.setProperty('--mx',e.clientX-r.left+'px'); c.style.setProperty('--my',e.clientY-r.top+'px');
});

/* ---------- фильтры ---------- */
const chips=$('#chips'), pill=chips.querySelector('.pill');
CATS.forEach(c=>{const b=document.createElement('button');b.className='chip'+(c===filter?' on':'');b.textContent=c;chips.appendChild(b)});
function movePill(){const on=chips.querySelector('.chip.on');pill.style.width=on.offsetWidth+'px';pill.style.transform=`translateX(${on.offsetLeft-4}px)`}
chips.addEventListener('click',e=>{
  const b=e.target.closest('.chip'); if(!b) return;
  chips.querySelectorAll('.chip').forEach(x=>x.classList.toggle('on',x===b));
  filter=b.textContent; movePill(); applyFilter();
});
$('#q').addEventListener('input',applyFilter);
function applyFilter(){
  const q=$('#q').value.trim().toLowerCase(); let n=0;
  cards.forEach(c=>{
    const s=SERVICES.find(x=>x.id===c.dataset.id);
    const ok=(filter==='Все'||s.cat===filter)&&s.name.toLowerCase().includes(q);
    if(ok){ // перезапуск анимации появления
      if(c.classList.contains('hide')){c.classList.remove('hide');c.style.animation='none';c.offsetHeight;c.style.animation='';c.style.setProperty('--i',n%8)}
      n++;
    }else c.classList.add('hide');
  });
  $('#empty').classList.toggle('show',!n);
}
