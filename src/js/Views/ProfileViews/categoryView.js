import View from '../View.js';

class CategoryView extends View {
  _parentEl = document.querySelector('.profile__categories');
  _errorMessage = 'Invalid category?.';

  addHandlerBtns(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest(
        '.profile__btn--caught, .profile__btn--favorites'
      );

      if (!btn) return;
      if (btn.classList.contains('profile__btn--caught')) {
        if (btn.classList.contains('btn--active')) return;

        console.log('caught clicked');
        handler('caught');
      } else if (btn.classList.contains('profile__btn--favorites')) {
        if (btn.classList.contains('btn--active')) return;

        console.log('fav clciked ');
        handler('favorites');
      }
    });
  }

  toggleCaught() {
    document
      .querySelector('.profile__btn--caught')
      .classList.add('btn--active');
    document
      .querySelector('.profile__btn--favorites')
      .classList.remove('btn--active');
  }

  toggleFavorites() {
    document
      .querySelector('.profile__btn--favorites')
      .classList.add('btn--active');
    document
      .querySelector('.profile__btn--caught')
      .classList.remove('btn--active');
  }

  getQuery() {
    return this._parentEl.value;
  }
}

export default new CategoryView();
