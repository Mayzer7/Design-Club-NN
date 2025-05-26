


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