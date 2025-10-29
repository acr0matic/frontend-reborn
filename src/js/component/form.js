import IMask from 'imask';

export class Form {
  constructor(form) {
    this.form = form;
    this.submit = form.querySelector('button[type=submit]');

    this.fields = form.querySelectorAll('input, select, textarea');
    this.phone = form.querySelector('input[type=tel]');
    this.email = form.querySelector('input[type=email]');
    this.name = form.querySelector('input[name=user_name]');

    this.privacy = form.querySelectorAll('[data-privacy]');

    this.country = form.querySelector('select[data-target="country"]');

    this.maskController = undefined;
    this.mask = {
      name: /^[ A-Za-zА-я]+$/,
      phone: {
        7: '+{7} (000) 000-00-00', // Россия
        1: '+{1} (000) 000-0000', // США
        49: '+{49} 0000 0000', // Германия
      },
    };

    this.initMask();
    this.initPrivacyListener();

    if (this.country) this.initCountrySelect();

    this.form.addEventListener('click', this.onClick);
  }

  onClick = (event) => {
    const button = event.target.closest('.button');
    if (!button) return;

    const action = button.dataset.action;
    if (action && typeof this[action] === 'function') {
      this[action]();
    }
  };

  initMask() {
    if (this.phone) {
      this.maskController = IMask(this.phone, {
        mask: this.mask.phone[7],
        prepare: (appended, masked) => (appended === '8' && masked.value === '' ? '+7' : appended),
      });
    }

    if (this.name) {
      IMask(this.name, { mask: this.mask.name });
    }
  }

  initPrivacyListener() {
    if (!this.privacy || !this.submit) return;

    const container = this.form;

    this.updateSubmitState();

    container.addEventListener('change', (e) => {
      if (e.target.matches('input[type="checkbox"]')) {
        this.updateSubmitState();
      }
    });
  }

  updateSubmitState() {
    const allChecked = [...this.privacy].every(item => item.checked);
    this.submit.disabled = !allChecked;
  }

  initCountrySelect() {
    this.country.addEventListener('change', () => {
      if (!this.mask.phone[this.country.value]) {
        console.warn(`Для кода страны не определена маска телефона: ${this.country.value}`);
        return;
      }
      this.phone.value = '';
      this.maskController.updateOptions({
        mask: this.mask.phone[this.country.value],
      });
    });
  }

  reset() {
    for (const field of this.fields) {
      if (field.type === 'checkbox' || field.type === 'radio') {
        field.checked = false;
      } else {
        field.value = '';
      }
    }

    if (this.maskController) {
      this.maskController.updateValue();
    }
  }
}

for (const form of document.querySelectorAll('.form-custom')) new Form(form);