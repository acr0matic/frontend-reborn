import { Swiper } from "swiper";
import { Navigation, Thumbs, EffectFade } from "swiper/modules";
import { MediaQuery } from '../global/func';
import { breakpoint } from '../global/settings';

export default class Gallery {
  constructor(options = {}) {
    this.options = {
      selector: '.b-gallery',
      ...options,
    };
    this.instances = new Map();
    this.init();
  }

  init() {
    this.update();
  }

  update() {
    for (const [el, instance] of this.instances) {
      if (!document.contains(el)) {
        this.destroyInstance(el, instance);
      }
    }

    const galleries = document.querySelectorAll(this.options.selector);
    for (const gallery of galleries) {
      if (this.instances.has(gallery)) continue;
      const instance = this.createInstance(gallery);
      if (instance) {
        this.instances.set(gallery, instance);
      }
    }
  }

  createInstance(gallery) {
    const mainEl = gallery.querySelector('.b-gallery__slider .swiper');
    if (!mainEl) return;

    const isVerticalGallery = gallery.classList.contains('b-gallery--vertical');
    const thumbEl = gallery.querySelector('.b-gallery__thumb .swiper');

    const instance = {
      el: gallery,
      mainEl,
      thumbEl,
      isVerticalGallery,
      isCurrentlyVertical: undefined,
      previewSwiper: undefined,
      mainSlider: undefined,
    };

    this.initGallery(instance);
    return instance;
  }

  initGallery(instance) {
    if (instance.isVerticalGallery && instance.thumbEl) {
      instance.isCurrentlyVertical = MediaQuery(breakpoint.tablet);
      this.setThumbSize(instance, instance.isCurrentlyVertical);
    }

    instance.previewSwiper = this.createPreview(instance);
    instance.mainSlider = this.createMainSlider(instance);

    if (instance.isVerticalGallery && instance.thumbEl) {
      instance.onResize = () => this.onResize(instance);
      window.addEventListener('resize', instance.onResize);
    }
  }

  setThumbSize(instance, isVertical) {
    if (!instance.thumbEl || !instance.mainEl) return;

    if (!isVertical) {
      instance.el.style.removeProperty('--b-thumb-height');
      return;
    }

    const viewport = instance.mainEl.closest('.b-gallery__viewport');
    if (!viewport) return;

    const height = viewport.clientHeight || Math.round(viewport.offsetWidth * 3 / 4);

    if (height > 0) {
      instance.el.style.setProperty('--b-thumb-height', `${height}px`);
    }
  }

  createPreview(instance) {
    if (!instance.thumbEl) return;

    const isVertical = instance.isVerticalGallery && MediaQuery(breakpoint.tablet);

    const swiperInstance = new Swiper(instance.thumbEl, {
      modules: isVertical ? [Navigation] : [],
      direction: isVertical ? 'vertical' : 'horizontal',
      slidesPerView: isVertical ? 'auto' : 4.5,
      spaceBetween: 8,
      slideToClickedSlide: true,
      centerInsufficientSlides: false,
      watchSlidesProgress: true,
      navigation: isVertical
        ? {
            prevEl: instance.el.querySelector('.b-gallery__thumb .swiper-button-prev'),
            nextEl: instance.el.querySelector('.b-gallery__thumb .swiper-button-next'),
          }
        : undefined,
      breakpoints: instance.isVerticalGallery
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
        const { clickedIndex, activeIndex, clickedSlide, slides, params, height } = swiperInstance;
        let slidesPerView = params.slidesPerView;

        if (slidesPerView === 'auto') {
          const slideHeight = slides[0]?.offsetHeight || 0;
          const spaceBetween = params.spaceBetween || 0;

          slidesPerView = slideHeight > 0
            ? Math.floor((height + spaceBetween) / (slideHeight + spaceBetween))
            : 1;
        } else {
          slidesPerView = Math.floor(slidesPerView);
        }

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

  createMainSlider(instance) {
    const mainSlider = new Swiper(instance.mainEl, {
      modules: [Thumbs, EffectFade],
      slidesPerView: 1,
      spaceBetween: 32,
      allowTouchMove: false,
      effect: 'fade',
      fadeEffect: {
        crossFade: true,
      },
      thumbs: {
        swiper: instance.previewSwiper,
      },
    });

    /* Остановка видео только на предыдущем активном слайде */
    mainSlider.on('slideChangeTransitionStart', () => {
      const prevSlide = mainSlider.slides[mainSlider.previousIndex];
      if (!prevSlide) return;

      const videos = prevSlide.querySelectorAll('video');
      for (const video of videos) video.pause();
    });

    return mainSlider;
  }

  onResize(instance) {
    const isVertical = MediaQuery(breakpoint.tablet);

    this.setThumbSize(instance, isVertical);

    if (isVertical === instance.isCurrentlyVertical) {
      if (instance.previewSwiper && !instance.previewSwiper.destroyed) {
        instance.previewSwiper.update();
      }
      return;
    }

    instance.isCurrentlyVertical = isVertical;

    if (instance.previewSwiper && !instance.previewSwiper.destroyed) {
      instance.previewSwiper.destroy(true, true);
    }

    instance.previewSwiper = this.createPreview(instance);

    if (instance.mainSlider.params.thumbs) {
      instance.mainSlider.thumbs.swiper = instance.previewSwiper;
      instance.mainSlider.thumbs.init();
      instance.mainSlider.thumbs.update(true);
    }
  }

  destroyInstance(el, instance) {
    if (instance.onResize) {
      window.removeEventListener('resize', instance.onResize);
    }

    if (instance.previewSwiper && !instance.previewSwiper.destroyed) {
      instance.previewSwiper.destroy(true, true);
    }

    if (instance.mainSlider && !instance.mainSlider.destroyed) {
      instance.mainSlider.destroy(true, true);
    }

    this.instances.delete(el);
  }

  destroy() {
    for (const [el, instance] of this.instances) {
      this.destroyInstance(el, instance);
    }
  }
}
