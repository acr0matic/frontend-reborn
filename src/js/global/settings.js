/* Все объекты конфигураций для скриптов */

// Повторяющиеся стили
export const StyleСlass = {
  mobile: {
    open: 'mobile-menu--open',
  },

  body: {
    scroll: 'scroll-lock'
  },

};

// Для адаптивности скриптов
export const breakpoint = {
  mobile: '(min-width: 480px)',
};

// Базовые настройки для MicroModal.js
export const modalParams = {
  awaitCloseAnimation: true,
  disableFocus: true,
  disableScroll: true,

  onShow: modal => {
    window.currentModal = modal.id;
  },

  onClose: () => {
    window.currentModal = undefined;
  }
};
