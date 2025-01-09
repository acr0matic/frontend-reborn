/* Прописываются все инициализации и первичные параметры для скриптов */

import LazyLoad from 'vanilla-lazyload';
import HystModal from "../libs/hystmodal";

/* Ленивая загрузка */

export const lazyImageController = new LazyLoad({
  elements_selector: '.lazy__item',

  callback_loaded: (trigger) => {
    const container = trigger.closest('.lazy');
    container.classList.remove('lazy--preloader');
  },
});

// Ленивая загрузка без прелоадеров
export const lazyBackgroundController = new LazyLoad({
  elements_selector: '.lazy-bg',
});

/* --------- */



/* Модальные окна */

export const modalManager = new HystModal({
  linkAttributeName: "data-modal",
  waitTransitions: true,
  backscroll: false,
});

window.modalManager = modalManager;

/* --------- */