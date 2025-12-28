import View from '../View.js';

class PaginationView extends View {
  _parentEl = document.querySelector('.screen__2--search');
  _errorMessage = 'oops';

  addHandlerPaginationClick(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.search__btn--next, .search__btn--prev');
      if (!btn) return;

      const direction = btn.dataset.page;

      handler(direction);
    });
  }

  disablePaginationBtn(btn) {
    document
      .querySelector(`.search__btn--${btn}`)
      .classList.add('btn--disabled');
  }

  enablePaginationBtn(btn) {
    document
      .querySelector(`.search__btn--${btn}`)
      .classList.remove('btn--disabled');
  }
}

export default new PaginationView();
