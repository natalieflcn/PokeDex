import View from './View.js';

class SortView extends View {
  _parentEl = document.querySelector('.search__form--sort');

  addHandlerSortName(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.search__btn--name');
      if (!btn) return;

      handler();
    });
  }

  addHandlerSortId(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.search__btn--id');
      if (!btn) return;

      handler();
    });
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
