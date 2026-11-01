'use strict';

const categories = {
  coffee: { label: 'Кофе', image: 'coffee.jpg', alt: 'Кофе на столе для неспешного утра', caption: '01 / COFFEE, ALWAYS', note: 'Сначала<br><em>кофе.</em>' },
  breakfast: { label: 'Завтраки', image: 'pastry.jpg', alt: 'Свежая золотистая выпечка', caption: '02 / MORNING, ANYTIME', note: 'Утро<br><em>когда хотите.</em>' },
  dessert: { label: 'Десерты', image: 'pastry.jpg', alt: 'Выпечка для приятной паузы', caption: '03 / A LITTLE SWEETNESS', note: 'Счастье<br><em>в деталях.</em>' },
  seasonal: { label: 'Сезонное', image: 'latte.jpg', alt: 'Тёплый кофейный напиток с молочной пеной', caption: '04 / TASTE THE SEASON', note: 'Согреться<br><em>изнутри.</em>' }
};

const menu = [
  { id: 'espresso', category: 'coffee', name: 'Эспрессо', description: 'Плотный, с нотами тёмного шоколада и ореха.', price: 190, volume: '40 мл', sizes: [{label:'40 мл', extra:0}], image:'coffee.jpg' },
  { id: 'filter', category: 'coffee', name: 'Фильтр-кофе', description: 'Чистый вкус, лёгкая сладость и долгое послевкусие.', price: 230, volume: '250 мл', sizes: [{label:'250 мл',extra:0},{label:'350 мл',extra:60}], image:'hero.jpg' },
  { id: 'cappuccino', category: 'coffee', name: 'Капучино', description: 'Баланс эспрессо и бархатистой молочной пены.', price: 290, volume: '250 мл', tag:'Любимый', milk:true, sizes:[{label:'250 мл',extra:0},{label:'350 мл',extra:60}], image:'latte.jpg' },
  { id: 'flatwhite', category: 'coffee', name: 'Флэт уайт', description: 'Больше характера. Двойной эспрессо, нежное молоко.', price: 310, volume: '200 мл', milk:true, sizes:[{label:'200 мл',extra:0}], image:'coffee.jpg' },
  { id: 'latte', category: 'coffee', name: 'Латте', description: 'Мягкий, сливочный и ровно такой, как вы любите.', price: 320, volume: '300 мл', milk:true, sizes:[{label:'300 мл',extra:0},{label:'400 мл',extra:70}], image:'latte.jpg' },
  { id: 'raf', category: 'coffee', name: 'Ванильный раф', description: 'Кофе, сливки и тёплый аромат натуральной ванили.', price: 370, volume: '300 мл', sizes:[{label:'300 мл',extra:0},{label:'400 мл',extra:70}], image:'latte.jpg' },
  { id: 'croissant', category: 'breakfast', name: 'Круассан с маслом', description: 'Хрустящие слои, сливочное масло и ягодный джем.', price: 260, volume: '100 г', tag:'К кофе', image:'pastry.jpg' },
  { id: 'avocado', category: 'breakfast', name: 'Тост с авокадо', description: 'Ремесленный хлеб, авокадо, томаты и микрозелень.', price: 490, volume:'220 г', image:'pastry.jpg' },
  { id: 'syrniki', category: 'breakfast', name: 'Сырники', description: 'Нежный творог, сметана и тёплый ягодный соус.', price: 420, volume:'230 г', image:'pastry.jpg' },
  { id: 'granola', category: 'breakfast', name: 'Гранола с йогуртом', description: 'Запечённые овсяные хлопья, орехи и сезонные ягоды.', price: 350, volume:'200 г', image:'pastry.jpg' },
  { id: 'cheesecake', category: 'dessert', name: 'Баскский чизкейк', description: 'Карамельная корочка и мягкая сливочная середина.', price: 390, volume:'150 г', tag:'Классика', image:'pastry.jpg' },
  { id: 'cookie', category: 'dessert', name: 'Шоколадное печенье', description: 'Мягкое внутри, с тёмным шоколадом и морской солью.', price: 180, volume:'80 г', image:'pastry.jpg' },
  { id: 'almond', category: 'dessert', name: 'Миндальный круассан', description: 'Миндальный крем, тонкие лепестки и сахарная пудра.', price: 320, volume:'130 г', image:'pastry.jpg' },
  { id: 'pumpkin', category: 'seasonal', name: 'Пряный тыквенный латте', description: 'Тыква, корица и мускатный орех — осень в чашке.', price: 390, volume:'300 мл', tag:'Сезон', milk:true, sizes:[{label:'300 мл',extra:0},{label:'400 мл',extra:70}], image:'latte.jpg' },
  { id: 'cocoa', category: 'seasonal', name: 'Какао с маршмеллоу', description: 'Насыщенный шоколад, горячее молоко и облачка зефира.', price: 340, volume:'300 мл', milk:true, sizes:[{label:'300 мл',extra:0}], image:'coffee.jpg' },
  { id: 'tea', category: 'seasonal', name: 'Облепиха и розмарин', description: 'Ягодный чай с цитрусом и веточкой розмарина.', price: 360, volume:'400 мл', sizes:[{label:'400 мл',extra:0},{label:'600 мл',extra:100}], image:'hero.jpg' }
];

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const rub = value => new Intl.NumberFormat('ru-RU').format(value) + ' ₽';
let cart = [];
let activeProduct = null;
let productQuantity = 1;
let cartSequence = 0;
let toastTimer;

function createNode(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
}

// Draw UI icons instead of relying on platform-specific emoji fonts.
function createIcon(name) {
  const paths = {
    arrow: 'M5 19 19 5M5 5h14v14',
    plus: 'M5 12h14M12 5v14',
    asterisk: 'M12 3v18M3 12h18M5.6 5.6l12.8 12.8M5.6 18.4 18.4 5.6'
  };
  const ns = 'http://www.w3.org/2000/svg';
  const icon = document.createElementNS(ns, 'svg');
  const attributes = {
    class: 'icon', viewBox: '0 0 24 24', width: '24', height: '24',
    fill: 'none', stroke: 'currentColor', 'stroke-width': '1.6',
    'stroke-linecap': 'round', 'stroke-linejoin': 'round',
    'aria-hidden': 'true', focusable: 'false'
  };
  Object.entries(attributes).forEach(([key, value]) => icon.setAttribute(key, value));
  const path = document.createElementNS(ns, 'path');
  path.setAttribute('d', paths[name]);
  icon.append(path);
  return icon;
}

function renderMenu(category) {
  const meta = categories[category];
  $('#menu-photo').src = `assets/${meta.image}`;
  $('#menu-photo').alt = meta.alt;
  $('#menu-visual-label').textContent = meta.caption;
  $('#photo-note').innerHTML = meta.note;
  $('#menu-panel').setAttribute('aria-labelledby', `tab-${category}`);
  const list = $('#menu-list');
  list.replaceChildren();
  menu.filter(item => item.category === category).forEach((item, index) => {
    const row = createNode('article', 'menu-item');
    row.style.animationDelay = `${index * 35}ms`;
    const info = createNode('div', 'item-info');
    const heading = createNode('h3', '', item.name);
    if (item.tag) heading.append(createNode('span', 'item-tag', item.tag));
    const desc = createNode('p', '', item.description);
    const volume = createNode('p', 'item-volume', item.volume);
    info.append(heading, desc, volume);
    const actions = createNode('div', 'item-action');
    const price = createNode('span', 'item-price', rub(item.price));
    const button = createNode('button', 'add-item');
    button.append(createIcon('plus'));
    button.type = 'button';
    button.setAttribute('aria-label', `Выбрать ${item.name}`);
    button.addEventListener('click', () => openProduct(item));
    actions.append(price, button);
    row.append(info, actions);
    list.append(row);
  });
  $$('.menu-tabs button').forEach(button => {
    const selected = button.dataset.category === category;
    button.setAttribute('aria-selected', String(selected));
    button.tabIndex = selected ? 0 : -1;
  });
}

$$('.menu-tabs button').forEach((button, index, tabs) => {
  button.addEventListener('click', () => renderMenu(button.dataset.category));
  button.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) {
      event.preventDefault();
      tabs[next].focus();
      renderMenu(tabs[next].dataset.category);
    }
  });
});

function openDialog(dialog) {
  closeMobileNav();
  if (!dialog.open) dialog.showModal();
  document.body.classList.add('modal-open');
}
function closeDialog(dialog) {
  dialog.close();
}
$$('dialog').forEach(dialog => {
  dialog.addEventListener('close', () => {
    if (!$('dialog[open]')) document.body.classList.remove('modal-open');
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeDialog(dialog);
  });
});
$$('[data-close-dialog]').forEach(button => button.addEventListener('click', () => closeDialog(button.closest('dialog'))));

function openProduct(item) {
  activeProduct = item;
  productQuantity = 1;
  $('#product-title').textContent = item.name;
  $('#product-description').textContent = item.description;
  $('#product-category').textContent = categories[item.category].label.toUpperCase();
  $('#product-meta').textContent = item.volume;
  $('#product-image').src = `assets/${item.image}`;
  $('#product-image').alt = categories[item.category].alt;
  $('#product-quantity').textContent = '1';
  $('#quantity-minus').disabled = true;
  $('#quantity-plus').disabled = false;
  $('#drink-options').hidden = !item.sizes;
  $('#milk-label').hidden = !item.milk;
  $('#product-milk').selectedIndex = 0;
  $('#size-options').replaceChildren();
  (item.sizes || []).forEach((size, index) => {
    const label = createNode('label', 'size-option');
    const radio = createNode('input');
    radio.type = 'radio';
    radio.name = 'size';
    radio.value = String(index);
    radio.checked = index === 0;
    radio.addEventListener('change', updateProductPrice);
    label.append(radio, createNode('span', '', size.label));
    $('#size-options').append(label);
  });
  updateProductPrice();
  openDialog($('#product-dialog'));
}

function getProductChoice() {
  const selectedSize = $('#size-options input:checked');
  const size = activeProduct.sizes?.[Number(selectedSize?.value || 0)];
  const milkSelect = $('#product-milk');
  const milkExtra = activeProduct.milk ? Number(milkSelect.value) : 0;
  const milk = activeProduct.milk ? milkSelect.options[milkSelect.selectedIndex].textContent.replace(' +60 ₽', '') : '';
  return {size: size?.label || activeProduct.volume, milk, unitPrice: activeProduct.price + (size?.extra || 0) + milkExtra};
}

function updateProductPrice() {
  if (activeProduct) $('#product-price').textContent = rub(getProductChoice().unitPrice * productQuantity);
}
$('#product-milk').addEventListener('change', updateProductPrice);
function changeQuantity(amount) {
  productQuantity = Math.min(20, Math.max(1, productQuantity + amount));
  $('#product-quantity').textContent = String(productQuantity);
  $('#quantity-minus').disabled = productQuantity === 1;
  $('#quantity-plus').disabled = productQuantity === 20;
  updateProductPrice();
}
$('#quantity-minus').addEventListener('click', () => changeQuantity(-1));
$('#quantity-plus').addEventListener('click', () => changeQuantity(1));

$('#product-form').addEventListener('submit', event => {
  event.preventDefault();
  if (!activeProduct) return;
  const choice = getProductChoice();
  const existing = cart.find(item => item.productId === activeProduct.id && item.size === choice.size && item.milk === choice.milk);
  if (existing) existing.quantity += productQuantity;
  else cart.push({ key: ++cartSequence, productId: activeProduct.id, name: activeProduct.name, ...choice, quantity: productQuantity });
  updateCart();
  closeDialog($('#product-dialog'));
  showToast(`${activeProduct.name} — добавлено в ваш выбор`);
});

function showToast(message) {
  clearTimeout(toastTimer);
  $('#toast').textContent = message;
  $('#toast').classList.add('visible');
  toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 3200);
}
function cartCount() { return cart.reduce((total, item) => total + item.quantity, 0); }
function cartTotal() { return cart.reduce((total, item) => total + item.unitPrice * item.quantity, 0); }
function itemWord(number) {
  const last = number % 10, lastTwo = number % 100;
  if (lastTwo >= 11 && lastTwo <= 14) return 'позиций';
  if (last === 1) return 'позиция';
  if (last >= 2 && last <= 4) return 'позиции';
  return 'позиций';
}
function updateCart() {
  const count = cartCount();
  $$('.basket-count').forEach(el => el.textContent = String(count));
  $('.selection-button').setAttribute('aria-label', `Открыть мой выбор: ${count} ${itemWord(count)}`);
  $('#selection-summary').textContent = count ? `${count} ${itemWord(count)} · ${rub(cartTotal())}` : 'Пока ничего не выбрано';
  $('#basket-total').textContent = rub(cartTotal());
  const container = $('#basket-items');
  container.replaceChildren();
  $('#basket-footer').hidden = count === 0;
  if (!count) {
    const empty = createNode('div', 'basket-empty');
    const mark = createNode('div', 'empty-mark');
    mark.append(createIcon('asterisk'));
    empty.append(mark, createNode('h3', '', 'С чего начнём?'), createNode('p', '', 'Выберите кофе, добавьте что-нибудь вкусное и представьте свой идеальный визит.'));
    const button = createNode('button', 'button primary', 'Посмотреть меню');
    button.append(createIcon('arrow'));
    button.addEventListener('click', () => goToMenu());
    empty.append(button);
    container.append(empty);
    return;
  }
  cart.forEach(item => {
    const row = createNode('article', 'basket-item');
    const info = createNode('div');
    info.append(createNode('h3', '', item.name), createNode('p', '', [item.size, item.milk ? `${item.milk.toLowerCase()} молоко` : '', `${item.quantity} шт.`].filter(Boolean).join(' · ')));
    const remove = createNode('button', 'basket-remove', 'Убрать');
    remove.setAttribute('aria-label', `Убрать ${item.name}, ${item.size}`);
    remove.addEventListener('click', () => {
      const index = cart.findIndex(entry => entry.key === item.key);
      cart = cart.filter(entry => entry.key !== item.key);
      updateCart();
      const remaining = $$('.basket-remove');
      (remaining[Math.min(index, remaining.length - 1)] || $('#basket-items button'))?.focus();
    });
    info.append(remove);
    row.append(info, createNode('strong', '', rub(item.unitPrice * item.quantity)));
    container.append(row);
  });
}
$$('[data-open-basket]').forEach(button => button.addEventListener('click', () => { updateCart(); openDialog($('#basket-dialog')); }));
function goToMenu() { closeDialog($('#basket-dialog')); $('#menu').scrollIntoView({behavior: prefersReducedMotion() ? 'instant' : 'smooth'}); }
$('#continue-menu').addEventListener('click', goToMenu);
$('#basket-book').addEventListener('click', () => {
  closeDialog($('#basket-dialog'));
  $('#booking').scrollIntoView({behavior: prefersReducedMotion() ? 'instant' : 'smooth'});
  setTimeout(() => $('#visit-date').focus({preventScroll:true}), prefersReducedMotion() ? 0 : 500);
});

function localDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}
function dateLimit() {
  const max = new Date(); max.setDate(max.getDate() + 30); return localDate(max);
}
function setDateBounds() {
  $('#visit-date').min = localDate(new Date());
  $('#visit-date').max = dateLimit();
}
setDateBounds();
const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
$('#visit-date').value = localDate(tomorrow);
const times = ['09:00','10:30','12:00','13:30','15:00','16:30','18:00','19:30'];
function renderTimes() {
  const selected = $('input[name=time]:checked')?.value;
  $('#time-slots').replaceChildren();
  const now = new Date();
  let firstAvailable;
  times.forEach(time => {
    const label = createNode('label','time-slot');
    const input = createNode('input');
    input.type = 'radio'; input.name = 'time'; input.value = time; input.required = true;
    const selectedDate = $('#visit-date').value;
    const slotDate = new Date(`${selectedDate}T${time}:00`);
    input.disabled = !selectedDate || slotDate <= now;
    input.checked = !input.disabled && selected === time;
    if (!input.disabled && !firstAvailable) firstAvailable = input;
    label.append(input, createNode('span','',time));
    $('#time-slots').append(label);
  });
  if (!$('input[name=time]:checked') && firstAvailable) firstAvailable.checked = true;
  $('#booking-error').hidden = Boolean(firstAvailable);
  if (!firstAvailable) $('#booking-error').textContent = 'На эту дату доступных демонстрационных интервалов уже нет. Выберите другой день.';
}
$('#visit-date').addEventListener('change', () => {setDateBounds(); renderTimes();});
$('#visit-date').addEventListener('focus', setDateBounds);
// Open the native calendar from the date text and the entire field surface.
// Keep native interaction available if showPicker is unavailable or restricted.
function openVisitDatePicker(event) {
  const input = $('#visit-date');
  if (typeof input.showPicker !== 'function') return;
  setDateBounds();
  try {
    input.showPicker();
    event.preventDefault();
  } catch {
    // The browser's default date control remains usable.
  }
}
$('#visit-date').addEventListener('click', openVisitDatePicker);
$('#visit-date').addEventListener('keydown', event => {
  if (event.key === 'Enter' || event.key === ' ') openVisitDatePicker(event);
});

$('#booking-form').addEventListener('submit', event => {
  event.preventDefault();
  const date = $('#visit-date').value;
  const time = $('input[name=time]:checked')?.value;
  const error = $('#booking-error');
  const now = new Date();
  if (!date || date < localDate(now) || date > dateLimit() || !time || new Date(`${date}T${time}:00`) <= now) {
    error.textContent = 'Выберите будущие дату и время в пределах ближайших 30 дней.';
    error.hidden = false;
    setDateBounds(); renderTimes();
    error.hidden = false;
    return;
  }
  error.hidden = true;
  const name = $('#guest-name').value.trim();
  $('#result-intro').textContent = name ? `${name}, вот как могло бы выглядеть подтверждение вашего визита.` : 'Вот как могло бы выглядеть подтверждение вашего визита.';
  const result = $('#result-details'); result.replaceChildren();
  const details = [
    ['Дата', new Date(`${date}T12:00:00`).toLocaleDateString('ru-RU',{day:'numeric',month:'long',year:'numeric'})],
    ['Время', time], ['Гости', $('#visit-guests').value],
    ['Выбор из меню', cartCount() ? `${cartCount()} ${itemWord(cartCount())} · ${rub(cartTotal())}` : 'Выберем на месте']
  ];
  if (cart.length) details.push(['Позиции', cart.map(item => `${item.name} × ${item.quantity}`).join(', ')]);
  const note = $('#visit-note').value.trim();
  if (note) details.push(['Пожелания', note]);
  details.forEach(([key,value]) => { const row = createNode('div'); row.append(createNode('span','',key),createNode('strong','',value)); result.append(row); });
  openDialog($('#result-dialog'));
});

$('#about-demo').addEventListener('click', () => openDialog($('#info-dialog')));
$('#year').textContent = String(new Date().getFullYear());
function closeMobileNav() {
  $('#mobile-nav').hidden = true;
  $('#nav-toggle').setAttribute('aria-expanded','false');
  $('#nav-toggle').setAttribute('aria-label','Открыть навигацию');
  document.body.classList.remove('nav-open');
}
$('#nav-toggle').addEventListener('click', () => {
  const willOpen = $('#mobile-nav').hidden;
  $('#mobile-nav').hidden = !willOpen;
  $('#nav-toggle').setAttribute('aria-expanded', String(willOpen));
  $('#nav-toggle').setAttribute('aria-label', willOpen ? 'Закрыть навигацию' : 'Открыть навигацию');
  document.body.classList.toggle('nav-open', willOpen);
});
$$('#mobile-nav a').forEach(link => link.addEventListener('click', closeMobileNav));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !$('#mobile-nav').hidden) { closeMobileNav(); $('#nav-toggle').focus(); }
  if (event.key === 'Tab' && !$('#mobile-nav').hidden) {
    const items = [$('.wordmark'), $('.selection-button'), $('#nav-toggle'), ...$$('#mobile-nav a')];
    const first = items[0], last = items[items.length-1];
    if (event.shiftKey && document.activeElement === first) {event.preventDefault();last.focus();}
    else if (!event.shiftKey && document.activeElement === last) {event.preventDefault();first.focus();}
  }
});

const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
function prefersReducedMotion() { return motionPreference.matches; }
if (!prefersReducedMotion() && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('js-motion');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) {entry.target.classList.add('revealed');observer.unobserve(entry.target);} });
  },{threshold:.12});
  $$('.reveal').forEach(el => observer.observe(el));
}
const heroMedia = $('.hero-media'), ritual = $('.ritual'), ritualImage = $('.ritual-image'), ritualCaption = $('.ritual-caption'), ritualProgress = $('.ritual-progress span');
let framePending = false;
const clamp = (value,min,max) => Math.max(min,Math.min(max,value));
function updateScroll() {
  framePending = false;
  const scroll = window.scrollY;
  $('#header').classList.toggle('scrolled', scroll > 110);
  if (prefersReducedMotion()) return;
  const viewport = window.innerHeight;
  if (scroll < viewport * 1.4) heroMedia.style.transform = `translateY(${scroll * .18}px) scale(${1.04 + scroll / viewport * .07})`;
  const bounds = ritual.getBoundingClientRect();
  if (bounds.top < viewport && bounds.bottom > 0) {
    const progress = clamp(-bounds.top / Math.max(1,bounds.height - viewport),0,1);
    ritualImage.style.transform = `scale(${1 + progress * .35})`;
    ritualCaption.style.transform = `translateY(${-progress * 30}px)`;
    ritualCaption.style.opacity = String(1 - Math.max(0,progress - .65) * 1.7);
    ritualProgress.style.transform = `scaleX(${progress})`;
  }
}
function requestScrollUpdate() { if (!framePending) {framePending = true;requestAnimationFrame(updateScroll);} }
window.addEventListener('scroll',requestScrollUpdate,{passive:true});
window.addEventListener('resize',() => { if (window.innerWidth > 1000) closeMobileNav(); requestScrollUpdate(); },{passive:true});
motionPreference.addEventListener('change', () => {
  if (prefersReducedMotion()) document.documentElement.classList.remove('js-motion');
  requestScrollUpdate();
});
renderMenu('coffee');
updateCart();
renderTimes();
updateScroll();
