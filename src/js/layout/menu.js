import { header } from "./header";
import { StyleСlass } from "../global/settings";

const menu = header.querySelector('.mobile-menu');
const button = header.querySelector('.hamburger');

if (menu) {
  const toggleMenu = (isOpen) => {
    menu.classList.toggle(StyleСlass.state.open, isOpen);
    button.classList.toggle(StyleСlass.state.active, isOpen);
    document.body.classList.toggle(StyleСlass.body.scroll, isOpen);
  };

  window.addEventListener('click', (e) => {
    const target = e.target;

    if (target.closest('.hamburger')) {
      const isMenuOpen = menu.classList.contains(StyleСlass.state.open);
      toggleMenu(!isMenuOpen);
    }
    else if (!target.closest('.mobile-menu__content')) {
      toggleMenu(false);
    }
  });
}
