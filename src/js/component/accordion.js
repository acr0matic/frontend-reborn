import { Collapse } from '../utils/collapse';

const accordions = document.querySelectorAll('.accordion');

for (const accordion of accordions) {
  const header = accordion.querySelector('.accordion__header'); // Задаем блок для клика на открытие
  const body = accordion.querySelector('.accordion__body'); // Задаем контейнер для раскрытия скриптом
  const collapse = new Collapse(body, 600); // Инициализация, задаем скорость открытия

  header.addEventListener('click', () => collapse.toggle()); // Вешаем обработчик на header чтобы открывался body
}