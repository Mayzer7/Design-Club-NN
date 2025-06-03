// Общие скрипты для всех страниц (снизу будут под отдельные страницы)

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
  // Если каталог открыт — закрываем
  if (isCatalogActive) {
    toggleCatalogMenu();
  }

  // Удаляем старые классы отступа
  menuNavigation.classList.remove('default-margin', 'search-active', 'search-active-down');

  const isTop = window.scrollY < 100;

  if (isTop) {
    header.classList.add('header-search-padding');
  } else {
    header.classList.add('header-search-padding-down');
  }

  // Общая логика
  underHeaders.forEach(el => el.style.filter = 'blur(5px)');
  underHeaders.forEach(el => el.style.cursor = 'pointer');
  blurContainers.forEach(container => {
    container.style.filter = 'blur(5px)';
    container.style.cursor = 'pointer';
  });
  
  
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
  header.classList.remove('header-search-padding-down');
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
    header.classList.remove('header-search-padding-down');
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

// Предотвращаем действия по ссылкам и кнопкам при открытом поиске или меню

let disableClick = false;

blurContainers.forEach(container => {
    container.addEventListener('click', function(event) {
        const isSearchActive = searchItems.classList.contains('show');

        if (isMenuOpen() || isSearchActive) {
            event.preventDefault();
            event.stopPropagation();

            // Устанавливаем блокировку кликов
            disableClick = true;

            resetHeaderState();

            // Снимаем блокировку через небольшой таймаут
            setTimeout(() => {
                disableClick = false;
            }, 100);
        } else if (disableClick) {
            event.preventDefault();
            event.stopPropagation();
        }
    }, true); // Захват
});

// Обработка кликов по under-header

underHeaders.forEach(header => {
    header.addEventListener('click', function(event) {
        const target = event.target;
        const link = target.closest('a');
        const button = target.closest('button');
        const isSearchActive = searchItems.classList.contains('show');

        if ((link || button) && (isMenuOpen() || isSearchActive)) {
            event.preventDefault();
            event.stopPropagation();

            disableClick = true;

            resetHeaderState();

            setTimeout(() => {
                disableClick = false;
            }, 100);

            return;
        }

        if (isMenuOpen() || isSearchActive) {
            // Клик в underHeaders, но не по ссылке/кнопке — просто закрываем меню
            resetHeaderState();
        }
    }, true); // захват для надёжности
});

// Теперь на кнопках добавьте проверку disableClick:

document.querySelectorAll('button, a').forEach(el => {
    el.addEventListener('click', (event) => {
        if (disableClick) {
            event.preventDefault();
            event.stopPropagation();
            return false;
        }
    }, true);
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


// Появление компактного хедера при скроле вверх на странице 

document.addEventListener('DOMContentLoaded', () => {
  const mainNav = document.querySelector('.main-nav');
  const aboutNav = document.querySelector('.about-company-nav');
  const navContainer = document.querySelector('.nav-container');

  function toggleNavOnScroll() {
    if (window.scrollY > 50) {
      mainNav.classList.add('hidden');
      aboutNav.classList.add('active');
      navContainer.classList.add('nav-scrolled');
    } else {
      mainNav.classList.remove('hidden');
      aboutNav.classList.remove('active');
      navContainer.classList.remove('nav-scrolled');
    }
  }

  window.addEventListener('scroll', toggleNavOnScroll);
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

    // Проверка: остались ли открытые модалки
    const modals = [contactModal, thanksModal, errorModal];
    const anyOpen = modals.some(m => m !== modal && m.style.display === 'flex');
    
    if (!anyOpen) {
      container.style.filter = 'none';
    }
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

// Валидация формы модалки
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

// Обработчик правого меню по клику, чтобы работало на touch устройствах
document.querySelectorAll('.submenu-item .menu-button').forEach(button => {
  const openRightMenu = () => {
    const submenuItem = button.closest('.submenu-item');
    const id = button.dataset.id;

    document.querySelectorAll('.submenu-item').forEach(item => item.classList.remove('active'));
    submenuItem.classList.add('active');

    document.querySelectorAll('.right-menu-content').forEach(content => {
      content.style.display = 'none';
    });
    const rightMenu = document.querySelector(`.right-menu-content[data-id="${id}"]`);
    if (rightMenu) rightMenu.style.display = 'flex';

    clearTimeout(hideTimeout);
  };

  button.addEventListener('mouseenter', () => {
    if (hasHover) openRightMenu();
  });

  button.addEventListener('click', (e) => {
    if (!hasHover) {
      e.preventDefault(); // отключить переход по ссылке
      openRightMenu();
    }
  });
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


// Считываем скроллы и скрываем/показываем header
// + на странице проекты показываем навигацию по странице

let lastScrollTop = 0;
const scrollThreshold = 0; // минимальный порог 

const projectsSection = document.querySelector('.projects-section');
const stickyNavs = document.querySelectorAll('.sticky-nav');
let hideStickyTimeout = null;

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

    // Убираем блюры в самом верху страницы
    blurContainers.forEach(container => {
      container.style.filter = 'none';
      container.style.cursor = '';
    });

    underHeaders.forEach(header => {
      header.style.filter = 'none';
      header.style.cursor = '';
    });

    // Закрываем всё при достижении самого верха
    resetHeaderState();
  }

  lastScrollTop = scrollTop;
}

window.addEventListener('scroll', handleScroll);


function handleScrollDown() {
  // Прерываем скрытие, если начался скролл вниз
  if (hideStickyTimeout) {
    clearTimeout(hideStickyTimeout);
    hideStickyTimeout = null;
  }

  if (projectsSection) {
    stickyNavs.forEach(nav => nav.classList.remove('hidden'));
  }

  menuNavigation.classList.add('scrolled-margin');

  if (isCatalogActive) return;

  if (toggleItem.classList.contains('open')) {
    toggleItem.classList.remove('open');
    menuNavigation.classList.remove('about-open');
  }

  header.classList.add('header-hidden');
  header.classList.remove('header-scrolled-up');
  header.classList.remove('header-search-padding');
  header.classList.remove('header-search-padding-down');

  searchInput.blur();
  searchInput.value = '';
  searchItems.classList.remove('show');

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
  // Если есть активный таймер — сбрасываем
  if (hideStickyTimeout) {
    clearTimeout(hideStickyTimeout);
    hideStickyTimeout = null;
  }

  hideStickyTimeout = setTimeout(() => {
    stickyNavs.forEach(nav => nav.classList.add('hidden'));
    hideStickyTimeout = null;
  }, 300); 

  header.style.display = 'block';
  header.classList.remove('header-hidden');
  header.classList.add('header-scrolled-up');

  if (window.scrollY === 0) {
    menuNavigation.classList.add('default-margin');
    menuNavigation.classList.remove('scrolled-margin');
  } else {
    menuNavigation.classList.add('scrolled-margin');
    menuNavigation.classList.remove('default-margin');
  }
}

// Валидация форм на странице

  const questionInput = document.querySelector('[name="your-question"]');
  const desiredPositionInput = document.querySelector('[name="desired-position"]'); 

  function validateForm(event, formId) {
    event.preventDefault();

    const form = document.getElementById(formId);

    if (!form) return;

    const errorElements = form.querySelectorAll('.error-contact');
    errorElements.forEach(error => error.style.display = 'none');

    let valid = true;

    const nameInput = form.querySelector('input[name="name"]');
    const phoneInput = form.querySelector('input[name="phone"]');
    const acceptInput = form.querySelector('input[name="accept"]');
    const contactMethodHiddenInput = form.querySelector('input[name="contact_method_value"]');
    const questionInput = form.querySelector('input[name="your-question"]');
    const desiredPositionInput = form.querySelector('input[name="desired-position"]');
    const errorSpans = form.querySelectorAll('.error-contact');

    // Проверки
    if (!nameInput.value.trim()) {
        errorSpans[0].textContent = 'Пожалуйста, введите ваше имя.';
        errorSpans[0].style.display = 'block';
        valid = false;
    }

    if (!phoneInput.value.trim()) {
        errorSpans[1].textContent = 'Пожалуйста, введите ваш телефон.';
        errorSpans[1].style.display = 'block';
        valid = false;
    }

    if (contactMethodHiddenInput) {
      if (!contactMethodHiddenInput.value.trim()) {
          const errorSpan = form.querySelector('.contact-input-wrapper .error-contact');
          errorSpan.textContent = 'Выберите способ связи';
          errorSpan.style.display = 'block';
          valid = false;
      }
    }

    if (questionInput && !questionInput.value.trim()) {
        errorSpans[2].textContent = 'Пожалуйста, введите ваш вопрос.';
        errorSpans[2].style.display = 'block';
        valid = false;
    }

    if (desiredPositionInput && !desiredPositionInput.value.trim()) {
        errorSpans[2].textContent = 'Пожалуйста, введите желаемую должность.';
        errorSpans[2].style.display = 'block';
        valid = false;
    }

    if (!acceptInput.checked) {
        errorSpans[3].textContent = 'Вы должны согласиться с политикой конфиденциальности.';
        errorSpans[3].style.display = 'block';
        valid = false;
    }

    if (valid) form.submit();
  }

  // Выбор способа связи в форме "Связаться с нами"

  const menu = document.querySelector('.contact-input-wrapper');

  if (menu) {
    document.querySelectorAll('.contact-form').forEach(form => {
        const wrapper = form.querySelector('.contact-input-wrapper');
        if (!wrapper) return;

        const toggleButton = wrapper.querySelector('.contact-method-selector');
        const menu = wrapper.querySelector('.menu-contact-method');
        const arrow = wrapper.querySelector('.dropdown-arrow');
        const contactMethodInput = form.querySelector('input[name="contact_method"]');
        const contactMethodValueInput = form.querySelector('input[name="contact_method_value"]');

        toggleButton.addEventListener('click', () => {
            const isOpen = menu.classList.contains('open');
            if (isOpen) {
                menu.style.maxHeight = '0px';
                menu.style.opacity = '0';
                menu.classList.remove('open');
                arrow?.classList.remove('rotated');
            } else {
                menu.style.maxHeight = menu.scrollHeight + 'px';
                menu.style.opacity = '1';
                menu.classList.add('open');
                arrow?.classList.add('rotated');
            }
        });

        menu.querySelectorAll('.contact-input-fields-menu').forEach(item => {
            item.addEventListener('click', () => {
              const russianText = item.querySelector('span').innerText;
              const englishValue = item.getAttribute('data-value');

              contactMethodInput.value = russianText;
              contactMethodValueInput.value = englishValue;

              // Сброс выделения
              menu.querySelectorAll('.contact-input-fields-menu').forEach(el => {
                  el.classList.remove('selected');
              });
              item.classList.add('selected');
          });
        });
    });
  }

  // Отображение загруженного файла 
  // в форме "Оставьте ваше резюме"
  
  if (desiredPositionInput) {
    const input = document.getElementById('resume-upload-input');
    const fileNameSpan = document.querySelector('.file-name');
        
    input.addEventListener('change', () => {
        if (input.files.length > 0) {
            fileNameSpan.textContent = `Файл выбран: ${input.files[0].name}`;
        } else {
            fileNameSpan.textContent = '';
        }
    });
  }

  // Переключение карточек "Популярные товары"

  const popularProductCard = document.querySelector('.popular-product-card');

  if (popularProductCard) {
    let swiper;

    function initSwiper() {
      const popularProductCard = document.querySelector('.popular-product-card');

      if (popularProductCard) {
        if (swiper) swiper.destroy(true, true);
        
        const isSmallScreen = window.innerWidth <= 870;

        swiper = new Swiper('.popular-products-swiper', {
          slidesPerView: 'auto',
          spaceBetween: window.innerWidth <= 400 ? 10 : 20,
          slidesPerGroup: 1,
          speed: 800,
          grabCursor: true,
          effect: 'slide',
          loop: true,
          loopedSlides: 4,
          touchRatio: 0.5,
          initialSlide: 2,
          centeredSlides: !isSmallScreen, // Отключаем при маленьком экране
          longSwipesRatio: 0.05,
          longSwipesMs: 300,

          navigation: {
            nextEl: '.popular-right-arrow',
            prevEl: '.popular-left-arrow',
          },
        });
      }
    }

    // Инициализация при загрузке
    initSwiper();

    // Переинициализация при изменении ширины окна
    window.addEventListener('resize', () => {
      initSwiper();
    });
  }

  // Переключение карточек "Наши бренды" мобильная версия

  const ourBrands = document.querySelector('.our-brands');

  if (ourBrands) {
    const swiper = new Swiper('.our-brands-swiper', {
        slidesPerView: 'auto',
        spaceBetween: 20,
        slidesPerGroup: 1,
        speed: 800,
        grabCursor: false,
        effect: 'slide',
        loop: true,
        centeredSlides: false,
  
    });
  }

  // Переключение карточек "Популярные категории" мобильная версия

  const popularCategoriesContentMobile = document.querySelector('.popular-categories-content-mobile');

  if (popularCategoriesContentMobile) {
    const swiper = new Swiper('.popular-categories-swiper', {
        slidesPerView: 'auto',
        spaceBetween: 20,
        slidesPerGroup: 1,
        speed: 800,
        grabCursor: false,
        effect: 'slide',
        loop: true,
        centeredSlides: false,
  
    });
  }

  // Переключение карточек "Уникальные решения для вашего дома" мобильная версия

  const uniqueSolutions520px = document.querySelector('.unique-solutions-520px');

  if (uniqueSolutions520px) {
    const swiper = new Swiper('.unique-swiper', {
      slidesPerView: 'auto',
      slidesPerGroup: 1,
      loop: false,
      speed: 800,
      spaceBetween: 10,
    });
  }
  

  // Яндекс карта

  const maps = document.querySelector('.maps');
  const mapsMobile = document.querySelector('.maps-mobile');

  if (maps || mapsMobile) {
    let center = [56.29952353059907, 44.02247565459635];

    function createMap(mapId) {
      let map = new ymaps.Map(mapId, {
        center: center,
        zoom: 17.5,
      });

      let balloonLayout = ymaps.templateLayoutFactory.createClass(
        `<div class="custom-balloon-wrapper">
          <div class="custom-balloon">
            <div class="balloon-content">
              <a href="https://yandex.ru/maps/-/CHCE6VNj" target="_blank" class="balloon__title">
                Дизайн клуб
              </a>
              <div class="balloon__address">
                <p>Адресс</p> 
                <a href="https://yandex.ru/maps/-/CHCE6VNj" target="_blank">ул. Эльтонская, 8</a>
              </div>
              <div class="balloon__contacts">
                <p>Телефон</p>
                <a href="tel:+79809224697">+7 (980) 922-46-97</a>
              </div>
              <div class="balloon__working__info">
                <p>Режим работы</p>
                <a href="https://yandex.ru/maps/-/CHCE6VNj" target="_blank">Пн-пт: 10:00 - 19:00</a>
              </div>
            </div>
            <div class="custom-balloon__close" title="Закрыть">
              <svg fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 50 50" width="16" height="16">
                <path d="M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z"/>
              </svg>
            </div>
            <div class="custom-balloon__arrow"></div>
          </div>
        </div>`,
        {
          build: function () {
            balloonLayout.superclass.build.call(this);

            const balloonElement = this.getElement().querySelector('.custom-balloon');
            const closeBtn = balloonElement.querySelector('.custom-balloon__close');

            if (window.innerWidth <= 1330) {
              balloonElement.style.transform = 'translate(-50%, -60%)';
            } else {
              balloonElement.style.transform = 'translate(-50%, -80%)';
            }

            closeBtn.addEventListener('click', this.onCloseClick.bind(this));
          },

          clear: function () {
            const closeBtn = this.getElement().querySelector('.custom-balloon__close');
            if (closeBtn) closeBtn.removeEventListener('click', this.onCloseClick.bind(this));
            balloonLayout.superclass.clear.call(this);
          },

          onCloseClick: function (e) {
            e.preventDefault();
            this.events.fire('userclose');
          },

          getShape: function () {
            const element = this.getElement();
            if (!element) return null;
            const rect = element.getBoundingClientRect();
            return new ymaps.shape.Rectangle(
              new ymaps.geometry.pixel.Rectangle([[0, 0], [rect.width, rect.height]])
            );
          },

          getOffset: function () {
            const balloon = this.getElement().querySelector('.custom-balloon');
            const height = balloon.offsetHeight;
            const width = balloon.offsetWidth;
            return [-width / 2, -height - 10];
          }
        }
      );

      let placemark = new ymaps.Placemark(center, {}, {
        iconLayout: 'default#image',
        iconImageHref: 'images/svg/marker.svg',
        iconImageSize: [40, 40],
        iconImageOffset: [-19, -44],
        balloonLayout: balloonLayout,
        balloonPanelMaxMapArea: 0
      });

      map.controls.remove('geolocationControl'); // удаляем геолокацию
      map.controls.remove('searchControl'); // удаляем поиск
      map.controls.remove('trafficControl'); // удаляем контроль трафика
      map.controls.remove('typeSelector'); // удаляем тип
      map.controls.remove('fullscreenControl'); // удаляем кнопку перехода в полноэкранный режим
      map.controls.remove('zoomControl'); // удаляем контрол зуммирования
      map.controls.remove('rulerControl'); // удаляем контрол правил

      map.geoObjects.add(placemark);
    }

    ymaps.ready(() => {
      if (maps) {
        createMap('map');
      }
      if (mapsMobile) {
        createMap('map-mobile');
      }
    });
  }

  // Скрипты для контента на странице "reviews-page.html"

  const reviewsPageSection = document.querySelector('.reviews-section');

  if (reviewsPageSection) {
    // Раскрытие отзывов на кнопку "Больше"
    const moreButton = document.getElementById('more-button');
    const reviewContainers = document.querySelectorAll('.more-reviews');
          
    // Индекс текущего контейнера, который будет показан
    let currentIndex = 0;
          
    function showNextReviewContainer() {
        if (currentIndex < reviewContainers.length) {
            const block = reviewContainers[currentIndex];
          
            block.classList.add('show');
            block.style.maxHeight = block.scrollHeight + 'px';
            block.style.opacity = '1';
          
            currentIndex++;
            }
          
        // Скрываем кнопку, если все блоки показаны
        if (currentIndex >= reviewContainers.length) {
            const moreContainer = document.querySelector('.more');
                
            moreButton.style.display = 'none';
            moreContainer.style.display = 'none';
        }
    }
          
    moreButton.addEventListener('click', showNextReviewContainer);
  }

  // Скрипты для контента на странице "customers-page.html"

  if (questionInput) {
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
  }

  // Свайп карточек отзывов

  const reviewsSection = document.querySelector('.reviews');

  if (reviewsSection) {
    const swiperReview = new Swiper('.reviews-cards-swiper', {
        slidesPerView: 'auto',
        centeredSlides: false, 
        spaceBetween: 20,
        grabCursor: false,
        loop: true,
        speed: 800,
        initialSlide: 0,
        navigation: {
          nextEl: '.right-arrow-review',
          prevEl: '.left-arrow-review',
        },
        breakpoints: {
          0: {
            spaceBetween: 10
          },
          430: {
            spaceBetween: 20
          }
        },
      });
  } 

  // Свайп карточек "Почему выбирают нас"

  const containerWhy = document.querySelector('.why-choose-us-content');

  if (containerWhy) {
    const swiper = new Swiper('.why-choose-us-swiper', {
      slidesPerView: 4,
      spaceBetween: 20,
      grabCursor: false,
      speed: 800,
      slidesPerGroup: 2,
      loop: true,
      navigation: {
        nextEl: '.why-right-arrow',
        prevEl: '.why-left-arrow',
      },

      breakpoints: {
        1020: {
          slidesPerView: 4,
          slidesPerGroup: 2,
          spaceBetween: 20,
        },
        765: {
          slidesPerView: 3,
          slidesPerGroup: 2,
          spaceBetween: 20,
        },
        541: {
          slidesPerView: 2,
          slidesPerGroup: 2,
          spaceBetween: 20,
        },
        0: {
          slidesPerView: 'auto',
          slidesPerGroup: 1,
          spaceBetween: 10,
        },
      },
    });

    // Отображаем стрелочки для переключения карточек "Почему выбирают нас", если карточек больше 4 
    const whyCards = document.querySelectorAll('.why-choose-us-content .card');
      const rigthTitleGroup = document.querySelector('.rigth-title-group');

      const isSmallScreen = window.innerWidth <= 600;

      if (whyCards.length > 4 && !isSmallScreen) {
          rigthTitleGroup.classList.add('visible');
      } else {
          rigthTitleGroup.classList.remove('visible');
      }
  }


// Модальное окно для просмотра видео

const modalVideo = document.querySelector(".modal-video");

if (modalVideo) {
  const btns = document.querySelectorAll(".video-button");
  const closeBtnVideo = document.querySelector(".close-video");
  const video = document.getElementById("modalVideo");

  btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      modalVideo.style.display = "flex";
      video.play();
    });
  });

  closeBtnVideo.addEventListener("click", () => {
    modalVideo.style.display = "none";
    video.pause();
    video.currentTime = 0;
  });

  window.addEventListener("click", (event) => {
    if (event.target === modalVideo) {
      modalVideo.style.display = "none";
      video.pause();
      video.currentTime = 0;
    }
  });
}

// Скрипты для контента на странице "main-page.html"

const pageWrapper3 = document.querySelector('.page-wrapper-3');

if (pageWrapper3) {
  // Скрипт для автоматического переключения контента на главной странице + переключение изображений на заднем плане

  // const section = document.querySelector('.main-page-top');
  // const pageWrappers = document.querySelectorAll('.page-wrapper');

  // const mobileProgressBars = document.querySelectorAll('.for-mobile-switch .progress-bar');
  // const mobileProgressBars340 = document.querySelectorAll('.for-mobile-switch-340 .progress-bar');
  // const progressBars1024 = document.querySelectorAll('.desctop-images-1024 .progress-bar');
  // const desktopProgressBars = document.querySelectorAll('.desctop-images .progress-bar');

  // const styles = getComputedStyle(section);
  // const bg1 = styles.getPropertyValue('--bg-1').trim();
  // const bg2 = styles.getPropertyValue('--bg-2').trim();
  // const bg3 = styles.getPropertyValue('--bg-3').trim();

  // function extractUrl(cssUrl) {
  //     return cssUrl.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
  // }

  // const bgImages = [bg1, bg2, bg3].map(extractUrl).map(path => path.replace(/^\.\.\//, ''));

  // let currentBgIndex = 0;
  // let intervalId = null;

  // // Определяем текущие прогресс-бары по ширине окна
  // function getCurrentProgressBars() {
  //     const width = window.innerWidth;
  //     if (width <= 400) {
  //         return mobileProgressBars340;
  //     } else if (width <= 1010) {
  //         return mobileProgressBars;
  //     } else if (width <= 1024) {
  //         return progressBars1024;
  //     } else {
  //         return desktopProgressBars;
  //     }
  // }

  // // Сброс анимации прогресс-бара
  // function resetProgressBars() {
  //     const bars = getCurrentProgressBars();
  //     bars.forEach(bar => {
  //         bar.style.transition = 'none';
  //         bar.style.width = '0%';
  //         void bar.offsetWidth; // принудительный reflow для сброса
  //         bar.style.transition = 'width 3s linear';
  //     });
  // }

  // // Анимация текущего прогресс-бара
  // function animateCurrentProgressBar(index) {
  //     resetProgressBars();
  //     const bars = getCurrentProgressBars();
  //     if (bars[index]) {
  //         bars[index].style.width = '100%';
  //     }
  // }

  // // Смена фона
  // function changeBackground(index) {
  //     const newBg = bgImages[index];

  //     const tempBg = document.createElement('div');
  //     tempBg.classList.add('temp-bg');
  //     tempBg.style.backgroundImage = `url('${newBg}')`;
  //     tempBg.style.opacity = '0';

  //     section.appendChild(tempBg);
  //     void tempBg.offsetHeight; // рефлоу
  //     tempBg.style.opacity = '1';

  //     setTimeout(() => {
  //         section.style.backgroundImage = `url('${newBg}')`;
  //         if (tempBg.parentNode) tempBg.remove();
  //     }, 1000);

  //     pageWrappers.forEach((wrapper, i) => {
  //         wrapper.classList.toggle('active', i === index);
  //     });

  //     animateCurrentProgressBar(index);
  // }

  // // Автоматическое переключение
  // function startAutoChange() {
  //     if (intervalId) clearInterval(intervalId);

  //     animateCurrentProgressBar(currentBgIndex);

  //     intervalId = setInterval(() => {
  //         currentBgIndex = (currentBgIndex + 1) % bgImages.length;
  //         changeBackground(currentBgIndex);
  //     }, 3000);
  // }

  // // Инициализация
  // startAutoChange();

  // // Повторная инициализация прогресс-бара при ресайзе
  // window.addEventListener('resize', () => {
  //     animateCurrentProgressBar(currentBgIndex);
  // });

  // // Обработка кликов на миниатюрах
  // document.querySelectorAll('.title-images a').forEach((link, index) => {
  //     link.addEventListener('click', function (e) {
  //         e.preventDefault();

  //         const bgUrl = this.getAttribute('data-bg');
  //         const foundIndex = bgImages.indexOf(bgUrl);
  //         if (foundIndex !== -1) {
  //             currentBgIndex = foundIndex;
  //             changeBackground(currentBgIndex);
  //             startAutoChange();
  //         }
  //     });
  // });
}

// Скрипты для контента на странице "catalog-page.html"

const categoriesSection = document.querySelector('.categories-section');

if (categoriesSection) {
  // Кнопка фильтровать на телефоне

    // Клик на первую кнопку — переключаем первое меню фильтров
    document.getElementById('filterFirstButtonMobile').addEventListener('click', () => {
        const mainPageContent = document.querySelector('.main-page-content');
        const filterMenu = document.querySelector('.filter-menu');
        const secondMenu = document.querySelector('.filter-second-button-menu');
        const secondButton = document.getElementById('filterSecondButtonMobile');
        const arrowIconMobile = secondButton.querySelector('.arrow-icon-mobile');

        // Закрываем второе меню, если оно открыто
        if (secondMenu.classList.contains('active')) {
            secondMenu.classList.remove('active');
            arrowIconMobile.classList.remove('active');
        }

        filterMenu.classList.toggle('active');    
        
        if (filterMenu.classList.contains('active')) {
            mainPageContent.style.filter = 'blur(5px)';
        } else {
            mainPageContent.style.filter = '';
        }
    });

    // Свайп фильтров на телефоне вниз

    let startY = 0;
    let currentY = 0;
    let isSwiping = false;

    const filterMenu = document.querySelector('.filter-menu');

    filterMenu.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
            isSwiping = true;
        });

    filterMenu.addEventListener('touchmove', (e) => {
        if (!isSwiping) return;

        currentY = e.touches[0].clientY;

        if (currentY - startY > 50 && filterMenu.classList.contains('active')) {
            closeFilterMenu();
            isSwiping = false;
        }
    });

    filterMenu.addEventListener('touchend', () => {
        isSwiping = false;
    });

    document.querySelector('.close-filters').addEventListener('click', () => {
        closeFilterMenu();
    });

    document.addEventListener('click', (e) => {
        const filterMenu = document.querySelector('.filter-menu');
        const firstButton = document.getElementById('filterFirstButtonMobile');

        const secondButton = document.getElementById('filterSecondButtonMobile');
        const secondMenu = secondButton.querySelector('.filter-second-button-menu');

        const isClickInsideFirstMenu = filterMenu.contains(e.target);
        const isClickOnFirstButton = e.target.closest('#filterFirstButtonMobile');
        const isClickOnSecondButtonOrMenu = secondButton.contains(e.target) || secondMenu.contains(e.target);

        if (filterMenu.classList.contains('active') && 
            !isClickInsideFirstMenu && 
            !isClickOnFirstButton && 
            !isClickOnSecondButtonOrMenu) {
            closeFilterMenu();
        }
    });

    function closeFilterMenu() {
        const mainPageContent = document.querySelector('.main-page-content');
        const filterMenu = document.querySelector('.filter-menu');

        filterMenu.classList.remove('active');
        mainPageContent.style.filter = '';
    }

    // Всплывающие меню фильтров на телефоне
    // Клик на вторую кнопку — переключаем второе меню фильтров и закрываем первое меню
    document.addEventListener('DOMContentLoaded', function() {
        const filterButton = document.getElementById('filterSecondButtonMobile');
        const menu = filterButton.querySelector('.filter-second-button-menu');
        const arrowIconMobile = filterButton.querySelector('.arrow-icon-mobile');
        const filterMenu = document.querySelector('.filter-menu');
        const mainPageContent = document.querySelector('.main-page-content');

        filterButton.addEventListener('click', function(event) {
            event.stopPropagation();

            // Закрываем первое меню, если оно открыто
            if (filterMenu.classList.contains('active')) {
                filterMenu.classList.remove('active');
                mainPageContent.style.filter = '';
            }

            const isActive = menu.classList.contains('active');
            menu.classList.toggle('active', !isActive);
            arrowIconMobile.classList.toggle('active', !isActive);
        });

        document.addEventListener('click', function(event) {
            if (!filterButton.contains(event.target)) {
                menu.classList.remove('active');
                arrowIconMobile.classList.remove('active');
            }
        });
    });

    // Свайп категорий

    const swiper = new Swiper('.categories-swiper', {
      slidesPerView: 'auto',
      spaceBetween: 20,
      freeMode: true,
      grabCursor: false,
      navigation: {
        nextEl: '.right-arrow-categories',
        prevEl: '.left-arrow-categories',
      }
    });

    // Выплывающие меню фильтров

    const toggleBtn = document.getElementById('filterToggle');
    const toggleBtn2 = document.getElementById('filterToggle-2');
    const dropdown = document.getElementById('filterDropdown');
    const dropdown2 = document.getElementById('filterDropdown-2');

    // Функция для закрытия всех выпадающих меню
    const closeAllDropdowns = () => {
        dropdown.classList.remove('active');
        dropdown2.classList.remove('active');
    };

    // Открытие/закрытие меню по кнопке
    toggleBtn.addEventListener('click', (event) => {
        event.stopPropagation(); // Останавливаем событие, чтобы не сработал обработчик на document

        const isActive = dropdown.classList.contains('active');

        closeAllDropdowns();

        if (!isActive) {
            dropdown.classList.add('active');
        }
    });

    toggleBtn2.addEventListener('click', (event) => {
        event.stopPropagation();

        const isActive = dropdown2.classList.contains('active');

        closeAllDropdowns();

        if (!isActive) {
            dropdown2.classList.add('active');
        }
    });

    // Закрытие меню при клике вне меню и кнопки
    document.addEventListener('click', (event) => {
        if (
            !dropdown.contains(event.target) &&
            event.target !== toggleBtn &&
            !dropdown2.contains(event.target) &&
            event.target !== toggleBtn2
        ) {
            closeAllDropdowns();
        }
    });
}



// Скрипты для контента на странице "product-page.html"
const productSwiper = new Swiper('.product-swiper', {
  slidesPerView: 'auto',
  spaceBetween: 20,
  loop: false,
  speed: 500,
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
  on: {
    reachEnd: function () {
      // Останавливаем autoplay временно
      this.autoplay.stop();

      // Ждём немного, чтобы пользователь понял, что был конец
      setTimeout(() => {
        this.slideTo(0); // Переход в начало

        // После возвращения — снова запускаем autoplay
        this.autoplay.start();
      }, 1000);
    }
  }
});

// let productSwiper = null;

// function openGallery(index) {
//   const modal = document.getElementById('imageModal');
//   modal.style.display = 'flex';

//   if (!productSwiper) {
//     productSwiper = new Swiper('.modal-product .mySwiper', {
//       centeredSlides: true,
//       slidesPerView: '5',
//       spaceBetween: 30,
//       loop: true,
//       initialSlide: index,
//     });
//   } else {
//     productSwiper.slideToLoop(index, 0);
//   }
// }

// function closeModal() {
//   document.getElementById('imageModal').style.display = 'none';
// }

const addToCardProduct = document.querySelector('.add-to-card-product');

if (addToCardProduct) {
  // Добавление товара в корзину
  const elements = {
    desktop: {
      addBtn: document.getElementById('add-btn'),
      qtyBlock: document.getElementById('qty-block'),
      notifyBlock: document.getElementById('notify-block'),
      minusBtn: document.getElementById('minus-btn'),
      plusBtn: document.getElementById('plus-btn'),
      addToCartBtn: document.querySelector('.add-to-cart'),
    },
    mobile: {
      addBtn: document.getElementById('add-btn-mobile'),
      qtyBlock: document.getElementById('qty-block-mobile'),
      notifyBlock: document.getElementById('notify-block-mobile'),
      minusBtn: document.getElementById('minus-btn-mobile'),
      plusBtn: document.getElementById('plus-btn-mobile'),
      addToCartBtn: document.querySelector('.add-to-cart-mobile'),
    },
  };

  const qtyLabel = document.getElementById('qty-label');
  let quantity = 1;

  function updateQtyLabel() {
    qtyLabel.textContent = quantity;
  }

  function toggleCartState(container) {
    container.addToCartBtn.style.display = container.qtyBlock.classList.contains('active') ? '' : 'none';
    container.qtyBlock.classList.toggle('active');
    container.notifyBlock.classList.toggle('active');
    updateQtyLabel();
  }

  function initContainer(container) {
    container.addBtn.addEventListener('click', () => {
      if (!container.qtyBlock.classList.contains('active')) {
        container.addToCartBtn.style.display = 'none';
        container.qtyBlock.classList.add('active');
        container.notifyBlock.classList.add('active');
        quantity = 1;
        updateQtyLabel();
      }
    });

    container.plusBtn.addEventListener('click', () => {
      quantity++;
      updateQtyLabel();
    });

    container.minusBtn.addEventListener('click', () => {
      if (quantity > 1) {
        quantity--;
        updateQtyLabel();
      } else {
        quantity = 1;
        container.qtyBlock.classList.remove('active');
        container.notifyBlock.classList.remove('active');
        container.addToCartBtn.style.display = '';
        updateQtyLabel();
      }
    });
  }

  initContainer(elements.desktop);
  initContainer(elements.mobile);

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
}

// Скрипты для контента на странице "cart-page.html"

const cart = document.querySelector('.cart');

if (cart) {
  // Увелечение количества товара на кнопки
  // И отображение товара за 1шт

  document.querySelectorAll('.product-item').forEach(product => {
        const minusBtn = product.querySelector('.product-count button:first-of-type');
        const plusBtn = product.querySelector('.product-count button:last-of-type');
        const countEl = product.querySelector('.product-count p');
        const priceContainer = product.querySelector('.product-price-container');

        const updatePriceVisibility = (count) => {
            if (count > 1) {
                priceContainer.classList.add('visible');
            } else {
                priceContainer.classList.remove('visible');
            }
        };

        let count = parseInt(countEl.textContent);

        plusBtn.addEventListener('click', () => {
            count++;
            countEl.textContent = count;
            updatePriceVisibility(count);
        });

        minusBtn.addEventListener('click', () => {
            if (count > 1) {
                count--;
                countEl.textContent = count;
                updatePriceVisibility(count);
            }
        });

        updatePriceVisibility(count);
    });
}

// Скрипты для контента на странице "order-page.html"

const buyProducts = document.querySelector('.buy-products');

if (buyProducts) {
  // Валидация формы "Оформления заказа"

  function initFormValidation(form, successUrl, errorUrl) {
      form.addEventListener('submit', function(e) {
          e.preventDefault();
          let hasError = false;

          // Сброс ошибок внутри формы
          const errorMessages = form.querySelectorAll('.error-contact');
          errorMessages.forEach(el => {
              el.textContent = '';
              el.style.display = 'none';
          });

          // Валидация имени
          const nameInput = form.querySelector('input[name="name"]');
          if (nameInput && nameInput.value.trim() === '') {
              const error = nameInput.closest('.order-input').querySelector('.error-contact');
              error.textContent = 'Введите имя';
              error.style.display = 'block';
              hasError = true;
          }

          // Валидация телефона
          const phoneInput = form.querySelector('input[name="phone"]');
          if (phoneInput && phoneInput.value.trim() === '') {
              const error = phoneInput.closest('.order-input').querySelector('.error-contact');
              error.textContent = 'Введите телефон';
              error.style.display = 'block';
              hasError = true;
          }

          // Валидация комментария
          const commentTextarea = form.querySelector('textarea');
          if (commentTextarea && commentTextarea.value.trim() === '') {
              let error = commentTextarea.nextElementSibling;
              if (!error || !error.classList.contains('error-contact')) {
                  error = document.createElement('span');
                  error.className = 'error-contact';
                  commentTextarea.insertAdjacentElement('afterend', error);
              }
              error.textContent = 'Введите комментарий';
              error.style.display = 'block';
              hasError = true;
          }

          // Валидация чекбокса
          const checkbox = form.querySelector('input[name="accept"]');
          if (checkbox && !checkbox.checked) {
              const error = form.querySelector('.accept-politics-order .error-contact');
              error.textContent = 'Необходимо согласиться с политикой';
              error.style.display = 'block';
              error.style.marginBottom = '20px';
              hasError = true;
          }

          // Обработка результата
          if (!hasError) {
              window.open(successUrl, '_blank');
              form.reset();
          } else {
              window.open(errorUrl, '_blank');
          }
      });
  }

  // Применяем валидацию только к 3 формам (1920, 1024, 340)
  ['order-form-1', 'order-form-2', 'order-form-3'].forEach(formId => {
      const form = document.getElementById(formId);
      if (form) {
          initFormValidation(
              form,
              'thanks-for-the-order-page.html',
              'order-mistake-page.html'
          );
      }
  });


  // Раскрытие и скрытие меню товаров при оформлении заказа на мобильном устройстве
  document.addEventListener('DOMContentLoaded', function() {
      const toggles = document.querySelectorAll('.right-side-items-600');

      toggles.forEach(function(header) {
          header.addEventListener('click', function() {
              const content = header.nextElementSibling;
              
              if (!content || !content.classList.contains('order-items-600')) {
                  return;
              }

              const isOpen = content.style.maxHeight && content.style.maxHeight !== '0px';

              if (!isOpen) {
                  const fullHeight = content.scrollHeight + 'px';
                  content.style.maxHeight = fullHeight;
                  header.classList.add('open');
              } else {
                  content.style.maxHeight = '0';
                  header.classList.remove('open');
              }
          });
      });
  });
}


// Скрипты для контента на странице "projects-page.html"

if (projectsSection) {
  // Переключение по навигации 

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  const HEADER_OFFSET = 250;  // учитываем высоту шапки
  let isScrollingProgrammatically = false;
  let isInitialHashScroll = false;

  function adjustHashScroll() {
    const hash = window.location.hash;
    if (!hash) return;
    const target = document.querySelector(hash);
    if (!target) return;

    const top = target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
    window.scrollTo({ top, behavior: 'auto' });
  }

  window.addEventListener('DOMContentLoaded', () => {
    if (window.location.hash) {
      isInitialHashScroll = true;
      // сначала даём браузеру открутить на элемент...
      setTimeout(() => {
        // ...а потом подвинем ровно на HEADER_OFFSET
        adjustHashScroll();
        isInitialHashScroll = false;
      }, 0);
    }
  });

  window.addEventListener('hashchange', () => {
    setTimeout(adjustHashScroll, 0);
  });

  // клики по кнопкам навигации
  document.querySelectorAll('.projects-nav button').forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-target');
      if (!targetId) return;

      const section = button.closest('.projects-section');
      if (!section) return;

      const candidates = section.querySelectorAll(targetId);
      if (!candidates.length) return;

      const targetEl = Array.from(candidates)
        .find(el => getComputedStyle(el).display !== 'none') || candidates[0];

      const topPosition = targetEl.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;

      isScrollingProgrammatically = true;
      header.classList.add('header-hidden');
      header.classList.remove('header-scrolled-up');
      stickyNavs.forEach(nav => nav.classList.remove('hidden'));

      window.scrollTo({ top: topPosition, behavior: 'smooth' });

      setTimeout(() => {
        // ставим hash после анимации
        window.history.pushState(null, '', targetId);
        isScrollingProgrammatically = false;
      }, 600);
    });
  });
}

// Скрипты для контента на странице "project-info-page.html"

const gallerySwiper = document.querySelector('.project-gallery-swiper');

  if (gallerySwiper) {
    // Переключение карточек "Галерея проекта"
    let swiper;

    function initSwiper() {
      const isMobile = window.matchMedia('(max-width: 830px)').matches;

      if (swiper) swiper.destroy(true, true); // удаляем старый instance

      swiper = new Swiper('.project-gallery-swiper', {
        slidesPerView: 'auto',
        centeredSlides: !isMobile, // если не мобильный — центрируем
        spaceBetween: 20,
        grabCursor: false,
        loop: true,
        speed: 800,
        initialSlide: 1,
        navigation: {
          nextEl: '.right-arrow',
          prevEl: '.left-arrow',
        },
      });
    }

    // Инициализация
    initSwiper();

    // Обновляем при изменении размера окна
    window.addEventListener('resize', () => {
      initSwiper();
    });
}




