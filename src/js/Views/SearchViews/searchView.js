import View from '../View.js';

class SearchView extends View {
  _parentEl = document.querySelector('.search__input');
  _errorMessage = 'We could not find that Pokémon! Please try again.';

  addHandlerSearch(handler) {
    window.addEventListener('load', handler);

    this._parentEl.addEventListener('input', handler);

    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
    });

    this._parentEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
      }
    });
  }

  getQuery() {
    return this._parentEl.value;
  }
}

export default new SearchView();
