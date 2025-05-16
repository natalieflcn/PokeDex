import View from '../View';

class SortView extends View {
  _parentEl = document.querySelector('.profile__form');
  _mode = 'id';

  addHandlerSortName(handler) {
    this._parentEl.addEventListener('click', function (e) {
      e.preventDefault();
      const btn = e.target.closest('.profile__btn--name');
      if (!btn || btn.classList.contains('btn--active')) return;

      console.log('addhandlersortname running');
      this._mode = 'name';

      handler('name');
    });
  }

  addHandlerSortId(handler) {
    this._parentEl.addEventListener('click', function (e) {
      e.preventDefault();
      const btn = e.target.closest('.profile__btn--id');
      if (!btn || btn.classList.contains('btn--active')) return;

      console.log('addhandlersortid running');

      this._mode = 'id';

      handler();
    });
  }

  toggleSortName() {
    document.querySelector('.profile__btn--name').classList.add('btn--active');
    document.querySelector('.profile__btn--id').classList.remove('btn--active');
  }

  toggleSortId() {
    document.querySelector('.profile__btn--id').classList.add('btn--active');
    document
      .querySelector('.profile__btn--name')
      .classList.remove('btn--active');
  }

  clearActive() {}
}

export default new SortView();
