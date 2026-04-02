/**
 * Class for managing modal windows
 */
class Modal {
  /**
   * @typedef {Object} ModalOptions
   * @property {string} [activeClass='is-show'] - CSS class for active state
   * @property {string} [scrollLockClass='is-scroll-locked'] - CSS class for scroll lock
   * @property {string} [modalSelector='data-modal'] - Selector for finding modals
   * @property {boolean} [closeOnEsc=true] - Close on Escape key
   * @property {boolean} [closeOnOverlay=true] - Close on overlay click
   * @property {boolean} [catchFocus=true] - Focus management inside modal
   * @property {string} [openSelector='data-modal-open'] - Selector for open triggers
   * @property {string} [closeSelector='data-modal-close'] - Selector for close triggers
   * @property {function} [onShow] - Callback on modal open
   * @property {function} [onClose] - Callback on modal close
   * @property {function} [onCloseAll] - Callback when all modals are closed
   */

  /**
   * Creates a Modal instance
   * @param {ModalOptions} [options={}] - Component options
   */
  constructor(options = {}) {
    this.options = {
      activeClass: options.activeClass || 'is-show',
      scrollLockClass: options.scrollLockClass || 'is-scroll-locked',
      modalSelector: options.modalSelector || 'data-modal',
      closeOnEsc: options.closeOnEsc ?? true,
      closeOnOverlay: options.closeOnOverlay ?? true,
      catchFocus: options.catchFocus ?? true,
      onShow: typeof options.onShow === 'function' ? options.onShow : () => {},
      onClose: typeof options.onClose === 'function' ? options.onClose : () => {},
      onCloseAll: options.onCloseAll || undefined,
      openSelector: options.openSelector || 'data-modal-open',
      closeSelector: options.closeSelector || 'data-modal-close',
      ...options
    };

    this.openedModals = [];
    this.init();
  }

  /**
   * Initializes the component
   */
  init() {
    // Один глобальный слушатель на все клики
    document.addEventListener('click', (e) => {
      // Клик по триггеру открытия
      const openTrigger = e.target.closest(`[${this.options.openSelector}]`);
      if (openTrigger) {
        e.preventDefault();
        const modalId = openTrigger.getAttribute(this.options.openSelector);

        window.dispatchEvent(new CustomEvent('modalBeforeOpen', {
          detail: { modalId, trigger: openTrigger }
        }));

        this.open(modalId, openTrigger);
        return; // Дальше не проверяем, работу сделали
      }

      // Клик по кнопке закрытия
      const closeTrigger = e.target.closest(`[${this.options.closeSelector}]`);
      if (closeTrigger) {
        e.preventDefault();
        const modalId = closeTrigger.getAttribute(this.options.closeSelector);
        if (modalId) {
          this.close(modalId);
        } else {
          this.close();
        }
        return;
      }

      // Клик по оверлею
      if (this.options.closeOnOverlay && e.target.classList.contains('modal__overlay')) {
        this.close();
      }
    });

    // Обработка клавиатуры
    document.addEventListener('keydown', (e) => {
      if (this.openedModals.length === 0) return;

      // Обработка Escape
      if (e.key === 'Escape' && this.options.closeOnEsc) {
        this.close();
        return;
      }

      // Обработка Tab (catchFocus)
      if (e.key === 'Tab' && this.options.catchFocus) {
        const currentModal = this.openedModals.at(-1);
        const focusableElements = [...currentModal.querySelectorAll(
          'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]'
        )].filter(el => el.tabIndex !== -1 && el.offsetParent !== null);

        if (focusableElements.length === 0) {
          e.preventDefault();
          return;
        }

        const first = focusableElements[0];
        const last = focusableElements.at(-1);

        if (e.shiftKey) {
          if (document.activeElement === first || !currentModal.contains(document.activeElement)) {
            last.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === last || !currentModal.contains(document.activeElement)) {
            first.focus();
            e.preventDefault();
          }
        }
      }
    });
  }

  /**
   * Opens a modal window
   * @param {string} modalId - Modal window ID
   * @param {HTMLElement} triggerElement - Element that triggered the opening
   */
  open(modalId, triggerElement) {
    const modal = document.querySelector(`[${this.options.modalSelector}="${modalId}"]`);
    if (!modal) {
      console.warn(`[Modal]: Модальное окно с ID "${modalId}" не найдено в DOM.`);
      return;
    }

    modal.classList.add(this.options.activeClass);
    this.openedModals.push(modal);

    if (this.options.catchFocus) {
      modal.previousActiveElement = document.activeElement;

      setTimeout(() => {
        const focusableElements = [...modal.querySelectorAll(
          'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]'
        )].filter(el => el.tabIndex !== -1 && el.offsetParent !== null);

        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        } else {
          modal.focus();
        }
      }, 0);
    }

    window.dispatchEvent(new CustomEvent('modalOpened', {
      detail: { modalId, modal, trigger: triggerElement }
    }));

    this.options.onShow(modal);

    if (this.openedModals.length === 1) {
      this.lockScroll();
    }
  }

  /**
   * Closes a modal window
   * @param {string} [modalId] - ID of specific modal to close
   */
  close(modalId) {
    if (this.openedModals.length === 0) return;

    let modal;

    if (modalId) {
      modal = document.querySelector(`[${this.options.modalSelector}="${modalId}"]`);
      if (!modal) {
        console.warn(`[Modal]: Модальное окно с ID "${modalId}" не найдено.`);
        return;
      }

      const modalIndex = this.openedModals.indexOf(modal);
      if (modalIndex === -1) {
        console.warn(`[Modal]: Модальное окно с ID "${modalId}" не найдено в списке открытых.`);
        return;
      }

      this.openedModals.splice(modalIndex, 1);
    } else {
      // Закрываем последнюю открытую модалку
      modal = this.openedModals.pop();
    }

    modal.classList.remove(this.options.activeClass);

    if (this.options.catchFocus && modal.previousActiveElement) {
      modal.previousActiveElement.focus();
    }

    this.options.onClose(modal);

    window.dispatchEvent(new CustomEvent('modalClosed', {
      detail: { modal }
    }));

    // Если закрыли последнюю модалку
    if (this.openedModals.length === 0) {
      this.unlockScroll();

      // Вызываем внешний хук, если он был передан
      if (typeof this.options.onCloseAll === 'function') {
        this.options.onCloseAll();
      }
    }
  }

  /**
   * Closes all open modal windows
   */
  closeAll() {
    while (this.openedModals.length > 0) {
      const modal = this.openedModals.pop();
      modal.classList.remove(this.options.activeClass);

      window.dispatchEvent(new CustomEvent('modalClosed', {
        detail: { modal }
      }));
    }

    this.unlockScroll();

    if (typeof this.options.onCloseAll === 'function') {
      this.options.onCloseAll();
    }
  }

  /**
   * Locks page scrolling
   */
  lockScroll() {
    // Вычисляем ширину скроллбара, чтобы контент не прыгал при его скрытии
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.classList.add(this.options.scrollLockClass);
  }

  /**
   * Unlocks page scrolling
   */
  unlockScroll() {
    document.body.style.paddingRight = '';
    document.body.classList.remove(this.options.scrollLockClass);
  }
}

export default Modal;
export { Modal };