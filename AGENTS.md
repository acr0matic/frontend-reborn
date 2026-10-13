# Руководство по фронтенд-проекту

## Назначение

Статический многостраничный фронтенд-шаблон для дальнейшей интеграции в CMS, включая WordPress. Стек: Webpack 5, Yarn 4, PostHTML, SCSS/PostCSS и ванильный ES2024.

Подробные технологические правила загружаются тематическими скиллами:

- `/html-methodology` — HTML, PostHTML, include, ID, CMS-тексты, изображения и SVG;
- `/scss-methodology` — SCSS, BEM, токены, адаптив и vendor-стили;
- `/javascript-methodology` — JS-модули, lifecycle, data-атрибуты, GSAP и lazy loading.

Процедуры:

- `/new-page` — создание новой страницы;
- `/verify-page` — приёмка страницы.

Не дублируй подробные правила из этих скиллов в `AGENTS.md`.

## Источники правды

Перед изменениями:

1. Прочитай `AGENTS.md`, `DOCS.MD`, `README.md` и относящиеся к задаче конфиги.
2. Классифицируй задачу: страница, секция, блок, карточка, UI-компонент, адаптив или JS-поведение.
3. Найди минимум две ближайшие реализации и повтори существующий паттерн.
4. Проследи цепочку подключения: HTML → include → SCSS-агрегатор → page-файл → JS-модуль.
5. Сделай минимальное изменение; новый уровень абстракции добавляй только при отсутствии подходящего существующего компонента.

`DOCS.MD` — источник правды для публичного API компонентов и интеграционных событий. Внутренние детали компонентов не являются публичным контрактом.

Код и комментарии в коде пиши на русском языке. Не добавляй комментарии в код без необходимости.

## Технологический стек и команды

| Слой | Технология |
| --- | --- |
| Сборка | Webpack 5, `dist/` |
| Пакетный менеджер | Yarn 4.18.0 (`nodeLinker: node-modules`) |
| HTML | PostHTML: `include`, `inline` (inline-svg), `expressions` (`{{ buildDate }}`) |
| CSS | Sass/SCSS, PostCSS (autoprefixer, sort-media-queries), cssnano |
| CSS-база | modern-normalize (импортируется в `src/js/app.js`) |
| JS | Vanilla ES2024, vanilla-lazyload, imask |
| SVG | `assets/images/icons/package.svg` через `<use>` |

В `src/js/component/ui/` лежат пресеты под внешние библиотеки: `tabs.js` и `gallery.js` — под `swiper`, `lightbox.js` — под `glightbox`. Эти пакеты **не установлены**: ставятся через `yarn add` в момент первого подключения компонента в `global/init.js`.

```powershell
yarn run dev

yarn run build

yarn run build:wp

yarn run fonts:convert
yarn run fonts:get "Семейство:веса"

npx stylelint "src/scss/**/*.scss" --fix
npx eslint "src/js/**/*.js" --fix
```

После изменения SCSS или JS обязательно запускай соответствующий линтер с `--fix`. Для изменений разметки и конфигурации как минимум выполняй `yarn run build`, если задача затрагивает сборку.

`yarn run deploy` выкатывает `dist/` на боевой хост по FTP — не запускай без явной просьбы пользователя.

## Быстрая карта проекта

```text
src/
├── index.html              # дашборд-навигатор по страницам (не страница сайта)
├── page-home.html          # страницы: page-*, archive-*, misc-*, single-*
├── assets/                 # fonts, images (icons/package.svg), favicons
├── js/
│   ├── app.js              # точка входа: стили библиотек + global/init
│   ├── global/             # app.js (реестр), init.js, settings.js, func.js
│   ├── component/          # ui/ (modal, submenu, accordion, tabs, gallery, lightbox),
│   │                       # input/ (number, select), form/ (form)
│   ├── layout/             # header.js, menu.js; page/section/block/modal создаются по мере надобности
│   ├── utils/              # collapse, scroll-top, video-optimization
│   └── libs/               # локальные библиотеки (nice-select2)
├── layout/                 # head, header, footer + block/, modal/, section/, template/
└── scss/
    ├── abstracts/          # functions/ (breakpoint, mq), mixins/, variables/ + _main.scss
    ├── common/             # reset, base, misc
    ├── layout/             # components/, global/, pages/{common,archive,misc,single}/,
    │                       # partials/{block,card,misc,section}/
    ├── settings/           # _container, _fonts, _vars
    └── vendors/            # include/ (sass-mq, hamburgers, family, js-libs), extend/, override/
```

Страницы находятся в корне `src/` и собираются webpack автоматически: `page-*.html` (`cp-`), `archive-*.html` (`ap-`), `misc-*.html` (`mp-`), `single-*.html` (`sp-`). `index.html` — служебный дашборд: новую страницу добавляй в его колонки со статусом.

## Always-on контракты

### HTML

- Страница содержит `head`, `header`, `footer`, `<body class="page">`, `<main>` и `.page__body` с ID.
- Типы страниц используют префиксы `cp-`, `ap-`, `mp-`, `sp-`; общие секции — `s-*`.
- ID секции имеет форму `{page-id}-{section}`.
- После каждого закрывающего `</div>` ставь комментарий с первым классом: `<!-- /.container -->`.
- CMS-текст помещай в `[data-editor]`; не дублируй типографику редактора в scoped-стилях.
- Для иконок используй SVG-спрайт `package.svg`; изображениям задавай `.image--cover` или `.image--contain`.
- Не добавляй безымянные `div`, лишние обёртки и несемантичные интерактивные элементы.

### Имена и области видимости

- Scoped-блок секции получает короткое смысловое имя (`.hero`, `.content`, `.info`); уникальность обеспечивает ID секции.
- `g-*` — глобальный каркас, `b-*` — переиспользуемый блок, `c-*` — интерактивный компонент, `m-*` — микро-элемент.
- Карточки всегда называются `card-{type}`, а элементы сохраняют этот префикс: `.card-news__title`.
- Конкретная модалка получает модификатор `mw-{name}` на корневом `.modal`: `.modal mw-callback`.
- Базовые атомы (`.button`, `.input`, `.link`, `.icon`, `.image`, `.container`, `.section`) не переименовывай.
- Поведение привязывай к `data-*`, состояния — к `is-*`.
- Общие роли секции — `.section__header`, `.section__title`, `.section__text`, `.section__action`; типовой фон и ритм — `.section--bg`, `.section--white`.

### SCSS

- Page-стили размещай под `#section-id`; глобальные правила не протаскивай в page-файлы.
- Используй токены проекта, а не литералы: CSS-переменные `--font-*`, `--line-height-*`, `--border-radius`, `--bp-*` (генерятся из карты брейкпоинтов) и Sass-константы `$palette-*`, `$color-text__*`, `$link-*`, `$weight-*`, `$z-index-*`, `$container-*`, `$font-default`, `$transition-time` из `src/scss/settings/` и `src/scss/abstracts/variables/`.
- Глубина вложенности — не более двух уровней; `&__element` используется только внутри блока.
- Media query пишется внутри конкретного селектора и первым в его блоке; общий `@include mq` для нескольких селекторов запрещён.
- Для Grid используй `minmax(0, 1fr)`, для изображений — `aspect-ratio`, для соседних элементов — `gap`.
- Высоту формируй контентом и `padding`; `height`/`min-height` для вертикального размера не используй, кроме `min-height: 2lh` для выравнивания заголовков карточек.
- CSS библиотек подключай централизованно в `src/js/app.js`; расширения и переопределения храни в `vendors/extend` и `vendors/override`.

### JavaScript

- Переиспользуемые компоненты используют lifecycle `init()` / `update(root)` / `destroy()` и регистрируются через `app.register()`.
- Page-модуль сначала ищет корень по ID и выходит, если разметки нет.
- Listeners и observers снимаются в `destroy()`; для групп listeners предпочитай `AbortController`.
- Анимационные сценарии выбирают элементы через `data-animation`; при подключении GSAP (пакет ставится отдельно) ScrollTrigger сохраняет контракт `toggleActions: 'play none none reverse'` и `ease: 'power2.out'`, если дизайн не требует другого.
- Lazy loading не смешивает контракты `.lazy` + `.lazy__item` + `data-src` и `.lazy-simple`.
- Публичная интеграция выполняется через `window.App` и документированные события из `DOCS.MD`.

## Скиллы проекта

Существующие процедурные и внешние скиллы находятся в `.agents/skills/`. Новые тематические скиллы этого проекта находятся в `.devin/skills/`; одинаковые скиллы в двух каталогах не дублируй. Внешние скиллы из `skills-lock.json` не редактируй без отдельной задачи.

| Скилл | Когда использовать |
| --- | --- |
| `/html-methodology` | HTML, PostHTML, шаблоны, include, ассеты |
| `/scss-methodology` | SCSS, BEM, токены, responsive, vendor-стили |
| `/javascript-methodology` | JS-модули, lifecycle, GSAP, lazy loading |
| `/new-page` | Создание страницы по проектному каркасу |
| `/verify-page` | Приёмка страницы, линтеры, сборка, браузер |
| `accessibility` | WCAG и доступность |
| `performance` | Оптимизация производительности |
| `core-web-vitals` | LCP, INP, CLS |
| `best-practices` | Общие web best practices и безопасность |
| `web-quality-audit` | Комплексный аудит страницы |

При задаче по HTML, SCSS или JS сначала используй соответствующий тематический скилл. При создании или приёмке страницы дополнительно используй процедурный скилл.

## Приёмка результата

- HTML: семантика, корректные include и ID, комментарии после `</div>`, валидные `picture`/`lazy`/`alt`.
- SCSS: файл лежит в правильной папке, подключён в агрегаторе, использует токены и не выходит за область секции.
- JS: модуль импортирован или зарегистрирован, есть root guard, `data-*`, состояния `is-*`, cleanup и нужный lifecycle.
- Проверки: соответствующие линтеры с `--fix`, затем `yarn run build`.
- В браузере: desktop и mobile, отсутствие горизонтального overflow и ошибок в консоли; для интерактивных страниц — работа основных сценариев.
