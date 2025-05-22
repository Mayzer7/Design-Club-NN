
// В самом верху делаем header прозрачным при старте страницы
document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header-top');
    const initialScrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
    if (!header) return;
    
    if (initialScrollTop === 0) {
      header.style.backgroundColor = 'transparent';
    } else {
      header.style.display = 'none';
    }
  });

// Анимации на странице
document.addEventListener("DOMContentLoaded", () => {
    const revealElements = document.querySelectorAll(".reveal-mask, .fade-in");

    const revealOnScroll = () => {
        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            
            if (rect.top <= window.innerHeight) {
                el.classList.add("active");
            }
        });
    };

    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll();
});

// Открытие бургер меню

const openBurgerMenu = document.getElementById('openBurgerMenu');
const burgerMenuContent = document.getElementById('burgerMenuContent');
const mainContent = document.getElementById('mainContent');
const closeBurgerBtn = document.getElementById('closeBurgerBtn');

function openMenu() {
    burgerMenuContent.classList.add('open');
    mainContent.classList.add('hidden');
}

function closeMenu() {
    burgerMenuContent.classList.remove('open');
            
    // Показать контент чуть раньше — через 250 мс (половина анимации)
    setTimeout(() => {
        mainContent.classList.remove('hidden');
    }, 250);
}

function onTransitionEnd(event) {
    if (event.propertyName === 'transform' || event.propertyName === 'opacity') {
        mainContent.classList.remove('hidden');
        // Чтобы не накопились обработчики, удаляем слушатель
        burgerMenuContent.removeEventListener('transitionend', onTransitionEnd);
    }
}

// Кнопка открытия меню
openBurgerMenu.addEventListener('click', () => {
    if (burgerMenuContent.classList.contains('open')) {
        closeMenu();
    } else {
        openMenu();
    }
});

// Кнопка закрытия меню
closeBurgerBtn.addEventListener('click', () => {
    closeMenu();
});

// Переключение менюшек в Бургере

const catalogToggle = document.querySelector('.burger-catalog > .has-submenu');
const catalogNav = document.querySelector('.burger-catalog nav');

catalogToggle.addEventListener('click', () => {
  catalogNav.classList.toggle('open');

  const arrow = catalogToggle.querySelector('svg');
  if (arrow) arrow.classList.toggle('rotated');

  catalogToggle.classList.toggle('active');
});


const submenuTitles = document.querySelectorAll('.burger-catalog nav .has-submenu');

submenuTitles.forEach(title => {
  title.addEventListener('click', () => {
    const submenu = title.nextElementSibling;
    if (!submenu || submenu.tagName !== 'UL') return;

    submenu.classList.toggle('open');

    const arrow = title.querySelector('svg');
    if (arrow) {
      arrow.classList.toggle('rotated');
    }

    title.classList.toggle('active');
  });
});



// Поиск в бургер меню

const inputBurger = document.getElementById('inputBurger');
const searchItemsBurger = document.getElementById('searchItemsBurger');

// По умолчанию скрываем
searchItemsBurger.classList.add('hidden');

inputBurger.addEventListener('input', () => {
  if (inputBurger.value.length > 0) {
    searchItemsBurger.classList.remove('hidden');
  } else {
    searchItemsBurger.classList.add('hidden');
  }
});

// Для переключение карточек "Почему выбирают нас" с помощью стрелок

document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.why-choose-us-content');
    const leftArrow = document.getElementById('why-left-arrow');
    const rightArrow = document.getElementById('why-right-arrow');

    const minWidth = parseInt(
        window.getComputedStyle(document.querySelector('.card')).getPropertyValue('min-width'), 10
    );

    const scrollAmount = minWidth; // ширина + отступ

    rightArrow.addEventListener('click', () => {
        animateScroll(container, scrollAmount, 300);
    });

    leftArrow.addEventListener('click', () => {
        animateScroll(container, -scrollAmount, 300);
    });
});

// Плавная анимация для переключения
function easeInOutQuad(t) {
    return t < 0.5
        ? 2 * t * t
        : -1 + (4 - 2 * t) * t;
}

function animateScroll(container, delta, duration = 800) {
    const start = container.scrollLeft;
    const end = start + delta;
    const t0 = performance.now();

    function tick(t) {
        const elapsed = t - t0;
        const progress = Math.min(elapsed / duration, 1);
        container.scrollLeft = start + (end - start) * easeInOutQuad(progress);

        if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
}

// Отображаем стрелочки для переключения карточек "Почему выбирают нас", если карточек больше 4 

document.addEventListener("DOMContentLoaded", function () {
    const whyCards = document.querySelectorAll('.why-choose-us-content .card');
    const rigthTitleGroup = document.querySelector('.rigth-title-group');

    const isSmallScreen = window.innerWidth <= 600;

    if (whyCards.length > 4 && !isSmallScreen) {
        rigthTitleGroup.classList.add('visible');
    } else {
        rigthTitleGroup.classList.remove('visible');
    }
});



// Переключение карточек товара с зацикливанием

const track = document.getElementById('track');
const cards = Array.from(track.querySelectorAll('.popular-product-card'));
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

let currentIndex = 2; // стартуем с Product 3 (индекс 2)
let cardWidth = 0;
let visibleCount = 0;

cards.forEach((card, idx) => {
    if (idx === currentIndex) card.classList.add('active');
    card.addEventListener('click', () => goTo(idx));
});

function updateSizes() {
    const contW = document.querySelector('.carousel-container').clientWidth;

    if (contW < 600) visibleCount = 3;
    else if (contW < 900) visibleCount = 4;
    else visibleCount = 5;

    const style = getComputedStyle(cards[0]);
    const margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight);
    cardWidth = cards[0].clientWidth + margin;

    moveTrack();
    updateButtons();
}

function moveTrack() {
    const shiftValue = getComputedStyle(track)
        .getPropertyValue('--manual-shift')
        .trim();
    const manualShift = parseFloat(shiftValue) || 0;

    const x = -currentIndex * cardWidth + manualShift;
    track.style.transform = `translateX(${x}px)`;

    cards.forEach((c, i) => c.classList.toggle('active', i === currentIndex));
}

function goTo(idx) {
    // Зацикливание индекса
    if (idx < 0) {
        currentIndex = cards.length - 1;
    } else if (idx >= cards.length) {
        currentIndex = 0;
    } else {
        currentIndex = idx;
    }
    moveTrack();
    updateButtons();
}

function updateButtons() {
    // Если зацикливание — кнопки не дизейблить
    prevBtn.disabled = false;
    nextBtn.disabled = false;
}

prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

window.addEventListener('resize', updateSizes);
window.addEventListener('load', updateSizes);

let startX = 0;
let endX = 0;

track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
});

track.addEventListener('touchmove', (e) => {
    endX = e.touches[0].clientX;
    e.preventDefault();
}, { passive: false });

track.addEventListener('touchend', () => {
    const swipeThreshold = 50;
    const diff = startX - endX;

    if (diff > swipeThreshold) {
        goTo(currentIndex + 1);
    } else if (diff < -swipeThreshold) {
        goTo(currentIndex - 1);
    }
});


// Валидация модального окна формы "Связаться с нами"

const thanksModal = document.getElementById('thanksModal');
const errorModal = document.getElementById('errorModal');

function validateFormModal(event, formId) {
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

    // Если есть ошибка, переадресовываем пользователя
    if (!valid) {
        contactModal.style.display = 'none';

        errorModal.style.display = 'flex';
        container.style.filter = 'blur(5px)';
        setTimeout(() => {
            errorModal.classList.add('open');  
        }, 10);

        return;
    }

    // Если всё ок — показываем спасибо за заявку
    contactModal.style.display = 'none';
    
    thanksModal.style.display = 'flex';
    container.style.filter = 'blur(5px)';
    setTimeout(() => {
        thanksModal.classList.add('open');  
    }, 10);

    // Очистить поля формы после успешной отправки
    nameInput.value = '';
    phoneInput.value = '';
    acceptInput.checked = false;
}


// Модальное окно "Связаться с нами"
const openBtn = document.getElementById('openModalBtn');
const openBtnInBurger = document.getElementById('burger-get-request');
const closeBtn = document.getElementById('closeModalBtn');
const closeBtnThanks = document.getElementById('closeModalBtnThanks');
const closeBtnError = document.getElementById('closeModalBtnError');
const contactModal = document.getElementById('contactModal');
const modalContent = document.querySelector('.modal-content');
    
// Для блюра контейнера из вне модалки
const container = document.querySelector('.container');

// Открытие
openBtn.addEventListener('click', () => {
    contactModal.style.display = 'flex';
    container.style.filter = 'blur(5px)';
    setTimeout(() => {
        contactModal.classList.add('open');  
    }, 10); 
});

// Открытие через кнопку в бургер меню
openBtnInBurger.addEventListener('click', () => {
    contactModal.style.display = 'flex';
    container.style.filter = 'blur(5px)';
    setTimeout(() => {
        contactModal.classList.add('open');  
    }, 10); 
});

// Закрытие по кнопке ✖
closeBtn.addEventListener('click', () => {
    contactModal.classList.remove('open');  
    setTimeout(() => {
        contactModal.style.display = 'none';
        container.style.filter = 'none';
    }, 500); 
});

// Закрытие по кнопке ✖
closeBtnThanks.addEventListener('click', () => {
    thanksModal.classList.remove('open');  
    setTimeout(() => {
        thanksModal.style.display = 'none';
        container.style.filter = 'none';
    }, 500); 
});

// Закрытие по кнопке ✖
closeBtnError.addEventListener('click', () => {
    errorModal.classList.remove('open');  
    setTimeout(() => {
        errorModal.style.display = 'none';
        container.style.filter = 'none';
    }, 500); 
});

contactModal.addEventListener('click', (e) => {
    if (e.target === contactModal) {
        contactModal.classList.remove('open');  
        setTimeout(() => {
            contactModal.style.display = 'none';
            container.style.filter = 'none';
        }, 500); 
    }
});


thanksModal.addEventListener('click', (e) => {
    if (e.target === thanksModal) {
        thanksModal.classList.remove('open');  
        setTimeout(() => {
            thanksModal.style.display = 'none';
            container.style.filter = 'none';
        }, 500); 
    }
});

errorModal.addEventListener('click', (e) => {
    if (e.target === errorModal) {
        errorModal.classList.remove('open');  
        setTimeout(() => {
            errorModal.style.display = 'none';
            container.style.filter = 'none';
        }, 500); 
    }
});


// Переадрисация на страницу "Результаты поиска" после того как 
// пользователь ввел название товара в поиске и нажал Enter

function performSearch() {
    const query = document.getElementById('search-input').value;
    window.location.href = 'search-no-result-page.html?query=' + encodeURIComponent(query);
}

document.getElementById('search-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        performSearch();
    }
});

document.querySelector('.search-icon-button').addEventListener('click', function() {
    performSearch();
});

// Валидация форм на странице

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



// Выбор способа связи в форме "Связаться с нами"

function toggleContactMethodMenu() {
    const menu = document.getElementById('menu-contact-method');
    const arrow = document.getElementById('dropdown-arrow');

    if (menu.classList.contains('open')) {
        // Закрытие меню с анимацией
        menu.style.maxHeight = '0px';
        menu.style.opacity = '0';
        arrow.classList.remove('rotated');
        menu.classList.remove('open');
    } else {
        // Открытие меню с анимацией до нужной высоты
        menu.style.maxHeight = menu.scrollHeight + 'px';
        menu.style.opacity = '1';
        arrow.classList.add('rotated');
        menu.classList.add('open');
    }
}

// Обработка выбора пункта меню
document.querySelectorAll('.input-field').forEach(item => {
    item.addEventListener('click', function () {
        const selected = document.getElementById('selected-contact-method');
        selected.value = this.placeholder;
        toggleContactMethodMenu(); // Скрываем меню после выбора
    });
});

// Валидация формы "Связаться с нами"

function validateFormContact(event, formId) {
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
    const methodInput = form.querySelector('input[name="contact_method"]');

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

    // Проверка поля "Способ связи"
    // if (!methodInput.value.trim()) {
    //     errorSpans[2].textContent = 'Пожалуйста, выберите способ связи.';
    //     errorSpans[2].style.display = 'block';
    //     valid = false;
    // }

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


// Секция "Наши Отзывы от покупателей"

// Раскрытие отзыва по больше если нужно 
const readFullButton = document.getElementById('read-full-btn');
const reviewContinueText = document.querySelector('.review-continue-text');
const readFullReview = document.querySelector('.read-full-review');

document.querySelectorAll('.read-full-btn').forEach(button => {
    button.addEventListener('click', () => {
        const review = button.closest('.review-text');
        const continueText = review.querySelector('.review-continue-text');
        const readMore = review.querySelector('.read-full-review');

        continueText.style.display = 'inline';
        readMore.style.display = 'none';
    });
});

// Переключение карточек отзывов
const cardsContainer = document.querySelector('.reviews-cards');
const leftArrowReview = document.getElementById('left-arrow-review');
const rightArrowReview = document.getElementById('right-arrow-review');
const ratingNumber = document.querySelector('.rating-number');
const cardsReview = document.querySelectorAll('.review-card');
const cardWidthReview = cardsReview[0].offsetWidth + 20; 

let currentIndexReview = 0;

leftArrowReview.addEventListener('click', () => moveReview(-1));
rightArrowReview.addEventListener('click', () => moveReview(1));

function moveReview(direction) {
    const newIndex = currentIndexReview + direction;
    if (newIndex >= 0 && newIndex < cardsReview.length) {
        currentIndexReview = newIndex;
        updateTransform();

        // Скрывать рейтинг только если ширина окна больше 1000px
        if (window.innerWidth > 1000) {
            ratingNumber.style.visibility = currentIndexReview > 0 ? 'hidden' : 'visible';
        } else {
            ratingNumber.style.visibility = 'visible';
        }
    }
}

function updateTransform() {
    cardsContainer.style.transform = `translateX(${-cardWidthReview * currentIndexReview}px)`;
}

// Обработка ресайза окна — обновляем видимость рейтинга
window.addEventListener('resize', () => {
    if (window.innerWidth > 1000) {
        ratingNumber.style.visibility = currentIndexReview > 0 ? 'hidden' : 'visible';
    } else {
        ratingNumber.style.visibility = 'visible';
    }
});

// Добавляем свайп
let startReviewX = 0;
let isDragging = false;

cardsContainer.addEventListener('touchstart', e => {
    startReviewX = e.touches[0].clientX;
    isDragging = true;
}, { passive: true });

cardsContainer.addEventListener('touchmove', e => {}, { passive: true });

cardsContainer.addEventListener('touchend', e => {
    if (!isDragging) return;
    const endX = e.changedTouches[0].clientX;
    const diffX = endX - startReviewX;
    const threshold = 50; // минимальная дистанция свайпа
    if (diffX > threshold) {
        moveReview(-1); // свайп вправо
    } else if (diffX < -threshold) {
        moveReview(1);  // свайп влево
    }
    isDragging = false;
});






// Поиск в хедере

const searchInput = document.getElementById('search-input');
const header = document.querySelector('.header-top');
const searchItems = document.querySelector('.search-items');
const underHeaderContainer = document.querySelector('.under-header-container');
const underHeader = document.querySelector('.under-header');
const underHeaders = document.querySelectorAll('.under-header');
let isCatalogActive = false;

const marginTopStart = parseFloat(getComputedStyle(document.querySelector('.menu-navigation')).marginTop);
const marginTopUseSearch = marginTopStart + 250;


searchInput.addEventListener('input', handleSearchInput);

function handleSearchInput() {
    const isSearching = searchInput.value.trim() !== '';
  if (isSearching) {
    activateSearchMode();
  } else {
    deactivateSearchMode();
  }
}

function activateSearchMode() {
  menuNavigation.classList.remove('default-margin');
  menuNavigation.classList.add('search-active');
 underHeaders.forEach(el => el.style.filter = 'blur(5px)');
  blurContainers.forEach(container => container.style.filter = 'blur(5px)');
  header.classList.add('header-search-padding');
  header.style.backgroundColor = '#151c28';
  searchItems.classList.add('show');
}

function deactivateSearchMode() {
  menuNavigation.classList.remove('search-active');
  menuNavigation.classList.add('default-margin');

  searchItems.classList.remove('show');
  header.classList.remove('header-search-padding');

  // Всегда сбрасываем blur у blurContainers
  blurContainers.forEach(container => container.style.filter = '');

  if (!isCatalogActive) {
    header.style.backgroundColor = 'transparent';
    underHeaders.forEach(el => el.style.filter = 'none');
    
  } else {
    underHeaders.forEach(el => el.style.filter = 'none');
    header.style.backgroundColor = 'transparent';
  }
}



// Функция когда клик вне хедера
const blurContainers = document.querySelectorAll('.blur-container');

function resetHeaderState() {
    if (isCatalogActive) {
        openCatalog.parentElement.classList.remove('active');
        isCatalogActive = false;
        menuNavigation.style.display = 'none';
        menuNavigation.classList.remove('default-margin');
        menuNavigation.style.backgroundColor = '';

        openCatalog.style.color = '';
    }

    header.classList.remove('header-search-padding');
    menuNavigation.classList.remove('search-active');
    header.style.backgroundColor = 'transparent';
    searchItems.classList.remove('show');
    underHeaders.forEach(el => el.style.filter = 'none');
    underHeaders.forEach(el => el.style.backdropFilter = 'none');
underHeaders.forEach(el => el.style.cursor = '');

    searchInput.value = '';

    blurContainers.forEach(container => {
        container.style.filter = 'none';
        container.style.cursor = '';
    });
}

// Назначаем обработчики на все blur-контейнеры
blurContainers.forEach(container => {
    container.addEventListener('click', resetHeaderState);
});

underHeader.addEventListener('click', resetHeaderState);


// Нажатие на кнопку каталог в хедере

const menuNavigation = document.querySelector('.menu-navigation');
const openCatalog = document.querySelector('.open-catalog');

function toggleCatalogMenu() {
    openCatalog.parentElement.classList.toggle('active');

    const isActive = openCatalog.parentElement.classList.contains('active');
    isCatalogActive = isActive;

    if (isActive) {
        underHeaders.forEach(el => el.style.filter = 'blur(5px)');
        underHeaders.forEach(el => el.style.cursor = 'pointer');

        blurContainers.forEach(container => {
            container.style.filter = 'blur(5px)';
            container.style.cursor = 'pointer';
        });

        openCatalog.style.color = '#D4B28C';
        header.style.backgroundColor = '#151c28';
        menuNavigation.style.backgroundColor = '#151c28';
        menuNavigation.style.display = 'block';
        menuNavigation.classList.add('default-margin');
    } else {
        if (searchInput.value.trim() !== '') {
            menuNavigation.style.display = 'none';
            openCatalog.style.color = '';
        } else {
            openCatalog.style.color = '';
            header.style.backgroundColor = 'transparent';
            menuNavigation.style.display = 'none';

            blurContainers.forEach(container => {
                container.style.filter = 'none';
                container.style.cursor = '';
            });

            underHeaders.forEach(el => el.style.filter = 'none');
            underHeaders.forEach(el => el.style.backdropFilter = 'none');

            searchItems.classList.remove('show');

            searchInput.value = '';
        }
    }
}

openCatalog.addEventListener('click', function(e) {
    e.preventDefault();
    toggleCatalogMenu();
});


// Открытие подкатегорий в меню в хедере и отображение содержимого
// меню справа + скрытие всех подменю при наведении на header

function setupDropdownToggle() {
  // Наведение на header — скрываем все подменю и сбрасываем активные состояния
  const header = document.querySelector('header');

  if (header) {
        header.addEventListener('mouseenter', () => {
        const searchActive = searchInput.value.trim() !== '';

        // Закрываем все подменю и правые меню, сбрасываем активные классы
        document.querySelectorAll('.submenu').forEach(subMenu => {
        subMenu.style.display = 'none';
        });

        document.querySelectorAll('.right-menu-content').forEach(menu => {
        menu.style.display = 'none';
        });

        document.querySelectorAll('.menu-item').forEach(menuItem => {
        menuItem.classList.remove('active');
        });

        document.querySelectorAll('.menu-toggle').forEach(toggle => {
        toggle.classList.remove('open');
        });

        document.querySelectorAll('.menu-button').forEach(btn => {
        btn.style.color = '';
        const svg = btn.parentElement.querySelector('svg');
        if (svg) {
            svg.querySelector('path').setAttribute('stroke', '#EDE4D7');
        }
        });

        // Закрываем сам каталог, если он открыт
       if (openCatalog && openCatalog.parentElement.classList.contains('active')) {
        openCatalog.parentElement.classList.remove('active');

        // Если поиск не активен — снимаем blur у underHeader и blurContainers
        if (!searchActive) {
            underHeaders.forEach(el => el.style.filter = 'none');
            underHeaders.forEach(el => el.style.backdropFilter = 'none');
            underHeaders.forEach(el => el.style.cursor = '');

            blurContainers.forEach(container => {
                container.style.filter = 'none';
                container.style.cursor = '';
            });
        }

        const initialScrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (initialScrollTop === 0 && !searchActive) {
            header.style.backgroundColor = 'transparent';
        } else {
            header.style.backgroundColor = '#151c28';
        }

        if (menuNavigation) {
            menuNavigation.style.display = 'none';
            menuNavigation.classList.remove('default-margin');
        }

        if (openCatalog) {
            openCatalog.style.color = '';
        }
    }
    });
    }
    

    // Главное меню - открытие по наведению
document.querySelectorAll('.menu-item').forEach(menuItem => {
  menuItem.addEventListener('mouseenter', () => {
    // Скрываем все правые меню при наведении на главное меню
    document.querySelectorAll('.right-menu-content').forEach(menu => {
        menu.style.display = 'none';
    });

    // Закрываем другие подменю
    document.querySelectorAll('.submenu').forEach(subMenu => {
      if (!menuItem.contains(subMenu)) {
        subMenu.style.display = 'none';
      }
    });
    // Убираем активность с других пунктов
    document.querySelectorAll('.menu-item').forEach(item => {
      if (item !== menuItem) {
        item.classList.remove('active');
        const toggle = item.querySelector('.menu-toggle');
        if (toggle) toggle.classList.remove('open');
      }
    });

    const subMenu = menuItem.querySelector('.submenu');
    if (subMenu) {
      subMenu.style.display = 'flex';
      menuItem.classList.add('active');
      const toggle = menuItem.querySelector('.menu-toggle');
      if (toggle) toggle.classList.add('open');
    }
  });
});


// Вложенные подменю - открытие по наведению
document.querySelectorAll('.submenu-items').forEach(submenuItem => {
  submenuItem.addEventListener('mouseenter', () => {
    const button = submenuItem.querySelector('.menu-button');
    if (!button) return;

    document.querySelectorAll('.menu-button').forEach(btn => {
      btn.style.color = '';
      const svg = btn.parentElement.querySelector('svg');
      if (svg) svg.querySelector('path').setAttribute('stroke', '#EDE4D7');
    });

    button.style.color = '#AE9877';
    const svg = button.parentElement.querySelector('svg');
    if (svg) svg.querySelector('path').setAttribute('stroke', '#AE9877');

    const id = button.dataset.id;
    if (!id) return;

    document.querySelectorAll('.right-menu-content').forEach(menu => {
      menu.style.display = 'none';
    });

    const rightMenu = document.querySelector(`.right-menu-content[data-id="${id}"]`);
    if (rightMenu) {
      rightMenu.style.display = 'flex';
    }
  });

});

// Скрываем все меню при уходе мыши с .header-top
document.querySelector('.header-top').addEventListener('mouseleave', () => {
    
  // Скрываем подменю
  document.querySelectorAll('.submenu').forEach(subMenu => {
    subMenu.style.display = 'none';
  });

  // Скрываем правые меню
  document.querySelectorAll('.right-menu-content').forEach(menu => {
    menu.style.display = 'none';
  });

  // Убираем активные классы
  document.querySelectorAll('.menu-item').forEach(item => {
    item.classList.remove('active');
    const toggle = item.querySelector('.menu-toggle');
    if (toggle) toggle.classList.remove('open');
  });

  // Сбрасываем стили кнопок
  document.querySelectorAll('.menu-button').forEach(button => {
    button.style.color = '';
    const svg = button.parentElement.querySelector('svg');
    if (svg) svg.querySelector('path').setAttribute('stroke', '#EDE4D7');
  });
});

  // Переключение подменю по клику на категорию
  document.querySelectorAll('.menu-toggle').forEach(toggle => {
    toggle.addEventListener('click', e => {
      e.preventDefault();

      const category = toggle.dataset.category;
      if (!category) return;

      const menuItem = toggle.closest(`.menu-item[data-category="${category}"]`);
      const subMenu = document.querySelector(`.submenu[data-category="${category}"]`);
      if (!menuItem || !subMenu) return;

      const isOpen = subMenu.style.display === 'flex';
      const nowOpen = !isOpen;

      // Закрываем все подменю, кроме текущего
      document.querySelectorAll('.submenu').forEach(ul => {
        if (ul !== subMenu) ul.style.display = 'none';  
      });
      document.querySelectorAll('.menu-item').forEach(li => {
        if (li !== menuItem) li.classList.remove('active');
      });
      document.querySelectorAll('.menu-toggle').forEach(t => {
        if (t !== toggle) t.classList.remove('open');
      });
      // Скрываем все правые меню
      document.querySelectorAll('.right-menu-content').forEach(menu => {
        menu.style.display = 'none';
      });
      // Сбрасываем стили кнопок в подменю
      document.querySelectorAll('.menu-button').forEach(btn => {
        btn.style.color = '';
        const svg = btn.parentElement.querySelector('svg');
        if (svg) {
          svg.querySelector('path').setAttribute('stroke', '#EDE4D7');
        }
      });

      if (nowOpen) {
        subMenu.style.display = 'flex';
        menuItem.classList.add('active');
        toggle.classList.add('open');
      } else {
        subMenu.style.display = 'none';
        menuItem.classList.remove('active');
        toggle.classList.remove('open');
      }
    });
  });

  // Клик по кнопкам в подменю для открытия правого меню
  document.querySelectorAll('.menu-button').forEach(button => {
    button.addEventListener('click', e => {
      e.preventDefault();

      // Сбросим стили у всех кнопок
      document.querySelectorAll('.menu-button').forEach(btn => {
        btn.style.color = '';
        const svg = btn.parentElement.querySelector('svg');
        if (svg) {
          svg.querySelector('path').setAttribute('stroke', '#EDE4D7');
        }
      });

      // Поставим активный стиль текущей кнопке
      button.style.color = '#AE9877';
      const svg = button.parentElement.querySelector('svg');
      if (svg) {
        svg.querySelector('path').setAttribute('stroke', '#AE9877');
      }

      const id = button.dataset.id;
      if (!id) return;

      // Скрываем все правые меню
      document.querySelectorAll('.right-menu-content').forEach(menu => {
        menu.style.display = 'none';
      });

      // Показываем нужное правое меню по data-id
      const rightMenu = document.querySelector(`.right-menu-content[data-id="${id}"]`);
      if (rightMenu) {
        rightMenu.style.display = 'flex';
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', setupDropdownToggle);


// Считываем скроллы и скрываем/показываем header

let lastScrollTop = 0;
const scrollThreshold = 1; // минимальный порог 

function handleScroll() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollDelta = scrollTop - lastScrollTop;

  if (Math.abs(scrollDelta) < scrollThreshold) {
    lastScrollTop = scrollTop;
    return;
  }

  if (scrollDelta > 0) {
    handleScrollDown();
  } else {
    handleScrollUp();
  }

  if (scrollTop <= 0) {
    header.classList.remove('header-scrolled-up');
  }

  lastScrollTop = scrollTop;
}

window.addEventListener('scroll', handleScroll);


function handleScrollDown() {
  header.classList.add('header-hidden');
  header.classList.remove('header-scrolled-up');

  searchInput.blur();
  searchInput.value = '';
  searchItems.classList.remove('show');
  header.classList.remove('header-search-padding');

  blurContainers.forEach(container => {
    container.style.filter = '';
    container.style.cursor = '';
  });

  header.style.backgroundColor = 'transparent';
  underHeaders.forEach(el => el.style.filter = 'none');
 underHeaders.forEach(el => el.style.cursor = '');
  openCatalog.parentElement.classList.remove('active');
  isCatalogActive = false;
  menuNavigation.style.display = 'none';
  menuNavigation.classList.add('default-margin');
  menuNavigation.classList.remove('search-active');
  openCatalog.style.color = '';
}

function handleScrollUp() {
  header.style.display = 'block';
  header.classList.remove('header-hidden');
  header.classList.add('header-scrolled-up');
  menuNavigation.classList.add('default-margin');
}




// Скрипт для автоматического переключения контента на главной странице + переключение изображений на заднем плане

const section = document.querySelector('.main-page-top');
const pageWrappers = document.querySelectorAll('.page-wrapper');

const mobileProgressBars = document.querySelectorAll('.for-mobile-switch .progress-bar');
const mobileProgressBars340 = document.querySelectorAll('.for-mobile-switch-340 .progress-bar');
const progressBars1024 = document.querySelectorAll('.desctop-images-1024 .progress-bar');
const desktopProgressBars = document.querySelectorAll('.desctop-images .progress-bar');

const styles = getComputedStyle(section);
const bg1 = styles.getPropertyValue('--bg-1').trim();
const bg2 = styles.getPropertyValue('--bg-2').trim();
const bg3 = styles.getPropertyValue('--bg-3').trim();

function extractUrl(cssUrl) {
    return cssUrl.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
}

const bgImages = [bg1, bg2, bg3].map(extractUrl).map(path => path.replace(/^\.\.\//, ''));

let currentBgIndex = 0;
let intervalId = null;

// Определяем текущие прогресс-бары по ширине окна
function getCurrentProgressBars() {
    const width = window.innerWidth;
    if (width <= 400) {
        return mobileProgressBars340;
    } else if (width <= 1010) {
        return mobileProgressBars;
    } else if (width <= 1024) {
        return progressBars1024;
    } else {
        return desktopProgressBars;
    }
}

// Сброс анимации прогресс-бара
function resetProgressBars() {
    const bars = getCurrentProgressBars();
    bars.forEach(bar => {
        bar.style.transition = 'none';
        bar.style.width = '0%';
        void bar.offsetWidth; // принудительный reflow для сброса
        bar.style.transition = 'width 3s linear';
    });
}

// Анимация текущего прогресс-бара
function animateCurrentProgressBar(index) {
    resetProgressBars();
    const bars = getCurrentProgressBars();
    if (bars[index]) {
        bars[index].style.width = '100%';
    }
}

// Смена фона
function changeBackground(index) {
    const newBg = bgImages[index];

    const tempBg = document.createElement('div');
    tempBg.classList.add('temp-bg');
    tempBg.style.backgroundImage = `url('${newBg}')`;
    tempBg.style.opacity = '0';

    section.appendChild(tempBg);
    void tempBg.offsetHeight; // рефлоу
    tempBg.style.opacity = '1';

    setTimeout(() => {
        section.style.backgroundImage = `url('${newBg}')`;
        if (tempBg.parentNode) tempBg.remove();
    }, 1000);

    pageWrappers.forEach((wrapper, i) => {
        wrapper.classList.toggle('active', i === index);
    });

    animateCurrentProgressBar(index);
}

// Автоматическое переключение
function startAutoChange() {
    if (intervalId) clearInterval(intervalId);

    animateCurrentProgressBar(currentBgIndex);

    intervalId = setInterval(() => {
        currentBgIndex = (currentBgIndex + 1) % bgImages.length;
        changeBackground(currentBgIndex);
    }, 3000);
}

// Инициализация
startAutoChange();

// Повторная инициализация прогресс-бара при ресайзе
window.addEventListener('resize', () => {
    animateCurrentProgressBar(currentBgIndex);
});

// Обработка кликов на миниатюрах
document.querySelectorAll('.title-images a').forEach((link, index) => {
    link.addEventListener('click', function (e) {
        e.preventDefault();

        const bgUrl = this.getAttribute('data-bg');
        const foundIndex = bgImages.indexOf(bgUrl);
        if (foundIndex !== -1) {
            currentBgIndex = foundIndex;
            changeBackground(currentBgIndex);
            startAutoChange();
        }
    });
});