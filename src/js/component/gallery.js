import { Swiper } from "swiper";
import { Navigation, Thumbs, Pagination } from "swiper/modules";

const galleries = document.querySelectorAll('.b-gallery');

for (const gallery of galleries) {
  const preview = new Swiper(gallery.querySelector('.b-gallery__thumb .swiper'), {
    slidesPerView: 2.5,
    spaceBetween: 16,
    slideToClickedSlide: true,

    breakpoints: {
      800: {
        slidesPerView: 3,
      },

      1200: {
        slidesPerView: 4,
      },

      1480: {
        slidesPerView: 5,
      }
    },
  });

  new Swiper(gallery.querySelector('.b-gallery__main .swiper'), {
    modules: [Navigation, Thumbs, Pagination],

    slidesPerView: 1,
    spaceBetween: 32,

    navigation: {
      prevEl: gallery.querySelector('.swiper-button-prev'),
      nextEl: gallery.querySelector('.swiper-button-next'),
    },

    thumbs: {
      swiper: preview.slides.length > 0 ? preview : undefined,
    },

    pagination: {
      el: gallery.querySelector('.b-gallery__main .swiper-pagination')
    }
  });
}