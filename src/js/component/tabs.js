import { Swiper } from "swiper";
import { EffectFade } from "swiper/modules";

class Tab {
  constructor(tab) {
    this.el = tab;
    this.controls = tab.querySelectorAll('.b-tabs__action button');
    this.swiperEl = tab.querySelector('.swiper');

    if (!this.swiperEl) return;

    this.slider = new Swiper(this.swiperEl, {
      modules: [EffectFade],
      slidesPerView: 1,
      spaceBetween: 20,
      speed: 300,
      allowTouchMove: false,
      autoHeight: true,

      effect: 'fade',
      fadeEffect: {
        crossFade: true,
      },
    });

    this.abortController = new AbortController();
    const { signal } = this.abortController;

    for (const [index, control] of this.controls.entries()) {
      control.addEventListener('click', () => {
        const currentActive = this.el.querySelector('.b-tabs__action .is-active');
        if (currentActive) currentActive.classList.remove('is-active');

        control.classList.add('is-active');
        this.slider.slideTo(index);
      }, { signal });
    }

    // Обновление высоты Swiper при открытии/закрытии аккордеона внутри табов
    const accordions = this.el.querySelectorAll('.b-accordion__body, .c-accordion__body');
    for (const accordionBody of accordions) {
      accordionBody.addEventListener('dropdownToggleStart', () => {
        const duration = 600;
        const startTime = performance.now();

        const updateHeight = (currentTime) => {
          const elapsed = currentTime - startTime;
          if (elapsed < duration) {
            this.slider.update();
            requestAnimationFrame(updateHeight);
          } else {
            this.slider.update();
          }
        };

        requestAnimationFrame(updateHeight);
      }, { signal });
    }
  }

  destroy() {
    this.abortController?.abort();

    if (this.slider && !this.slider.destroyed) {
      this.slider.destroy(true, true);
    }

    this.el = undefined;
    this.swiperEl = undefined;
  }
}

export default class Tabs {
  constructor(options = {}) {
    this.options = {
      selector: '.b-tabs',
      ...options,
    };
    this.instances = [];
    this.init();
  }

  init() {
    this.update();
  }

  update() {
    const tabs = document.querySelectorAll(this.options.selector);
    const newTabs = [...tabs].filter((el) => !this.instances.some((instance) => instance.el === el));
    const newInstances = newTabs.map((el) => new Tab(el)).filter(Boolean);

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
