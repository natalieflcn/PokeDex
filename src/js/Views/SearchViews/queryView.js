import View from '../View.js';

class QueryView extends View {
  _parentEl = document.querySelector('.search__input');
  _errorMessage = 'We could not find that Pokémon! Please try again.';

  addHandlerQuery(handler) {
    ['hashchange', 'load'].forEach(e => window.addEventListener(e, handler));

    this._parentEl.addEventListener('input', handler);

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

export default new QueryView();
