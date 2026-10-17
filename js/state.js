/* ---------- состояние ---------- */
const $=s=>document.querySelector(s);
const fmt=n=>Math.round(n).toLocaleString('ru-RU').replace(/ /g,' ')+' ₽';
const termLabel=m=>m+' мес';
const cardTerm={};            // выбранный срок на карточке
let cart={};                  // id -> срок
try{cart=JSON.parse(localStorage.getItem('subcalc')||'{}')}catch(e){}
const save=()=>{try{localStorage.setItem('subcalc',JSON.stringify(cart))}catch(e){}};
cart=Object.fromEntries(Object.entries(cart).filter(([id,t])=>SERVICES.some(s=>s.id===id)&&TERMS.includes(t)));
let filter='Все';

const priceFor=(s,t)=>({full:s.price*t,final:s.price*t*(1-DISCOUNT[t])});
