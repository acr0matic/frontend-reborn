export const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
export let scrollDirection;

window.addEventListener('scroll', function handleScroll() {
  if (window.scrollY > this.lastScrollTop || 0) scrollDirection = 'bottom';
  else if (window.scrollY < this.lastScrollTop) scrollDirection = 'top';

  this.lastScrollTop = window.scrollY;
});