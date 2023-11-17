import { Swiper } from 'swiper';
import { Pagination } from 'swiper/modules';
import 'swiper/css';

new Swiper('.swiper', {
  modules: [Pagination],
  pagination: {
    el: '.swiper-pagination'
  }
});

document.body.classList.add('test');
