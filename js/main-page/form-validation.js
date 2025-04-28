// Валидация 2 форм для связи на странице

function validateForm(event, formId) {
    event.preventDefault();

    const form = document.getElementById(formId);

    // Скрыть все ошибки только внутри своей формы
    const errorElements = form.querySelectorAll('.error-contact');
    errorElements.forEach(error => error.style.display = 'none');

    let valid = true;

    // Поля внутри своей формы
    const nameInput = form.querySelector('input[name="name"]');
    const phoneInput = form.querySelector('input[name="phone"]');
    const acceptInput = form.querySelector('input[name="accept"]');
    const errorSpans = form.querySelectorAll('.error-contact');

    // Проверка поля "Ваше имя"
    if (!nameInput.value.trim()) {
        errorSpans[0].textContent = 'Пожалуйста, введите ваше имя.';
        errorSpans[0].style.display = 'block';
        valid = false;
    }

    // Проверка поля "Телефон"
    if (!phoneInput.value.trim()) {
        errorSpans[1].textContent = 'Пожалуйста, введите ваш телефон.';
        errorSpans[1].style.display = 'block';
        valid = false;
    }

    // Проверка чекбокса "Согласие"
    if (!acceptInput.checked) {
        errorSpans[2].textContent = 'Вы должны согласиться с политикой конфиденциальности.';
        errorSpans[2].style.display = 'block';
        valid = false;
    }

    // Если всё ок — отправляем форму
    if (valid) {
        form.submit();
    }
}

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





// Секция "Наши Отзывы от покупателей"

// Переключение карточек отзывов
const cardsContainer = document.querySelector('.reviews-cards');
const leftArrowReview = document.getElementById('left-arrow-review');
const rightArrowReview = document.getElementById('right-arrow-review');
const ratingNumber = document.querySelector('.rating-number');
        
let currentIndexReview = 0;
const cardsReview = document.querySelectorAll('.review-card');
const cardWidthReview = cardsReview[0].offsetWidth + 20; // ширина карты + gap
        
leftArrowReview.addEventListener('click', () => { // <-- исправлено
    if (currentIndexReview > 0) {
        currentIndexReview--;
        updateTransform();
    }

    if (currentIndexReview > 0) {
        ratingNumber.style.visibility = 'hidden';
    } else {
        ratingNumber.style.visibility = 'visible';
    }
});
        
rightArrowReview.addEventListener('click', () => { // <-- исправлено
    if (currentIndexReview < cardsReview.length - 1) {
        currentIndexReview++;
        updateTransform();
    }

    if (currentIndexReview > 0) {
        ratingNumber.style.visibility = 'hidden';
    } else {
        ratingNumber.style.visibility = 'visible';
    }
});
        
function updateTransform() {
    cardsContainer.style.transform = `translateX(${-cardWidthReview * currentIndexReview}px)`; // <-- исправлено
}