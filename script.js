
const products=[
 {size:'XS',max:5,length:'12 см',diameter:'Ø 1,7–2,2 см',character:'Карманный ценитель хороших палок',image:'assets-v2/product-xs.webp'},
 {size:'S',max:10,length:'13 см',diameter:'Ø 2,2–2,5 см',character:'Маленький, но серьёзный грызун',image:'assets-v2/product-s.webp'},
 {size:'M',max:15,length:'18 см',diameter:'Ø 3,2–3,7 см',character:'Уверенный палкоед среднего звена',image:'assets-v2/product-m.webp'},
 {size:'L',max:20,length:'21 см',diameter:'Ø 4,2–5,2 см',character:'Опытный специалист по погрызушкам',image:'assets-v2/product-l.webp'},
 {size:'XL',max:Infinity,length:'22 см',diameter:'Ø 5–6 см',character:'Профессиональный уничтожитель скуки',image:'assets-v2/product-xl.webp'}
];
const grid=document.querySelector('#productGrid');
grid.innerHTML=products.map(p=>`<article class="product" data-size="${p.size}"><img src="${p.image}" alt="Палочка Coffee Wood ${p.size}"><div class="product-head"><h3>${p.size}</h3></div><p class="product-character">${p.character}</p><p>${p.length}<br>${p.diameter}</p><span class="product-status">Скоро</span></article>`).join('');
const range=document.querySelector('#weight');
function update(value){const p=products.find(x=>value<=x.max);document.querySelector('#weightOutput').textContent=`${value}${value==45?'+':''} кг`;document.querySelector('#recSize').textContent=p.size;document.querySelector('#recTitle').textContent=p.character;document.querySelector('#recWeight').textContent=p.size==='XL'?'Для собак весом от 21 кг':`Для собак весом до ${p.max} кг`;document.querySelector('#recSpecs').textContent=`${p.length} · ${p.diameter}`;document.querySelectorAll('.product').forEach(card=>card.classList.toggle('active',card.dataset.size===p.size))}
range.addEventListener('input',e=>update(Number(e.target.value)));update(Number(range.value));
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.12});document.querySelectorAll('.fade').forEach(el=>observer.observe(el));
const movable=document.querySelectorAll('.hero-float');window.addEventListener('pointermove',event=>{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;const x=event.clientX/innerWidth-.5,y=event.clientY/innerHeight-.5;movable.forEach((el,index)=>el.style.transform=`translate(${x*(index?18:-14)}px,${y*(index?14:-10)}px) rotate(${index?5:-6}deg)`)},{passive:true});


