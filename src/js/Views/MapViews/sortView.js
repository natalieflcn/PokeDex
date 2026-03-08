import View from '../View.js';

class SortView extends View {
  _parentEl = document.querySelector('.map__btns--sort');
  _errorMessage = 'There was an error sorting Pokémon on the Map module.';

  /**
   * Adds handler to search sort buttons
   *
   * @param {Function} handler - Search controller callback (controlSearchSortBtn)
   */
  addHandlerSortBtn(handler) {
    this._parentEl.addEventListener('click', function (e) {
      e.preventDefault();

      const btn = e.target.closest(
        '.map__btn--name, .map__btn--id, .map__btn--date',
      );
      if (!btn || btn.classList.contains('btn--active')) return;

      const sort = btn.dataset.sort;

      handler(sort);
    });
  }

  /**
   * Adds handler to load active sort button during browser navigation events
   *
   * @param {Function} handler - Search controller callback (controlSearchSortLoad)
   */
  addHandlerSortLoad(handler) {
    ['popstate', 'load'].forEach(e => window.addEventListener(e, handler));
  }

  // Visually toggles the "Name" sort button as active
  toggleMapSortName() {
    this._parentEl
      .querySelector('.map__btn--name')
      .classList.add('btn--active');
    this._parentEl
      .querySelector('.map__btn--id')
      .classList.remove('btn--active');
    this._parentEl
      .querySelector('.map__btn--date')
      .classList.remove('btn--active');
  }

  // Visually toggles the "Id" sort button as active
  toggleMapSortId() {
    this._parentEl.querySelector('.map__btn--id').classList.add('btn--active');
    this._parentEl
      .querySelector('.map__btn--name')
      .classList.remove('btn--active');
    this._parentEl
      .querySelector('.map__btn--date')
      .classList.remove('btn--active');
  }

  // Visually toggles the "Date" sort button as active
  toggleMapSortDate() {
    this._parentEl
      .querySelector('.map__btn--date')
      .classList.add('btn--active');
    this._parentEl
      .querySelector('.map__btn--name')
      .classList.remove('btn--active');
    this._parentEl
      .querySelector('.map__btn--id')
      .classList.remove('btn--active');
  }
}

export default new SortView();
