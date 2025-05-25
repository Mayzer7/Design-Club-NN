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


// Модальное окно "Связаться с нами"

// Получаем элементы модалок
const contactModal = document.getElementById('contactModal');
const thanksModal = document.getElementById('thanksModal');
const errorModal = document.getElementById('errorModal');

// Кнопки открытия
const openBtns = [
  document.getElementById('openModalBtn'),
  document.getElementById('burger-get-request')
];

// Кнопки закрытия
const closeBtns = [
  document.getElementById('closeModalBtn'),
  document.getElementById('closeModalBtnThanks'),
  document.getElementById('closeModalBtnError')
];

// Контейнер для блюра
const container = document.querySelector('.container');

// Функция открытия модалки с блюром
function openModal(modal) {
  modal.style.display = 'flex';
  container.style.filter = 'blur(5px)';
  setTimeout(() => modal.classList.add('open'), 10);
}

// Функция закрытия модалки и снятия блюра
function closeModal(modal) {
  modal.classList.remove('open');
  setTimeout(() => {
    modal.style.display = 'none';
    container.style.filter = 'none';
  }, 500);
}

// Открытие контактной модалки по кнопкам
openBtns.forEach(btn => {
  if (btn) {
    btn.addEventListener('click', () => openModal(contactModal));
  }
});

// Закрытие модалок по кнопкам ✖
closeBtns.forEach(btn => {
  if (!btn) return;
  btn.addEventListener('click', () => {
    if (btn.id === 'closeModalBtn') closeModal(contactModal);
    else if (btn.id === 'closeModalBtnThanks') closeModal(thanksModal);
    else if (btn.id === 'closeModalBtnError') closeModal(errorModal);
  });
});

// Закрытие модалок по клику на затемнённый фон
[contactModal, thanksModal, errorModal].forEach(modal => {
  if (!modal) return;
  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal(modal);
  });
});

// Очистка формы и ошибок
function formReset(form) {
  form.reset();
  const errorElements = form.querySelectorAll('.error-contact');
  errorElements.forEach(error => (error.style.display = 'none'));
}

// Валидация формы — возвращает true/false, не открывает модалки
function validateFormModal(form) {
  let valid = true;

  const errorElements = form.querySelectorAll('.error-contact');
  errorElements.forEach(error => (error.style.display = 'none'));

  const nameInput = form.querySelector('input[name="name"]');
  const phoneInput = form.querySelector('input[name="phone"]');
  const acceptInput = form.querySelector('input[name="accept"]');

  if (!nameInput.value.trim()) {
    errorElements[0].textContent = 'Пожалуйста, введите ваше имя.';
    errorElements[0].style.display = 'block';
    valid = false;
  }

  if (!phoneInput.value.trim()) {
    errorElements[1].textContent = 'Пожалуйста, введите ваш телефон.';
    errorElements[1].style.display = 'block';
    valid = false;
  }

  if (!acceptInput.checked) {
    errorElements[2].textContent = 'Вы должны согласиться с политикой конфиденциальности.';
    errorElements[2].style.display = 'block';
    valid = false;
  }

  return valid;
}

// Обработчик отправки формы — привязывается к onsubmit формы
function onSubmitForm(event) {
  event.preventDefault();
  const form = event.target;

  if (!validateFormModal(form)) {
    closeModal(contactModal);
    openModal(errorModal);
    return;
  }

  closeModal(contactModal);
  openModal(thanksModal);
  formReset(form);
}

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
  // Удаляем старые классы отступа
  menuNavigation.classList.remove('default-margin', 'search-active', 'search-active-down');

  const isTop = window.scrollY < 100;

  if (isTop) {
    menuNavigation.classList.add('search-active');
    header.classList.add('header-search-padding');
    header.style.paddingBottom = '270px';
  } else {
    menuNavigation.classList.add('search-active-down');
    header.classList.add('header-search-padding');
    header.style.paddingBottom = '330px';
  }

  // Общая логика
  underHeaders.forEach(el => el.style.filter = 'blur(5px)');
  blurContainers.forEach(container => container.style.filter = 'blur(5px)');
  header.style.backgroundColor = '#151c28';
  searchItems.classList.add('show');

  // Скрытие навигации "О компании"
  const aboutToggle = document.querySelector('.about-toggle');
  if (aboutToggle && aboutToggle.classList.contains('open')) {
    aboutToggle.classList.remove('open');

    // Убираем блюры, которые мог активировать about-toggle
    blurContainers.forEach(container => {
      container.style.filter = '';
      container.style.cursor = '';
    });

    underHeaders.forEach(el => {
      el.style.filter = '';
      el.style.cursor = '';
    });
  }
}


function deactivateSearchMode() {
  // Сброс всех классов, связанных с поиском
  menuNavigation.classList.remove('search-active', 'search-active-down');
  menuNavigation.classList.add('default-margin');

  // Скрытие результатов поиска
  searchItems.classList.remove('show');

  // Сброс паддинга и фона хедера
  header.classList.remove('header-search-padding');
  header.style.paddingBottom = '';
  header.style.backgroundColor = 'transparent';

  // Сброс фильтров (blur)
  underHeaders.forEach(el => {
    el.style.filter = 'none';
    el.style.backdropFilter = 'none';
  });

  blurContainers.forEach(container => {
    container.style.filter = '';
    container.style.cursor = '';
  });
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
    header.style.paddingBottom = '';
    
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

    // Закрываем меню "О компании", если оно открыто
    if (toggleItem.classList.contains('open')) {
      toggleItem.classList.remove('open');
      menuNavigation.classList.remove('about-open');
    }

}

// Предотвращаем переход по ссылке если нажимаем на ссылочный объект
// чтобы закрыть менюшки и сам Каталог

blurContainers.forEach(container => {
    container.addEventListener('click', function(event) {
        const target = event.target;
        const link = target.closest('a');

        if (link && isMenuOpen()) {
            // Если меню открыто — закрываем и НЕ переходим
            event.preventDefault();
            resetHeaderState();
            return;
        }

        // Если клик вне меню — просто закрываем
        resetHeaderState();
    });
});


// Обработка кликов по under-header
underHeaders.forEach(header => {
    header.addEventListener('click', function(event) {
        const target = event.target;
        const link = target.closest('a');

        if (link && isMenuOpen()) {
            event.preventDefault();
            resetHeaderState();
            return;
        }

        resetHeaderState();
    });
});

// Проверка, открыт ли каталог или любое меню
function isMenuOpen() {
    return isCatalogActive || toggleItem.classList.contains('open');
}


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

    // Если в поиске есть текст, сначала отключаем поиск
    if (searchInput.value.trim() !== '') {
        searchInput.value = '';
        deactivateSearchMode();
    }

    // Проверяем, открыт ли меню "О компании"
    if (toggleItem.classList.contains('open')) {
        toggleItem.classList.remove('open');
    }

    toggleCatalogMenu();
});


// Открытие меню "О компании" в хедере
const toggleItem = document.querySelector('.about-toggle');
const toggleHeader = toggleItem.querySelector('.about-header');

document.addEventListener('DOMContentLoaded', () => {

    toggleHeader.addEventListener('click', (e) => {
        e.preventDefault();

        // 1. Очищаем поиск и сбрасываем UI поиска
        if (searchInput.value.trim() !== '') {
            searchInput.value = '';
            deactivateSearchMode();
        }

        // 2. Закрываем активный каталог, если он открыт
        if (openCatalog.parentElement.classList.contains('active')) {
            openCatalog.parentElement.classList.remove('active');
            isCatalogActive = false;

            // Сброс UI каталога
            openCatalog.style.color = '';
            header.style.backgroundColor = 'transparent';
            menuNavigation.style.display = 'none';
            menuNavigation.classList.remove('default-margin');

            blurContainers.forEach(container => {
                container.style.filter = 'none';
                container.style.cursor = '';
            });

            underHeaders.forEach(el => el.style.filter = 'none');
            underHeaders.forEach(el => el.style.backdropFilter = 'none');
        }

        // 3. Переключаем меню "О компании"
        toggleItem.classList.toggle('open');

        // 4. Применяем/снимаем blur в зависимости от состояния
        if (toggleItem.classList.contains('open')) {
            blurContainers.forEach(container => {
                container.style.filter = 'blur(5px)';
                container.style.cursor = 'pointer';
            });
            underHeaders.forEach(el => {
                el.style.filter = 'blur(5px)';
                el.style.cursor = 'pointer';
            });
        } else {
            blurContainers.forEach(container => {
                container.style.filter = '';
                container.style.cursor = '';
            });
            underHeaders.forEach(el => {
                el.style.filter = '';
                el.style.cursor = '';
            });
        }
    });
});


// Раскрытие менюшек при нажатии на каталог в хедере

// Определяем, есть ли поддержка hover и fine pointer (т.е. мышь, ПК)
const hasHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

const menuContainer = document.querySelector('.menu-container');
let hideTimeout;

// Закрытие всей панели каталога при уходе курсора
header.addEventListener('mouseenter', (e) => {
  const isOverCatalogButton = e.target.closest('.open-catalog');

  if (!isOverCatalogButton && openCatalog.parentElement.classList.contains('active')) {
    // Закрываем каталог
    toggleCatalogMenu();

    // Сброс состояния меню
    document.querySelectorAll('.submenu').forEach(sm => sm.classList.remove('open'));
    document.querySelectorAll('.menu-toggle').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.submenu-item').forEach(item => item.classList.remove('active'));
    document.querySelectorAll('.right-menu-content').forEach(content => {
      content.style.display = 'none';
    });

    // Сброс фильтров, курсоров и фоновых цветов
    blurContainers.forEach(container => {
      container.style.filter = 'none';
      container.style.cursor = '';
    });

    underHeaders.forEach(el => {
      el.style.filter = 'none';
      el.style.cursor = '';
      el.style.backdropFilter = 'none';
    });

    openCatalog.style.color = '';
    header.style.backgroundColor = 'transparent';
    menuNavigation.style.display = 'none';
    menuNavigation.classList.remove('default-margin');

    searchItems.classList.remove('show');
    searchInput.value = '';
  }
});

// Клик по верхнему меню
document.querySelectorAll('.menu-toggle').forEach(button => {
  button.addEventListener('click', e => {
    const category = button.dataset.category;
    const submenu = document.querySelector(`.submenu[data-category="${category}"]`);

    if (!submenu.classList.contains('open')) {
      e.preventDefault();

      document.querySelectorAll('.submenu').forEach(sm => {
        if (sm.dataset.category !== category) sm.classList.remove('open');
      });
      document.querySelectorAll('.menu-toggle').forEach(btn => {
        if (btn.dataset.category !== category) btn.classList.remove('active');
      });

      submenu.classList.add('open');
      button.classList.add('active');
    } else {
      submenu.classList.remove('open');
      button.classList.remove('active');

      document.querySelectorAll('.submenu-item').forEach(item => item.classList.remove('active'));
      document.querySelectorAll('.right-menu-content').forEach(content => {
        content.style.display = 'none';
      });
    }
  });
});


// Hover для ПК
if (hasHover) {
  document.querySelectorAll('.menu-toggle').forEach(button => {
    button.addEventListener('mouseenter', () => {
      const category = button.dataset.category;

      document.querySelectorAll('.submenu').forEach(sm => {
        if (sm.dataset.category !== category) sm.classList.remove('open');
      });
      document.querySelectorAll('.menu-toggle').forEach(btn => {
        if (btn.dataset.category !== category) btn.classList.remove('active');
      });

      const submenu = document.querySelector(`.submenu[data-category="${category}"]`);
      if (submenu) {
        submenu.classList.add('open');
        button.classList.add('active');
      }
    });
  });
}

// Наведение на подменю
document.querySelectorAll('.submenu-item .menu-button').forEach(button => {
  button.addEventListener('mouseenter', () => {
    const submenuItem = button.closest('.submenu-item');
    const id = button.dataset.id;

    document.querySelectorAll('.submenu-item').forEach(item => item.classList.remove('active'));

    submenuItem.classList.add('active');
    currentActiveId = id;

    document.querySelectorAll('.right-menu-content').forEach(content => {
      content.style.display = 'none';
    });
    const rightMenu = document.querySelector(`.right-menu-content[data-id="${id}"]`);
    if (rightMenu) rightMenu.style.display = 'flex';

    clearTimeout(hideTimeout);
  });
});

// Защита от ухода мыши с правого меню
document.querySelectorAll('.right-menu-content').forEach(menu => {
  menu.addEventListener('mouseenter', () => clearTimeout(hideTimeout));
});


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
    menuNavigation.classList.add('scrolled-margin');

    if (isCatalogActive) return;

    // Закрываем меню "О компании", если оно открыто
    if (toggleItem.classList.contains('open')) {
      toggleItem.classList.remove('open');
      menuNavigation.classList.remove('about-open');
    }

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
  menuNavigation.classList.remove('default-margin', 'search-active', 'search-active-down');
  openCatalog.style.color = '';
  header.style.paddingBottom = '';
}

function handleScrollUp() {
  header.style.display = 'block';
  header.classList.remove('header-hidden');
  header.classList.add('header-scrolled-up');

  if (window.scrollY === 0) {
    // Если в самом верху страницы
    menuNavigation.classList.add('default-margin');
    menuNavigation.classList.remove('scrolled-margin');
  } else {
    // Если прокрутка вниз

    menuNavigation.classList.add('scrolled-margin');
    menuNavigation.classList.remove('default-margin');
  }
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

// Переключение карточек "Популярные товары"

const swiper = new Swiper('.mySwiper', {
    slidesPerView: 'auto',
    spaceBetween: 20,
    initialSlide: 2,
    loop: true,
    loopedSlides: 8,
    centeredSlides: true,
    grabCursor: true,
    speed: 700,
    navigation: {
        nextEl: '.popular-right-arrow',
        prevEl: '.popular-left-arrow',
    },

    breakpoints: {
        // gap между карточками
        // от 0 до 399px
        0: {
            spaceBetween: 10
        },
        // от 400px и выше 
        400: {
            spaceBetween: 20
        }
    }
});

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


