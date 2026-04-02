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
   * @property {string} [accordionSelector='.b-accordion'] - Selector for accordion elements
   * @property {string} [headerSelector='.b-accordion__header'] - Selector for accordion headers
   * @property {string} [bodySelector='.b-accordion__body'] - Selector for accordion bodies
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
      accordionSelector: options.accordionSelector || '.b-accordion',
      headerSelector: options.headerSelector || '.b-accordion__header',
      bodySelector: options.bodySelector || '.b-accordion__body',
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

      header.addEventListener('click', () => {
        // Если включен режим single, закрываем другие аккордеоны
        if (this.options.single) {
          const allAccordions = document.querySelectorAll(this.options.accordionSelector);
          for (const otherAccordion of allAccordions) {
            if (otherAccordion !== accordion && otherAccordion.__collapse) {
              otherAccordion.__collapse.close();
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
