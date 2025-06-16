/* Прелоадер — фоновый экран */

window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  preloader.classList.add("hidden");
});

// Общие скрипты для всех страниц (снизу будут под отдельные страницы)
const bodyCont = document.querySelector('body');

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


function performMainSearch() {
    const query = document.getElementById('search-input').value.trim();
    if (query) {
        window.location.href = 'search-result-page.html?query=' + encodeURIComponent(query);
    }
}

document.getElementById('search-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        performMainSearch();
    }
});

document.querySelector('.search-icon-button').addEventListener('click', function() {
    performMainSearch();
});

const query = document.getElementById('search-input-on-page')

if (query) {
  function performOnPageSearch() {

      if (query) {
          window.location.href = 'search-result-page.html?query=' + encodeURIComponent(query);
      }
  }

  document.getElementById('search-input-on-page').addEventListener('keypress', function(event) {
      if (event.key === 'Enter') {
          performOnPageSearch();
      }
  });

  document.querySelector('.search-icon-on-page').addEventListener('click', function() {
      performOnPageSearch();
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

            disableClick = true;

            resetHeaderState();

            setTimeout(() => {
                disableClick = false;
            }, 100);
        } else if (disableClick) {
            event.preventDefault();
            event.stopPropagation();
        }
    }, true); 
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
            resetHeaderState();
        }
    }, true); 
});

document.querySelectorAll('button, a').forEach(el => {
    el.addEventListener('click', (event) => {
        if (disableClick) {
            event.preventDefault();
            event.stopPropagation();
            return false;
        }
    }, true);
});

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

        if (searchInput.value.trim() !== '') {
            searchInput.value = '';
            deactivateSearchMode();
        }

        if (openCatalog.parentElement.classList.contains('active')) {
            openCatalog.parentElement.classList.remove('active');
            isCatalogActive = false;

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

        toggleItem.classList.toggle('open');

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

const contactModalWrapper = document.getElementById('get-contact-modal');
const thanksModalWrapper = document.getElementById('thanks-modal');
const errorModalWrapper = document.getElementById('error-modal');
const container = document.querySelector('.container'); // блюр-контейнер

if (contactModalWrapper && thanksModalWrapper && errorModalWrapper) {
  Promise.all([
    fetch('modals/get-contact.html').then(res => res.text()),
    fetch('modals/thanks-modal.html').then(res => res.text()),
    fetch('modals/error-modal.html').then(res => res.text())
  ]).then(([contactHTML, thanksHTML, errorHTML]) => {
    // Вставка HTML
    contactModalWrapper.innerHTML = contactHTML;
    thanksModalWrapper.innerHTML = thanksHTML;
    errorModalWrapper.innerHTML = errorHTML;

    const contactModal = document.getElementById('contactModal');
    const thanksModal = document.getElementById('thanksModal');
    const errorModal = document.getElementById('errorModal');

    const openBtns = [
      document.getElementById('openModalBtn'),
      document.getElementById('burger-get-request'),
      document.getElementById('sign-up-showroom')
    ];

    const closeBtns = [
      document.getElementById('closeModalBtn'),
      document.getElementById('closeModalBtnThanks'),
      document.getElementById('closeModalBtnError')
    ];

    // Открытие модалки
    function openModal(modal) {
      if (!modal) return;
      modal.style.display = 'flex';
      container.style.filter = 'blur(5px)';
      setTimeout(() => modal.classList.add('open'), 10);
      document.documentElement.classList.add('no-scroll');
    }

    // Закрытие модалки
    function closeModal(modal) {
      if (!modal) return;
      modal.classList.remove('open');
      setTimeout(() => {
        modal.style.display = 'none';
        const modals = [contactModal, thanksModal, errorModal];
        const anyOpen = modals.some(m => m && m !== modal && m.style.display === 'flex');
        if (!anyOpen) container.style.filter = 'none';
        document.documentElement.classList.remove('no-scroll');
      }, 500);
    }

    openBtns.forEach(btn => {
      if (btn) btn.addEventListener('click', () => openModal(contactModal));
    });

    closeBtns.forEach(btn => {
      if (!btn) return;
      btn.addEventListener('click', () => {
        if (btn.id === 'closeModalBtn') closeModal(contactModal);
        else if (btn.id === 'closeModalBtnThanks') closeModal(thanksModal);
        else if (btn.id === 'closeModalBtnError') closeModal(errorModal);
      });
    });

    [contactModal, thanksModal, errorModal].forEach(modal => {
      if (!modal) return;
      modal.addEventListener('click', e => {
        if (e.target === modal) closeModal(modal);
      });
    });

    window.onSubmitForm = function (event) {
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
    };

    function formReset(form) {
      form.reset();

      const errorElements = form.querySelectorAll('.error-contact');
      errorElements.forEach(error => (error.style.display = 'none'));

      // Сброс кастомного select-а
      const contactSelect = form.querySelector("#contactSelect");
      const selectedOption = contactSelect.querySelector(".selected-option");
      const hiddenInput = form.querySelector("#contactMethodInput");

      selectedOption.textContent = "КАК УДОБНЕЕ СВЯЗАТЬСЯ";
      hiddenInput.value = "";
    }

    function validateFormModal(form) {
      let valid = true;

      const errorElements = form.querySelectorAll('.error-contact');
      errorElements.forEach(error => (error.style.display = 'none'));

      const nameInput = form.querySelector('input[name="name"]');
      const phoneInput = form.querySelector('input[name="phone"]');
      const contactMethodInput = form.querySelector('input[name="contact_method"]');
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

      if (!contactMethodInput.value.trim()) {
        errorElements[2].textContent = 'Пожалуйста, выберите способ связи.';
        errorElements[2].style.display = 'block';
        valid = false;
      }

      if (!acceptInput.checked) {
        errorElements[3].textContent = 'Вы должны согласиться с политикой конфиденциальности.';
        errorElements[3].style.display = 'block';
        valid = false;
      }

      return valid;
    }

    // Выборка "Как удобнее связаться"

    const select = document.getElementById("contactSelect");
    const header = select.querySelector(".select-header");
    const options = select.querySelectorAll(".select-options li");
    const selected = select.querySelector(".selected-option");
    const hiddenInput = document.getElementById("contactMethodInput");

    header.addEventListener("click", () => {
      select.classList.toggle("open");
    });

    options.forEach(option => {
      option.addEventListener("click", () => {
        selected.textContent = option.textContent;
        hiddenInput.value = option.dataset.value;
        select.classList.remove("open");
      });
    });

    // Закрытие при клике вне блока
    document.addEventListener("click", (e) => {
      if (!select.contains(e.target)) {
        select.classList.remove("open");
      }
    });
  });
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

const hasHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

const menuContainer = document.querySelector('.menu-container');
let hideTimeout;

// Закрытие всей панели каталога при уходе курсора
header.addEventListener('mouseenter', (e) => {
  const isOverCatalogButton = e.target.closest('.open-catalog');

  if (!isOverCatalogButton && openCatalog.parentElement.classList.contains('active')) {
    toggleCatalogMenu();

    document.querySelectorAll('.submenu').forEach(sm => sm.classList.remove('open'));
    document.querySelectorAll('.menu-toggle').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.submenu-item').forEach(item => item.classList.remove('active'));
    document.querySelectorAll('.right-menu-content').forEach(content => {
      content.style.display = 'none';
    });

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

document.querySelectorAll('.right-menu-content').forEach(menu => {
  menu.addEventListener('mouseenter', () => clearTimeout(hideTimeout));
});

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
      e.preventDefault();
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

    document.documentElement.classList.add('no-scroll');

    mainContent.classList.add('hidden');
}

function closeMenu() {
  document.documentElement.classList.remove('no-scroll');  
  
  burgerMenuContent.classList.remove('open');

    setTimeout(() => {
        mainContent.classList.remove('hidden');
    }, 250);
}

function onTransitionEnd(event) {
    if (event.propertyName === 'transform' || event.propertyName === 'opacity') {
        mainContent.classList.remove('hidden');
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
const burgerUnderSearch = document.querySelector('.burger-under-search-hide');

searchItemsBurger.classList.add('hidden');

inputBurger.addEventListener('input', () => {
  if (inputBurger.value.length > 0) {
    searchItemsBurger.classList.remove('hidden');
    burgerUnderSearch.classList.add('hidden');
  } else {
    searchItemsBurger.classList.add('hidden');
    burgerUnderSearch.classList.remove('hidden');
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
  const raw = window.pageYOffset || document.documentElement.scrollTop;

  // 1) фильтруем резиновый overscroll iOS
  // 2) фильтруем «мгновенный» перескок из отрицательного в 0
  if (raw < 0 || (raw === 0 && lastScrollTop > header.offsetHeight)) {
    return; 
  }

  const scrollTop = raw;  // уже всегда ≥ 0
  const scrollDelta = scrollTop - lastScrollTop;

  const headerHeight = header.offsetHeight;


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

    resetHeaderState();
  }

  lastScrollTop = scrollTop;
}

window.addEventListener('scroll', () => {
  window.requestAnimationFrame(handleScroll);
}, { passive: true });


function handleScrollDown() {
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
        errorSpans[2].textContent = 'Пожалуйста, выберите способ связи.';
        errorSpans[2].style.display = 'block';
        valid = false;
      }
    }

    if (questionInput) {
      if (questionInput && !questionInput.value.trim()) {
        errorSpans[3].textContent = 'Пожалуйста, введите ваш вопрос.';
        errorSpans[3].style.display = 'block';
        valid = false;
      }
    }

    if (desiredPositionInput && !desiredPositionInput.value.trim()) {
        errorSpans[2].textContent = 'Пожалуйста, введите желаемую должность.';
        errorSpans[2].style.display = 'block';
        valid = false;
    }

    if (!questionInput) {
      if (!acceptInput.checked) {
        errorSpans[3].textContent = 'Вы должны согласиться с политикой конфиденциальности.';
        errorSpans[3].style.display = 'block';
        valid = false;
      }
    }

    if (questionInput) {
      if (!acceptInput.checked) {
        errorSpans[4].textContent = 'Вы должны согласиться с политикой конфиденциальности.';
        errorSpans[4].style.display = 'block';
        valid = false;
      }
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
    const labelTextSpan = document.querySelector('#resume-label-text');
    const labelIcon = document.querySelector('.resume-icon');
    const removeFileBtn = document.querySelector('.remove-file-btn');

    input.addEventListener('change', () => {
        labelTextSpan.style.color = '';

        if (input.files.length > 0) {
            // Проверка формата файла
            const file = input.files[0];
            const acceptedFormats = ['.pdf', '.jpg', '.jpeg', '.doc', '.docx', '.png'];
            let isAcceptedFormat = false;

            for (let format of acceptedFormats) {
                if (file.name.endsWith(format)) {
                    isAcceptedFormat = true;
                    break;
                }
            }

            if (isAcceptedFormat) {
                let fileName = file.name;
                if (fileName.length > 10) {
                    fileName = fileName.substring(0, 10) + file.name.substring(fileName.length - 4);
                }
                labelTextSpan.textContent = fileName;
                labelIcon.src = 'images/svg/file.svg';
                removeFileBtn.style.display = 'block';
            } else {
                labelTextSpan.textContent = 'Некорректный формат. Загрузите еще раз';
                labelTextSpan.style.color = '#EB5151';
                labelIcon.src = 'images/svg/upload-file.svg';
                removeFileBtn.style.display = 'none';
            }
        } else {
            labelTextSpan.textContent = 'Прикрепите ваше резюме в формате PDF, JPG или DOC';
            labelIcon.src = 'images/svg/upload-file.svg';
            removeFileBtn.style.display = 'none';
        }
    });

    removeFileBtn.addEventListener('click', () => {
        input.value = '';
        labelTextSpan.textContent = 'Прикрепите ваше резюме в формате PDF, JPG или DOC';
        labelIcon.src = 'images/svg/upload-file.svg';
        removeFileBtn.style.display = 'none';
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
          loop: false,
          initialSlide: 2,
          centeredSlides: !isSmallScreen,

          navigation: {
            nextEl: '.popular-right-arrow',
            prevEl: '.popular-left-arrow',
          },
        });
      }
    }

    initSwiper();

    window.addEventListener('resize', () => {
      initSwiper();
    });
  }

  // Переключение карточек "Наши бренды" мобильная версия

  const ourBrands = document.querySelector('.our-brands');

  if (ourBrands) {
    const swiper = new Swiper('.our-brands-swiper', {
      slidesPerView: 4,
      spaceBetween: 20,
      slidesPerGroup: 1,
      speed: 800,
      grabCursor: false,
      effect: 'slide',
      loop: true,
      centeredSlides: false,

      breakpoints: {
        0: {
          slidesPerView: 'auto',
          spaceBetween: 10,
        },
        769: {
          slidesPerView: 'auto',
          spaceBetween: 20, 
        },
        1001: {
          slidesPerView: 4,
          spaceBetween: 20,
        },
      },
    });
  }

  // Переключение карточек "Популярные категории" мобильная версия

  const popularCategoriesContentMobile = document.querySelector('.popular-categories-content-mobile');

  if (popularCategoriesContentMobile) {
    const swiper = new Swiper('.popular-categories-swiper', {
        slidesPerView: 'auto',
        spaceBetween: 10,
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

  // Расркытие менюшек навигации на страницах

  const customersNavigation = document.querySelector('.customers-navigation');

    if (customersNavigation) {
      document.addEventListener("DOMContentLoaded", function () {
        const navBlocks = document.querySelectorAll(".customers-navigation");
        const HEADER_OFFSET = 160; 

        navBlocks.forEach(nav => {
            const button = nav.querySelector(".open-button");
            const section = nav.querySelector(".customers-section");

            function toggleCurrentMenu(event) {
                event.stopPropagation();

                const wasActive = section.classList.contains("active");

                // Закрывает все меню
                document.querySelectorAll(".customers-section.active").forEach(activeSection => {
                    activeSection.classList.remove("active");
                });

                // Если секция была неактивной — открыть и проскроллить
                if (!wasActive) {
                    section.classList.add("active");

                    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
                    const scrollTo = sectionTop - HEADER_OFFSET;

                    window.scrollTo({
                        top: scrollTo,
                        behavior: "smooth"
                    });
                }
            }

            nav.addEventListener("click", toggleCurrentMenu);
            if (button) button.addEventListener("click", toggleCurrentMenu);
        });
      }); 
    }  

  // Скрипты для контента на странице "reviews-page.html"

  const reviewsPageSection = document.querySelector('.reviews-section');

  if (reviewsPageSection) {
    // Раскрытие отзывов на кнопку "Больше"
    const moreButton = document.getElementById('more-button');
    const reviewContainers = document.querySelectorAll('.more-reviews');
          
    let currentIndex = 0;
          
    function showNextReviewContainer() {
        if (currentIndex < reviewContainers.length) {
            const block = reviewContainers[currentIndex];
          
            block.classList.add('show');
            block.style.maxHeight = block.scrollHeight + 'px';
            block.style.opacity = '1';
          
            currentIndex++;
            }
          
        if (currentIndex >= reviewContainers.length) {
            const moreContainer = document.querySelector('.more');
                
            moreButton.style.display = 'none';
            moreContainer.style.display = 'none';
        }
    }
          
    moreButton.addEventListener('click', showNextReviewContainer);
  }

  // Скрипты для контента на странице "customers-page.html"

  // Раскрытие текст "О товаре" побольше
  const readMoreLink = document.querySelector('.read-more-link-product');

  if (readMoreLink) {
    readMoreLink.addEventListener('click', function (e) {
      e.preventDefault();

      const moreText = document.querySelector('.more-text');
      const dots = document.querySelector('.dots');
      const arrowIcon = this.querySelector('.arrow-icon');

      if (moreText.style.display === "none") {
        moreText.style.display = "inline";
        dots.style.display = "none";
        this.childNodes[0].textContent = "скрыть ";
        arrowIcon.classList.add("rotated");
      } else {
        moreText.style.display = "none";
        dots.style.display = "inline";
        this.childNodes[0].textContent = "открыть весь ";
        arrowIcon.classList.remove("rotated");
      }
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

  // Открытие отзыва побольше в модальном окне

    const reviewModalContainer = document.getElementById('review-modal-container');

    if (reviewModalContainer || reviewsPageSection) {
      fetch("modals/review-modal.html")
      .then(response => response.text())
      .then(html => {
        document.getElementById("review-modal-container").innerHTML = html;

        // После загрузки HTML
        const modal = document.getElementById("modal-review");
        const openLinks = document.querySelectorAll(".read-more-link");
        const closeBtn = document.querySelector(".modal-close");
        const container = document.querySelector(".container");

        openLinks.forEach(link => {
          link.addEventListener("click", (e) => {
            e.preventDefault();
            container.style.filter = "blur(5px)";
            document.documentElement.classList.add("no-scroll");
            document.body.classList.add("no-scroll");
            modal.classList.remove("closing");
            modal.classList.add("open");
          });
        });

        function closeModalReview() {
          modal.classList.remove("open");
          modal.classList.add("closing");
          setTimeout(() => {
            modal.classList.remove("closing");
            container.style.filter = "none";
            document.documentElement.classList.remove("no-scroll");
            document.body.classList.remove("no-scroll");
          }, 500);
        }

        closeBtn.addEventListener("click", closeModalReview);
        window.addEventListener("click", (e) => {
          if (e.target === modal) {
            closeModalReview();
          }
        });
      });

      // Скрытие кнопки "читать весь" у отзыва если строк меньше 7

      document.querySelectorAll('.review-card').forEach(card => {
          const textEl = card.querySelector('.review-text');
          const btn    = card.querySelector('.read-more-link');
          if (!textEl || !btn) return;

          const style      = window.getComputedStyle(textEl);
          let lineHeight   = parseFloat(style.lineHeight);
          
          if (isNaN(lineHeight)) {
            lineHeight = parseFloat(style.fontSize) * 1.2;
          }


          const totalHeight = textEl.scrollHeight;

          const linesCount  = Math.round(totalHeight / lineHeight);

          // если строк меньше 8 — скрываем кнопку
          if (linesCount < 8) {
            btn.style.display = 'none';
          }
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

// Уведомления

// Уведомление об удалении товара
const notificationContainer = document.getElementById('notification-container');

if (notificationContainer) {
  fetch('modals/notification-delete-product.html')
    .then(response => {
      if (!response.ok) {
        throw new Error('Не удалось загрузить notification.html');
      }
      return response.text();
    })
    .then(html => {
      notificationContainer.innerHTML = html;

      const notification = document.getElementById('notification');

      setupDeleteModal(notification);
    })
    .catch(error => {
      console.error('Ошибка при загрузке уведомления:', error);
    });


// Уведомление и модалка очистки корзины
Promise.all([
  fetch('modals/clear-cart.html').then(res => res.text()),
  fetch('modals/notification-clear-cart.html').then(res => res.text())
]).then(([clearModalHTML, clearNotificationHTML]) => {
  const clearModalContainer = document.getElementById('modal-clear-container');
  const clearNotificationContainer = document.getElementById('notification-clear-container');

  clearModalContainer.innerHTML = clearModalHTML;
  clearNotificationContainer.innerHTML = clearNotificationHTML;

  const clearCartModal = document.getElementById('clearCartModal');
  const clearCartNotification = document.getElementById('notification-clear-cart');
  const container = document.querySelector('.container'); 

  const openClearModalBtns = document.querySelectorAll('.clear-cart-button');
  const confirmClearBtn = clearCartModal.querySelector('.confirm-clear-cart');
  const cancelClearBtn = clearCartModal.querySelector('.cancel-clear-cart');

  function openClearModal() {
    clearCartModal.classList.add('show');
    container.style.filter = 'blur(5px)';
    document.documentElement.classList.add('no-scroll');
  }

  function closeClearModal() {
    clearCartModal.classList.remove('show');
    container.style.filter = 'none';
    document.documentElement.classList.remove('no-scroll');
  }

  openClearModalBtns.forEach(btn => {
    btn.addEventListener('click', openClearModal);
  });

  cancelClearBtn.addEventListener('click', closeClearModal);

  clearCartModal.addEventListener('click', (e) => {
    if (e.target === clearCartModal) closeClearModal();
  });

  confirmClearBtn.addEventListener('click', () => {
    clearCartNotification.classList.remove('hidden');

    setTimeout(() => {
      clearCartNotification.classList.add('hidden');
    }, 3000);

    closeClearModal();
  });
});
  }

function setupDeleteModal(notification) {
  const modalContainer = document.getElementById("modal-container");  

  if (modalContainer) {
    fetch('modals/delete-product.html')
      .then(response => response.text())
      .then(html => {
        document.body.insertAdjacentHTML('beforeend', html);

        const modal = document.getElementById('deleteModal');
        const openButtons = document.querySelectorAll('.open-modal-btn');
        const stopButton = modal.querySelector('.stop-button');
        const closeBtn = modal.querySelector('.close-modal-delete');
        const deleteButton = modal.querySelector('.delete-button');

        function openModal() {
          modal.classList.add('show');
          container.style.filter = 'blur(5px)';
          document.documentElement.classList.add('no-scroll');
        }

        function closeModal() {
          modal.classList.remove('show');
          container.style.filter = 'none';
          document.documentElement.classList.remove('no-scroll');
        }

        // Открытие модалки
        openButtons.forEach(btn => {
          btn.addEventListener('click', openModal);
        });

        // Кнопка "Оставить" — закрыть модалку
        stopButton.addEventListener('click', closeModal);

        // Клик по фону — закрыть модалку
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            closeModal();
          }
        });

        // Крестик — закрыть модалку
        if (closeBtn) {
          closeBtn.addEventListener('click', closeModal);
        }

        deleteButton.addEventListener('click', () => {
          notification.classList.remove('hidden');
          
          setTimeout(() => {
            notification.classList.add('hidden');
          }, 3000);

          // Закрыть модалку
          closeModal();
        });
      });
  }
}

// Скрипты для контента на странице "main-page.html"

const heroContent1 = document.querySelector('.hero-content-1');

if (heroContent1) {
  
// Переключение изображений каждые 3 секунды (десктоп + мобилка)
document.addEventListener('DOMContentLoaded', () => {
  // Десктопные элементы:
  const images       = document.querySelectorAll('.hero-bg');
  const contents     = document.querySelectorAll('.hero-content');
  const allProgress  = document.querySelectorAll('.hero-content .progress-bar');
  const deskButtons  = document.querySelectorAll('.hero-content .hero-right-side button');

  // Мобильные элементы:
  const mobContents      = [
    document.querySelector('.hero-content-mobile-1'),
    document.querySelector('.hero-content-mobile-2'),
    document.querySelector('.hero-content-mobile-3')
  ];
  // Получим все мобильные кнопки сразу – querySelectorAll даёт коллекцию из 9 кнопок, 
  // но далее мы будем опираться на data-index каждого:
  const mobThumbButtons  = document.querySelectorAll('.hero-content-mobile .mobile-thumb');
  const allMobProgress   = document.querySelectorAll('.hero-content-mobile .progress-bar-mobile');

  const slideCount       = images.length; // Должно быть 3
  const SWITCH_INTERVAL  = 3000;          // 3 секунды
  let current = 0;
  let intervalId = null;

  // Условие подмены первого фона, если экран <= 1030px
  if (window.innerWidth <= 1030 && images[0]) {
    images[0].src = 'images/main-page/bg-1030.webp';
  }

  /*** ФУНКЦИЯ: сброс всех прогресс-баров (десктопные + мобильные) ***/
  function resetAllProgressBars() {
    // Десктоп
    allProgress.forEach(pb => {
      pb.classList.remove('fill');
      pb.style.transition = 'none';
      pb.style.width = '0';
    });
    // Мобилка
    allMobProgress.forEach(pb => {
      pb.classList.remove('fill');
      pb.style.transition = 'none';
      pb.style.width = '0';
    });
  }

  /*** ФУНКЦИЯ: запускаем прогресс-бар у десктопной кнопки с индексом idx ***/
  function startProgressBarDesktop(idx) {
    resetAllProgressBars(); // сбрасываем прежде чем запустить любую
    const activeContent = contents[idx];
    const btn = activeContent.querySelector(`button[data-index="${idx}"]`);
    const bar = btn ? btn.querySelector('.progress-bar') : null;
    if (bar) {
      requestAnimationFrame(() => {
        bar.style.transition = `width ${SWITCH_INTERVAL / 1000}s linear`;
        bar.classList.add('fill');
      });
    }
  }

  /*** ФУНКЦИЯ: запускаем прогресс-бар у мобильной кнопки с индексом idx ***/
  function startProgressBarMobile(idx) {
    // Снова сбросили все (чтобы десктоп и мобилка синхронизировались).
    const wantedBtns = Array.from(mobThumbButtons).filter(b => {
      return Number(b.getAttribute('data-index')) === idx;
    });
    if (wantedBtns.length === 0) return;
    const parentMobile = mobContents[idx];
    const btn = parentMobile.querySelector(`button[data-index="${idx}"]`);
    const bar = btn ? btn.querySelector('.progress-bar-mobile') : null;
    if (bar) {
      requestAnimationFrame(() => {
        bar.style.transition = `width ${SWITCH_INTERVAL / 1000}s linear`;
        bar.classList.add('fill');
      });
    }
  }

  /*** ФУНКЦИЯ: показываем десктопный слайд ***/
  function showSlideDesktop(i) {
      images[current].classList.remove('active');
      contents[current].classList.remove('active');
      images[i].classList.add('active');
      contents[i].classList.add('active');
    }

    /*** ФУНКЦИЯ: показываем мобильный слайд ***/
    function showSlideMobile(i) {
    mobContents[current].classList.remove('active');
    mobContents[i].classList.add('active');

    if (window.innerWidth <= 1000) {
      const parentMobile = mobContents[i];
      const thumbContainer = parentMobile.querySelector('.mobile-miniatures');
      if (!thumbContainer) return;

      const btn = thumbContainer.querySelector(`button[data-index="${i}"]`);
      if (!btn) return;

      if (i === 0) {
        thumbContainer.scrollTop = 0;
      } else {
        const offsetTopRelative = btn.offsetTop;
        const maxScroll = thumbContainer.scrollHeight - thumbContainer.clientHeight;
        const targetScroll = Math.min(offsetTopRelative, maxScroll);

        thumbContainer.scrollTo({
          top: targetScroll,
          behavior: 'auto'
        });
      }
    }
  }

  /*** ФУНКЦИЯ: переключение на слайд (десктоп + мобилка) ***/
  function showSlide(i) {
    if (i === current) return;
    // Скрываем предыдущий десктоп
    showSlideDesktop(i);
    // Скрываем предыдущий мобильный
    showSlideMobile(i);
    current = i;
  }

  /*** ФУНКЦИЯ: следующий слайд по кругу ***/
  function nextSlide() {
    const next = (current + 1) % slideCount;
    showSlide(next);
    // Запускаем прогресс-бары у десктопа и мобилки
    startProgressBarDesktop(next);
    startProgressBarMobile(next);
  }

  /*** ФУНКЦИЯ: запускаем автопрокрутку ***/
  function startAutoSwitch() {
    if (intervalId) {
      clearInterval(intervalId);
    }

    startProgressBarDesktop(current);
    startProgressBarMobile(current);

    intervalId = setInterval(nextSlide, SWITCH_INTERVAL);
  }

  /*** ОБРАБОТЧИКИ КЛИКА НА ДЕСКТОПНЫЕ КНОПКИ ***/
  deskButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-index'), 10);
      if (!isNaN(idx) && idx !== current) {
        showSlide(idx);
        startProgressBarDesktop(idx);
        startProgressBarMobile(idx);
        startAutoSwitch();
      }
    });
  });

  /*** ОБРАБОТЧИКИ КЛИКА НА МОБИЛЬНЫЕ КНОПКИ ***/
  mobThumbButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-index'), 10);
      if (!isNaN(idx) && idx !== current) {
        showSlide(idx);
        startProgressBarDesktop(idx);
        startProgressBarMobile(idx);
        startAutoSwitch();
      }
    });
  });

  // Инициируем: показываем первый слайд и запускаем автопрокрутку
  showSlideDesktop(0);
  showSlideMobile(0);
  startAutoSwitch();
  });
}

const pageWrapper3 = document.querySelector('.page-wrapper-3');

// Скрипты для контента на странице "catalog-page.html"

const categoriesSection = document.querySelector('.categories-section');

if (categoriesSection) {
  const body = document.body;
  let scrollPosition = 0;

  // Функции для открытия/закрытия меню фильтров 
  const backdrop = document.querySelector('.filter-backdrop');
  const filterMenu = document.querySelector('.filter-menu');

  function openFilterMenu() {
    scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    body.style.overflow = 'hidden'; // добавлено

    backdrop.classList.add('active');
    backdrop.style.overflow = 'hidden'; // добавлено #2
    filterMenu.classList.add('active');
    document.querySelector('.main-page-content').style.filter = 'blur(5px)';
  }

  function closeFilterMenu() {
    filterMenu.classList.remove('active');
    backdrop.classList.remove('active');
    backdrop.style.overflow = ''; // сброс
    document.querySelector('.main-page-content').style.filter = '';

    body.style.position = '';
    body.style.top = '';
    body.style.width = '';
    body.style.overflow = ''; // сброс #2

    window.scrollTo(0, scrollPosition);
  }

  // Открытие/закрытие кнопкой
  document.getElementById('filterFirstButtonMobile')
    .addEventListener('click', () => {
      if (!filterMenu.classList.contains('active')) openFilterMenu();
      else closeFilterMenu();
    });

  // Клик по кресту
  document.querySelector('.close-filters')
    .addEventListener('click', closeFilterMenu);

  // Клик на фон — закрываем и не даём дальше
  backdrop.addEventListener('click', e => {
    e.stopPropagation();
    closeFilterMenu();
  });

  // Всплывающие меню второго уровня (второй фильтр)
  document.addEventListener('DOMContentLoaded', () => {
    const filterButton = document.getElementById('filterSecondButtonMobile');
    const menu = filterButton.querySelector('.filter-second-button-menu');
    const arrowIconMobile = filterButton.querySelector('.arrow-icon-mobile');
    const filterMenu = document.querySelector('.filter-menu');
    const mainPageContent = document.querySelector('.main-page-content');

    filterButton.addEventListener('click', (event) => {
      event.stopPropagation();

      // Если первое меню открыто, закрываем его
      if (filterMenu.classList.contains('active')) {
        filterMenu.classList.remove('active');
        mainPageContent.style.filter = '';
        body.style.position = '';
        body.style.top = '';
        body.style.left = '';
        body.style.right = '';
        body.style.width = '';
        window.scrollTo(0, scrollPosition);
      }

      const isActive = menu.classList.contains('active');
      menu.classList.toggle('active', !isActive);
      arrowIconMobile.classList.toggle('active', !isActive);
    });

    document.addEventListener('click', (event) => {
      if (!filterButton.contains(event.target)) {
        menu.classList.remove('active');
        arrowIconMobile.classList.remove('active');
      }
    });
  });

  // Инициализация свайпера для категорий

  const swiper = new Swiper('.categories-swiper', {
    slidesPerView: 'auto',
    spaceBetween: 30,
    freeMode: true,
    grabCursor: false,
    navigation: {
      nextEl: '.right-arrow-categories',
      prevEl: '.left-arrow-categories',
    },

    breakpoints: {
      0:   { spaceBetween: 10 },  // < 435px

      435: { spaceBetween: 20 },  // ≥ 435px и < 635px

      635: { spaceBetween: 30 },  // ≥ 635px (включая 1920+)
    }
  });

  // Выплывающие меню фильтров в шапке
  const toggleBtn = document.getElementById('filterToggle');
  const toggleBtn2 = document.getElementById('filterToggle-2');
  const dropdown = document.getElementById('filterDropdown');
  const dropdown2 = document.getElementById('filterDropdown-2');

  // Функция для закрытия всех выпадающих меню
  const closeAllDropdowns = () => {
    dropdown.classList.remove('active');
    dropdown2.classList.remove('active');
  };

  // Открытие/закрытие первого выпадающего меню
  toggleBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    const isActive = dropdown.classList.contains('active');
    closeAllDropdowns();
    if (!isActive) {
      dropdown.classList.add('active');
    }
  });

  // Открытие/закрытие второго выпадающего меню
  toggleBtn2.addEventListener('click', (event) => {
    event.stopPropagation();
    const isActive = dropdown2.classList.contains('active');
    closeAllDropdowns();
    if (!isActive) {
      dropdown2.classList.add('active');
    }
  });

  // Закрытие выпадающих меню при клике вне них
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

let modalProductSwiper;
let modalProductImagesMobileSwiper;
let modalProductMainSwiper;

const modalProduct = document.getElementById('modal-product');
const modalProductSwiperInstances = []; 

if (modalProduct) {
    
  // Инициализация product-swiper
  const modalProductMainSwiperContainer = document.querySelector('.product-swiper');
  if (modalProductMainSwiperContainer) {
    modalProductMainSwiper = new Swiper('.product-swiper', {
      slidesPerView: 'auto',
      spaceBetween: 20,
      loop: false,
      effect: 'slide',
      speed: 500,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
      breakpoints: {
        0: { spaceBetween: 10 },
        1411: { spaceBetween: 20 }
      },
      on: {
        reachEnd: function () {
          this.autoplay.stop();
          setTimeout(() => {
            this.slideTo(0);
            this.autoplay.start();
          }, 1000);
        }
      }
    });
    modalProductSwiperInstances.push(modalProductMainSwiper);
  }

  const modalProductImagesMobileSwiperContainer = document.querySelector('.images-mobile.swiper');
  if (modalProductImagesMobileSwiperContainer) {
    modalProductImagesMobileSwiper = new Swiper('.images-mobile.swiper', {
      slidesPerView: 'auto',
      slidesPerGroup: 1,
      initialSlide: 1,
      spaceBetween: 10,
      centeredSlides: false,
      loop: true,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
    });
    modalProductSwiperInstances.push(modalProductImagesMobileSwiper);
  }

  function initModalProductSwiper(startIndex = 0) {
    if (modalProductSwiper) modalProductSwiper.destroy(true, true);

    modalProductSwiper = new Swiper('.modal-product-swiper', {
        loop: true,
        speed: 800,
        initialSlide: startIndex,
        navigation: {
          prevEl: '.swiper-button-next',
          nextEl: '.swiper-button-prev',
        },
        spaceBetween: 50,
        centeredSlides: true,
        breakpoints: {
          0: {
            slidesPerView: 1,
            centeredSlides: false,
            spaceBetween: 20,
          },
          646: {
            slidesPerView: 3,
            centeredSlides: true,
            spaceBetween: 50,
          },
        },
      });
  }

  let isModalOpen = false;
  
  // функция открытия модалки
  function openModalProductAt(index) {
    if (isModalOpen) return;
    isModalOpen = true;

    modalProduct.classList.add('show');
    document.querySelector('.container').style.filter = 'blur(5px)';
    document.documentElement.classList.add('no-scroll');

    modalProductSwiperInstances.forEach(swiper => swiper.autoplay?.stop());

    requestAnimationFrame(() => {
      initModalProductSwiper(index);
    });
  }

  // Закрытие модалки
  function closeModalProduct() {
  modalProduct.classList.remove('show');
  document.querySelector('.container').style.filter = 'none';
  document.documentElement.classList.remove('no-scroll');
  isModalOpen = false;

  setTimeout(() => {
    if (modalProductSwiper) {
      modalProductSwiper.destroy(true, true);
      modalProductSwiper = null;
    }
  }, 400); 
  modalProductSwiperInstances.forEach(swiper => swiper.autoplay?.start());
}

  // Обработчик закрытия модалки
  document.querySelector('.close-product-modal').addEventListener('click', closeModalProduct);

  // Картинки десктопного swiper
  document.querySelectorAll('.product-swiper-slide img').forEach((img, index) => {
    img.addEventListener('click', () => {
      openModalProductAt(index);
    });
  });

  // Картинки мобильного swiper
  document.querySelectorAll('.product-images.images-mobile .swiper-slide img').forEach((img, index) => {
    img.addEventListener('click', () => {
      openModalProductAt(index);
    });
  });

  // Раскрытие информации товара побольше

document.querySelectorAll('.open-all-about-products').forEach(button => {
    button.addEventListener('click', () => {
        // Найти родительский элемент, содержащий кнопку
        const container = button.closest('.about-products-mobile');
        
        // Найти элемент, который нужно показать/скрыть
        const extraText = container.querySelector('.extra-text');

        if (extraText) {
            // Проверяем, скрыт ли элемент и переключаем класс
            const isHidden = !extraText.classList.contains('show'); 
            extraText.classList.toggle('show', isHidden); 

            const arrow = button.querySelector('.arrow'); 
            if (arrow) {
                arrow.classList.toggle('rotate', isHidden); 
            }

            const span = button.querySelector('span'); 
            if (span) { 
                span.textContent = isHidden ? 'скрыть' : 'открыть все'; 
            }
        }
    });
});
}


// Добавление товара в корзину
const addToCardProduct = document.querySelector('.add-to-card-product');

if (addToCardProduct) {
  const elements = {
    desktop: {
      addBtn: document.getElementById('add-btn'),
      qtyBlock: document.getElementById('qty-block'),
      notifyBlock: document.getElementById('notify-block'),
      minusBtn: document.getElementById('minus-btn'),
      plusBtn: document.getElementById('plus-btn'),
      qtyLabel: document.getElementById('qty-label-desktop'),
      addToCartBtn: document.querySelector('.add-to-cart'),
    },
    mobile: {
      addBtn: document.getElementById('add-btn-mobile'),
      qtyBlock: document.getElementById('qty-block-mobile'),
      notifyBlock: document.getElementById('notify-block-mobile'),
      minusBtn: document.getElementById('minus-btn-mobile'),
      plusBtn: document.getElementById('plus-btn-mobile'),
      qtyLabel: document.getElementById('qty-label-mobile'),
      addToCartBtn: document.querySelector('.add-to-cart-mobile'),
    },
  };

  function initContainer(container) {
    let quantity = 1;
    let notifyTimeout = null; 

    function updateQtyLabel() {
      container.qtyLabel.textContent = quantity;
    }

    function showNotification() {
      const notify = container.notifyBlock;

      // Сбросить старый таймер, если пользователь спамит
      if (notifyTimeout) {
        clearTimeout(notifyTimeout);
        notifyTimeout = null;
      }

      // Перезапускаем анимацию (если элемент уже активен)
      notify.classList.remove('active');
      void notify.offsetWidth;
      notify.classList.add('active');

      notifyTimeout = setTimeout(() => {
        notify.classList.remove('active');
      }, 3000);
    }

    container.addBtn?.addEventListener('click', () => {
      if (!container.qtyBlock.classList.contains('active')) {
        container.addToCartBtn.style.display = 'none';
        container.qtyBlock.classList.add('active');
        quantity = 1;
        updateQtyLabel();
      }

      showNotification(); 
    });

    container.plusBtn?.addEventListener('click', () => {
      quantity++;
      updateQtyLabel();
    });

    container.minusBtn?.addEventListener('click', () => {
      if (quantity > 1) {
        quantity--;
        updateQtyLabel();
      } else {
        quantity = 1;
        container.qtyBlock.classList.remove('active');
        container.notifyBlock.classList.remove('active');
        container.addToCartBtn.style.display = '';
        updateQtyLabel();

        // Очистить таймер уведомления, если плашка выключена досрочно
        if (notifyTimeout) {
          clearTimeout(notifyTimeout);
          notifyTimeout = null;
        }
      }
    });
  }

  initContainer(elements.desktop);
  initContainer(elements.mobile);
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

  // Увелечение количества товара на кнопки
  // И отображение товара за 1шт

  function setupQuantityToggle(containerSelector, priceSelector) {
      document.querySelectorAll(containerSelector).forEach(item => {
          const minusBtn = item.querySelector('.change-count button:first-of-type');
          const plusBtn  = item.querySelector('.change-count button:last-of-type');
          const countEl  = item.querySelector('.change-count p');
          const priceEl  = item.querySelector(priceSelector);

          let count = parseInt(countEl.textContent, 10);

          const updateVisibility = () => {
              if (count > 1) {
                  priceEl.classList.add('visible');
              } else {
                  priceEl.classList.remove('visible');
              }
          };

          plusBtn.addEventListener('click', () => {
              count++;
              countEl.textContent = count;
              updateVisibility();
          });

          minusBtn.addEventListener('click', () => {
              if (count > 1) {
                  count--;
                  countEl.textContent = count;
                  updateVisibility();
              }
          });

          // инициализация
          updateVisibility();
      });
  }

  // Настраиваем для десктопа
  setupQuantityToggle('.order-products', '.price-per-piece');
  // Настраиваем для мобильной версии
  setupQuantityToggle('.order-item-600', '.price-per-piece-2');

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
      setTimeout(() => {
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
        window.history.pushState(null, '', targetId);
        isScrollingProgrammatically = false;
      }, 600);
    });
  });

  // Свайп навигации проектов

  const swiper = new Swiper('.projects-navigation', {
    slidesPerView: 'auto',       
    spaceBetween: 10,            
    freeMode: true,              
    loop: false,                  
    grabCursor: true,            
  });

  // Раскрытие проектов побольше

  const btnWrapper = document.querySelector('.open-more-project-btn');

  if (btnWrapper) {
    const btn = btnWrapper.querySelector('button');
    let clickCount = 0; 

    btn.addEventListener('click', () => {
      clickCount++;

      document.querySelectorAll('.projects-content-container').forEach(orig => {
        const clone = orig.cloneNode(true);
        clone.classList.add('cloned');
        orig.after(clone);
        
        setTimeout(() => clone.classList.add('visible'), 50);
      });

      if (clickCount >= 2) {
        btnWrapper.style.display = 'none';
      }
    });
  }
}

// Скрипты для контента на странице "project-info-page.html"

const gallerySwiper = document.querySelector('.project-gallery-swiper');

  if (gallerySwiper) {
    // Переключение карточек "Галерея проекта"
    let swiper;

    function initSwiper() {
      const isMobile = window.matchMedia('(max-width: 830px)').matches;

      if (swiper) swiper.destroy(true, true); 

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




