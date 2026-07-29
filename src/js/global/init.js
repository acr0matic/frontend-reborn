/* Прописываются все инициализации и первичные параметры для скриптов */

// import ScrollTop from '../utils/scroll-top';

import LazyLoad from 'vanilla-lazyload';
import Modal from '../component/modal';
import Submenu from '../component/submenu';
import Accordion from '../component/accordion';
import Forms from '../component/form';
import NumberInputs from '../component/input';

import { PlayVideoInViewport } from '../utils/video-optimization';

window.App = window.App || {};

/* --------- */

document.addEventListener('DOMContentLoaded', () => {
  window.App.lazyImage = new LazyLoad({
    elements_selector: '.lazy__item:not([data-custom-lazy])',

    callback_loaded: (trigger) => {
      const container = trigger.closest('.lazy');
      container.classList.remove('lazy--preloader');
    },
  });

  window.App.lazyBackground = new LazyLoad({
    elements_selector: '.lazy-simple',
  });

  window.App.modal = new Modal({
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

  window.App.submenu = new Submenu({
    single: false,
    duration: 300
  });

  window.App.accordion = new Accordion({
    single: false,
    duration: 600
  });

  window.App.forms = new Forms();
  window.App.numberInputs = new NumberInputs();

  PlayVideoInViewport();

  // window.App.scrollTop = new ScrollTop();
});

/* --------- */
