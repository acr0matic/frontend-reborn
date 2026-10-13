import GLightbox from 'glightbox';

/*
 * Lightbox на базе GLightbox (npm-пакет).
 * Стили библиотеки подключены в src/js/app.js.
 * Триггер: элемент с классом .glightbox, источник — data-атрибуты:
 * data-type="video", data-source="local|youtube|vimeo", href — ссылка на видео.
 */
export default class Lightbox {
  constructor(options = {}) {
    this.options = {
      selector: '.glightbox',
      autoplayVideos: true,
      ...options,
    };
    this.instance = undefined;
    this.init();
  }

  /*
   * GLightbox вызывает player.play() без catch: при закрытии или смене слайда
   * pause() прерывает ещё не начавшееся воспроизведение, и браузер выбрасывает
   * unhandled rejection. Отказ play() глушим только у видео внутри лайтбокса.
   */
  static patchMediaPlay() {
    if (Lightbox.playPatched) return;
    Lightbox.playPatched = true;

    const nativePlay = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function play(...args) {
      const promise = nativePlay.apply(this, args);
      if (this.closest('.gvideo-wrapper')) promise.catch(() => {});
      return promise;
    };
  }

  init() {
    Lightbox.patchMediaPlay();
    this.update();
  }

  update() {
    const { selector, ...settings } = this.options;

    if (!document.querySelector(selector)) {
      this.destroy();
      return;
    }

    if (this.instance) {
      // Пересканирует DOM — подхватывает триггеры, добавленные через AJAX/CMS
      this.instance.reload();
      return;
    }

    this.instance = GLightbox({ selector, ...settings });
  }

  destroy() {
    this.instance?.destroy();
    this.instance = undefined;
  }
}
