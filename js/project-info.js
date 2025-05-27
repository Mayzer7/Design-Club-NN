

// Переключение фотографий "Галерея проекта"

const gallery = document.querySelector('.project-gallery-images');
const images = document.querySelectorAll('.project-gallery-images img');
const leftArrow = document.querySelector('.left-arrow');
const rightArrow = document.querySelector('.right-arrow');

let currentIndex = 0;

function updateGalleryTransform() {
  const imageElement = document.querySelector('.project-gallery-images img');
  const isSmallScreen = window.innerWidth <= 1373;
  const imageWidth = isSmallScreen ? 532 + 20 : 1120 + 20;
  const offset = -(currentIndex * imageWidth);
  gallery.style.transform = `translateX(${offset}px)`;
}

rightArrow.addEventListener('click', () => {
  if (currentIndex < images.length - 2) {
    currentIndex++;
    updateGalleryTransform();
  }
});

leftArrow.addEventListener('click', () => {
  if (currentIndex >= 0) {
    currentIndex--;
    updateGalleryTransform();
  }
});

// Обновление галереи при изменении размера экрана
window.addEventListener('resize', () => {
  updateGalleryTransform();
});

