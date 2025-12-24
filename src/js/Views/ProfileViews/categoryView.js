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

  // //TODO - may remove this, doesnt matter if /caught doesnt immediately load
  addHandlerCategoryLoad(handler) {
    document.addEventListener('DOMContentLoaded', handler);
  }
  // }
}

export default new CategoryView();
