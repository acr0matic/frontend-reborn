/**
 * Class for managing scroll-to-top button
 */
export class ScrollTop {
  /**
   * @typedef {Object} ScrollTopOptions
   * @property {string} [selector='.scroll-top'] - Селектор кнопки
   * @property {string} [visibleClass='scroll-top--visible'] - CSS-класс видимости
   * @property {number} [showThreshold=0.3] - Порог появления (0-1)
   * @property {string} [footerSelector='footer'] - Селектор футера
   * @property {number} [footerGap=24] - Отступ от футера (px)
   * @property {'before'|'on'|'off'} [footerMode='before'] - Режим позиционирования относительно футера: 'before' — перед ним, 'on' — на нём, 'off' — не реагировать
   * @property {number} [mobileBreakpoint=768] - Брейкпоинт отключения прилипания к футеру
   */
  constructor(options = {}) {
    this.options = {
      selector: '.scroll-top',
      visibleClass: 'scroll-top--visible',
      showThreshold: 0.3,
      footerSelector: 'footer',
      footerGap: 24,
      footerMode: 'before',
      mobileBreakpoint: 768,
      ...options,
    };

    this.button = undefined;
    this.footer = undefined;
    this.ticking = false;

    this.init();
  }

  init() {
    this.button = document.querySelector(this.options.selector);
    if (!this.button) return;

    this.footer = document.querySelector(this.options.footerSelector);

    // Привязываем методы
    this.onScroll = this.onScroll.bind(this);
    this.onClick = this.onClick.bind(this);

    window.addEventListener('scroll', this.onScroll, { passive: true });
    window.addEventListener('resize', this.onScroll, { passive: true });
    this.button.addEventListener('click', this.onClick);

    // Проверяем стартовое состояние
    this.update();
  }

  onScroll() {
    if (!this.ticking) {
      requestAnimationFrame(() => {
        this.update();
        this.ticking = false;
      });
      this.ticking = true;
    }
  }

  isMobile() {
    const bpTablet = getComputedStyle(document.documentElement)
      .getPropertyValue('--bp-tablet')
      .trim();
    const tabletValue = Number.parseFloat(bpTablet);

    return Number.isNaN(tabletValue)
      ? window.innerWidth < this.options.mobileBreakpoint
      : window.innerWidth < tabletValue;
  }

  update() {
    if (!this.button) return;

    const scrollY = window.scrollY || window.pageYOffset;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;

    // Показ/скрытие кнопки по порогу
    const scrollPercent = documentHeight > 0 ? scrollY / documentHeight : 0;
    const isVisible = scrollPercent >= this.options.showThreshold;

    this.button.classList.toggle(this.options.visibleClass, isVisible);

    if (!isVisible) return;

    // Позиционирование относительно футера
    if (this.options.footerMode === 'off' || this.isMobile() || !this.footer) {
      this.resetPosition();
      return;
    }

    const footerRect = this.footer.getBoundingClientRect();

    if (footerRect.top <= windowHeight) {
      // Вычисляем сдвиг вверх, когда футер входит в viewport
      const extraOffset = this.options.footerMode === 'before' ? this.options.footerGap : 0;
      const offset = windowHeight - footerRect.top + extraOffset;
      this.button.style.transform = `translateY(-${offset}px)`;
    } else {
      this.resetPosition();
    }
  }

  resetPosition() {
    if (this.button) {
      this.button.style.transform = '';
    }
  }

  onClick(e) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  destroy() {
    if (!this.button) return;

    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onScroll);
    this.button.removeEventListener('click', this.onClick);

    this.resetPosition();
    this.button.classList.remove(this.options.visibleClass);
  }
}

export default ScrollTop;