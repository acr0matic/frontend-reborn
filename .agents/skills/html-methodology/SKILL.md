---
name: html-methodology
description: Use when работаешь с HTML-страницами, PostHTML-шаблонами, include, ID секций, CMS-текстами, изображениями или SVG-ассетами этого проекта.
argument-hint: "[файл или область]"
triggers:
  - user
  - model
---

# HTML-методология проекта

Применяй эти правила к разметке в `src/*.html` и `src/layout/**/*.html`. Процедура создания страницы описана в `/new-page`, приёмка — в `/verify-page`; этот скилл задаёт именно контракт HTML.

## Перед изменением

1. Найди минимум две ближайшие реализации в `src/` и повтори их структуру.
2. Проверь цепочку `страница → include → шаблон → SCSS-агрегатор`; JS подключай только при наличии поведения.
3. Для публичного API компонентов сверяйся с `DOCS.MD`, а не с внутренними деталями реализации.

## Типы страниц и ID

| Тип | Файл | Префикс ID | Папка SCSS |
| --- | --- | --- | --- |
| common | `page-*.html` | `cp-` | `src/scss/layout/pages/common/` |
| archive | `archive-*.html` | `ap-` | `src/scss/layout/pages/archive/` |
| misc | `misc-*.html` | `mp-` | `src/scss/layout/pages/misc/` |
| single | `single-*.html` | `sp-` | `src/scss/layout/pages/single/` |

- Корень страницы — `.page__body` с ID `{префикс}-{имя}`.
- ID секции — `{page-id}-{section}` на `<section class="section">`.
- Общая секция из `src/layout/section/` получает ID `s-{имя}`.
- Если ID страницы уже содержит `content`, текстовую секцию называй `{page-id}-content-text`, чтобы не получить `content-content`.
- Витринные блоки на служебных страницах (`misc-*`) получают суффикс `-dev`.
- Scoped-блок внутри секции получает короткое смысловое имя (`.hero`, `.content`, `.info`); уникальность даёт ID секции.

## Каркас страницы

Каждая страница содержит `<!DOCTYPE html>`, `<html lang="ru">` (или фактический язык), include `head`, `header`, `footer`, `<body class="page">`, `<main>` и `.page__body` с корректным ID.

```html
<main>
  <div id="cp-example" class="page__body">
    <section id="cp-example-content" class="section">
      <div class="container">
        <div class="content">
          <!-- содержимое секции -->
        </div>
        <!-- /.content -->
      </div>
      <!-- /.container -->
    </section>
  </div>
  <!-- /.page__body -->
</main>
```

## Include и условная разметка

Переиспользуемый фрагмент подключается через:

```html
<include src="layout/block/achievements.html"></include>
```

Данные шаблону передаются JSON-блоком внутри include. Внутри шаблонов используй `<if condition="...">` и `<else>` только для действительно разных вариантов разметки; не размножай почти одинаковые фрагменты.

## Форматирование и семантика

- После каждого закрывающего `</div>` ставь комментарий с первым классом: `<!-- /.container -->`.
- Между соседними элементами одного уровня оставляй пустую строку. Исключение — короткие плоские списки без вложенной разметки.
- Используй семантические элементы (`section`, `nav`, `header`, `button`, `a`, `time`, `picture`) по назначению.
- Для действий используй `button`, для навигации — `a`; иконковым кнопкам задавай доступное имя.
- Не добавляй безымянные `div` и лишние обёртки вокруг `picture`/`img`.

## CMS-текст

Редактируемые CMS-блоки помечай `data-editor`:

```html
<div class="content__text" data-editor>
  <p>Текст страницы.</p>
  <h2>Подзаголовок</h2>
</div>
```

Обёртка отвечает только за ширину и позиционирование. Типографика, интервалы параграфов и списков задаются редактором в `src/scss/layout/components/editor/`; не дублируй их в scoped-стилях.

## Изображения и SVG

- Пути к макетным изображениям повторяют структуру: `assets/images/layout/{global|section|page}/...`; page-ассеты лежат в `layout/page/{page-id}/{section}/`.
- ID иконок группируй по назначению: `arrow-*`, `misc-*`, `profile-*`, `payment-*`, `social-*`.
- Для SVG-иконок используй спрайт:

```html
<svg class="icon" aria-hidden="true">
  <use href="assets/images/icons/package.svg#arrow-dropdown"></use>
</svg>
```

- Изображение всегда получает `.image--cover` или `.image--contain`; голый `.image` не используется.
- Для lazy loading с прелоадером: `.lazy.lazy--preloader` на обёртке, `.lazy__item` на изображении и `data-src` вместо `src`.
- `.lazy__item--blur` используй только для крупных баннеров и hero-фонов.
- Для простых фоновых элементов без прелоадера используй `.lazy-simple`; не смешивай два контракта.
- Адаптивные фоны оформляй через `<picture>` с `bg_pc`, `bg_tablet`, `bg_mobile` и корректными `media`.
- У каждого содержательного изображения есть `alt`; декоративному изображению оставляй пустой `alt`.

## Чек-лист

- [ ] Каркас страницы и ID соответствуют типу.
- [ ] Все include-пути существуют, параметры шаблонов валидны.
- [ ] После `</div>` есть комментарии с первым классом.
- [ ] CMS-тексты отмечены `data-editor` без дублирования типографики.
- [ ] Изображения, lazy loading, `alt` и SVG используют проектные контракты.
- [ ] Разметка семантична и не содержит лишних обёрток.
