import { Collapse } from '../utils/collapse';

const accordions = document.querySelectorAll('.b-accordion');

for (const accordion of accordions) {
  const header = accordion.querySelector('.b-accordion__header'); // Задаем блок для клика на открытие
  const body = accordion.querySelector('.b-accordion__body'); // Задаем контейнер для раскрытия скриптом
  const collapse = new Collapse(body, 600); // Инициализация, задаем скорость открытия

  header.addEventListener('click', () => collapse.toggle()); // Вешаем обработчик на header чтобы открывался body
}