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


// Переключение карточек товара

const track = document.getElementById('track');
const cards = Array.from(track.querySelectorAll('.popular-product-card'));
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
    
let currentIndex = 2; // стартуем с Product 3 (индекс 2)
let cardWidth, visibleCount;

// Привязываем клики к статическим карточкам
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
    // читаем CSS-переменную и парсим в число
    const shiftValue = getComputedStyle(track)
                         .getPropertyValue('--manual-shift')
                         .trim();
    const manualShift = parseFloat(shiftValue);

    // рассчитываем смещение
    const x = -currentIndex * cardWidth + manualShift;
    track.style.transform = `translateX(${x}px)`;
    cards.forEach((c, i) => c.classList.toggle('active', i === currentIndex));
}

function goTo(idx) {
    currentIndex = Math.max(0, Math.min(cards.length - 1, idx));
    moveTrack();
    updateButtons();
}

function updateButtons() {
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === cards.length - 1;
}

prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
nextBtn.addEventListener('click', () => goTo(currentIndex + 1));
window.addEventListener('resize', updateSizes);
window.addEventListener('load', updateSizes);


// Свайпы карточек товара

let startX = 0;
let endX = 0;

track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
});

track.addEventListener('touchmove', (e) => {
    endX = e.touches[0].clientX;
});

track.addEventListener('touchend', () => {
    const swipeThreshold = 50;  // Минимальная длина свайпа для смены карточки
    const diff = startX - endX;

    if (diff > swipeThreshold) {
        goTo(currentIndex + 1);
    } else if (diff < -swipeThreshold) {
        goTo(currentIndex - 1);
    }
});




// Для переключение карточек "Почему выбирают нас" с помощью стрелок

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



// Добавление товара в корзину

const addBtn = document.getElementById('add-btn');
const addBtnMobile = document.getElementById('add-btn-mobile');
const qtyBlock = document.getElementById('qty-block');
const qtyBlockMobile = document.getElementById('qty-block-mobile');
const notifyBlock = document.getElementById('notify-block');
const notifyBlockMobile = document.getElementById('notify-block-mobile');
const minusBtn = document.getElementById('minus-btn');
const minusBtnMobile = document.getElementById('minus-btn-mobile');
const plusBtn = document.getElementById('plus-btn');
const plusBtnMobile = document.getElementById('plus-btn-mobile');
const qtyLabel = document.getElementById('qty-label');
          
let quantity = 1;
    
addBtn.addEventListener('click', () => {
    // скрываем кнопку "В корзину"
    document.querySelector('.add-to-cart').style.display = 'none';
    // показываем эти два блока
    qtyBlock.classList.add('active');
    notifyBlock.classList.add('active');
    qtyLabel.textContent = quantity;
});
    
plusBtn.addEventListener('click', () => {
    quantity++;
    qtyLabel.textContent = quantity;
});

minusBtn.addEventListener('click', () => {
    if (quantity > 1) {
      quantity--;
      qtyLabel.textContent = quantity;
    } else {
      // восстанавливаем исходное состояние
      quantity = 1;
      qtyLabel.textContent = quantity;
      qtyBlock.classList.remove('active');
      notifyBlock.classList.remove('active');
      document.querySelector('.add-to-cart').style.display = '';
    }
});

// Для контейнера мобильного телефона

addBtnMobile.addEventListener('click', () => {
    // скрываем кнопку "В корзину"
    document.querySelector('.add-to-cart-mobile').style.display = 'none';
    // показываем эти два блока
    qtyBlockMobile.classList.add('active');
    notifyBlockMobile.classList.add('active');
    qtyLabel.textContent = quantity;
});
    
plusBtnMobile.addEventListener('click', () => {
    quantity++;
    qtyLabel.textContent = quantity;
});


// Переадрисация на страницу "Результаты поиска" после того как 
// пользователь ввел название товарава в поиске и нажал Enter

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

// Валидация формы "Остались вопросы?"

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
    const questionInput = form.querySelector('input[name="your-question"]'); // <-- новое поле
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

    // Проверка поля "Ваш вопрос"
    if (!questionInput.value.trim()) {
        errorSpans[2].textContent = 'Пожалуйста, введите ваш вопрос.';
        errorSpans[2].style.display = 'block';
        valid = false;
    }

    // Проверка чекбокса "Согласие"
    if (!acceptInput.checked) {
        errorSpans[3].textContent = 'Вы должны согласиться с политикой конфиденциальности.';
        errorSpans[3].style.display = 'block';
        valid = false;
    }

    // Если всё ок — отправляем форму
    if (valid) {
        form.submit();
    }
}





// Поиск в хедере

const searchInput = document.getElementById('search-input');
const header = document.querySelector('.header-top');
const searchItems = document.querySelector('.search-items');
const underHeaderContainer = document.querySelector('.under-header-container');
const underHeader = document.querySelector('.under-header');
let isCatalogActive = false;

const marginTopStart = parseFloat(getComputedStyle(document.querySelector('.menu-navigation')).marginTop);
const marginTopUseSearch = marginTopStart + 250;



// Обработчик ввода в поле поиска
searchInput.addEventListener('input', function () {
    const isSearching = searchInput.value.trim() !== '';

    if (isSearching) {
        menuNavigation.classList.remove('default-margin');
        menuNavigation.classList.add('search-active');
        underHeader.style.filter = 'blur(5px)';
        blurContainers.forEach(container => container.style.filter = 'blur(5px)');
        header.classList.add('header-search-padding');
        header.style.backgroundColor = '#151c28';
        searchItems.classList.add('show');
    } else {
        menuNavigation.classList.remove('search-active');
        menuNavigation.classList.add('default-margin');

        if (!isCatalogActive) {
            header.style.backgroundColor = 'transparent';
            header.classList.remove('header-search-padding');
            searchItems.classList.remove('show');
            underHeader.style.filter = 'none';
            blurContainers.forEach(container => container.style.filter = '');
        } else {
            searchItems.classList.remove('show');
            header.classList.remove('header-search-padding');
            underHeader.style.filter = 'blur(5px)';
        }
    }
});







const blurContainers = document.querySelectorAll('.blur-container');

// Функция когда клик вне хедера
function resetHeaderState() {
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
    underHeader.style.filter = 'none';
    underHeader.style.backdropFilter = 'none';
    searchInput.value = '';
    underHeader.style.cursor = '';

    // Сбрасываем blur, если поле поиска пустое
    blurContainers.forEach(container => {
        container.style.filter = '';
    });
}

// Назначаем обработчики на все blur-контейнеры
blurContainers.forEach(container => {
    container.addEventListener('click', resetHeaderState);
});

// Обработчик на underHeader, если он есть
underHeader.addEventListener('click', resetHeaderState);





// Нажатие на кнопку каталог в хедере

const menuNavigation = document.querySelector('.menu-navigation');
const openCatalog = document.querySelector('.open-catalog');

openCatalog.addEventListener('click', function (e) {    
    
    e.preventDefault(); // чтобы не перезагружалась страница
    this.parentElement.classList.toggle('active');

    underHeader.style.filter = 'blur(5px)';
    underHeader.style.cursor = 'pointer';

    // Накидываем blur на все контейнеры
    blurContainers.forEach(container => {
        container.style.filter = 'blur(5px)';
        container.style.cursor = 'pointer';
    });

    // Проверяем, активирован ли класс и выводим результат в консоль
    const isActive = this.parentElement.classList.contains('active');
    isCatalogActive = isActive;

    if (isCatalogActive) {
        // Когда каталог активирован, меняем фон и показываем меню
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
            // Когда каталог деактивирован, скрываем меню и сбрасываем стиль
            openCatalog.style.color = '';
            header.style.backgroundColor = 'transparent';
            menuNavigation.style.display = 'none';

            // Убираем блюр со всех контейнеров, когда выходим из каталога
            blurContainers.forEach(container => {
                container.style.filter = 'none';
                container.style.cursor = '';
            });
    
            // underHeaderContainer.style.marginTop = '250px';
            underHeader.style.filter = 'none';
            underHeader.style.backdropFilter = 'none';
    
            searchItems.classList.remove('show');
    
            // Сбросить поле поиска
            searchInput.value = '';
        }
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

        // underHeaderContainer.style.marginTop = isOpen ? '0px' : '0px';
    });
});


// Отображение меню Мебели
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

// Закрытие всех подменю при наведении на header
header.addEventListener('mouseenter', function () {
    document.querySelectorAll('.submenu-plumbing').forEach(subMenu => {
        subMenu.style.display = 'none';
    });

    document.querySelectorAll('.submenu-furniture').forEach(subMenu => {
        subMenu.style.display = 'none';
    });

    document.querySelectorAll('.right-menu-content').forEach(subMenu => {
        subMenu.style.display = 'none';
    });

    document.querySelectorAll('.menu-item-furniture').forEach(menuItem => {
        menuItem.classList.remove('active');
    });

    document.querySelectorAll('.menu-item-plumbing').forEach(menuItem => {
        menuItem.classList.remove('active');
    });
});
// Делегирование для правого меню
const rightMenuContent = document.querySelector('.right-menu-content');

// Назначаем обработчики на все .shower-enclosures-and-pallets
document.querySelectorAll('.shower-enclosures-and-pallets').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        rightMenuContent.innerHTML = `
            <a href="catalog-page.html">Душевые уголки, двери и перегородки</a>
            <a href="catalog-page.html">Поддоны</a>
            <a href="catalog-page.html">Шторки для ванны</a>
            <div class="all-categories-link">
                <a href="catalog-page.html">Все товары категории</a>
                            
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
            <a href="catalog-page.html">Новые душевые кабины</a>
            <a href="catalog-page.html">Новые поддоны</a>
            <a href="catalog-page.html">Новые шторки</a>
            <div class="all-categories-link">
                <a href="catalog-page.html">Все товары категории</a>
                            
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 8L16.6854 13.2929C17.1049 13.6834 17.1049 14.3166 16.6854 14.7071L11 20" stroke="#EDE4D7" stroke-linecap="round"/>
                </svg>  
            </div>
        `;
        rightMenuContent.style.display = 'flex';
    });
});


// Назначаем обработчики на все .shower-program
document.querySelectorAll('.shower-program').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        rightMenuContent.innerHTML = `
            <a href="catalog-page.html">Лейки и держатели</a>
            <a href="catalog-page.html">Душевые стойки и штанги</a>
            <a href="catalog-page.html">Гибкие шланги</a>
            <a href="catalog-page.html">Верхний душ</a>
            <a href="catalog-page.html">Готовые душевые комплекты</a>
            <div class="all-categories-link">
                <a href="catalog-page.html">Все товары категории</a>
                            
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 8L16.6854 13.2929C17.1049 13.6834 17.1049 14.3166 16.6854 14.7071L11 20" stroke="#EDE4D7" stroke-linecap="round"/>
                </svg>  
            </div>
        `;
        rightMenuContent.style.display = 'flex';
    });
});



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





// Чётко считываем скроллы и скрываем/показываем header

let lastScrollTop = 0;
const scrollThreshold = 1; // минимальный порог (можно даже 0, если нужно всё отслеживать)

window.addEventListener('scroll', () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollDelta = scrollTop - lastScrollTop;

  // Учитываем любые изменения скролла, даже при scrollTop === 0
  if (Math.abs(scrollDelta) < scrollThreshold) {
    lastScrollTop = scrollTop; // всё равно обновим позицию
    return;
  }

  if (scrollDelta > 0) {
    // Скролл вниз
    header.classList.add('header-hidden');
    header.classList.remove('header-scrolled-up');
    
    searchInput.blur(); // убирает фокус с поля ввода
    searchInput.value = ''; // очищает текст
    searchItems.classList.remove('show'); // скрывает блок
    
    header.classList.remove('header-search-padding');
    // Убираем пустые отступы
    

    // Сброс состояния
    blurContainers.forEach(container => {
        container.style.filter = ''
        container.style.cursor = ''
    });
    
    header.style.backgroundColor = 'transparent';
    underHeader.style.filter = 'none';
    underHeader.style.cursor = '';
    openCatalog.parentElement.classList.remove('active');
    isCatalogActive = false;
    menuNavigation.style.display = 'none';
    menuNavigation.classList.add('default-margin');
    menuNavigation.classList.remove('search-active');
    openCatalog.style.color = '';
    
  } else if (scrollDelta < 0) {
    
    header.style.display = 'block';
    // Скролл вверх

    menuNavigation.classList.add('default-margin');

    header.classList.remove('header-hidden');
    header.classList.add('header-scrolled-up');
  }

  // Если в самом верху — убираем "скролл вверх" класс
  if (scrollTop <= 0) {
    header.classList.remove('header-scrolled-up');
  }

  lastScrollTop = scrollTop;
});



// Навигация (раскрытие менюшек)
document.addEventListener("DOMContentLoaded", function () {
    const navBlocks = document.querySelectorAll(".customers-navigation");

    navBlocks.forEach(nav => {
        // Навешиваем клик на всю навигационную секцию
        nav.addEventListener("click", () => {
            const section = nav.querySelector(".customers-section");
            section.classList.toggle("active");
        });

        // Дополнительно: клик по кнопке (стрелке) тоже открывает
        const button = nav.querySelector(".open-button");
        if (button) {
            button.addEventListener("click", (event) => {
                event.stopPropagation(); // предотвращает всплытие
                const section = nav.querySelector(".customers-section");
                section.classList.toggle("active");
            });
        }
    });
});