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
   * Finds and initializes all uninitialized submenus
   */
  update() {
    const submenus = document.querySelectorAll(`.nav__submenu:not(.${this.options.initializedClass})`);

    for (const menu of submenus) {
      const list = menu.querySelector('ul');
      if (!list) continue;

      const collapse = new Collapse(list, this.options.duration);
      menu.__collapse = collapse;

      menu.addEventListener('click', (e) => {
        const link = e.target.closest('.nav__link');

        if (!link) {
          if (this.options.single && !menu.classList.contains(this.options.openClass)) {
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

          collapse.toggle();
          menu.classList.toggle(this.options.openClass);
        }
      });

      menu.classList.add(this.options.initializedClass);
    }
  }
}