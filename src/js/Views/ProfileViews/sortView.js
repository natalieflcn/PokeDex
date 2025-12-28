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

  // Adds active classes to visually toggle the Sort Name button on the Profile module
  toggleProfileSortName() {
    document.querySelector('.profile__btn--name').classList.add('btn--active');
    document.querySelector('.profile__btn--id').classList.remove('btn--active');
  }

  // Adds active classes to visually toggle the Sort ID button on the Profile module
  toggleProfileSortId() {
    document.querySelector('.profile__btn--id').classList.add('btn--active');
    document
      .querySelector('.profile__btn--name')
      .classList.remove('btn--active');
  }
}

export default new SortView();
