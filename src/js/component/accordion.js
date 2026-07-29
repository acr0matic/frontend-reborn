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
   * @property {(accordion: HTMLElement, body: HTMLElement) => void} [onBeforeOpen] - Перед открытием
   * @property {(accordion: HTMLElement, body: HTMLElement) => void} [onOpen] - После открытия
   * @property {(accordion: HTMLElement, body: HTMLElement) => void} [onBeforeClose] - Перед закрытием
   * @property {(accordion: HTMLElement, body: HTMLElement) => void} [onClose] - После закрытия
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
      onBeforeOpen: () => {},
      onOpen: () => {},
      onBeforeClose: () => {},
      onClose: () => {},
      ...options
    };

    this.instances = [];
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
    this.instances = this.instances.filter((instance) => {
      if (document.contains(instance.el)) return true;
      this.destroyInstance(instance);
      return false;
    });

    const accordions = document.querySelectorAll(`${this.options.accordionSelector}:not(.${this.options.initializedClass})`);

    for (const accordion of accordions) {
      const header = accordion.querySelector(this.options.headerSelector);
      const body = accordion.querySelector(this.options.bodySelector);

      if (!header || !body) continue;

      const collapse = new Collapse(body, this.options.duration);
      accordion.__collapse = collapse;

      const instance = {
        el: accordion,
        header,
        body,
        collapse,
        textElement: undefined,
        textData: undefined,
      };

      // Если есть модификатор с текстом, сохраняем оригинальный текст
      if (this.options.modifier?.data?.text) {
        const textData = this.options.modifier.data.text;
        const textElement = header.querySelector('span');

        if (textElement) {
          accordion.__originalText = textElement.textContent;
          accordion.__textData = textData;
          instance.textElement = textElement;
          instance.textData = textData;
        }
      }

      instance.headerClickHandler = this.createHeaderClickHandler(instance);
      instance.dropdownStartHandler = this.createDropdownStartHandler(instance);
      instance.dropdownEndHandler = this.createDropdownEndHandler(instance);

      header.addEventListener('click', instance.headerClickHandler);
      body.addEventListener('dropdownToggleStart', instance.dropdownStartHandler);
      body.addEventListener('dropdownToggle', instance.dropdownEndHandler);

      accordion.classList.add(this.options.initializedClass);
      this.instances.push(instance);
    }
  }

  createHeaderClickHandler(instance) {
    return () => {
      if (this.options.single) {
        this.closeAllExcept(instance.el);
      }

      instance.collapse.toggle();
    };
  }

  closeAllExcept(excludedEl) {
    const allAccordions = document.querySelectorAll(this.options.accordionSelector);
    for (const otherAccordion of allAccordions) {
      if (otherAccordion !== excludedEl && otherAccordion.__collapse) {
        otherAccordion.__collapse.close();
      }
    }
  }

  createDropdownStartHandler(instance) {
    return () => {
      const isOpen = instance.el.classList.contains('is-open');

      if (isOpen) {
        this.options.onBeforeOpen(instance.el, instance.body);
      } else {
        this.options.onBeforeClose(instance.el, instance.body);
      }
    };
  }

  createDropdownEndHandler(instance) {
    return () => {
      const isOpen = instance.el.classList.contains('is-open');

      if (instance.textElement && instance.textData) {
        instance.textElement.textContent = isOpen ? instance.textData.open : instance.textData.close;
      }

      if (isOpen) {
        this.options.onOpen(instance.el, instance.body);
      } else {
        this.options.onClose(instance.el, instance.body);
      }
    };
  }

  destroyInstance(instance) {
    instance.header.removeEventListener('click', instance.headerClickHandler);
    instance.body.removeEventListener('dropdownToggleStart', instance.dropdownStartHandler);
    instance.body.removeEventListener('dropdownToggle', instance.dropdownEndHandler);
    instance.el.classList.remove(this.options.initializedClass);
    delete instance.el.__collapse;
  }

  getInstance(accordion) {
    const element = typeof accordion === 'string' ? document.querySelector(accordion) : accordion;
    return this.instances.find((instance) => instance.el === element);
  }

  /**
   * Opens specific accordion
   * @param {HTMLElement|string} accordion - Accordion element or selector
   */
  open(accordion) {
    const instance = this.getInstance(accordion);
    if (instance) {
      if (this.options.single) {
        this.closeAllExcept(instance.el);
      }
      instance.collapse.open();
    }
  }

  /**
   * Closes specific accordion
   * @param {HTMLElement|string} accordion - Accordion element or selector
   */
  close(accordion) {
    const instance = this.getInstance(accordion);
    if (instance) {
      instance.collapse.close();
    }
  }

  /**
   * Toggles specific accordion
   * @param {HTMLElement|string} accordion - Accordion element or selector
   */
  toggle(accordion) {
    const instance = this.getInstance(accordion);
    if (instance) {
      if (this.options.single) {
        this.closeAllExcept(instance.el);
      }
      instance.collapse.toggle();
    }
  }

  /**
   * Closes all accordions
   */
  closeAll() {
    for (const instance of this.instances) {
      instance.collapse.close();
    }
  }

  /**
   * Destroys all accordions
   */
  destroy() {
    for (const instance of this.instances) {
      this.destroyInstance(instance);
    }
    this.instances = [];
  }
}
