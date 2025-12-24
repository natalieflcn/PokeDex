import View from '../View.js';

class QueryView extends View {
  _parentEl = document.querySelector('.profile__input');
  _errorMessage = 'We could not find that Pokémon! Please try again.';

  addHandlerQuery(handler) {
    ['hashchange', 'load'].forEach(e => window.addEventListener(e, handler));

    this._parentEl.addEventListener('input', handler);

    // submit events don't work on input elements, only submit elements
    // this._parentEl.addEventListener('submit', function (e) {
    //   e.preventDefault();
    // });

    //refactor this functionality into initializeInput method in SearchController later? TODO -- have to refactor queryService for ProfileView and SearchView first

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

export default new QueryView();
