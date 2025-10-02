function applyVariant(image, price = null, discountPrice = null, discount = 0) {
  function fmt(n) {
    if (n === null || n === undefined || n === '') return '';
    if (isNaN(Number(n))) return String(n);
    return String(Math.round(Number(n))).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽';
  }

  const mainImg = document.querySelector('.product-swiper .product-swiper-slide img');
  const modalImg = document.querySelector('#modal-product .modal-product-swiper .swiper-slide .slide-inner img');
  const mobileFirstImg = document.querySelector('.product-images.images-mobile .swiper-slide img');

  if (mainImg) { mainImg.src = image; mainImg.alt = mainImg.alt || 'product image'; }
  if (modalImg) { modalImg.src = image; modalImg.alt = modalImg.alt || 'product image'; }
  if (mobileFirstImg) { mobileFirstImg.src = image; mobileFirstImg.alt = mobileFirstImg.alt || 'product image'; }

  // desktop
  const discountBanner = document.querySelector('.product-banners .discount');
  const discountBannerP = discountBanner ? discountBanner.querySelector('p') : null;
  const discountPriceEl = document.querySelector('.product-prices .discount-price h3');
  const priceEl = document.querySelector('.product-prices .price p');

  // mobile
  const mobileDiscountP = document.querySelector('.product-mobile-discount-icons .discount-mobile');
  const mobilePriceEl = document.querySelector('.product-mobile-price .price');
  const mobileDiscountPriceEl = document.querySelector('.product-mobile-price .price-discount');

  if (!priceEl) console.warn('applyVariant: не найден .product-prices .price p (desktop)');
  if (!discountPriceEl) console.warn('applyVariant: не найден .product-prices .discount-price h3 (desktop)');
  if (!mobilePriceEl) console.warn('applyVariant: не найден .product-mobile-price .price (mobile)');
  if (!mobileDiscountPriceEl) console.warn('applyVariant: не найден .product-mobile-price .price-discount (mobile)');

  const priceVal = (price != null && price !== '') ? price : null;
  const discountPriceVal = (discountPrice != null && discountPrice !== '' && Number(discountPrice) > 0) ? discountPrice : null;
  const discountPercent = (discount != null && !isNaN(Number(discount))) ? Number(discount) : 0;

  const priceNum = priceVal != null ? Number(priceVal) : null;
  const discountPriceNum = discountPriceVal != null ? Number(discountPriceVal) : null;
  const showDiscount = discountPriceNum != null && discountPriceNum > 0 && !(priceNum != null && discountPriceNum === priceNum && discountPercent === 0);

  if (showDiscount && discountPriceEl && priceEl) {
    discountPriceEl.textContent = fmt(discountPriceVal);
    priceEl.textContent = fmt(priceVal);

    if (discountBanner) discountBanner.style.display = '';
    if (discountBannerP) discountBannerP.textContent = (discountPercent > 0) ? `-${Math.round(discountPercent)}%` : '';

    if (discountPriceEl.parentElement) discountPriceEl.parentElement.style.display = '';
  } else {
    if (discountPriceEl && discountPriceEl.parentElement) discountPriceEl.parentElement.style.display = 'none';
    if (discountBanner) discountBanner.style.display = 'none';
    if (priceEl) priceEl.textContent = fmt(priceVal);
  }

  if (mobileDiscountPriceEl && mobilePriceEl) {
    if (showDiscount) {
      mobileDiscountPriceEl.textContent = fmt(discountPriceVal);
      mobilePriceEl.textContent = fmt(priceVal);
    } else {
      mobileDiscountPriceEl.textContent = '';
      mobilePriceEl.textContent = fmt(priceVal);
    }
  } else {
    if (mobilePriceEl) mobilePriceEl.textContent = fmt(priceVal);
    if (mobileDiscountPriceEl) mobileDiscountPriceEl.textContent = showDiscount ? fmt(discountPriceVal) : '';
  }

  if (mobileDiscountP) {
    mobileDiscountP.textContent = showDiscount && discountPercent > 0 ? `-${Math.round(discountPercent)}%` : '';
    mobileDiscountP.style.display = (showDiscount && discountPercent > 0) ? '' : 'none';
  }

  try {
    const mainSwiperEl = document.querySelector('.product-swiper');
    if (mainSwiperEl && mainSwiperEl.swiper && typeof mainSwiperEl.swiper.update === 'function') mainSwiperEl.swiper.update();
    else if (window.productSwiper && typeof window.productSwiper.update === 'function') window.productSwiper.update();

    const modalSwiperEl = document.querySelector('#modal-product .modal-product-swiper');
    if (modalSwiperEl && modalSwiperEl.swiper && typeof modalSwiperEl.swiper.update === 'function') modalSwiperEl.swiper.update();
    else if (window.modalProductSwiper && typeof window.modalProductSwiper.update === 'function') window.modalProductSwiper.update();

    if (window.mobileProductSwiper && typeof window.mobileProductSwiper.update === 'function') {
      window.mobileProductSwiper.update();
    }
  } catch (e) {
    console.warn('applyVariant: не удалось обновить Swiper-экземпляры', e);
  }

  (function smoothScrollToUnderHeader() {
    const anchor = document.querySelectorAll('.under-header-container-product') || document.querySelector('.under-header-desktop');
    if (!anchor) return;

    function waitForImageLoad(img, timeout = 1500) {
      return new Promise(resolve => {
        if (!img) return resolve();
        if (img.complete && img.naturalWidth !== 0) return resolve();
        let done = false;
        const onDone = () => { if (!done) { done = true; cleanup(); resolve(); } };
        const onError = () => onDone();
        const cleanup = () => { img.removeEventListener('load', onDone); img.removeEventListener('error', onError); clearTimeout(timer); };
        img.addEventListener('load', onDone);
        img.addEventListener('error', onError);
        const timer = setTimeout(onDone, timeout);
      });
    }

    function trySwiperUpdateAndSettle() {
      return new Promise(resolve => {
        try {
          if (window.productSwiper && typeof window.productSwiper.update === 'function') window.productSwiper.update();
          if (window.modalProductSwiper && typeof window.modalProductSwiper.update === 'function') window.modalProductSwiper.update();
          if (window.mobileProductSwiper && typeof window.mobileProductSwiper.update === 'function') window.mobileProductSwiper.update();
        } catch (e) {
        }
        requestAnimationFrame(() => setTimeout(resolve, 40));
      });
    }

    (async function doScroll() {
      try {
        const waits = [];
        const mainImgEl = document.querySelector('.product-swiper .product-swiper-slide img');
        const modalImgEl = document.querySelector('#modal-product .modal-product-swiper .swiper-slide .slide-inner img');
        const mobileImgEl = document.querySelector('.product-images.images-mobile .product-swiper-slide img');
        if (mainImgEl) waits.push(waitForImageLoad(mainImgEl, 1500));
        if (modalImgEl) waits.push(waitForImageLoad(modalImgEl, 1500));
        if (mobileImgEl) waits.push(waitForImageLoad(mobileImgEl, 1500));

        waits.push(trySwiperUpdateAndSettle());

        await Promise.all(waits);

        const header = document.querySelector('.header') ||
                       document.querySelector('#header') ||
                       document.querySelector('.site-header') ||
                       document.querySelector('.header-desktop');
        const headerHeight = header ? header.getBoundingClientRect().height : 0;
        const extraOffset = 10;

        const rect = anchor.getBoundingClientRect();
        const targetY = Math.max(0, window.scrollY + rect.top - headerHeight - extraOffset);

        const startY = window.scrollY;
        const distance = targetY - startY;
        if (distance === 0) return;

        const duration = 700; 
        let startTime = null;
        function easeInOutQuad(t) { return t < 0.5 ? 2*t*t : -1 + (4 - 2*t)*t; }

        function step(timestamp) {
          if (!startTime) startTime = timestamp;
          const elapsed = timestamp - startTime;
          const progress = Math.min(1, elapsed / duration);
          const eased = easeInOutQuad(progress);
          window.scrollTo(0, Math.round(startY + distance * eased));
          if (elapsed < duration) requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
      } catch (err) {
        try {
          const rect = anchor.getBoundingClientRect();
          const targetY = Math.max(0, window.scrollY + rect.top - 10);
          window.scrollTo({ top: targetY, behavior: 'smooth' });
        } catch (e) { }
      }
    })();
  })();
}
