import { SetSize } from "../global/func";

/**
 * Шапка сайта: прокидывает её высоту в CSS-переменную и следит за resize
 */
export default class Header {
  constructor(options = {}) {
    this.options = {
      selector: '#header',
      ...options,
    };

    this.controller = new AbortController();
    this.el = undefined;

    this.init();
  }

  init() {
    this.update();
    window.addEventListener('resize', this.onResize, { signal: this.controller.signal });
  }

  onResize = () => {
    if (this.el) SetSize(this.el, 'header');
  };

  update() {
    this.el = document.querySelector(this.options.selector);
    if (this.el) SetSize(this.el, 'header');
  }

  destroy() {
    this.controller.abort();
    this.el = undefined;
  }
}
