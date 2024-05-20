/* eslint-disable no-unused-expressions */
/* https://itchief.ru/javascript/slidetoggle */

const toggleEvent = new Event("dropdownToggle");

export class Collapse {
  constructor(target, duration = 350) {
    this._target = target;
    this._duration = duration;

    this.init();
  }

  init() {
    if (this._target.dataset.state === 'open') {
      this._target.classList.add('collapse_show');
      this._target.parentNode.classList.add('is-open');
    }

    else {
      this._target.classList.add('collapse');
    }

    this._target.addEventListener('dropdownToggle', () => {
      this._target.parentNode.classList.toggle('is-open');
    });
  }

  show() {
    const el = this._target;
    if (el.classList.contains('collapsing') || el.classList.contains('collapse_show')) {
      return;
    }
    el.classList.remove('collapse');
    const height = el.offsetHeight;
    el.style.height = 0;
    el.style.overflow = 'hidden';
    el.style.transition = `all ${this._duration}ms ease`;
    el.classList.add('collapsing');
    el.offsetHeight;
    el.style.height = `${height}px`;
    el.dispatchEvent(toggleEvent);

    window.setTimeout(() => {
      el.classList.remove('collapsing');
      el.classList.add('collapse');
      el.classList.add('collapse_show');
      el.style.height = '';
      el.style.transition = '';
      el.style.overflow = '';
    }, this._duration);
  }

  hide() {
    const el = this._target;
    if (el.classList.contains('collapsing') || !el.classList.contains('collapse_show')) {
      return;
    }
    el.style.height = `${el.offsetHeight}px`;
    el.offsetHeight;
    el.style.opacity = 0;
    el.style.height = 0;
    el.style.overflow = 'hidden';
    el.style.transition = `all ${this._duration}ms ease`;
    el.classList.remove('collapse');
    el.classList.remove('collapse_show');
    el.classList.add('collapsing');
    window.setTimeout(() => {
      el.classList.remove('collapsing');
      el.classList.add('collapse');
      el.style.opacity = '';
      el.style.height = '';
      el.style.transition = '';
      el.style.overflow = '';
      el.dispatchEvent(toggleEvent);
    }, this._duration);
  }

  toggle() {
    this._target.classList.contains('collapse_show') ? this.hide() : this.show();
  }
}