/* Прописываются все инициализации и первичные параметры для скриптов */

import LazyLoad from 'vanilla-lazyload';
import Modal from '../component/modal';
import Submenu from '../component/submenu';
import Accordion from '../component/accordion';

/* Ленивая загрузка */

const lazyImageController = new LazyLoad({
  elements_selector: '.lazy__item:not([data-custom-lazy])',

  callback_loaded: (trigger) => {
    const container = trigger.closest('.lazy');
    container.classList.remove('lazy--preloader');
  },
});

const lazyBackgroundController = new LazyLoad({
  elements_selector: '.lazy-simple',
});

const submenuController = new Submenu({
  single: false,
  duration: 300
});

const accordionController = new Accordion({
  single: false,
  duration: 600
});

const modalController = new Modal({
  activeClass: 'is-show',
  scrollLockClass: 'is-scroll-locked',

  closeOnEsc: true,
  closeOnOverlay: true,
  catchFocus: true,

  modalSelector: 'data-modal',
  openSelector: 'data-modal-open',
  closeSelector: 'data-modal-close',

  onShow: (modal) => {},
  onClose: (modal) => {},
  onCloseAll: () => {}
});

/* --------- */

window.App = window.App || {};

window.App.lazyImage = lazyImageController;
window.App.lazyBackground = lazyBackgroundController;
window.App.modal = modalController;
window.App.submenu = submenuController;
window.App.accordion = accordionController;

/* --------- */