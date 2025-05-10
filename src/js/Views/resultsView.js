import View from './View.js';

class ResultsView extends View {
  _parentEl = document.querySelector('.search__preview--container');
  _errorMessage = 'We could not find that Pokémon! Please try again.';

  _generateMarkup() {
    console.log('wor');
    // Map each Pokémon from an array of data created with previewView markup texts and consolidate markup into one string
    return this._data.map(result => previewView.render(result, false));
  }
}

export default new ResultsView();
