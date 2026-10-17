/* ---------- корзина ---------- */
/* ---------- корзина ---------- */
const itemsEl=$('#items');
function lineHTML(s,t){
  return `<div class="line" data-id="${s.id}">${iconHTML(s)}
    <div class="info"><div class="n">${s.name}</div>
      <div class="mini">${TERMS.map(x=>`<button data-t="${x}" class="${x===t?'on':''}">${x} мес</button>`).join('')}</div></div>
    <div class="sum">${fmt(priceFor(s,t).final)}</div>
    <button class="rm" aria-label="Удалить"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div>`;
}
function renderCart(newId){
  const ids=Object.keys(cart);
  // удалить исчезнувшие
  [...itemsEl.children].forEach(r=>{if(!cart[r.dataset.id]&&!r.classList.contains('leave'))r.remove()});
  ids.forEach(id=>{
    const s=SERVICES.find(x=>x.id===id), t=cart[id];
    let row=itemsEl.querySelector(`.row[data-id="${id}"]`);
    if(!row){
      row=document.createElement('div');row.className='row enter';row.dataset.id=id;
      row.innerHTML=`<div>${lineHTML(s,t)}</div>`;itemsEl.appendChild(row);
      requestAnimationFrame(()=>requestAnimationFrame(()=>row.classList.remove('enter')));
    }else{
      row.querySelectorAll('.mini button').forEach(b=>b.classList.toggle('on',+b.dataset.t===t));
      row.querySelector('.sum').textContent=fmt(priceFor(s,t).final);
    }
  });
  let full=0,fin=0;
  ids.forEach(id=>{const p=priceFor(SERVICES.find(x=>x.id===id),cart[id]);full+=p.full;fin+=p.final});
  tween($('#full'),full,v=>fmt(v)); tween($('#saved'),full-fin,v=>'−'+fmt(v)); tween($('#total'),fin,v=>fmt(v));
  const n=ids.length;
  [$('#badge'),$('#fabBadge')].forEach(b=>{if(+b.textContent!==n){b.textContent=n;b.classList.remove('bump');b.offsetWidth;b.classList.add('bump')}});
  $('#blank').hidden=n>0; $('#clear').hidden=!n; $('#pay').disabled=!n;
  cards.forEach(renderCard);
}
function removeFromCart(id){
  delete cart[id]; save();
  const row=itemsEl.querySelector(`.row[data-id="${id}"]`);
  if(row){row.classList.add('leave');setTimeout(()=>row.remove(),520)}
  renderCart();
}
itemsEl.addEventListener('click',e=>{
  const line=e.target.closest('.line'); if(!line) return;
  const id=line.dataset.id;
  if(e.target.closest('.rm')) return removeFromCart(id);
  const b=e.target.closest('.mini button');
  if(b){cart[id]=+b.dataset.t;cardTerm[id]=cart[id];save();renderCart()}
});
$('#clear').addEventListener('click',()=>{Object.keys(cart).forEach(removeFromCart);toast('Корзина очищена')});
$('#pay').addEventListener('click',()=>toast('Итого к оплате: '+$('#total').textContent));
$('#fab').addEventListener('click',()=>$('#cartBox').scrollIntoView({behavior:'smooth'}));
