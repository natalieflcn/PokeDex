import View from '../View.js';

class SearchView extends View {
  _parentEl = document.querySelector('.profile__input');
  _errorMessage = 'We could not find that Pokémon! Please try again.';

  addHandlerSearch(handler) {
    ['hashchange', 'load'].forEach(e => window.addEventListener(e, handler));

    this._parentEl.addEventListener('input', handler);

    // this._parentEl.addEventListener('submit', function (e) {
    //   e.preventDefault();
    // });

    //refactor this into initializeInput method in controller later
    this._parentEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
      }
    });
  }

  getQuery() {
    return this._parentEl.value;
  }

  clearInput() {
    document.querySelector('.profile__input').value = '';
  }
}

export default new SearchView();
