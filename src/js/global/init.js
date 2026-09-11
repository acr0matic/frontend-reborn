/* Прописываются все инициализации и первичные параметры для скриптов */

// import ScrollTop from '../utils/scroll-top';
// import Gallery from '../component/ui/gallery';
// import Tab from '../component/ui/tabs';

import LazyLoad from 'vanilla-lazyload';
import Modal from '../component/ui/modal';
import Submenu from '../component/ui/submenu';
import Accordion from '../component/ui/accordion';
import Form from '../component/form/form';
import NumberInput from '../component/input/number';

import Header from '../layout/header';
import MobileMenu from '../layout/menu';
import LazyVideo from '../utils/video-optimization';

import App from './app';

/* --------- */

document.addEventListener('DOMContentLoaded', () => {
  const app = new App();

  const lazyImage = new LazyLoad({
    elements_selector: '.lazy__item:not([data-custom-lazy])',

    callback_loaded: (trigger) => {
      trigger.closest('.lazy')?.classList.remove('lazy--preloader');
    },
  });

  const lazyBackground = new LazyLoad({
    elements_selector: '.lazy-simple',
  });

  const modal = new Modal({
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

  const submenu = new Submenu({
    single: false,
    duration: 300
  });

  const accordion = new Accordion({
    single: false,
    duration: 600
  });

  const form = new Form();
  const numberInput = new NumberInput();

  app
    .register('header', new Header())
    .register('mobileMenu', new MobileMenu())
    .register('lazyImage', lazyImage)
    .register('lazyBackground', lazyBackground)
    .register('lazyVideo', new LazyVideo())
    .register('modal', modal)
    .register('submenu', submenu)
    .register('accordion', accordion)
    .register('form', form)
    .register('numberInput', numberInput);

  // app.register('scrollTop', new ScrollTop());
  // app.register('gallery', new Gallery());
  // app.register('tab', new Tab());

  /*
   * Событийный контракт для интеграции (натяжка на CMS, сторонние скрипты):
   * document.dispatchEvent(new CustomEvent('modal:open', { detail: 'callback' }));
   * document.dispatchEvent(new CustomEvent('modal:close'));
   * document.dispatchEvent(new CustomEvent('app:update')); // после AJAX-вставки разметки
   */
  document.addEventListener('modal:open', (event) => modal.open(event.detail));
  document.addEventListener('modal:close', (event) => modal.close(event.detail));
  document.addEventListener('modal:closeAll', () => modal.closeAll());
  document.addEventListener('app:update', (event) => app.update(event.detail || document));

  /*
   * Публичный API для интеграторов. Контракт зафиксирован в DOCS.MD —
   * расширять только через него, внутренности компонентов снаружи не трогаем.
   */
  window.App = {
    modal: {
      open: (name) => modal.open(name),
      close: (name) => modal.close(name),
      closeAll: () => modal.closeAll(),
    },
    accordion: {
      open: (item) => accordion.open(item),
      close: (item) => accordion.close(item),
      toggle: (item) => accordion.toggle(item),
      closeAll: () => accordion.closeAll(),
    },
    update: (root) => app.update(root),
    destroy: () => app.destroy(),

    /* Запасной доступ к экземпляру: window.App.get('form') */
    get: (name) => app.get(name),
  };
});

/* --------- */
