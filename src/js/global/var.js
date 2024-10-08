const body = document.body;
const html = document.documentElement;

export const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
export const pageHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);



export let scrollDirection;

window.addEventListener('scroll', function handleScroll() {
  if (window.scrollY > this.lastScrollTop || 0) scrollDirection = 'bottom';
  else if (window.scrollY < this.lastScrollTop) scrollDirection = 'top';

  this.lastScrollTop = window.scrollY;
});