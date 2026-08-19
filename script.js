document.documentElement.classList.add('js');

const products = [
  {size:'XS',max:5,length:'12 см',diameter:'Ø 1,7–2,2 см',character:'Карманный ценитель хороших палок',image:'assets-v2/product-xs.webp?v=c846bd3'},
  {size:'S',max:10,length:'13 см',diameter:'Ø 2,2–2,5 см',character:'Маленький, но серьёзный грызун',image:'assets-v2/product-s.webp?v=c846bd3'},
  {size:'M',max:15,length:'18 см',diameter:'Ø 3,2–3,7 см',character:'Уверенный палкоед среднего звена',image:'assets-v2/product-m.webp?v=c846bd3'},
  {size:'L',max:20,length:'21 см',diameter:'Ø 4,2–5,2 см',character:'Опытный специалист по погрызушкам',image:'assets-v2/product-l.webp?v=c846bd3'},
  {size:'XL',max:Infinity,length:'22 см',diameter:'Ø 5–6 см',character:'Профессиональный уничтожитель скуки',image:'assets-v2/product-xl.webp?v=c846bd3'}
];

const grid = document.querySelector('#productGrid');
grid.innerHTML = products.map(product => `
  <article class="product" data-size="${product.size}">
    <img src="${product.image}" width="800" height="800" loading="lazy" decoding="async" alt="Палочка Coffee Wood ${product.size}">
    <div class="product-head"><h3>${product.size}</h3></div>
    <p class="product-character">${product.character}</p>
    <p>${product.length}<br>${product.diameter}</p>
    <span class="product-status">Скоро</span>
  </article>
`).join('');

const range = document.querySelector('#weight');
function updateRecommendation(value, scrollCard = false) {
  const product = products.find(item => value <= item.max);
  document.querySelector('#weightOutput').textContent = `${value}${value === 45 ? '+' : ''} кг`;
  document.querySelector('#recSize').textContent = product.size;
  document.querySelector('#recTitle').textContent = product.character;
  document.querySelector('#recWeight').textContent = product.size === 'XL' ? 'Для собак весом от 21 кг' : `Для собак весом до ${product.max} кг`;
  document.querySelector('#recSpecs').textContent = `${product.length} · ${product.diameter}`;
  document.querySelectorAll('.product').forEach(card => {
    const isActive = card.dataset.size === product.size;
    card.classList.toggle('active', isActive);
    if (isActive && scrollCard && matchMedia('(max-width: 960px)').matches) {
      card.scrollIntoView({behavior:'smooth', block:'nearest', inline:'center'});
    }
  });
}
range.addEventListener('input', event => updateRecommendation(Number(event.target.value), true));
updateRecommendation(Number(range.value));

const fadeElements = document.querySelectorAll('.fade');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  }), {threshold:.12});
  fadeElements.forEach(element => observer.observe(element));
} else {
  fadeElements.forEach(element => element.classList.add('visible'));
}

const themeButtons = document.querySelectorAll('[data-theme-value]');
const themeStatus = document.querySelector('#themeStatus');
const themeMeta = document.querySelector('meta[name="theme-color"]');
function applyTheme(theme, announce = false) {
  const selected = theme === 'hooligan' ? 'hooligan' : 'editorial';
  document.documentElement.dataset.theme = selected;
  themeButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.themeValue === selected)));
  themeMeta.setAttribute('content', selected === 'hooligan' ? '#e04f2f' : '#123629');
  if (announce) themeStatus.textContent = selected === 'hooligan' ? 'Включён хулиганский дизайн' : 'Включён редакционный дизайн';
  try { localStorage.setItem('coffeeWoodTheme', selected); } catch (error) { /* Сайт работает и без сохранения настройки. */ }
}
let savedTheme = 'editorial';
try { savedTheme = localStorage.getItem('coffeeWoodTheme') || 'editorial'; } catch (error) { /* Используем дизайн по умолчанию. */ }
applyTheme(savedTheme);
themeButtons.forEach(button => button.addEventListener('click', () => applyTheme(button.dataset.themeValue, true)));

const menuToggle = document.querySelector('.mobile-menu-toggle');
const primaryNav = document.querySelector('#primaryNav');
function closeMenu() {
  primaryNav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}
menuToggle.addEventListener('click', () => {
  const isOpen = primaryNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});
primaryNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
document.addEventListener('click', event => {
  if (!primaryNav.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
});

