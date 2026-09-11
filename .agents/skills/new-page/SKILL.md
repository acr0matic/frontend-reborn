---
name: new-page
description: Scaffold a new page following the project methodology (type, ID, include skeleton, SCSS, dashboard)
argument-hint: "<type> <name> — e.g. page about / archive article"
triggers:
  - user
allowed-tools:
  - read
  - edit
  - write
  - grep
  - glob
  - exec
---

Create a new page following the project methodology. All code comments and explanations must be in Russian.

## Step 1. Determine type and ID

Derive the page type from the user's argument. If the type is missing or unclear — ask.

| Type    | File             | ID prefix | SCSS folder                  |
| ------- | ---------------- | --------- | ---------------------------- |
| common  | `page-*.html`    | `cp-`     | `scss/layout/pages/common/`  |
| archive | `archive-*.html` | `ap-`     | `scss/layout/pages/archive/` |
| single  | `single-*.html`  | `sp-`     | `scss/layout/pages/single/`  |
| misc    | `misc-*.html`    | `mp-`     | `scss/layout/pages/misc/`    |

Page ID: `{prefix}-{name}` → goes on `.page__body`. Section ID: `{page-id}-{section}`.

## Step 2. Find the nearest implementations

Before creating anything, read at least one existing page of the same type (`src/*.html`) and its SCSS in `scss/layout/pages/{type}/` to repeat the pattern. Do not copy markup blindly — verify the class names.

## Step 3. Create the HTML

File `src/{file-prefix}-{name}.html`. Inner page skeleton:

```html
<!DOCTYPE html>
<html lang="ru">

<include src="layout/head.html"></include>

<body class="page">
  <include src="layout/header.html">
    {
    "mod": "sticky"
    }
  </include>

  <main>
    <div id="{page-id}" class="page__body">
      <section id="{page-id}-content" class="section">
        <div class="container">
          <div class="content">
            <!-- содержимое -->
          </div>
          <!-- /.content -->
        </div>
        <!-- /.container -->
      </section>
    </div>
    <!-- /.page__body -->
  </main>

  <include src="layout/footer.html"></include>
</body>

</html>
```

Rules:
- the section's root block gets a short semantic name without a page prefix (`.content`, `.hero`, `.info`); uniqueness comes from `#section-id`;
- after every `</div>` — a comment `<!-- /.first-class -->`;
- CMS-editable text goes inside a `data-editor` wrapper;
- images follow `AGENTS.md` §9 (`.lazy`, `.image--cover|contain`, `data-src`).

## Step 4. Create the SCSS

- Folder `src/scss/layout/pages/{type}/{name}/`, file `_content.scss` (or one file per section for complex pages).
- All styles strictly under `#section-id { .block { &__element {} } }`, nesting depth ≤ 2.
- Register in `src/scss/layout/pages/{type}/_main.scss` — `@import "{name}/content";`.
- Responsive only via `@include mq(...)`; values come from tokens in `settings/_vars.scss`.

## Step 5. JS — only if needed

If the page has behavior: `src/js/layout/page/{page-id}.js` with an `if (page)` guard, imported in `src/js/app.js`. If there is no behavior — do not create the file.

## Step 6. Dashboard

Add an entry to the appropriate column of `src/index.html`:

```html
<li class="status-todo"><a href="{file}.html">{Page title}</a></li>
```

## Step 7. Verification

```powershell
npx stylelint "src/scss/**/*.scss" --fix
npx eslint "src/js/**/*.js" --fix
yarn run build
```

The build must pass without errors. Finish with a short report: created files, page-id, where everything was registered.
