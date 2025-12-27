import View from '../View';

class SortView extends View {
  _parentEl = document.querySelector('.profile__form');

  addHandlerSortBtn(handler) {
    this._parentEl.addEventListener('click', function (e) {
      e.preventDefault();

      const btn = e.target.closest('.profile__btn--name, .profile__btn--id');
      if (!btn || btn.classList.contains('btn--active')) return;

      const sort = btn.dataset.sort;

      handler(sort);
    });
  }

  addHandlerSortLoad(handler) {
    ['popstate', 'load'].forEach(e => window.addEventListener(e, handler));
  }
}

export default new SortView();
