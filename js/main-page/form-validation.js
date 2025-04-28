function validateForm(event) {
    event.preventDefault();

    // Скрыть все ошибки
    const errorElements = document.querySelectorAll('.error');
    errorElements.forEach(error => error.style.display = 'none');

    let valid = true;

    // Проверка поля "Ваше имя"
    const nameInput = document.getElementById('name');
    const nameError = document.getElementById('name-error');
    if (!nameInput.value.trim()) {
        nameError.textContent = 'Пожалуйста, введите ваше имя.';
        nameError.style.display = 'block';
        valid = false;
    }

    // Проверка поля "Телефон"
    const phoneInput = document.getElementById('phone');
    const phoneError = document.getElementById('phone-error');
    if (!phoneInput.value.trim()) {
        phoneError.textContent = 'Пожалуйста, введите ваш телефон.';
        phoneError.style.display = 'block';
        valid = false;
    }

    // Проверка чекбокса "Согласие с политикой"
    const acceptInput = document.getElementById('accept');
    const acceptError = document.getElementById('accept-error');
    if (!acceptInput.checked) {
        acceptError.textContent = 'Вы должны согласиться с политикой конфиденциальности.';
        acceptError.style.display = 'block';
        valid = false;
    }

    // Если все поля валидны, отправить форму
    if (valid) {
        document.getElementById('request-form').submit();
    }
}

// Привязка события к кнопке отправки
const form = document.getElementById('request-form');
form.addEventListener('submit', validateForm);


// Переключение карточек товара через стрелочки
const wrapper = document.getElementById('productCards');
const cards  = Array.from(wrapper.querySelectorAll('.product-card'));
const scopeContainer = document.querySelector('.product-card-scope');
const leftArrow  = document.getElementById('left-arrow');
const rightArrow = document.getElementById('right-arrow');
        
const cardGap = 20; 
let cardWidth = cards[0].getBoundingClientRect().width;
const step = cardWidth + cardGap;
        
// Индекс карточки, которая сейчас в scope
let activeIndex = 0;
        
// Функция обновления содержимого scope-карты
function updateScope(idx) {
    const srcCard = cards[idx];
    // клонируем всё содержимое .product-card внутрь .product-card-scope
    scopeContainer.innerHTML = '';
    const clone = srcCard.cloneNode(true);
    // у клона убираем класс .product-card (и переназначим класс scope)
    clone.classList.remove('product-card');
    clone.classList.add('product-card-scope');
    scopeContainer.appendChild(clone);
}
        
// Функция прокрутки и обновления
function moveTo(idx) {
    // сдвигаем обёртку: так, чтобы выбранная карточка встала
    const offset = (idx - 2) * step;
    wrapper.style.transition = 'transform 0.5s ease';

    updateScope(idx);
}
    
// Навешиваем обработчики
rightArrow.addEventListener('click', () => {
if (activeIndex < cards.length - 1) {
    activeIndex++;
    moveTo(activeIndex);
    }
});
    
leftArrow.addEventListener('click', () => {
    if (activeIndex > 0) {
        activeIndex--;
        moveTo(activeIndex);
    }
});
    
// Инициализируем видимую scope-карту
moveTo(activeIndex);


