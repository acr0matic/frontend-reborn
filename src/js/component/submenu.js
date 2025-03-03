import { Collapse } from "../utils/collapse";

const submenu = document.querySelectorAll('.nav__submenu');

for (const menu of submenu) {
  const list = menu.querySelector('ul');
  const collapse = new Collapse(list, 300);

  menu.addEventListener('click', (e) => {
    if (!e.target.classList.contains('nav__link')) collapse.toggle();
  });

  list.classList.add('collapse');

  list.addEventListener('dropdownToggle', () => {
    list.classList.toggle('open');
  });
}