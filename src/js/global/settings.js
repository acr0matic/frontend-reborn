/* Все объекты конфигураций для скриптов */

// Повторяющиеся стили
export const StyleСlass = {
  mobile: {
    open: 'mobile-menu--open',
  },
};

// Для адаптивности скриптов
export const breakpoint = {
  size: '(min-width: )',
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
    window.currentModal = null;
  }
};
