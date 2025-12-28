import View from '../View.js';

class CategoryView extends View {
  _parentEl = document.querySelector('.profile__categories');
  _errorMessage = 'Invalid category?.';

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

  addHandlerCategory(handler) {
    ['popstate', 'load'].forEach(e => window.addEventListener(e, handler));
  }

  addHandlerCategoryLoad(handler) {
    document.addEventListener('DOMContentLoaded', handler);
  }

  // Adds active classes to visually toggle the Caught Pokemon list on the Profile module
  toggleCaughtCategory() {
    this._parentEl
      .querySelector('.profile__btn--caught')
      .classList.add('btn--active');
    this._parentEl
      .querySelector('.profile__btn--favorites')
      .classList.remove('btn--active');
  }

  // Adds active classes to visually toggle the Favorites Pokemon list on the Profile module
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
