import View from './View.js';

class ResultsView extends View {
  _parentEl = document.querySelector('.search__preview--container');
  _errorMessage = 'We could not find that Pokémon! Please try again.';

  _generateMarkup() {}
}

export default new ResultsView();
