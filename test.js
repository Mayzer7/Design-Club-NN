const inputBurger = document.querySelector('.search-inputBurger inputBurger');
const searchItemsBurger = document.querySelector('.burger-search-items');

inputBurger.addEventListener('inputBurger', () => {
  if (inputBurger.value.length > 0) {
    searchItemsBurger.classList.remove('hidden');
  } else {
    searchItemsBurger.classList.add('hidden');
  }
});

// Инициализируем состояние скрытым по умолчанию
searchItemsBurger.classList.add('hidden');
