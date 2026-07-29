import { Collapse } from "../utils/collapse";

/**
 * Class for managing navigation submenus
 */
export default class Submenu {
  /**
   * @typedef {Object} SubmenuOptions
   * @property {boolean} [single=false] - Only one submenu can be open at a time
   * @property {number} [duration=300] - Animation duration in ms
   * @property {string} [initializedClass='is-initialized'] - CSS class for initialized submenus
   * @property {string} [openClass='open'] - CSS class for open state
   * @property {(menu: HTMLElement) => void} [onOpen] - После открытия
   * @property {(menu: HTMLElement) => void} [onClose] - После закрытия
   * @property {(menu: HTMLElement, isOpen: boolean) => void} [onToggle] - При переключении
   */

  /**
   * Creates a Submenu instance
   * @param {SubmenuOptions} [options={}] - Component options
   */
  constructor(options = {}) {
    this.options = {
      single: options.single ?? false,
      duration: options.duration ?? 300,
      initializedClass: 'is-initialized',
      openClass: 'open',
      onOpen: () => {},
      onClose: () => {},
      onToggle: () => {},
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
   * Finds and initializes all uninitialized submenus
   */
  update() {
    this.instances = this.instances.filter((instance) => {
      if (document.contains(instance.el)) return true;
      this.destroyInstance(instance);
      return false;
    });

    const submenus = document.querySelectorAll(`.nav__submenu:not(.${this.options.initializedClass})`);

    for (const menu of submenus) {
      const list = menu.querySelector('ul');
      if (!list) continue;

      const collapse = new Collapse(list, this.options.duration);
      menu.__collapse = collapse;

      const instance = {
        el: menu,
        list,
        collapse,
      };

      instance.clickHandler = this.createClickHandler(instance);
      menu.addEventListener('click', instance.clickHandler);

      menu.classList.add(this.options.initializedClass);
      this.instances.push(instance);
    }
  }

  createClickHandler(instance) {
    return (event) => {
      const link = event.target.closest('.nav__link');
      if (link) return;

      const menu = instance.el;
      const isOpen = menu.classList.contains(this.options.openClass);

      if (this.options.single && !isOpen) {
        const parentList = menu.closest('ul');
        if (parentList) {
          const openSiblings = parentList.querySelectorAll(`:scope > .nav__submenu.${this.options.openClass}`);
          for (const sibling of openSiblings) {
            if (sibling !== menu && sibling.__collapse) {
              sibling.__collapse.toggle();
              sibling.classList.remove(this.options.openClass);
            }
          }
        }
      }

      instance.collapse.toggle();
      menu.classList.toggle(this.options.openClass);

      const nowOpen = menu.classList.contains(this.options.openClass);
      this.options.onToggle(menu, nowOpen);

      if (nowOpen) {
        this.options.onOpen(menu);
      } else {
        this.options.onClose(menu);
      }
    };
  }

  getInstance(menu) {
    const element = typeof menu === 'string' ? document.querySelector(menu) : menu;
    return this.instances.find((instance) => instance.el === element);
  }

  open(menu) {
    const instance = this.getInstance(menu);
    if (instance && !instance.el.classList.contains(this.options.openClass)) {
      if (this.options.single) {
        this.closeSiblings(instance.el);
      }
      instance.collapse.open();
      instance.el.classList.add(this.options.openClass);
      this.options.onOpen(instance.el);
    }
  }

  close(menu) {
    const instance = this.getInstance(menu);
    if (instance && instance.el.classList.contains(this.options.openClass)) {
      instance.collapse.close();
      instance.el.classList.remove(this.options.openClass);
      this.options.onClose(instance.el);
    }
  }

  toggle(menu) {
    const instance = this.getInstance(menu);
    if (instance) {
      const isOpen = instance.el.classList.contains(this.options.openClass);
      if (this.options.single && !isOpen) {
        this.closeSiblings(instance.el);
      }
      instance.collapse.toggle();
      instance.el.classList.toggle(this.options.openClass);

      const nowOpen = instance.el.classList.contains(this.options.openClass);
      this.options.onToggle(instance.el, nowOpen);

      if (nowOpen) {
        this.options.onOpen(instance.el);
      } else {
        this.options.onClose(instance.el);
      }
    }
  }

  closeSiblings(excludedEl) {
    const parentList = excludedEl.closest('ul');
    if (!parentList) return;

    const openSiblings = parentList.querySelectorAll(`:scope > .nav__submenu.${this.options.openClass}`);
    for (const sibling of openSiblings) {
      if (sibling !== excludedEl && sibling.__collapse) {
        sibling.__collapse.close();
        sibling.classList.remove(this.options.openClass);
      }
    }
  }

  closeAll() {
    for (const instance of this.instances) {
      if (instance.el.classList.contains(this.options.openClass)) {
        instance.collapse.close();
        instance.el.classList.remove(this.options.openClass);
        this.options.onClose(instance.el);
      }
    }
  }

  destroyInstance(instance) {
    instance.el.removeEventListener('click', instance.clickHandler);
    instance.el.classList.remove(this.options.initializedClass);
    delete instance.el.__collapse;
  }

  destroy() {
    for (const instance of this.instances) {
      this.destroyInstance(instance);
    }
    this.instances = [];
  }
}
