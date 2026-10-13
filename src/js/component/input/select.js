import NiceSelect from '../../libs/nice-select2';

/**
 * Кастомные селекты на базе NiceSelect2 (локальная копия в js/libs).
 * Стили подключены через scss/vendors (js-libs/nice-select + extend/_nice-select).
 * data-атрибуты на <select>: data-placeholder, data-search (включает поиск).
 */
export default class Select {
  constructor(options = {}) {
    this.options = {
      selector: 'select',
      ...options,
    };
    this.instances = new Map();
    this.init();
  }

  init() {
    this.update();
  }

  /**
   * Инициализирует новые селекты и вычищает удалённые из DOM
   * @param {ParentNode} [root=document] - корневой узел для поиска
   */
  update(root = document) {
    for (const [select, instance] of this.instances) {
      if (document.contains(select)) continue;
      instance.destroy();
      this.instances.delete(select);
    }

    for (const select of root.querySelectorAll(this.options.selector)) {
      if (this.instances.has(select)) continue;

      const instance = new NiceSelect(select, {
        placeholder: select.dataset.placeholder || 'Выберите',
        searchtext: 'Поиск',
        selectedtext: 'выбрано',
        searchable: !!(select.dataset.search && select.dataset.search !== 'false'),
      });

      // Синхронизирует NiceSelect с исходным состоянием select
      select.dispatchEvent(new Event('change'));
      this.instances.set(select, instance);
    }
  }

  destroy() {
    for (const instance of this.instances.values()) {
      instance.destroy();
    }
    this.instances.clear();
  }
}
