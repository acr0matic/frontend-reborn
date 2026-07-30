# Памятка по работе со скриптами `frontend-reborn`

## Сборка и запуск

- Разработка: `yarn dev`
- Сборка: `yarn build`
- Сборка под WordPress: `yarn build_wp`

При сборке автоматически запускаются ESLint и Stylelint.

## Структура JS

- `src/js/app.js` — точка входа. Подключаёт стили, `init.js` и лейауты.
- `src/js/global/init.js` — центр инициализации. Создаёт контроллеры в `DOMContentLoaded` и публикует их в `window.App`.
- `src/js/component/` — переиспользуемые UI-компоненты-контроллеры (`Modal`, `Submenu`, `Accordion`, `Form`, `NumberInput`, `Gallery`, `Tab`).
- `src/js/utils/` — вспомогательные классы и функции (`Collapse`, `ScrollTop`, `video-optimization`).
- `src/js/layout/` — логика страниц и глобальных участков (`header`, `menu`).
- `src/js/libs/` — сторонние библиотеки, не из npm.

## Архитектура компонентов

Все компоненты оформлены как **менеджеры коллекций** с единым API:

- `init()` — первичная инициализация
- `update()` — поиск новых элементов в DOM и инициализация только их
- `destroy()` — удаление всех обработчиков и очистка

Каждый компонент принимает `selector` в опциях и поддерживает callback'и для кастомизации поведения отдельных элементов.

## Как добавить компонент

1. Создайте класс в `src/js/component/` (или `utils/`, или `layout/`).
2. Используйте `export default class` для контроллеров.
3. Добавьте методы `init()`, `update()`, `destroy()`.
4. Импортируйте и создайте экземпляр в `src/js/global/init.js`.
5. Сохраните ссылку в `window.App.<name>`.
6. По возможности добавьте JSDoc, особенно `@typedef` для опций конструктора.

## Глобальный объект `window.App`

В `init.js` публикуются контроллеры, к которым можно обращаться извне:

```js
window.App.modal.open('modal-id');
window.App.modal.close();

window.App.accordion.closeAll();
window.App.accordion.update(); // для динамически добавленных аккордеонов

window.App.submenu.update();

window.App.form.update();     // для динамически добавленных форм
window.App.form.get('#form-id'); // получить конкретную форму

window.App.numberInput.update(); // для динамически добавленных number-полей
```

## Callback'и для кастомизации

### Modal

```js
new Modal({
  onBeforeOpen: (modal) => { /* перед открытием */ },
  onShow: (modal) => { /* после открытия */ },
  onBeforeClose: (modal) => { /* перед закрытием */ },
  onClose: (modal) => { /* после закрытия */ },
  onCloseAll: () => { /* после закрытия всех */ },
});
```

### Accordion

```js
new Accordion({
  single: true,
  onBeforeOpen: (accordion, body) => { /* перед открытием */ },
  onOpen: (accordion, body) => { /* после открытия */ },
  onBeforeClose: (accordion, body) => { /* перед закрытием */ },
  onClose: (accordion, body) => { /* после закрытия */ },
});
```

Также можно использовать data-атрибуты для кастомизации отдельных аккордеонов внутри callback'ов:

```js
new Accordion({
  onBeforeOpen: (accordion) => {
    if (accordion.dataset.accordionGsap === 'true') {
      // кастомная анимация
    }
  },
});
```

### Submenu

```js
new Submenu({
  onOpen: (menu) => { /* после открытия */ },
  onClose: (menu) => { /* после закрытия */ },
  onToggle: (menu, isOpen) => { /* при любом переключении */ },
});
```

### Form

```js
new Form({
  onSubmit: (form, event) => { /* при сабмите */ },
  onReset: (form) => { /* при сбросе */ },
  onValidate: (form, isValid) => { /* при изменении состояния privacy */ },
});
```

- Кнопка с `data-action="reset"` вызывает сброс формы.
- Формы ищутся по классу `.form-custom`.
- Доступ к конкретной форме — через `window.App.form.get('#form-id')`.

### Number inputs

- Автоматически инициализируются для `input[type="number"]` с атрибутами `min`/`max`.
- При `change` значение приводится к границам. Пустое/некорректное значение сбрасывается к `min` или очищается.

### Видео

- `PlayVideoInViewport()` ставит на паузу/воспроизведение видео с атрибутом `[lazy-video]` в зависимости от видимости во viewport.

### Лейаут

- `header.js` обновляет CSS-переменную `--header-height` при загрузке и ресайзе.
- `menu.js` управляет мобильным меню: открытие по `.hamburger`, закрытие по клику вне `.mobile-menu__content`.

## Подключение галереи и табов

Файлы `component/gallery.js` и `component/tabs.js` используют `swiper`. Перед раскомментированием их импортов установите зависимость:

```bash
yarn add swiper
```

После установки импортируйте в `init.js` и создайте экземпляры:

```js
import Gallery from '../component/gallery';
import Tab from '../component/tabs';

// в DOMContentLoaded:
window.App.gallery = new Gallery();
window.App.tab = new Tab();
```

## Стилистика и линтеры

- ESLint: `standard` + `unicorn/recommended`.
- StyleLint: `stylelint-config-standard-scss`.
- Комментарии и JSDoc пишутся на русском языке.
