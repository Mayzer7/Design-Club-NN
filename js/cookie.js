fetch('/cookie-banner.html')
    .then(res => res.text())
    .then(html => {
        // Вставляем баннер в страницу
        document.getElementById('cookie-container').innerHTML = html;

        // Ищем баннер и кнопки
        const banner = document.getElementById('cookie-banner');
        const acceptBtn = document.getElementById('accept-btn');
        const rejectBtn = document.getElementById('reject-btn');

        // Проверяем значение cookieConsent в localStorage
        const cookieChoice = localStorage.getItem('cookieConsent');
        
        // Если пользователь уже выбрал (accepted или rejected), скрываем баннер
        if (cookieChoice === 'accepted' || cookieChoice === 'rejected') {
            banner.style.display = 'none';
        } else {
            // Если нет выбора, показываем баннер
            banner.style.display = 'flex';
        }

        // Обработчик кнопки "ПРИНИМАЮ"
        acceptBtn?.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted'); // Сохраняем выбор
            banner.style.display = 'none'; // Скрываем баннер
        });

        // Обработчик кнопки "ОТКАЗЫВАЮСЬ"
        rejectBtn?.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'rejected'); // Сохраняем выбор
            banner.style.display = 'none'; // Скрываем баннер
        });
    })
    .catch(err => console.error('Ошибка загрузки баннера:', err));
