import View from '../View.js';

class SortView extends View {
  _parentEl = document.querySelector('.search__form--sort');

  addHandlerSortBtn(handler) {
    this._parentEl.addEventListener('click', function (e) {
      e.preventDefault();

      const btn = e.target.closest('.search__btn--name, .search__btn--id');
      if (!btn || btn.classList.contains('btn--active')) return;

      const sort = btn.dataset.sort;

      handler(sort);
    });
  }

  addHandlerSortLoad(handler) {
    ['popstate', 'load'].forEach(e => window.addEventListener(e, handler));
  }

  toggleSortName() {
    document.querySelector('.search__btn--name').classList.add('btn--active');
    document.querySelector('.search__btn--id').classList.remove('btn--active');
  }

  toggleSortId() {
    document.querySelector('.search__btn--id').classList.add('btn--active');
    document
      .querySelector('.search__btn--name')
      .classList.remove('btn--active');
  }
}

export default new SortView();
