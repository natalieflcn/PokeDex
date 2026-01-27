/**
 * Profile Views – Sort View
 * ---------------------
 * Responsible for rendering Pokémon profile sort controls and managing sort-related DOM interactions.
 *
 * Emits events to the profileController but does not own state, perform data fetching, or implement business logic.
 */

import View from '../View';

class SortView extends View {
  _parentEl = document.querySelector('.profile__form');
  _errorMessage = 'There was an error sorting Pokémon on the profile.';

  /**
   * Adds handler to profile sort buttons
   *
   * @param {Function} handler - Profile controller callback (controlProfileSortBtn)
   */
  addHandlerSortBtn(handler) {
    this._parentEl.addEventListener('click', function (e) {
      e.preventDefault();

      const btn = e.target.closest('.profile__btn--name, .profile__btn--id');
      if (!btn || btn.classList.contains('btn--active')) return;

      const sort = btn.dataset.sort;

      handler(sort);
    });
  }

  /**
   * Adds handler to load active sort button during browser navigation events
   *
   * @param {Function} handler - Profile controller callback (controlProfileSortLoad)
   */
  addHandlerSortLoad(handler) {
    ['popstate', 'load'].forEach(e => window.addEventListener(e, handler));
  }

  // Visually toggles the "Name" sort button as active
  toggleProfileSortName() {
    this._parentEl
      .querySelector('.profile__btn--name')
      .classList.add('btn--active');
    this._parentEl
      .querySelector('.profile__btn--id')
      .classList.remove('btn--active');
  }

  // Visually toggles the "Id" sort button as active
  toggleProfileSortId() {
    this._parentEl
      .querySelector('.profile__btn--id')
      .classList.add('btn--active');
    this._parentEl
      .querySelector('.profile__btn--name')
      .classList.remove('btn--active');
  }
}

export default new SortView();
