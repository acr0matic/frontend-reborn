/* Прописываются все инициализации и первичные параметры для скриптов */

// import ScrollTop from '../utils/scroll-top';

import LazyLoad from 'vanilla-lazyload';
import Modal from '../component/modal';
import Submenu from '../component/submenu';
import Accordion from '../component/accordion';
import Forms from '../component/form';
import NumberInputs from '../component/input';

import { PlayVideoInViewport } from '../utils/video-optimization';

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
  scrollLock: true,

  closeOnEsc: true,
  closeOnOverlay: true,
  catchFocus: true,

  awaitCloseAnimation: true,

  modalSelector: 'data-modal',
  openSelector: 'data-modal-open',
  closeSelector: 'data-modal-close',

  onShow: (modal) => { },
  onClose: (modal) => { },
  onCloseAll: () => { }
});

window.App = window.App || {};

window.App.lazyImage = lazyImageController;
window.App.lazyBackground = lazyBackgroundController;
window.App.modal = modalController;
window.App.submenu = submenuController;
window.App.accordion = accordionController;

/* --------- */

document.addEventListener('DOMContentLoaded', () => {
  window.App.forms = new Forms();
  window.App.numberInputs = new NumberInputs();

  PlayVideoInViewport();
});

/* --------- */

// window.App.scrollTop = new ScrollTop();

/* --------- */
