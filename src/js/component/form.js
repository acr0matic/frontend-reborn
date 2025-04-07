import IMask from 'imask';

export class Form {
  constructor(form) {
    form.addEventListener('click', this.onClick.bind(this));

    this.form = form;
    this.fields = form.querySelectorAll('input');
    this.phone = form.querySelector('input[type=tel]');
    this.email = form.querySelector('input[type=email]');
    this.name = form.querySelector('input[name=user_name]');

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

    this.inputMask();
    if (this.country) this.countrySelect();
  }

  onClick(event) {
    const isButtonClicked = event.target.closest('.button');

    if (isButtonClicked) {
      const action = isButtonClicked.dataset.action;
      if (action) this[action]();
    }
  }

  inputMask() {
    if (this.phone) {
      this.maskController = IMask(this.phone, {
        mask: this.mask.phone[7],
        prepare: (appended, masked) => ((appended === '8' && masked.value === '') ? '+7' : appended),
      });
    }

    if (this.name) IMask(this.name, { mask: this.mask.name });
  }

  countrySelect() {
    this.country.addEventListener('change', () => {
      this.phone.value = '';
      this.maskController.updateValue();
      this.maskController.updateOptions({
        mask: this.mask.phone[this.country.value],
      });
    });
  }

  reset() {
    for (const field of this.fields) {
      field.value = '';
      field.checked = false;
    }
  }
}

const forms = document.querySelectorAll('.form-custom');
for (const form of forms) new Form(form);
