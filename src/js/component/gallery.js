import { Swiper } from "swiper";
import { Navigation, Thumbs, Pagination, EffectFade } from "swiper/modules";
import { MediaQuery } from '../global/func';
import { breakpoint } from '../global/settings';

class Gallery {
  constructor(gallery) {
    this.el = gallery;
    this.mainEl = gallery.querySelector('.b-gallery__slider .swiper');

    if (!this.mainEl) return;

    this.isVerticalGallery = gallery.classList.contains('b-gallery--vertical');
    this.thumbEl = gallery.querySelector('.b-gallery__thumb .swiper');
    this.previewSwiper = undefined;
    this.mainSlider = undefined;

    this.init();
  }

  init() {
    this.previewSwiper = this.createPreview();
    this.createMainSlider();

    if (this.isVerticalGallery && this.thumbEl) {
      this.isCurrentlyVertical = MediaQuery(breakpoint.tablet);
      window.addEventListener('resize', this.onResize);
    }
  }

  createPreview() {
    if (!this.thumbEl) return;

    const isVertical = this.isVerticalGallery && MediaQuery(breakpoint.tablet);

    const swiperInstance = new Swiper(this.thumbEl, {
      modules: isVertical ? [Navigation] : [],
      direction: isVertical ? 'vertical' : 'horizontal',
      slidesPerView: isVertical ? 5 : 4.5,
      spaceBetween: 8,
      slideToClickedSlide: true,
      watchSlidesProgress: true,
      navigation: isVertical
        ? {
            prevEl: this.el.querySelector('.b-gallery__thumb .swiper-button-prev'),
            nextEl: this.el.querySelector('.b-gallery__thumb .swiper-button-next'),
          }
        : undefined,
      breakpoints: this.isVerticalGallery
        ? undefined
        : {
            800: { slidesPerView: 3 },
            1200: { slidesPerView: 4 },
            1480: { slidesPerView: 5 },
          },
    });

    /* Автоматическая прокрутка превью при клике на крайний видимый слайд */
    if (isVertical) {
      swiperInstance.on('tap', () => {
        const { clickedIndex, activeIndex, clickedSlide, slides, params } = swiperInstance;
        const slidesPerView = Math.floor(params.slidesPerView);

        if (
          clickedIndex === undefined ||
          clickedIndex < 0 ||
          (clickedSlide && clickedSlide.classList.contains('swiper-slide-thumb-active'))
        ) return;

        const lastVisibleIndex = activeIndex + slidesPerView - 1;
        const maxIndex = slides.length - slidesPerView;

        if (clickedIndex === activeIndex && activeIndex > 0) {
          swiperInstance.slideTo(activeIndex - 1);
        } else if (clickedIndex === lastVisibleIndex) {
          swiperInstance.slideTo(Math.min(activeIndex + 1, maxIndex));
        }
      });
    }

    return swiperInstance;
  }

  createMainSlider() {
    this.mainSlider = new Swiper(this.mainEl, {
      modules: [Navigation, Thumbs, Pagination, EffectFade],
      slidesPerView: 1,
      spaceBetween: 32,
      allowTouchMove: false,
      effect: 'fade',
      fadeEffect: {
        crossFade: true,
      },
      navigation: {
        prevEl: this.el.querySelector('.b-gallery__viewport .swiper-button-prev'),
        nextEl: this.el.querySelector('.b-gallery__viewport .swiper-button-next'),
      },
      thumbs: {
        swiper: this.previewSwiper,
      },
      pagination: {
        el: this.el.querySelector('.swiper-pagination'),
        clickable: true,
      },
    });

    /* Остановка видео только на предыдущем активном слайде */
    this.mainSlider.on('slideChangeTransitionStart', () => {
      const prevSlide = this.mainSlider.slides[this.mainSlider.previousIndex];
      if (!prevSlide) return;

      const videos = prevSlide.querySelectorAll('video');
      for (const video of videos) video.pause();
    });
  }

  onResize = () => {
    const isVertical = MediaQuery(breakpoint.tablet);
    if (isVertical === this.isCurrentlyVertical) return;

    this.isCurrentlyVertical = isVertical;

    if (this.previewSwiper && !this.previewSwiper.destroyed) {
      this.previewSwiper.destroy(true, true);
    }

    this.previewSwiper = this.createPreview();

    if (this.mainSlider.params.thumbs) {
      this.mainSlider.thumbs.swiper = this.previewSwiper;
      this.mainSlider.thumbs.init();
      this.mainSlider.thumbs.update(true);
    }
  };

  destroy() {
    window.removeEventListener('resize', this.onResize);

    if (this.previewSwiper && !this.previewSwiper.destroyed) {
      this.previewSwiper.destroy(true, true);
    }

    if (this.mainSlider && !this.mainSlider.destroyed) {
      this.mainSlider.destroy(true, true);
    }

    this.el = undefined;
    this.mainEl = undefined;
    this.thumbEl = undefined;
  }
}

export default class Galleries {
  constructor(options = {}) {
    this.options = {
      selector: '.b-gallery',
      ...options,
    };
    this.instances = [];
    this.init();
  }

  init() {
    this.update();
  }

  update() {
    const galleries = document.querySelectorAll(this.options.selector);
    const newGalleries = [...galleries].filter((el) => !this.instances.some((instance) => instance.el === el));
    const newInstances = newGalleries.map((el) => new Gallery(el)).filter(Boolean);

    this.instances = [...this.instances, ...newInstances];
    return newInstances;
  }

  destroy() {
    for (const instance of this.instances) {
      instance.destroy();
    }
    this.instances = [];
  }
}
