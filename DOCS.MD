# Документация компонентов

## Modal

Компонент модальных окон с настраиваемыми опциями и анимациями.

### Использование

```javascript
import Modal from './js/component/modal';

const modalController = new Modal({
  closeOnEsc: true,
  closeOnOverlay: true,
  catchFocus: true,
  onShow: (modal) => console.log('Модалка открыта'),
  onClose: (modal) => console.log('Модалка закрыта'),
  onCloseAll: () => console.log('Все модалки закрыты')
});
```

### HTML-структура

```html
<div class="modal" data-modal="modal-id">
  <div class="modal__overlay">
    <div class="modal__container">
      <div class="modal__header">
        <p class="modal__title">Заголовок</p>
        <div class="modal__close" data-modal-close></div>
      </div>
      <div class="modal__content">
        <!-- Контент модалки -->
      </div>
    </div>
  </div>
</div>
```

### Триггеры

```html
<!-- Открыть модалку -->
<button data-modal-open="modal-id">Открыть модалку</button>

<!-- Закрыть модалку -->
<button data-modal-close="modal-id">Закрыть модалку</button>
<button data-modal-close>Закрыть последнюю модалку</button>
```

### Опции

| Опция | Тип | По умолчанию | Описание |
|--------|------|-------------|----------|
| `activeClass` | string | `'is-show'` | CSS класс активного состояния |
| `scrollLockClass` | string | `'is-scroll-locked'` | CSS класс блокировки скролла |
| `modalSelector` | string | `'data-modal'` | Селектор для поиска модалок |
| `openSelector` | string | `'data-modal-open'` | Селектор триггеров открытия |
| `closeSelector` | string | `'data-modal-close'` | Селектор триггеров закрытия |
| `closeOnEsc` | boolean | `true` | Закрытие по клавише Escape |
| `closeOnOverlay` | boolean | `true` | Закрытие по клику на оверлей |
| `catchFocus` | boolean | `true` | Управление фокусом внутри модалки |
| `onShow` | function | `() => {}` | Коллбек при открытии модалки |
| `onClose` | function | `() => {}` | Коллбек при закрытии модалки |
| `onCloseAll` | function | `undefined` | Коллбек при закрытии всех модалок |

### Методы

- `open(modalId, triggerElement)` - Открыть конкретную модалку
- `close(modalId)` - Закрыть конкретную или последнюю модалку
- `closeAll()` - Закрыть все открытые модалки

### События

- `modalBeforeOpen` - Перед открытием модалки
- `modalOpened` - После открытия модалки
- `modalClosed` - После закрытия модалки

---

## Submenu

Компонент подменю навигации с поддержкой аккордеона.

### Использование

```javascript
import Submenu from './js/component/submenu';

const submenuController = new Submenu({
  single: false // Только одно подменю открыто одновременно
});
```

### HTML-структура

```html
<nav class="nav">
  <ul class="nav__list">
    <li class="nav__item">
      <a href="/" class="nav__link">Главная</a>
    </li>
    <li class="nav__submenu">
      <div class="nav__item-header">
        <a href="/services" class="nav__link">Услуги</a>
        <button class="nav__submenu-trigger" type="button">▼</button>
      </div>
      <ul class="nav__submenu-list">
        <li><a href="/services/web" class="nav__link">Разработка сайтов</a></li>
        <li><a href="/services/seo" class="nav__link">SEO</a></li>
      </ul>
    </li>
  </ul>
</nav>
```

### Опции

| Опция | Тип | По умолчанию | Описание |
|--------|------|-------------|----------|
| `single` | boolean | `false` | Только одно подменю открыто одновременно |
| `initializedClass` | string | `'is-initialized'` | CSS класс инициализированных подменю |
| `openClass` | string | `'open'` | CSS класс открытого состояния |

### Методы

- `init()` - Инициализация компонента
- `update()` - Поиск и инициализация новых подменю

---

## Accordion

Компонент аккордеонов с настраиваемой анимацией и селекторами.

### Использование

```javascript
import Accordion from './js/component/accordion';

const accordionController = new Accordion({
  duration: 600
});
```

### HTML-структура

```html
<div class="b-accordion">
  <div class="b-accordion__header">
    <h3>Заголовок аккордеона</h3>
  </div>

  <div class="b-accordion__body">
    <div class="b-accordion__content">
      <p>Содержимое аккордеона...</p>
    </div>
  </div>
</div>
```

### Опции

| Опция | Тип | По умолчанию | Описание |
|--------|------|-------------|----------|
| `duration` | number | `600` | Длительность анимации в мс |
| `initializedClass` | string | `'is-initialized'` | CSS класс инициализированных аккордеонов |
| `accordionSelector` | string | `'.b-accordion'` | Селектор аккордеонов |
| `headerSelector` | string | `'.b-accordion__header'` | Селектор заголовков |
| `bodySelector` | string | `'.b-accordion__body'` | Селектор содержимого |

### Методы

- `open(accordion)` - Открыть конкретный аккордеон
- `close(accordion)` - Закрыть конкретный аккордеон
- `toggle(accordion)` - Переключить состояние аккордеона
- `closeAll()` - Закрыть все аккордеоны
- `update()` - Найти и инициализировать новые аккордеоны

### Примеры использования

```javascript
// Открыть аккордеон по селектору
window.App.accordion.open('.b-accordion:first-child');

// Закрыть все аккордеоны
window.App.accordion.closeAll();

// Переключить конкретный аккордеон
window.App.accordion.toggle('#my-accordion');

// Обновить после добавления новых аккордеонов
window.App.accordion.update();
```

---

## Интеграция

### Глобальный объект App

Глобальный объект `window.App` содержит экземпляры всех компонентов для доступа из любой части приложения.

```javascript
window.App = {
  modal: modalController,        // Управление модальными окнами
  submenu: submenuController,    // Управление подменю навигации
  accordion: accordionController, // Управление аккордеонами
  lazyImage: lazyImageController,        // Ленивая загрузка изображений
  lazyBackground: lazyBackgroundController // Ленивая загрузка фонов
};
```

#### Доступ к методам компонентов

```javascript
// Открытие модалки программно
window.App.modal.open('callback', document.querySelector('button'));

// Закрытие всех модалок
window.App.modal.closeAll();

// Обновление подменю (если добавлены новые элементы)
window.App.submenu.update();

// Работа с аккордеонами
window.App.accordion.open('.b-accordion:first-child');
window.App.accordion.closeAll();
window.App.accordion.update();

// Работа с lazy loading
window.App.lazyImage.update();
window.App.lazyBackground.update();

// Получение настроек
console.log(window.App.modal.options);
```

#### События и интеграция

```javascript
// Подписка на события модалок
window.addEventListener('modalOpened', (e) => {
  console.log('Открыта модалка:', e.detail.modalId);
});

window.addEventListener('modalClosed', (e) => {
  console.log('Закрыта модалка:', e.detail.modal);
});

// Динамическое изменение настроек
window.App.modal.options.closeOnEsc = false;
```

#### Примеры использования в других скриптах

```javascript
// Валидация формы перед закрытием
window.App.modal.options.onClose = (modal) => {
  const form = modal.querySelector('form');
  if (form && form.dataset.dirty === 'true') {
    if (!confirm('Есть несохраненные изменения. Закрыть?')) {
      return false; // Предотвратить закрытие
    }
  }
};

// Автоматическое открытие модалки по URL
if (window.location.hash === '#callback') {
  window.App.modal.open('callback');
}

// Интеграция с аналитикой
window.App.modal.options.onShow = (modal) => {
  gtag('event', 'modal_open', {
    modal_id: modal.dataset.modal
  });
};
```

---

## Поддержка браузеров

- Современные браузеры с поддержкой CSS Grid и Flexbox
- ES6+ функции JavaScript
- Поддержка CSS кастомных свойств
