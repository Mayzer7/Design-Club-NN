// Переключение карточек товара

const track = document.getElementById('track');
const cards = Array.from(track.querySelectorAll('.popular-product-card'));
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
    
let currentIndexCard = 2; // стартуем с Product 3 (индекс 2)
let cardWidth, visibleCount;

// Привязываем клики к статическим карточкам
cards.forEach((card, idx) => {
    if (idx === currentIndexCard) card.classList.add('active');
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
    const x = -currentIndexCard * cardWidth + manualShift;
    track.style.transform = `translateX(${x}px)`;
    cards.forEach((c, i) => c.classList.toggle('active', i === currentIndexCard));
}

function goTo(idx) {
    currentIndexCard = Math.max(0, Math.min(cards.length - 1, idx));
    moveTrack();
    updateButtons();
}

function updateButtons() {
    prevBtn.disabled = currentIndexCard === 0;
    nextBtn.disabled = currentIndexCard === cards.length - 1;
}

prevBtn.addEventListener('click', () => goTo(currentIndexCard - 1));
nextBtn.addEventListener('click', () => goTo(currentIndexCard + 1));
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
        goTo(currentIndexCard + 1);
    } else if (diff < -swipeThreshold) {
        goTo(currentIndexCard - 1);
    }
});