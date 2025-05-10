import View from './View.js';
import previewView from './previewView.js';

class ResultsView extends View {
  _parentEl = document.querySelector('.search__preview--container');
  _errorMessage = 'We could not find that Pokémon! Please try again.';

  _generateMarkup() {
    // Map each Pokémon from an array of data created with previewView markup texts and consolidate markup into one string
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultsView();
