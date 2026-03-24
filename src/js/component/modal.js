
export class Modal {
  constructor(options = {}) {
    this.options = {
      activeClass: options.activeClass || 'is-active',
      scrollLockClass: options.scrollLockClass || 'is-scroll-locked',
      ...options
    };

    this.openedModals = [];
    this.init();
  }

  init() {
    document.addEventListener('click', (e) => {
      const openTrigger = e.target.closest('[data-modal-open]');
      if (openTrigger) {
        e.preventDefault();
        const modalId = openTrigger.dataset.modalOpen;

        const event = new CustomEvent('modalBeforeOpen', {
          detail: { modalId, trigger: openTrigger }
        });
        window.dispatchEvent(event);

        this.open(modalId, openTrigger);
      }

      const closeTrigger = e.target.closest('[data-modal-close]');
      if (closeTrigger) {
        e.preventDefault();
        this.close();
      }
    });

    // Close on overlay click
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal__overlay')) {
        this.close();
      }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.close();
      }
    });
  }

  open(modalId, triggerElement) {
    const modal = document.querySelector(`[data-modal="${modalId}"]`);
    if (!modal) return;

    modal.classList.add(this.options.activeClass);
    this.openedModals.push(modal);

    // Trigger modalOpened custom event
    const openedEvent = new CustomEvent('modalOpened', {
      detail: { modalId, modal, trigger: triggerElement }
    });
    window.dispatchEvent(openedEvent);

    if (this.openedModals.length === 1) {
      this.lockScroll();
    }
  }

  close() {
    if (this.openedModals.length === 0) return;

    const modal = this.openedModals.pop();
    modal.classList.remove(this.options.activeClass);

    // Trigger modalClosed custom event
    const closedEvent = new CustomEvent('modalClosed', {
      detail: { modal }
    });
    window.dispatchEvent(closedEvent);

    if (this.openedModals.length === 0) {
      this.unlockScroll();
      this.enableGsapScroll();
    }
  }

  closeAll() {
    while (this.openedModals.length > 0) {
      const modal = this.openedModals.pop();
      modal.classList.remove(this.options.activeClass);

      // Trigger modalClosed custom event
      const closedEvent = new CustomEvent('modalClosed', {
        detail: { modal }
      });
      window.dispatchEvent(closedEvent);
    }

    this.unlockScroll();
    this.enableGsapScroll();
  }

  lockScroll() {
    document.body.classList.add(this.options.scrollLockClass);
  }

  unlockScroll() {
    document.body.classList.remove(this.options.scrollLockClass);
  }
}
