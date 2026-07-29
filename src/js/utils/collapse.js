/* eslint-disable unicorn/no-null */
/* eslint-disable no-unused-expressions */

export class Collapse {
  constructor(target, duration = 350, className = 'is-open', container = null) {
    this._target = target;
    this._duration = duration;
    this._className = className;
    this._container = container || target.parentNode;
    this._isTransitioning = false;

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

  show() {
    if (this._isTransitioning || this._container.classList.contains(this._className)) return;

    this._isTransitioning = true;
    const el = this._target;

    el.style.transition = `height ${this._duration}ms ease`;
    const height = el.scrollHeight;

    el.style.height = `${height}px`;
    this._container.classList.add(this._className);
    delete this._container.dataset.state;

    this._triggerEvent('dropdownToggleStart');

    window.setTimeout(() => {
      el.style.height = '';
      el.style.transition = '';
      this._isTransitioning = false;
      this._triggerEvent();
    }, this._duration);
  }

  hide() {
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

    window.setTimeout(() => {
      el.style.transition = '';
      this._isTransitioning = false;
      this._triggerEvent();
    }, this._duration);
  }

  toggle() {
    this._container.classList.contains(this._className) ? this.hide() : this.show();
  }

  _triggerEvent(eventName = 'dropdownToggle') {
    this._target.dispatchEvent(new CustomEvent(eventName, { bubbles: true }));
  }
}