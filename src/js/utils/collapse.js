/* eslint-disable unicorn/no-null */
/* eslint-disable no-unused-expressions */

export class Collapse {
  constructor(target, duration = 350, className = 'is-open', container = null) {
    this._target = target;
    this._duration = duration;
    this._className = className;
    this._container = container || target.parentNode;
    this._isTransitioning = false;
    this._timer = undefined;
    this._onTransitionEnd = undefined;

    this.init();
  }

  init() {
    const isOpen = this._container.dataset.state === 'open';

    this._target.style.overflow = 'hidden';

    if (isOpen) {
      this._container.classList.add(this._className);
      this._target.style.height = '';
    } else {
      this._container.classList.remove(this._className);
      this._target.style.height = '0';
    }
  }

  open() {
    if (this._isTransitioning || this._container.classList.contains(this._className)) return;

    this._isTransitioning = true;
    const el = this._target;

    el.style.transition = `height ${this._duration}ms ease`;
    const height = el.scrollHeight;

    el.style.height = `${height}px`;
    this._container.classList.add(this._className);
    delete this._container.dataset.state;

    this._triggerEvent('dropdownToggleStart');

    this._afterTransition(() => {
      el.style.height = '';
      el.style.transition = '';
      this._finishTransition();
    });
  }

  close() {
    if (this._isTransitioning || !this._container.classList.contains(this._className)) return;

    this._isTransitioning = true;
    const el = this._target;

    el.style.height = `${el.scrollHeight}px`;
    el.offsetHeight;

    el.style.transition = `height ${this._duration}ms ease`;
    el.style.height = '0';
    this._container.classList.remove(this._className);
    delete this._container.dataset.state;

    this._triggerEvent('dropdownToggleStart');

    this._afterTransition(() => {
      el.style.transition = '';
      this._finishTransition();
    });
  }

  toggle() {
    this._container.classList.contains(this._className) ? this.close() : this.open();
  }

  /**
   * Завершает переход по событию transitionend с таймаутом-фолбэком
   * @param {Function} callback - действие после завершения анимации
   */
  _afterTransition(callback) {
    this._clearPending();

    this._onTransitionEnd = (event) => {
      if (event.target !== this._target || event.propertyName !== 'height') return;
      this._completeTransition(callback);
    };

    this._target.addEventListener('transitionend', this._onTransitionEnd);
    this._timer = window.setTimeout(() => {
      this._completeTransition(callback);
    }, this._duration + 50);
  }

  _completeTransition(callback) {
    this._clearPending();
    callback();
  }

  _finishTransition() {
    this._isTransitioning = false;
    this._triggerEvent();
  }

  _clearPending() {
    if (this._timer !== undefined) {
      clearTimeout(this._timer);
      this._timer = undefined;
    }

    if (this._onTransitionEnd) {
      this._target.removeEventListener('transitionend', this._onTransitionEnd);
      this._onTransitionEnd = undefined;
    }
  }

  destroy() {
    this._clearPending();
    this._target.style.height = '';
    this._target.style.transition = '';
    this._target.style.overflow = '';
    this._isTransitioning = false;
  }

  _triggerEvent(eventName = 'dropdownToggle') {
    this._target.dispatchEvent(new CustomEvent(eventName, { bubbles: true }));
  }
}
