import View from './View.js';

class SearchView extends View {
  _parentEl = document.querySelector('.search__form');
  _errorMessage = 'We could not find that Pokémon! Please try again.';

  addHandlerSearch(handler) {
    this._parentEl
      .querySelector('.search__input')
      .addEventListener('input', handler);
  }

  getQuery() {
    return this._parentEl.querySelector('.search__input').value;
  }
}

export default new SearchView();
