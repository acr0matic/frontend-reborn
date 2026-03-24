/* Прописываются все инициализации и первичные параметры для скриптов */

import LazyLoad from 'vanilla-lazyload';
import { Modal } from '../component/modal';

/* Ленивая загрузка */

export const lazyImageController = new LazyLoad({
  elements_selector: '.lazy__item:not([data-custom-lazy])',

  callback_loaded: (trigger) => {
    const container = trigger.closest('.lazy');
    container.classList.remove('lazy--preloader');
  },
});

// Ленивая загрузка без прелоадера и обёртки
export const lazyBackgroundController = new LazyLoad({
  elements_selector: '.lazy-simple',
});

/* --------- */

window.lazyload = lazyImageController;
window.modal = new Modal();

/* --------- */