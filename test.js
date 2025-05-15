// Переключение фотографий в секции "О компании" на разрешении 520px и ниже

const sliderWrapperUnique = document.querySelector(".slider-wrapper");
const slidesUnique = document.querySelectorAll(".slide");
let currentIndexUnique = 0;
let uniqueStartX = 0;
let uniqueCurrentX = 0;
let isDraggingUnique = false;

const slideWidthUnique = slidesUnique[0].offsetWidth + 10; // 10px — это gap

function updateSlider() {
  const offset = -currentIndexUnique * slideWidthUnique;
  sliderWrapperUnique.style.transform = `translateX(${offset}px)`;
}

// Начало свайпа
sliderWrapperUnique.addEventListener("touchstart", (e) => {
  uniqueStartX = e.touches[0].clientX;
  isDraggingUnique = true;
});

// Движение свайпа
sliderWrapperUnique.addEventListener("touchmove", (e) => {
  if (!isDraggingUnique) return;
  uniqueCurrentX = e.touches[0].clientX;
  const diff = uniqueCurrentX - uniqueStartX;

  sliderWrapperUnique.style.transform = `translateX(${
    -(currentIndexUnique * slideWidthUnique) + diff
  }px)`;
});

// Завершение свайпа
sliderWrapperUnique.addEventListener("touchend", () => {
  isDraggingUnique = false;

  const diff = uniqueCurrentX - uniqueStartX;

  // Если свайп вправо
  if (diff > 50 && currentIndexUnique > 0) {
    currentIndexUnique--;
  }
  // Если свайп влево
  else if (diff < -50 && currentIndexUnique < slidesUnique.length - 1) {
    currentIndexUnique++;
  }

  updateSlider();
});
