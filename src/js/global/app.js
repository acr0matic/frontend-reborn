/**
 * Реестр компонентов приложения.
 * Централизует жизненный цикл (update/destroy) и служит внутренней
 * точкой доступа вместо разбросанных глобальных переменных.
 * Наружу смотрит публичный фасад window.App (см. init.js и DOCS.MD).
 */
export default class App {
  #components = new Map();

  /**
   * Регистрирует компонент под именем
   * @param {string} name - имя компонента
   * @param {object} instance - экземпляр с опциональными методами update()/destroy()
   * @returns {App} текущий реестр для цепочки вызовов
   */
  register(name, instance) {
    if (this.#components.has(name)) {
      console.warn(`[App] Компонент "${name}" уже зарегистрирован`);
      return this;
    }

    this.#components.set(name, instance);
    return this;
  }

  /**
   * Возвращает зарегистрированный компонент
   * @param {string} name - имя компонента
   * @returns {object|undefined} экземпляр компонента
   */
  get(name) {
    return this.#components.get(name);
  }

  /**
   * Обновляет все компоненты (например, после AJAX-подгрузки разметки)
   * @param {ParentNode} [root=document] - корневой узел для поиска элементов
   */
  update(root = document) {
    for (const instance of this.#components.values()) {
      instance.update?.(root);
    }
  }

  /**
   * Уничтожает все компоненты
   * @param {ParentNode} [root=document] - корневой узел
   */
  destroy(root = document) {
    for (const instance of this.#components.values()) {
      instance.destroy?.(root);
    }
  }
}
