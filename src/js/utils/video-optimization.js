/**
 * Ленивая загрузка видео: воспроизведение только в зоне видимости,
 * пауза при выходе из viewport
 */
export default class LazyVideo {
  constructor(options = {}) {
    this.options = {
      selector: '[lazy-video]',
      threshold: 0.05,
      ...options,
    };

    this.instances = new Map();

    this.init();
  }

  init() {
    this.update();
  }

  /**
   * @param {ParentNode} [root=document] - корневой узел для поиска видео
   */
  update(root = document) {
    for (const [video, observer] of this.instances) {
      if (document.contains(video)) continue;
      observer.disconnect();
      this.instances.delete(video);
    }

    for (const video of root.querySelectorAll(this.options.selector)) {
      if (this.instances.has(video)) continue;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        },
        { threshold: this.options.threshold }
      );

      observer.observe(video);
      this.instances.set(video, observer);
    }
  }

  destroy() {
    for (const observer of this.instances.values()) {
      observer.disconnect();
    }
    this.instances.clear();
  }
}
