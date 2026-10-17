/* ---------- утилиты интерфейса ---------- */
/* плавный счётчик */
const raf=new WeakMap();
function tween(el,to,f){
  const from=+el.dataset.v||0; el.dataset.v=to; cancelAnimationFrame(raf.get(el));
  const t0=performance.now(), d=650;
  (function step(now){
    const k=Math.min(1,(now-t0)/d), e=1-Math.pow(1-k,4);
    el.textContent=f(from+(to-from)*e);
    if(k<1)raf.set(el,requestAnimationFrame(step));
  })(t0);
}
let tt; function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('show'),1800)}
