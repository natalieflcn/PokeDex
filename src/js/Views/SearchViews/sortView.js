/**
 * Search Views – Sort View
 * ---------------------
 * Responsible for rendering Pokémon search sort controls and managing sort-related DOM interactions.
 *
 * Emits events to the searchController but does not own state, perform data fetching, or implement business logic.
 */

import View from '../View.js';

class SortView extends View {
  _parentEl = document.querySelector('.search__form--sort');

  /**
   * Adds handler to search sort buttons
   *
   * @param {Function} handler - Search controller callback (controlSearchSortBtn)
   */
  addHandlerSortBtn(handler) {
    this._parentEl.addEventListener('click', function (e) {
      e.preventDefault();

      const btn = e.target.closest('.search__btn--name, .search__btn--id');
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
  toggleSearchSortName() {
    this._parentEl
      .querySelector('.search__btn--name')
      .classList.add('btn--active');
    this._parentEl
      .querySelector('.search__btn--id')
      .classList.remove('btn--active');
  }

  // Visually toggles the "Id" sort button as active
  toggleSearchSortId() {
    this._parentEl
      .querySelector('.search__btn--id')
      .classList.add('btn--active');
    this._parentEl
      .querySelector('.search__btn--name')
      .classList.remove('btn--active');
  }
}

export default new SortView();
