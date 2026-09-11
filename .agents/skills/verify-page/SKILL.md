---
name: verify-page
description: Acceptance check of a built page — linters, build, browser, methodology checklist
argument-hint: "[page file name, e.g. page-about]"
triggers:
  - user
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
---

Verify a page against the project methodology and basic quality standards. If no page name is given — detect it from recently changed files or ask.

## Stage 1. Static review

1. Read `src/{page}.html` and the related SCSS (`scss/layout/pages/{type}/{page}/`).
2. Check against the checklist:

**HTML**
- skeleton: `head`/`header`/`footer` includes, `body.page`, `main`, `.page__body` with the correct ID;
- section IDs `{page-id}-{section}`, shared sections — `s-*`;
- after every `</div>` — a comment with the element's first class;
- no classless `div`s and no extra wrappers around `picture`/`img`;
- `data-editor` on CMS text blocks;
- `alt` on images, `aria-label` on icon buttons, `button`/`a` used by purpose;
- icons via `<use href="assets/images/icons/package.svg#...">`.

**SCSS**
- all selectors under `#section-id`; no bare global classes leaking from the page file;
- `mq()` for responsive rules, `minmax(0, 1fr)` in grid tracks, `aspect-ratio` on media;
- no `position: absolute` on content elements (layers only);
- tokens from `_vars.scss`, no magic colors/fonts;
- SCSS class names match the HTML classes (spot-check).

## Stage 2. Linters and build

```powershell
npx stylelint "src/scss/**/*.scss" --fix
npx eslint "src/js/**/*.js" --fix
yarn run build
```

If a linter auto-fixed something — list what. If the build fails — stop and investigate the cause.

## Stage 3. Browser check (chrome-devtools MCP)

1. Start the dev server `yarn run dev` (or reuse a running one).
2. Open the page via chrome-devtools.
3. Check:
   - console — no JS errors;
   - desktop (~1920px) and mobile (~375px): horizontal overflow, heading wraps, card heights;
   - lazy loading: images load, no empty areas;
   - interactivity: modals, accordions, menu — work correctly;
   - `prefers-reduced-motion` if the page has animations.

## Stage 4. Report

A summary table: what was checked → status (ok / issue + file:line). Propose fixes for found issues, but do not change code without approval.
