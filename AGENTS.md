Ниже полный текст, который можно скопировать и использовать как `AGENTS.md` в другом проекте.

---

```markdown
# Руководство по вёрстке и организации фронтенда

## 1. Общая информация

Фронтенд-шаблон для верстки статических веб-страниц с возможностью дальнейшей интеграции в CMS (например, WordPress). Проект использует Webpack, Gulp, SCSS, PostHTML и ванильный JavaScript.

## 2. Технологический стек

| Слой              | Технология                                                              |
| ----------------- | ----------------------------------------------------------------------- |
| Сборка            | Webpack 5 + Gulp 5                                                      |
| Пакетный менеджер | Yarn 4.x                                                                |
| CSS               | Sass/SCSS + PostCSS (autoprefixer, cssnano, сортировка медиа-запросов)  |
| Линтеры           | Stylelint (standard-scss), ESLint (standard + unicorn)                  |
| JS                | Ванильный ES2024, GSAP, vanilla-lazyload, imask                         |
| HTML              | PostHTML: `<include>`, `<inline>`, условные теги `<if condition="...">` |
| SVG               | SVG-спрайт с иконками, подключение через `<use href="...#id">`          |

После любых изменений в `SCSS` или `JS` обязательно запускать линтеры с флагом `--fix`.

## 3. Структура проекта

```
src/
├── assets/
│   ├── fonts/
│   ├── images/
│   │   ├── icons/        # SVG-иконки и спрайт
│   │   ├── misc/         # технические изображения
│   │   └── layout/       # макетные изображения
│   └── favicons/
├── js/
│   ├── app.js
│   ├── global/
│   ├── component/
│   ├── layout/
│   ├── animation/
│   └── libs/
├── layout/
│   ├── head.html
│   ├── header.html
│   ├── footer.html
│   ├── block/
│   ├── modal/
│   ├── section/
│   └── template/
├── scss/
│   ├── main.scss
│   ├── abstracts/        # mixins, functions, variables
│   ├── common/
│   ├── settings/         # vars, fonts, container
│   ├── vendors/
│   └── layout/
└── page-*.html, archive-*.html, single-*.html, misc-*.html
```

## 4. Создание HTML-страницы

Каждая страница — отдельный HTML-файл в `src/`.

```html
<!DOCTYPE html>
<html>

<include src="layout/head.html"></include>

<body class="page">
  <include src="layout/header.html">
    {
    "mod": "sticky"
    }
  </include>

  <main>
    <div id="cp-example" class="page__body">
      <!-- секции -->
    </div>
    <!-- /.page__body -->
  </main>

  <include src="layout/footer.html"></include>
</body>

</html>
```

Обязательно:
- `<include src="layout/head.html">`;
- `<include src="layout/header.html">`;
- `<include src="layout/footer.html">`;
- `<body class="page">`;
- `<main>`;
- `<div class="page__body" id="...">` с ID страницы по правилам нейминга.

## 5. Нейминг страниц и секций

Страницы делятся на 4 типа по префиксам, как в WordPress:

| Тип          | Префикс | HTML-файл        | Папка SCSS                   | ID страницы  | ID секции            |
| ------------ | ------- | ---------------- | ---------------------------- | ------------ | -------------------- |
| archive-page | `ap-`   | `archive-*.html` | `scss/layout/pages/archive/` | `ap-article` | `ap-article-content` |
| common-page  | `cp-`   | `page-*.html`    | `scss/layout/pages/common/`  | `cp-about`   | `cp-about-hero`      |
| misc-page    | `mp-`   | `misc-*.html`    | `scss/layout/pages/misc/`    | `mp-content` | `mp-content-text`    |
| single-page  | `sp-`   | `single-*.html`  | `scss/layout/pages/single/`  | `sp-product` | `sp-product-content` |

Правила:
- ID страницы: `{префикс}-{название}` на `.page__body`.
- ID секции: `{префикс}-{название}-{секция}` на `<section class="section">`.
- Если имя страницы уже содержит `content`, секция называется `...-content-text`, чтобы избежать `content-content`.
- Сложные страницы (Главная, О компании) могут использовать собственные семантические имена секций: `hero`, `info`, `achievements`, `buy`.

## 6. Комментарии в HTML

После каждого закрывающего `</div>` ставится комментарий с первым классом элемента:

```html
<div class="container">
  <div class="content">
    <div class="content__text" data-editor>
      ...
    </div>
    <!-- /.content__text -->
  </div>
  <!-- /.content -->
</div>
<!-- /.container -->
```

Это касается всех `div`: `page__body`, `container`, `content`, `swiper`, `swiper-wrapper`, BEM-блоков и их элементов.

## 7. Include и условные теги

### Подключение блоков

```html
<include src="layout/block/achievements.html"></include>
```

### Передача данных

```html
<include src="layout/template/card/product.html">
  {
  "isPreorder": true,
  "isNew": false
  }
</include>
```

### Условные теги внутри шаблона

```html
<div class="card-product__badges">
  <if condition="isNew">
    <div class="card-product__badge">Новинка</div>
  </if>
</div>

<div class="card-product__action">
  <if condition="isPreorder">
    <button class="button button-primary" type="button">Под заказ</button>
  </if>
  <else>
    <button class="button button-primary button-primary--accent" type="button">В корзину</button>
  </else>
</div>
```

## 8. data-editor — текстовые блоки

Текстовые блоки, которые редактируются через CMS, помечаются атрибутом `data-editor`:

```html
<div class="content__text" data-editor>
  <p>...</p>
  <h2>...</h2>
  <ul>...</ul>
</div>
```

Принципы:
- класс-обёртка отвечает только за позиционирование (ширина, отступы);
- типографика наследуется из `src/scss/layout/components/editor/_editor.scss`;
- не дублировать `font-size`, `line-height`, `font-weight`, отступы между параграфами и списками.

## 9. Изображения, иконки, SVG

### Корневая структура

```
src/assets/images/
├── icons/
│   ├── package.svg          # основной SVG-спрайт
│   ├── payment/
│   └── social/
├── misc/
│   └── preloader.svg
└── layout/
    ├── global/
    ├── modal/
    ├── section/
    ├── block/
    └── page/
```

### Иконки

Используются из SVG-спрайта через `<use>`:

```html
<svg class="icon">
  <use href="assets/images/icons/package.svg#arrow-dropdown"></use>
</svg>
```

ID иконок именуются по шаблону `группа-назначение`:
- `arrow-*` — стрелки;
- `misc-*` — сервисные иконки;
- `profile-*` — личный кабинет;
- `payment-*` — способы оплаты;
- `social-*` — соцсети.

### Макетные изображения

Папки в `layout/` повторяют структуру проекта:

| Расположение            | Пример пути                                         |
| ----------------------- | --------------------------------------------------- |
| Глобальные элементы     | `assets/images/layout/global/footer/reward_1.png`   |
| Модальные окна          | `assets/images/layout/modal/painting/art.svg`       |
| Переиспользуемые секции | `assets/images/layout/section/callback/picture.png` |
| Страницы                | `assets/images/layout/page/cp-home/hero/bg_pc.jpg`  |

Папка страницы = ID страницы, подпапки = имена секций:

```text
layout/page/cp-home/hero/
layout/page/cp-home/about/
layout/page/cp-home/buy/
layout/page/cp-about/textblock/
layout/page/sp-product/colors/
```

### Адаптивные фоны

Имена файлов для адаптивных версий:

```html
<picture class="hero__bg lazy">
  <source media="(max-width: 767px)" srcset="assets/images/layout/page/cp-home/hero/bg_mobile.jpg">
  <source media="(max-width: 1023px)" srcset="assets/images/layout/page/cp-home/hero/bg_tablet.jpg">
  <img class="image image--cover lazy__item lazy__item--blur" data-src="assets/images/layout/page/cp-home/hero/bg_pc.jpg" alt="">
</picture>
```

| Имя             | Устройство |
| --------------- | ---------- |
| `bg_pc.jpg`     | десктоп    |
| `bg_tablet.jpg` | планшет    |
| `bg_mobile.jpg` | телефон    |

### Ленивая загрузка

```html
<img class="image image--cover lazy__item" data-src="..." alt="">
<picture class="lazy">
  <img class="image image--cover lazy__item lazy__item--blur" data-src="..." alt="">
</picture>
```

## 10. SCSS: переменные и принципы

### CSS-переменные vs SASS-переменные

```scss
:root {
  // CSS-переменные — могут меняться в медиа-запросах
  --font-title-large: 50px;
  --font-title-medium: 32px;
  --font-text-regular: 16px;
  --line-height-large: 1.5;

  @include mq($until: desktop) {
    --font-title-large: 36px;
  }

  @include mq($until: tablet) {
    --font-title-large: 32px;
  }
}

// SASS-переменные — константы
$transition-time: 0.3s;
$palette-black: #14181c;
$weight-Light: 300;
```

Правило:
- CSS-переменные (`--*`) — для значений, которые адаптируются.
- SASS-переменные (`$*`) — для констант: цвета, толщины шрифта, переходы.

### Типографика

```scss
body {
  font-family: $font-default;
  font-size: var(--font-text-regular);
  font-weight: $weight-Light;
  line-height: var(--line-height-large);
}

h1, h2, h3, h4, h5 {
  font-weight: $weight-Regular;
  line-height: var(--line-height-small);
}
```

Размеры шрифтов не привязаны к HTML-тегам, а описывают визуальный уровень:
- `--font-title-large`
- `--font-title-medium`
- `--font-title-small`
- `--font-text-large`
- `--font-text-big`
- `--font-text-regular`
- `--font-text-small`

### Палитра и семантические цвета

```scss
$palette-white: #ffffff;
$palette-gray: #e9ebee;
$palette-black: #14181c;

$palette-accent: #1976d2;
$palette-neutral: #87919b;

$color-text__primary: $palette-black;
$link-hover-color: $palette-accent !default;
```

- `$palette-*` — абстрактные цвета.
- `$color-text__primary`, `$link-color` — семантические роли.

### Контейнеры

```scss
$container-max-widths: (
  mobile: 480px,
  tablet: 768px,
  notebook: 991px,
  laptop: 1200px,
  desktop: 1700px
);

$container-wide-width: 1800px;
$container-padding: 16px;
```

Миксин `make-container` генерирует адаптивный контейнер. Класс `.container--wide` используется для широких блоков (шапка, футер, слайдеры).

### z-index

```scss
$z-index-header: 50;
$z-index-overlay: 51;
$z-index-menu: 52;
$z-index-modal: 53;
$z-index-toast: 54;
```

Используются переменные, чтобы слои не конфликтовали и управлялись централизованно.

## 11. BEM и плоская вложенность

### Базовый нейминг

```html
<div class="card">
  <h3 class="card__title">Заголовок</h3>
  <picture class="card__picture">
    <img class="card__picture-img" src="..." alt="">
  </picture>
  <p class="card__text">Текст</p>
</div>
```

```scss
.card {
  &__title { }
  &__picture {
    &-img { }
  }
  &__text { }
}
```

### Правила вложенности

- `&__element` пишется только внутри блока.
- Для составных имён используется `&-suffix`: `&__card` → `&-title` = `.content__card-title`.
- Глубина вложенности — максимум 2 уровня: `#id { .block { &__element {} } }`.
- Не вкладывать `&__` в `&__`: `.block__body__title` — это не BEM.

## 12. CSS Grid и адаптив

### Двухколоночные макеты

```scss
.content {
  @include mq($until: laptop) {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  display: grid;
  grid-template-columns: 510px 1fr;
  gap: 64px;
}
```

### Сетки карточек

```scss
&__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}
```

### Принципы

- `minmax(0, 1fr)` вместо `1fr`, чтобы контент не растягивал колонку.
- `min-height: 2lh` для выравнивания заголовков в карточках.
- `aspect-ratio` для изображений вместо фиксированных `width`/`height`.
- Округлять значения до «чистых» чисел: `549px` → `550px`, `512px` → `510px`.
- Не дублировать наследуемые свойства: `color`, `font-weight`, `line-height`.
- Классы вешаются на семантические элементы (`<picture>`, `<h3>`, `<img>`), без лишних `div`-обёрток.

## 13. JavaScript

- ES6+ классы.
- JSDoc для методов.
- Экспорт по умолчанию.
- Глобальный доступ через `window.App`.
- GSAP-анимации подключаются через `data-animation="тип"` на секциях.
- Использование `querySelectorAll` + `for...of` для обработки всех элементов.
- ScrollTrigger с `toggleActions: 'play none none reverse'`.
- `ease: 'power2.out'` для естественных анимаций.

## 14. Линтеры и автоисправление

После изменений в `SCSS` или `JS`:

```bash
npx stylelint "src/scss/**/*.scss" --fix
npx eslint "src/js/**/*.js" --fix
```

Или через скрипты `package.json`.

## 15. Основные команды

```bash
yarn run dev       # локальный сервер с hot reload
yarn run build     # production-сборка
yarn run build_wp  # сборка для WordPress
yarn run deploy    # деплой на FTP
```

## Основные принципы в одном списке

1. CSS-переменные — для адаптивных значений, SASS-переменные — для констант.
2. Использовать существующие переменные из `src/scss/settings/_vars.scss`.
3. Пути к изображениям повторяют структуру: `assets/images/layout/page/{id-страницы}/{секция}/{файл}`.
4. Иконки — из спрайта `package.svg` через `<use>`.
5. `data-editor` для текстовых CMS-блоков.
6. ID страниц и секций по префиксам `cp-`, `ap-`, `mp-`, `sp-`.
7. Плоский BEM, глубина вложенности ≤ 2.
8. CSS Grid для структуры, `minmax(0, 1fr)` для карточек.
9. Комментарии `<!-- /.class-name -->` после каждого `</div>`.
10. После изменений запускать `stylelint` и `eslint` с `--fix`.
```