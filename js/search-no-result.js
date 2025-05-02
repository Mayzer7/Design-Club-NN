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
        menuNavigation.style.marginTop = '430px';
        underHeader.style.filter = 'blur(5px)';

        // Накидываем blur на все контейнеры
        blurContainers.forEach(container => {
            container.style.filter = 'blur(5px)';
        });

        // Расширяем background color
        header.style.paddingBottom = '270px';
        // Меняем фон header на синий
        header.style.backgroundColor = '#151c28'; // синий цвет
        // Показываем элементы с плавным переходом
        searchItems.classList.add('show');
    } else if (!isCatalogActive) {
        menuNavigation.style.marginTop = '200px';
        // Сбрасываем фон header, если поиск пуст
        header.style.backgroundColor = 'transparent';

        header.style.paddingBottom = '40px';

        // Скрываем элементы с плавным переходом
        searchItems.classList.remove('show');
        underHeader.style.filter = 'none';

        // Сбрасываем blur, если поле поиска пустое
        blurContainers.forEach(container => {
            container.style.filter = '';
        });
    } else {
        menuNavigation.style.marginTop = '200px';
        // Скрываем элементы с плавным переходом
        searchItems.classList.remove('show');
        header.style.transition = 'padding-bottom 0.5s ease';
        header.style.paddingBottom = '40px';
        underHeader.style.filter = 'blur(5px)';
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
    menuNavigation.style.marginTop = '200px';
    header.style.paddingBottom = '40px';

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

    // Накидываем blur на все контейнеры
    blurContainers.forEach(container => {
        container.style.filter = 'blur(5px)';
    });

    if (searchInput.value.trim() == '') {
        header.style.paddingBottom = '40px';
    }

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
        if (searchInput.value.trim() !== '') {
            menuNavigation.style.display = 'none';
            openCatalog.style.color = '';
        } else {
            // Когда каталог деактивирован, скрываем меню и сбрасываем стиль
            openCatalog.style.color = '';
            header.style.backgroundColor = 'transparent';
            menuNavigation.style.display = 'none';
    
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



document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header-top');
    const initialScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    console.log('Начальное положение прокрутки:', initialScrollTop);
  
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

    // Сброс состояния
    blurContainers.forEach(container => container.style.filter = '');
    header.style.backgroundColor = 'transparent';
    underHeader.style.filter = 'none';
    openCatalog.parentElement.classList.remove('active');
    isCatalogActive = false;
    menuNavigation.style.display = 'none';
    openCatalog.style.color = '';
    
  } else if (scrollDelta < 0) {
    header.style.display = 'block';
    // Скролл вверх
    header.classList.remove('header-hidden');
    header.classList.add('header-scrolled-up');
  }

  // Если в самом верху — убираем "скролл вверх" класс
  if (scrollTop <= 0) {
    header.classList.remove('header-scrolled-up');
  }

  lastScrollTop = scrollTop;
});