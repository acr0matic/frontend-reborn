import IMask from 'imask';

// Глобальные маски для телефона
const PHONE_MASKS = {
  7: '+{7} (000) 000-00-00', // Россия
  1: '+{1} (000) 000-0000', // США
  49: '+{49} 0000 0000', // Германия
};

const phoneMasks = new WeakMap();

/**
 * Инициализирует маску для конкретного поля телефона
 */
export function initPhoneMask(phoneInput, countryCode = '7') {
  if (!phoneInput || phoneMasks.has(phoneInput)) return phoneMasks.get(phoneInput);

  const maskController = IMask(phoneInput, {
    mask: PHONE_MASKS[countryCode] || PHONE_MASKS[7],

    dispatch: (appended, dynamicMasked) => {
      const number = (dynamicMasked.value + appended).replaceAll(/\D/g, '');
      if (number.startsWith('8') && number.length === 1) {
        dynamicMasked.value = '+7';
      }
      return dynamicMasked;
    },
  });

  phoneMasks.set(phoneInput, maskController);
  return maskController;
}

/**
 * Обновляет маску телефона при смене страны
 */
export function updatePhoneMask(phoneInput, countryCode) {
  const maskController = phoneMasks.get(phoneInput);

  if (!maskController) {
    console.warn('Маска для поля телефона не найдена');
    return;
  }

  const maskPattern = PHONE_MASKS[countryCode];
  if (!maskPattern) {
    console.warn(`Для кода страны не определена маска телефона: ${countryCode}`);
    return;
  }

  maskController.value = '';
  maskController.updateOptions({ mask: maskPattern });
}

export class Form {
  constructor(form) {
    if (!form) return;
    this.form = form;
    this.submit = form.querySelector('button[type=submit]');
    this.fields = form.querySelectorAll('input, select, textarea');
    this.phone = form.querySelector('input[type=tel]');
    this.email = form.querySelector('input[type=email]');
    this.name = form.querySelector('input[name=user_name]');
    this.privacy = [...form.querySelectorAll('[data-privacy]')];
    this.country = form.querySelector('select[data-target="country"]');

    this.init();
  }

  init() {
    this.initNameMask();
    this.initPhone();
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

  initNameMask() {
    if (!this.name) return;

    this.nameMask = IMask(this.name, {
      mask: /^[\sA-Za-zЁА-яё-]+$/,
    });
  }

  initPhone() {
    if (!this.phone) return;
    const countryCode = this.phone.dataset.countryCode || (this.country?.value) || '7';
    initPhoneMask(this.phone, countryCode);
  }

  initPrivacyListener() {
    if (this.privacy.length === 0 || !this.submit) return;

    this.updateSubmitState();
    this.form.addEventListener('change', this.onPrivacyChange);
  }

  onPrivacyChange = (event) => {
    if (Object.hasOwn(event.target.dataset, 'privacy')) {
      this.updateSubmitState();
    }
  };

  updateSubmitState() {
    if (!this.submit) return;

    const allChecked = this.privacy.every((item) => item.checked);
    this.submit.disabled = !allChecked;
  }

  initCountrySelect() {
    this.country.addEventListener('change', this.onCountryChange);
  }

  onCountryChange = () => {
    if (this.phone) {
      updatePhoneMask(this.phone, this.country.value);
    }
  };

  reset() {
    this.form.reset();

    if (this.phone && phoneMasks.has(this.phone)) {
      const mask = phoneMasks.get(this.phone);
      mask.value = '';
      mask.updateValue();
    }

    this.updateSubmitState();
  }

  destroy() {
    if (!this.form) return;

    this.form.removeEventListener('click', this.onClick);
    this.form.removeEventListener('change', this.onPrivacyChange);

    if (this.country) {
      this.country.removeEventListener('change', this.onCountryChange);
    }

    if (this.phone && phoneMasks.has(this.phone)) {
      const mask = phoneMasks.get(this.phone);
      mask.destroy();
      phoneMasks.delete(this.phone);
    }

    if (this.nameMask) {
      this.nameMask.destroy();
    }

    this.form = undefined;
  }
}

export default class Forms {
  constructor(options = {}) {
    this.options = {
      selector: '.form-custom',
      ...options,
    };
    this.instances = [];
    this.init();
  }

  init() {
    this.update();
  }

  update() {
    this.instances = this.instances.filter((instance) => {
      if (instance.form && document.contains(instance.form)) return true;
      instance.destroy();
      return false;
    });

    const forms = document.querySelectorAll(this.options.selector);
    const newForms = [...forms].filter((form) => !this.instances.some((instance) => instance.form === form));
    const newInstances = newForms.map((form) => new Form(form));

    this.instances = [...this.instances, ...newInstances];
    return newInstances;
  }

  destroy() {
    for (const instance of this.instances) {
      instance.destroy();
    }
    this.instances = [];
  }
}
