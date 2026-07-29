/*
* Задает CSS-переменную для указаного узла. Вешается на блок или на <body>
* По умолчанию высчитывается высота блока а область видимости - вся страница
*/

export const SetSize = (target, prefix, attach = false, dimension = 'height') => {
  if (target) {
    const size = (dimension === 'width') ? target.offsetWidth : target.offsetHeight;

    if (attach) target.style.setProperty(`--${prefix}-${dimension}`, size + 'px');
    else document.documentElement.style.setProperty(`--${prefix}-${dimension}`, size + 'px');

    return size;
  }

  return 0;
};

export const BlockHeight = (block) => block ? block.clientHeight : undefined;
export const MediaQuery = (breakpoint) => window.matchMedia(`${breakpoint}`).matches;

/**
 * Читает значение брейкпоинта из CSS-переменной на :root,
 * сгенерированной из $generated-breakpoints в SCSS.
 * @param {string} name — имя брейкпоинта (mobile, tablet, notebook, laptop, desktop)
 * @returns {string} значение, например "528px"
 */
export const getBreakpointVar = (name) => {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(`--bp-${name}`)
    .trim();

  if (!value) {
    console.warn(`Брейкпоинт --bp-${name} не найден в CSS-переменных`);
    return '0px';
  }

  return value;
};