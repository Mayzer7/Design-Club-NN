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