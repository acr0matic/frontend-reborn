import { StyleClass } from "../global/settings";

/**
 * Мобильное меню: открытие по гамбургеру, закрытие по клику вне контента и по Escape
 */
export default class MobileMenu {
  constructor(options = {}) {
    this.options = {
      menuSelector: '.mobile-menu',
      contentSelector: '.mobile-menu__content',
      buttonSelector: '.hamburger',
      ...options,
    };

    this.controller = new AbortController();
    this.menu = undefined;
    this.button = undefined;

    this.init();
  }

  init() {
    this.update();

    window.addEventListener('click', this.onWindowClick, { signal: this.controller.signal });
    window.addEventListener('keydown', this.onWindowKeydown, { signal: this.controller.signal });
  }

  onWindowClick = (event) => {
    const target = event.target;

    if (target.closest(this.options.buttonSelector)) {
      const isOpen = this.menu?.classList.contains(StyleClass.state.open);
      this.toggle(!isOpen);
    } else if (!target.closest(this.options.contentSelector)) {
      this.toggle(false);
    }
  };

  onWindowKeydown = (event) => {
    if (event.key === 'Escape') this.toggle(false);
  };

  toggle(isOpen) {
    if (!this.menu) return;

    this.menu.classList.toggle(StyleClass.state.open, isOpen);
    this.button?.classList.toggle(StyleClass.state.active, isOpen);
    this.button?.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle(StyleClass.body.scroll, isOpen);
  }

  update() {
    this.menu = document.querySelector(this.options.menuSelector);
    this.button = document.querySelector(this.options.buttonSelector);
  }

  destroy() {
    this.controller.abort();
    this.toggle(false);
    this.menu = undefined;
    this.button = undefined;
  }
}
