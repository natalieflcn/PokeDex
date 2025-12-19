import View from '../View.js';

class CategoryView extends View {
  _parentEl = document.querySelector('.profile__categories');
  _errorMessage = 'Invalid category?.';

  addHandlerCategoryBtn(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest(
        '.profile__btn--caught, .profile__btn--favorites'
      );
      if (!btn) return;
      if (btn.classList.contains('btn--active')) return;

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
}

export default new CategoryView();
