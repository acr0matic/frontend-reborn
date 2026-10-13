# Документация компонентов

Публичные контракты компонентов проекта и точки интеграции (`window.App`,
события на `document`). Внутренние детали реализации могут меняться — снаружи
опирайся только на описанное здесь.

## Modal

Модальные окна: стек открытых окон, блокировка скролла с компенсацией ширины
скроллбара, ловушка фокуса. Реализация — `src/js/component/ui/modal.js`.

### Использование

```javascript
import Modal from './js/component/ui/modal';

const modal = new Modal({
  closeOnEsc: true,
  closeOnOverlay: true,
  catchFocus: true,
  awaitCloseAnimation: true,
});
```

### HTML-структура

```html
<div class="modal mw-callback" data-modal="callback" role="dialog" aria-modal="true" aria-labelledby="modal-callback-title" aria-hidden="true">
  <div class="modal__overlay">
    <div class="modal__container">
      <div class="modal__wrapper">
        <div class="modal__header">
          <p class="modal__title" id="modal-callback-title">Заголовок формы</p>
          <button class="modal__close" type="button" data-modal-close aria-label="Закрыть"></button>
        </div>
        <div class="modal__content">
          <!-- Контент модалки -->
        </div>
      </div>
      <!-- /.modal__wrapper -->
    </div>
    <!-- /.modal__container -->
  </div>
  <!-- /.modal__overlay -->
</div>
<!-- /.modal -->
```

Конкретная модалка получает модификатор `mw-{name}` (`.modal mw-callback`) и
кладётся в `src/layout/modal/`; include подключается в `src/layout/footer.html`.

### Триггеры

```html
<!-- Открыть модалку -->
<button data-modal-open="callback">Открыть модалку</button>

<!-- Закрыть конкретную или последнюю открытую модалку -->
<button data-modal-close="callback">Закрыть</button>
<button data-modal-close>Закрыть последнюю</button>
```

### Опции

| Опция | Тип | По умолчанию | Описание |
|--------|------|-------------|----------|
| `activeClass` | string | `'is-show'` | CSS-класс видимости модалки |
| `scrollLockClass` | string | `'is-scroll-locked'` | CSS-класс блокировки скролла на `body` |
| `scrollLock` | boolean | `true` | Блокировать скролл страницы |
| `modalSelector` | string | `'data-modal'` | Data-атрибут идентификации модалки |
| `openSelector` | string | `'data-modal-open'` | Data-атрибут триггера открытия |
| `closeSelector` | string | `'data-modal-close'` | Data-атрибут триггера закрытия |
| `closeOnEsc` | boolean | `true` | Закрытие по Escape |
| `closeOnOverlay` | boolean | `true` | Закрытие по клику на `.modal__overlay` |
| `catchFocus` | boolean | `true` | Ловушка фокуса внутри модалки |
| `awaitCloseAnimation` | boolean | `false` | Ждать конца CSS-перехода перед разблокировкой скролла |
| `onBeforeOpen` | function | `() => {}` | Перед открытием `(modal)` |
| `onShow` | function | `() => {}` | После открытия `(modal)` |
| `onBeforeClose` | function | `() => {}` | Перед закрытием `(modal)` |
| `onClose` | function | `() => {}` | После закрытия `(modal)` |
| `onCloseAll` | function | `() => {}` | Когда закрылась последняя модалка |

### Методы

- `open(modalId, triggerElement)` — открыть модалку по значению `data-modal`;
- `close(modalId?)` — закрыть конкретную модалку или последнюю открытую;
- `closeAll()` — закрыть весь стек;
- `destroy()` — закрыть всё и снять глобальные обработчики.

### События (dispatch на `window`)

| Событие | `detail` | Когда |
|---------|----------|-------|
| `modalBeforeOpen` | `{ modalId, trigger }` | клик по `data-modal-open`, до открытия |
| `modalOpened` | `{ modalId, modal, trigger }` | после добавления `is-show` |
| `modalClosed` | `{ modal }` | после снятия `is-show` у каждой закрытой модалки |

---

## Submenu

Подменю навигации на базе утилиты `Collapse`. Реализация —
`src/js/component/ui/submenu.js`.

### HTML-контракт

Подменю — `li.nav__submenu` с вложенным `ul`. Клик внутри пункта переключает
подменю; клик по `.nav__link` обрабатывается как обычная ссылка и подменю не
трогает. Класс открытого состояния — `open` (без префикса `is-`).

```html
<ul class="nav__list">
  <li class="nav__item">
    <a href="/" class="nav__link">Главная</a>
  </li>
  <li class="nav__submenu">
    <button class="nav__link" type="button">Услуги</button>
    <ul>
      <li><a href="/services/web" class="nav__link">Разработка сайтов</a></li>
      <li><a href="/services/seo" class="nav__link">SEO</a></li>
    </ul>
  </li>
</ul>
```

### Опции

| Опция | Тип | По умолчанию | Описание |
|--------|------|-------------|----------|
| `single` | boolean | `false` | Одно открытое подменю среди соседей |
| `duration` | number | `300` | Длительность раскрытия, мс |
| `initializedClass` | string | `'is-initialized'` | Маркер инициализированного подменю |
| `openClass` | string | `'open'` | CSS-класс открытого состояния |
| `onOpen` / `onClose` | function | `() => {}` | `(menu)` после открытия/закрытия |
| `onToggle` | function | `() => {}` | `(menu, isOpen)` при переключении |

### Методы

- `open(menu)` / `close(menu)` / `toggle(menu)` — `menu` — элемент или селектор;
- `closeAll()` — закрыть все;
- `update(root)` — подхватить новую разметку, вычистить удалённую;
- `destroy()` — снять обработчики и разрушить Collapse-инстансы.

---

## Accordion

Аккордеоны на базе `Collapse`. Состояние `is-open` вешается на корневой
`.c-accordion`. Реализация — `src/js/component/ui/accordion.js`.

### HTML-структура

```html
<div class="c-accordion">
  <div class="c-accordion__header">
    <h3>Заголовок аккордеона</h3>
  </div>
  <!-- /.c-accordion__header -->

  <div class="c-accordion__body">
    <div class="c-accordion__content">
      <p>Содержимое аккордеона...</p>
    </div>
  </div>
  <!-- /.c-accordion__body -->
</div>
<!-- /.c-accordion -->
```

### Опции

| Опция | Тип | По умолчанию | Описание |
|--------|------|-------------|----------|
| `duration` | number | `600` | Длительность анимации, мс |
| `single` | boolean | `false` | Закрывать остальные при открытии |
| `initializedClass` | string | `'is-initialized'` | Маркер инициализированного аккордеона |
| `accordionSelector` | string | `'.c-accordion'` | Селектор аккордеонов |
| `headerSelector` | string | `'.c-accordion__header'` | Селектор заголовка |
| `bodySelector` | string | `'.c-accordion__body'` | Селектор тела |
| `modifier` | object | `undefined` | См. ниже |
| `onBeforeOpen` / `onOpen` | function | `() => {}` | `(accordion, body)` до/после открытия |
| `onBeforeClose` / `onClose` | function | `() => {}` | `(accordion, body)` до/после закрытия |

`modifier.data.text = { open, close }` — подменяет текст первого `span` внутри
заголовка при открытии/закрытии (исходный текст сохраняется).

### Методы

- `open(accordion)` / `close(accordion)` / `toggle(accordion)` — элемент или селектор;
- `closeAll()` — закрыть все;
- `update(root)` — инициализировать новые аккордеоны;
- `destroy()` — полная очистка.

### Внутренние события

`Collapse` диспатчит на теле аккордеона `dropdownToggleStart` (начало
перехода) и `dropdownToggle` (конец) с `bubbles: true` — на них можно
подписываться снаружи, например чтобы обновлять высоту слайдеров.

---

## Form

Контроллер форм `.form-custom`: маски, приватность, сброс. Реализация —
`src/js/component/form/form.js`.

### HTML-контракт

```html
<form class="form form-custom" action="">
  <div class="form__wrapper">
    <label class="input">
      <input type="tel" name="phone" class="input__field" data-country-code="7">
      <span class="input__label">Телефон</span>
    </label>
    <!-- /.input -->

    <label class="input">
      <input type="text" name="user_name" class="input__field">
      <span class="input__label">Имя</span>
    </label>
    <!-- /.input -->
  </div>
  <!-- /.form__wrapper -->

  <button class="button button-primary" type="submit"><span>Отправить</span></button>
  <button class="button" type="button" data-action="reset"><span>Сбросить</span></button>

  <label class="checkbox">
    <input type="checkbox" data-privacy>
    <span>Согласен с обработкой данных</span>
  </label>
</form>
```

Автоматически обрабатывается:

- `input[type=tel]` — маска телефона по `data-country-code` (по умолчанию `7`);
  поддерживаются коды `7`, `1`, `49`. При наличии `select[data-target=country]`
  маска переключается при смене страны. Ввод `8` в начале подменяется на `+7`;
- `input[name=user_name]` — маска «только буквы» (кириллица/латиница, дефис, пробел);
- `[data-privacy]` — submit блокируется (`disabled`), пока все такие чекбоксы
  не отмечены;
- `.button[data-action="reset"]` — программный сброс формы с очисткой масок.

### Опции

| Опция | Тип | По умолчанию | Описание |
|--------|------|-------------|----------|
| `selector` | string | `'.form-custom'` | Селектор форм |
| `onSubmit` | function | `() => {}` | `(form, event)` при сабмите |
| `onReset` | function | `() => {}` | `(form)` при сбросе |
| `onValidate` | function | `() => {}` | `(form, isValid)` при смене состояния privacy |

### Методы

- `update(root)` — подхватить новые формы, вычистить удалённые;
- `get(form)` — экземпляр формы по элементу или селектору;
- `forEach(callback)` — обход всех экземпляров;
- `destroy()` — снять обработчики и разрушить маски.

Отправка на сервер намеренно не реализована: `onSubmit` — точка интеграции
(`fetch`, CMS-эндпоинт, аналитика).

---

## NumberInput

Кламп `input[type="number"]` по атрибутам `min`/`max` при `change`. Реализация —
`src/js/component/input/number.js`. Работает только с полями, у которых задан
хотя бы один из атрибутов.

Опции: `selector` (по умолчанию `'input[type="number"]'`).
Методы: `update(root)`, `destroy()`.

---

## LazyVideo

Автоплей/пауза `<video lazy-video>` по видимости (`IntersectionObserver`,
`threshold: 0.05`). Реализация — `src/js/utils/video-optimization.js`.

Опции: `selector` (по умолчанию `'[lazy-video]'`), `threshold`.
Методы: `update(root)`, `destroy()`.

---

## Lazy loading (изображения и фоны)

Два отдельных контракта на `vanilla-lazyload`, смешивать нельзя:

- `lazyImage` — `.lazy__item` внутри обёртки `.lazy` + `data-src` вместо `src`.
  На обёртке может быть `.lazy--preloader` — снимается после загрузки.
  Элемент с `data-custom-lazy` исключается из этого контроллера. Модификатор
  `.lazy__item--blur` — только для крупных баннеров/hero;
- `lazyBackground` — `.lazy-simple` для простых фоновых элементов без
  прелоадера.

```html
<div class="lazy lazy--preloader">
  <img class="lazy__item image image--cover" data-src="assets/images/..." alt="...">
</div>
<!-- /.lazy -->

<div class="lazy-simple" data-bg="url(assets/images/...)"></div>
```

---

## Header

`src/js/layout/header.js` — пишет высоту `#header` в CSS-переменную
`--header-height` на `:root` и обновляет её на resize. Используй переменную
для отступов секций под фиксированной шапкой.

---

## MobileMenu

`src/js/layout/menu.js` — мобильное меню.

Контракт разметки: `.mobile-menu` (корень), `.mobile-menu__content` (контент,
клик снаружи закрывает), `.hamburger` (кнопка-триггер, ей выставляется
`aria-expanded`).

Состояния: `is-open` на `.mobile-menu`, `is-active` на `.hamburger`,
`is-scroll-locked` на `body`. Закрытие — по клику вне контента и по Escape.

Опции: `menuSelector`, `contentSelector`, `buttonSelector`.
Методы: `update()`, `toggle(isOpen)`, `destroy()`.

---

## Select

Кастомные селекты на локальной копии NiceSelect2 (`src/js/libs/nice-select2.js`).
Стили уже собираются через `scss/vendors` (`js-libs/nice-select` +
`extend/_nice-select`). Компонент зарегистрирован как `select` и обрабатывает
все `<select>` на странице.

Атрибуты на `<select>`:

| Атрибут | Назначение |
|---------|------------|
| `data-placeholder` | Текст-плейсхолдер (по умолчанию «Выберите») |
| `data-search` | Не `false` — включает поле поиска в дропдауне |
| `multiple` | Мультивыбор со списком выбранных значений |

Методы: `update(root)` — подхватывает новые селекты и вычищает удалённые,
`destroy()` — убирает все дропдауны.

---

## Опциональные компоненты

В `src/js/component/` лежат пресеты, по умолчанию не задействованные в
`global/init.js`. Подключаются импортом и `app.register()`.

| Компонент | Файл | Зависимость | Контракт |
|-----------|------|-------------|----------|
| `Lightbox` | `component/ui/lightbox.js` | `yarn add glightbox` | триггеры `.glightbox` с `data-type`, `data-source`, `href`; CSS библиотеки подключить в `src/js/app.js` |
| `Tabs` | `component/ui/tabs.js` | `yarn add swiper` | `.b-tabs`: `.b-tabs__action button` переключают `.swiper`-слайды (fade) |
| `Gallery` | `component/ui/gallery.js` | `yarn add swiper` | `.b-gallery` (+`--vertical`): основной слайдер + превью `.b-gallery__thumb` |
| `ScrollTop` | `utils/scroll-top.js` | — | кнопка `.scroll-top`, появление после 30% прокрутки, отбивка от `footer` |

Пример включения:

```javascript
// в global/init.js
import ScrollTop from '../utils/scroll-top';
import Lightbox from '../component/ui/lightbox';

app
  .register('scrollTop', new ScrollTop())
  .register('lightbox', new Lightbox());
```

---

## Интеграция

### Публичный API (window.App)

`window.App` — стабильный фасад поверх внутреннего реестра. Для интеграции
(натяжка вёрстки на CMS, сторонние скрипты) используй только перечисленное —
внутренности компонентов могут меняться.

```javascript
// Модальные окна
window.App.modal.open('callback');
window.App.modal.close('callback');   // без аргумента — последняя открытая
window.App.modal.closeAll();

// Аккордеоны
window.App.accordion.open('.c-accordion');
window.App.accordion.close('.c-accordion');
window.App.accordion.toggle('.c-accordion');
window.App.accordion.closeAll();

// Переинициализация всех компонентов после AJAX-вставки разметки
window.App.update();
window.App.update(document.querySelector('#new-content')); // можно сузить корень

// Полная очистка всех компонентов
window.App.destroy();

// Запасной доступ к экземпляру (нестандартные случаи)
window.App.get('modal').options.closeOnEsc = false;
```

Зарегистрированные имена для `window.App.get(name)`:
`header`, `mobileMenu`, `lazyImage`, `lazyBackground`, `lazyVideo`, `modal`,
`submenu`, `accordion`, `form`, `numberInput`, `select`.

### События-команды (dispatch на `document`)

Удобно дёргать из CMS-шаблонов и сторонних скриптов без доступа к `window.App`:

```javascript
document.dispatchEvent(new CustomEvent('modal:open', { detail: 'callback' }));
document.dispatchEvent(new CustomEvent('modal:close', { detail: 'callback' }));
document.dispatchEvent(new CustomEvent('modal:closeAll'));
document.dispatchEvent(new CustomEvent('app:update', { detail: rootElement }));
// app:update без detail — обновление по document
```

### События-уведомления (dispatch на `window`)

```javascript
window.addEventListener('modalOpened', (e) => {
  console.log('Открыта модалка:', e.detail.modalId);
});

window.addEventListener('modalClosed', (e) => {
  console.log('Закрыта модалка:', e.detail.modal);
});
```

### Примеры

```javascript
// Автоматическое открытие модалки по URL-хэшу
if (window.location.hash === '#callback') {
  window.App.modal.open('callback');
}

// Интеграция с аналитикой
window.addEventListener('modalOpened', (e) => {
  gtag('event', 'modal_open', { modal_id: e.detail.modalId });
});

// Своя отправка формы (заменяет заглушку onSubmit)
window.App.get('form').options.onSubmit = (form, event) => {
  event.preventDefault();
  // fetch('/api/callback', { method: 'POST', body: new FormData(form) });
};
```

---

## Поддержка браузеров

- Современные браузеры с поддержкой CSS Grid и Flexbox;
- ES2024 (приватные поля классов, `Array.at`, `Object.hasOwn` и т.п.);
- CSS-кастомные свойства.

Список целевых браузеров — в `.browserslistrc`.
