/* Все объекты конфигураций для скриптов */

import { getBreakpointVar } from './func';

// Повторяющиеся стили
export const StyleClass = {
  mobile: {
    open: 'mobile-menu--open',
  },

  body: {
    scroll: 'scroll-lock'
  },

  state: {
    open: 'is-open',
    active: 'is-active',
  }
};

// Для адаптивности скриптов
// Значения читаются из CSS-переменных, сгенерированных в SCSS из $generated-breakpoints
// breakpoint.* — соответствует mq($from: name) в SCSS (min-width)
// Для проверки "мобильный" использовать !MediaQuery(breakpoint.tablet) — соответствует mq($until: tablet)
export const breakpoint = new Proxy({}, {
  get: (_, name) => `(min-width: ${getBreakpointVar(name)})`,
});


