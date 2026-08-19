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

const carousel = grid.closest('.product-carousel');
const previousButton = carousel.querySelector('.carousel-prev');
const nextButton = carousel.querySelector('.carousel-next');

function carouselStep() {
  const card = grid.querySelector('.product');
  if (!card) return grid.clientWidth;
  const gap = parseFloat(getComputedStyle(grid).columnGap) || 0;
  return card.getBoundingClientRect().width + gap;
}

function updateCarouselControls() {
  const lastScrollPosition = Math.max(0, grid.scrollWidth - grid.clientWidth);
  previousButton.disabled = grid.scrollLeft <= 2;
  nextButton.disabled = grid.scrollLeft >= lastScrollPosition - 2;
  carousel.classList.toggle('at-start', previousButton.disabled);
  carousel.classList.toggle('at-end', nextButton.disabled);
}

function moveCarousel(direction) {
  grid.scrollBy({
    left: carouselStep() * direction,
    behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
  });
}

previousButton.addEventListener('click', () => moveCarousel(-1));
nextButton.addEventListener('click', () => moveCarousel(1));
grid.addEventListener('scroll', () => requestAnimationFrame(updateCarouselControls), {passive:true});
grid.addEventListener('keydown', event => {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
  event.preventDefault();
  moveCarousel(event.key === 'ArrowRight' ? 1 : -1);
});

let dragStart = null;
grid.addEventListener('pointerdown', event => {
  if (event.pointerType !== 'mouse' || event.button !== 0) return;
  dragStart = {x:event.clientX, scrollLeft:grid.scrollLeft, pointerId:event.pointerId};
  grid.setPointerCapture(event.pointerId);
  grid.classList.add('is-dragging');
});
grid.addEventListener('pointermove', event => {
  if (!dragStart || event.pointerId !== dragStart.pointerId) return;
  grid.scrollLeft = dragStart.scrollLeft - (event.clientX - dragStart.x);
});
function stopCarouselDrag(event) {
  if (!dragStart || event.pointerId !== dragStart.pointerId) return;
  grid.classList.remove('is-dragging');
  dragStart = null;
}
grid.addEventListener('pointerup', stopCarouselDrag);
grid.addEventListener('pointercancel', stopCarouselDrag);

if ('ResizeObserver' in window) new ResizeObserver(updateCarouselControls).observe(grid);
else window.addEventListener('resize', updateCarouselControls);
requestAnimationFrame(updateCarouselControls);

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
      const left = card.offsetLeft - (grid.clientWidth - card.clientWidth) / 2;
      grid.scrollTo({left, behavior:'smooth'});
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
}
applyTheme('editorial');
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

