/**
 * Profile Views – Category View
 * ---------------------
 * Responsible for rendering Pokémon profile category controls and managing category-related DOM interactions.
 *
 * Emits events to the profileController but does not own state, perform data fetching, or implement business logic.
 */

import View from '../View.js';

class CategoryView extends View {
  _parentEl = document.querySelector('.profile__categories');
  _errorMessage = 'There was an error loading this category.';

  /**
   * Adds handler to profile category buttons
   *
   * @param {Function} handler - Profile controller callback (controlProfileCategoryBtn)
   */
  addHandlerCategoryBtn(handler) {
    this._parentEl.addEventListener('click', function (e) {
      e.preventDefault();

      const btn = e.target.closest(
        '.profile__btn--caught, .profile__btn--favorites'
      );
      if (!btn || btn.classList.contains('btn--active')) return;

      const view = btn.dataset.view;
      if (!view) return;

      handler(view);
    });
  }

  /**
   * Adds handler to trigger rendering of correct category during browser navigation events
   *
   * @param {Function} handler - Profile controller callback (controlProfileCategory)
   */
  addHandlerCategory(handler) {
    ['popstate', 'load'].forEach(e => window.addEventListener(e, handler));
  }

  /**
   * Adds handler to trigger rendering of correct category upon page load
   *
   * @param {Function} handler - Profile controller callback (controlProfileCategoryLoad)
   */
  addHandlerCategoryLoad(handler) {
    document.addEventListener('DOMContentLoaded', handler);
  }

  // Visually toggles the "Caught" category as active
  toggleCaughtCategory() {
    this._parentEl
      .querySelector('.profile__btn--caught')
      .classList.add('btn--active');
    this._parentEl
      .querySelector('.profile__btn--favorites')
      .classList.remove('btn--active');
  }

  // Visually toggles the "Favorites" category as active
  toggleFavoritesCategory() {
    this._parentEl
      .querySelector('.profile__btn--favorites')
      .classList.add('btn--active');
    this._parentEl
      .querySelector('.profile__btn--caught')
      .classList.remove('btn--active');
  }
}

export default new CategoryView();
