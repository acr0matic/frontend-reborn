export default class NumberInput {
  constructor(options = {}) {
    this.options = {
      selector: options.selector || 'input[type="number"]',
      ...options,
    };
    this.instances = new Map();
    this.init();
  }

  init() {
    this.update();
  }

  /**
   * Инициализирует новые input[type="number"] и вычищает удалённые из DOM
   * @param {ParentNode} [root=document] - корневой узел для поиска
   */
  update(root = document) {
    for (const [input, controller] of this.instances) {
      if (document.contains(input)) continue;
      controller.abort();
      this.instances.delete(input);
    }

    const inputs = root.querySelectorAll(this.options.selector);

    for (const input of inputs) {
      if (this.instances.has(input)) continue;

      const maxAttr = input.getAttribute('max');
      const minAttr = input.getAttribute('min');

      const max = maxAttr === null ? undefined : Number.parseFloat(maxAttr);
      const min = minAttr === null ? undefined : Number.parseFloat(minAttr);

      if (min === undefined && max === undefined) continue;

      const controller = new AbortController();

      input.addEventListener('change', () => {
        let value = Number.parseFloat(input.value);

        if (Number.isNaN(value)) {
          input.value = min === undefined ? '' : min;
          return;
        }

        if (min !== undefined && value < min) value = min;
        if (max !== undefined && value > max) value = max;

        input.value = value;
      }, { signal: controller.signal });

      this.instances.set(input, controller);
    }
  }

  destroy() {
    for (const controller of this.instances.values()) {
      controller.abort();
    }
    this.instances.clear();
  }
}
