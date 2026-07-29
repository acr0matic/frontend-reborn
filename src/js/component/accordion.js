import { Collapse } from "../utils/collapse";

/**
 * Class for managing accordion components
 */
export default class Accordion {
  /**
   * @typedef {Object} AccordionOptions
   * @property {number} [duration=600] - Animation duration in ms
   * @property {boolean} [single=false] - Only one accordion can be open at a time
   * @property {string} [initializedClass='is-initialized'] - CSS class for initialized accordions
   * @property {string} [accordionSelector='.c-accordion'] - Selector for accordion elements
   * @property {string} [headerSelector='.c-accordion__header'] - Selector for accordion headers
   * @property {string} [bodySelector='.c-accordion__body'] - Selector for accordion bodies
   * @property {Object} [modifier] - Modifier для изменения поведения аккордеона
   * @property {Object} [modifier.data] - Данные для модификатора
   * @property {Object} [modifier.data.text] - Текст для изменения при открытии/закрытии
   * @property {string} [modifier.data.text.close] - Текст при закрытии аккордеона
   * @property {string} [modifier.data.text.open] - Текст при открытии аккордеона
   */

  /**
   * Creates an Accordion instance
   * @param {AccordionOptions} [options={}] - Component options
   */
  constructor(options = {}) {
    this.options = {
      duration: options.duration ?? 600,
      single: options.single ?? false,
      initializedClass: options.initializedClass || 'is-initialized',
      accordionSelector: options.accordionSelector || '.c-accordion',
      headerSelector: options.headerSelector || '.c-accordion__header',
      bodySelector: options.bodySelector || '.c-accordion__body',
      modifier: options.modifier ?? undefined,
      ...options
    };

    this.init();
  }

  /**
   * Initializes the component
   */
  init() {
    this.update();
  }

  /**
   * Finds and initializes all uninitialized accordions
   */
  update() {
    const accordions = document.querySelectorAll(`${this.options.accordionSelector}:not(.${this.options.initializedClass})`);

    for (const accordion of accordions) {
      const header = accordion.querySelector(this.options.headerSelector);
      const body = accordion.querySelector(this.options.bodySelector);

      if (!header || !body) continue;

      const collapse = new Collapse(body, this.options.duration);
      accordion.__collapse = collapse;

      // Если есть модификатор с текстом, сохраняем оригинальный текст и добавляем элемент для текста
      if (this.options.modifier?.data?.text) {
        const textData = this.options.modifier.data.text;
        const textElement = header.querySelector('span');

        if (textElement) {
          accordion.__originalText = textElement.textContent;
          accordion.__textData = textData;

          // Добавляем событие для изменения текста при открытии/закрытии
          body.addEventListener('dropdownToggle', () => {
            const isOpen = accordion.classList.contains('is-open');
            const newText = isOpen ? textData.open : textData.close;
            textElement.textContent = newText;
          });
        }
      }

      header.addEventListener('click', () => {
        // Если включен режим single, закрываем другие аккордеоны
        if (this.options.single) {
          const allAccordions = document.querySelectorAll(this.options.accordionSelector);
          for (const otherAccordion of allAccordions) {
            if (otherAccordion !== accordion && otherAccordion.__collapse) {
              otherAccordion.__collapse.close();
              // Восстанавливаем текст для закрытых аккордеонов с анимацией
              if (otherAccordion.__textData) {
                const otherHeader = otherAccordion.querySelector(this.options.headerSelector);
                const otherTextElement = otherHeader?.querySelector('span');

                if (otherTextElement) {
                  otherTextElement.textContent = otherAccordion.__textData.close;
                }
              }
            }
          }
        }

        collapse.toggle();
      });

      accordion.classList.add(this.options.initializedClass);
    }
  }

  /**
   * Opens specific accordion
   * @param {HTMLElement|string} accordion - Accordion element or selector
   */
  open(accordion) {
    const element = typeof accordion === 'string' ? document.querySelector(accordion) : accordion;
    if (element && element.__collapse) {
      element.__collapse.open();
    }
  }

  /**
   * Closes specific accordion
   * @param {HTMLElement|string} accordion - Accordion element or selector
   */
  close(accordion) {
    const element = typeof accordion === 'string' ? document.querySelector(accordion) : accordion;
    if (element && element.__collapse) {
      element.__collapse.close();
    }
  }

  /**
   * Toggles specific accordion
   * @param {HTMLElement|string} accordion - Accordion element or selector
   */
  toggle(accordion) {
    const element = typeof accordion === 'string' ? document.querySelector(accordion) : accordion;
    if (element && element.__collapse) {
      element.__collapse.toggle();
    }
  }

  /**
   * Closes all accordions
   */
  closeAll() {
    const accordions = document.querySelectorAll(this.options.accordionSelector);
    for (const accordion of accordions) {
      if (accordion.__collapse) {
        accordion.__collapse.close();
      }
    }
  }
}
