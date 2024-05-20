import IMask from 'imask';

export class Form {
  constructor(form) {
    this.form = form;
    this.phone = form.querySelector('input[type=tel]');
    this.email = form.querySelector('input[type=email]');
    this.name = form.querySelector('input[name=user_name]');

    this.mask = {
      phone: '+{7} (000) 000-00-00',
      name: /^[A-Za-zА-я]+$/,
    };

    this.Mask();
  }

  Mask() {
    if (this.phone) {
      IMask(this.phone, {
        mask: this.mask.phone,
        prepare: (appended, masked) => ((appended === '8' && masked.value === '') ? '+7' : appended),
      });
    }

    if (this.name) IMask(this.name, { mask: this.mask.name });
  }
}

const forms = document.querySelectorAll('.form-custom');
for (const form of forms) new Form(form);
