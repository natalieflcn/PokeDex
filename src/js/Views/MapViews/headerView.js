import View from '../View.js';

class HeaderView extends View {
  _parentEl = document.querySelector('.map__header--caught');
  _errorMessage = 'There was an error loading the number of Caught Pokémon.';

  /**
   * Adds handler to trigger rendering of profile details during browser navigation events
   *
   * @param {Function} handler - Profile controller callback (controlProfileLoad)
   */
  addHandlerLoadSummary(handler) {
    ['popstate', 'load'].forEach(e => window.addEventListener(e, handler));
  }

  //change later when creating map controller
  _generateMarkup() {
    return `${this._data}`;
  }
}

export default new HeaderView();
