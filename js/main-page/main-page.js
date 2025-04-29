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



// Поиск в хедере

const searchInput = document.getElementById('search-input');
const header = document.querySelector('.header-top');
const searchItems = document.querySelector('.search-items');
const underHeaderContainer = document.querySelector('.under-header-container');
const underHeader = document.querySelector('.under-header');
let isCatalogActive = false;

// Обработчик ввода в поле поиска
searchInput.addEventListener('input', function () {
    if (searchInput.value.trim() !== '') {
        // Меняем фон header на синий
        header.style.backgroundColor = '#151c28'; // синий цвет

        // Показываем элементы с плавным переходом
        searchItems.classList.add('show');
        underHeaderContainer.style.marginTop = '0px';
        underHeader.style.filter = 'blur(5px)';
        underHeader.style.backdropFilter = 'blur(5px)';
    } else if (!isCatalogActive) {
        // Сбрасываем фон header, если поиск пуст
        header.style.backgroundColor = 'transparent';

        // Скрываем элементы с плавным переходом
        searchItems.classList.remove('show');
        underHeaderContainer.style.marginTop = '250px';
        underHeader.style.filter = 'none';
        underHeader.style.backdropFilter = 'none';
    } else {
        // Скрываем элементы с плавным переходом
        searchItems.classList.remove('show');
        underHeaderContainer.style.marginTop = '0px';
        underHeader.style.filter = 'blur(5px)';
        underHeader.style.backdropFilter = 'blur(5px)';
    }
});


underHeader.addEventListener('click', function () {
    // Удаляем активность каталога, если он открыт
    if (isCatalogActive) {
        openCatalog.parentElement.classList.remove('active');
        isCatalogActive = false;
        menuNavigation.style.display = 'none';
        openCatalog.style.color = '';
    }

    // Сбрасываем фон и стили
    header.style.backgroundColor = 'transparent';
    searchItems.classList.remove('show');
    underHeaderContainer.style.marginTop = '250px';
    underHeader.style.filter = 'none';
    underHeader.style.backdropFilter = 'none';
    searchInput.value = '';
});

// Нажатие на кнопку каталог в хедере

const menuNavigation = document.querySelector('.menu-navigation');
const openCatalog = document.querySelector('.open-catalog');

openCatalog.addEventListener('click', function (e) {    
    
    e.preventDefault(); // чтобы не перезагружалась страница
    this.parentElement.classList.toggle('active');

    underHeaderContainer.style.marginTop = '0px';
    underHeader.style.filter = 'blur(5px)';
    underHeader.style.backdropFilter = 'blur(5px)';

    // Проверяем, активирован ли класс и выводим результат в консоль
    const isActive = this.parentElement.classList.contains('active');
    isCatalogActive = isActive;

    if (isCatalogActive) {
        // Когда каталог активирован, меняем фон и показываем меню
        openCatalog.style.color = '#D4B28C';
        header.style.backgroundColor = '#151c28';
        menuNavigation.style.backgroundColor = '#151c28';
        menuNavigation.style.display = 'block';
    } else {
        // Когда каталог деактивирован, скрываем меню и сбрасываем стиль
        openCatalog.style.color = '';
        header.style.backgroundColor = 'transparent';
        menuNavigation.style.display = 'none';

        underHeaderContainer.style.marginTop = '250px';
        underHeader.style.filter = 'none';
        underHeader.style.backdropFilter = 'none';

        searchItems.classList.remove('show');

        // Сбросить поле поиска
        searchInput.value = '';
    }
});



// Отображение меню Сантехники
document.querySelectorAll('.menu-toggle-plumbing').forEach(toggle => {
    toggle.addEventListener('click', function (e) {
        e.preventDefault();

        const menuItem = toggle.closest('.menu-item-plumbing');
        const subMenu = menuItem.querySelector('.submenu-plumbing');

        const isOpen = subMenu.style.display === 'flex';
        subMenu.style.display = isOpen ? 'none' : 'flex';
        menuItem.classList.toggle('active', !isOpen);

        underHeaderContainer.style.marginTop = isOpen ? '0px' : '0px';
    });
});


document.querySelectorAll('.menu-toggle-furniture').forEach(toggle => {
    toggle.addEventListener('click', function (e) {
        e.preventDefault();

        const menuItem = toggle.closest('.menu-item-furniture');
        const subMenu = menuItem.querySelector('.submenu-furniture');

        const isOpen = subMenu.style.display === 'flex';
        subMenu.style.display = isOpen ? 'none' : 'flex';
        menuItem.classList.toggle('active', !isOpen);
    });
});


// Делегирование для правого меню
const rightMenuContent = document.querySelector('.right-menu-content');

// Назначаем обработчики на все .shower-enclosures-and-pallets
document.querySelectorAll('.shower-enclosures-and-pallets').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        rightMenuContent.innerHTML = `
            <a href="#">Душевые уголки, двери и перегородки</a>
            <a href="#">Поддоны</a>
            <a href="#">Шторки для ванны</a>
            <div class="all-categories-link">
                <a href="#">Все товары категории</a>
                            
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 8L16.6854 13.2929C17.1049 13.6834 17.1049 14.3166 16.6854 14.7071L11 20" stroke="#EDE4D7" stroke-linecap="round"/>
                </svg>  
            </div>
        `;
        rightMenuContent.style.display = 'flex';
    });
});

// Назначаем обработчики на все .plumbing
document.querySelectorAll('.plumbing').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        rightMenuContent.innerHTML = `
            <a href="#">Новые душевые кабины</a>
            <a href="#">Новые поддоны</a>
            <a href="#">Новые шторки</a>
            <div class="all-categories-link">
                <a href="#">Все товары категории</a>
                            
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 8L16.6854 13.2929C17.1049 13.6834 17.1049 14.3166 16.6854 14.7071L11 20" stroke="#EDE4D7" stroke-linecap="round"/>
                </svg>  
            </div>
        `;
        rightMenuContent.style.display = 'flex';
    });
});


// Назначаем обработчики на все .plumbing
document.querySelectorAll('.shower-program').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        rightMenuContent.innerHTML = `
            <a href="#">Лейки и держатели</a>
            <a href="#">Душевые стойки и штанги</a>
            <a href="#">Гибкие шланги</a>
            <a href="#">Верхний душ</a>
            <a href="#">Готовые душевые комплекты</a>
            <div class="all-categories-link">
                <a href="#">Все товары категории</a>
                            
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 8L16.6854 13.2929C17.1049 13.6834 17.1049 14.3166 16.6854 14.7071L11 20" stroke="#EDE4D7" stroke-linecap="round"/>
                </svg>  
            </div>
        `;
        rightMenuContent.style.display = 'flex';
    });
});