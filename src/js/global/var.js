const body = document.body;
const html = document.documentElement;

export const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
export const pageHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);



export let scrollDirection;

let lastScrollTop = 0;
window.addEventListener('scroll', () => {
  requestAnimationFrame(() => {
    const currentScroll = window.scrollY;

    if (currentScroll > lastScrollTop && currentScroll > 0) {
      scrollDirection = 'down';
    } else if (currentScroll < lastScrollTop) {
      scrollDirection = 'up';
    }

    lastScrollTop = Math.max(0, currentScroll);
  });
}, { passive: true });
