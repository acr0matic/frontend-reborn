export default class NumberInput {
  constructor(options = {}) {
    this.options = {
      selector: options.selector || 'input[type="number"]',
      ...options,
    };
    this.instances = new WeakSet();
    this.init();
  }

  init() {
    this.update();
  }

  update() {
    const inputs = document.querySelectorAll(this.options.selector);

    for (const input of inputs) {
      if (this.instances.has(input)) continue;
      this.instances.add(input);

      const maxAttr = input.getAttribute('max');
      const minAttr = input.getAttribute('min');

      const max = maxAttr === null ? undefined : Number.parseFloat(maxAttr);
      const min = minAttr === null ? undefined : Number.parseFloat(minAttr);

      if (min === undefined && max === undefined) continue;

      input.addEventListener('change', () => {
        let value = Number.parseFloat(input.value);

        if (Number.isNaN(value)) {
          input.value = min === undefined ? '' : min;
          return;
        }

        if (min !== undefined && value < min) value = min;
        if (max !== undefined && value > max) value = max;

        input.value = value;
      });
    }
  }
}
