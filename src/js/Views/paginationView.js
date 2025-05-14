import View from './View.js';

class PaginationView extends View {
  _parentEl = document.querySelector('.screen__2--search');
  _errorMessage = 'oops';

  addHandlerClick(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.search__btn--next, .search__btn--prev');
      if (!btn) return;

      const direction = btn.classList.contains('search__btn--next')
        ? 'next'
        : 'prev';

      handler(direction);
    });
  }

  //   addHandlerDisable(handler) {
  //     ['load', 'hashchange'].forEach(ev =>
  //       this._parentEl.addEventListener('ev', function (e) {
  //         const btn = e.target.closest('.search__btn--next, .search__btn--prev');
  //         if (!btn) return;
  //       })
  //     );
  //   }

  disableButton(btn) {
    document
      .querySelector(`.search__btn--${btn}`)
      .classList.add('btn--disabled');
  }

  enableButton(btn) {
    document
      .querySelector(`.search__btn--${btn}`)
      .classList.remove('btn--disabled');
  }
}

export default new PaginationView();
