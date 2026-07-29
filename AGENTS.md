# Памятка по работе со скриптами `frontend-reborn`

## Сборка и запуск

- Разработка: `yarn dev`
- Сборка: `yarn build`
- Сборка под WordPress: `yarn build_wp`

При сборке автоматически запускаются ESLint и Stylelint.

## Структура JS

- `src/js/app.js` — точка входа. Подключаёт стили, `init.js` и лейауты.
- `src/js/global/init.js` — центр инициализации. Создаёт контроллеры и публикует их в `window.App`.
- `src/js/component/` — переиспользуемые UI-компоненты (Modal, Submenu, Accordion, Forms, NumberInputs).
- `src/js/utils/` — вспомогательные классы и функции (Collapse, ScrollTop, video-optimization).
- `src/js/layout/` — логика страниц и глобальных участков (header, menu).
- `src/js/libs/` — сторонние библиотеки, не из npm.

## Как добавить компонент

1. Создайте класс в `src/js/component/` (или `utils/`, или `layout/`).
2. Используйте `export default class` для контроллеров, чтобы быть консистентным с `Modal`, `Submenu`, `Accordion`, `Forms`.
3. Импортируйте и создайте экземпляр в `src/js/global/init.js`.
4. При необходимости сохраните ссылку в `window.App.<name>`.
5. По возможности добавьте JSDoc, особенно `@typedef` для опций конструктора.

## Глобальный объект `window.App`

В `init.js` публикуются контроллеры, к которым можно обращаться извне:

```js
window.App.modal.open('modal-id');
window.App.modal.close();
window.App.accordion.closeAll();
window.App.accordion.update(); // для динамически добавленных аккордеонов
window.App.submenu.update();
window.App.forms.update();     // для динамически добавленных форм
window.App.numberInputs.update(); // для динамически добавленных number-полей
```

## Важные моменты

### Формы

- Формы ищутся по классу `.form-custom`.
- Класс `Form` можно использовать напрямую: `new Form(formElement)`.
- Для динамического контента используйте `window.App.forms.update()`.
- Кнопка с `data-action="reset"` вызывает `Form.reset()`.

### Модалки

- Модалка привязывается к `data-modal`, открывается по `data-modal-open="id"`, закрывается по `data-modal-close="id"`.
- Поддерживается стек модалок: Escape и фокус работают с последней открытой.

### Аккордеоны

- Дефолтные селекторы: `.c-accordion`, `.c-accordion__header`, `.c-accordion__body`.
- Есть режим `single` — один открытый элемент.
- Модификатор `modifier.data.text` меняет текст заголовка при открытии/закрытии.

### Number inputs

- Автоматически инициализируются для `input[type="number"]` с атрибутами `min`/`max`.
- При `change` значение приводится к границам. Пустое/некорректное значение сбрасывается к `min` или очищается.

### Видео

- `PlayVideoInViewport()` ставит на паузу/воспроизведение видео с атрибутом `[lazy-video]` в зависимости от видимости во viewport.

### Лейаут

- `header.js` обновляет CSS-переменную `--header-height` при загрузке и ресайзе.
- `menu.js` управляет мобильным меню: открытие по `.hamburger`, закрытие по клику вне `.mobile-menu__content`.

## Подключение галереи и табов

Файлы `component/gallery.js` и `component/tabs.js` используют `swiper`. Перед раскомментированием их импортов в `app.js` установите зависимость:

```bash
yarn add swiper
```

## Стилистика и линтеры

- ESLint: `standard` + `unicorn/recommended`.
- StyleLint: `stylelint-config-standard-scss`.
- Комментарии и JSDoc пишутся на русском языке.
