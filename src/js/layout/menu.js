import { header } from "./header";
import { StyleClass } from "../global/settings";

const menu = header?.querySelector('.mobile-menu');

if (menu) {
  const button = header.querySelector('.hamburger');

  const toggleMenu = (isOpen) => {
    menu.classList.toggle(StyleClass.state.open, isOpen);
    button.classList.toggle(StyleClass.state.active, isOpen);
    document.body.classList.toggle(StyleClass.body.scroll, isOpen);
  };

  window.addEventListener('click', (e) => {
    const target = e.target;

    if (target.closest('.hamburger')) {
      const isMenuOpen = menu.classList.contains(StyleClass.state.open);
      toggleMenu(!isMenuOpen);
    }

    else if (!target.closest('.mobile-menu__content')) {
      toggleMenu(false);
    }
  });
}
