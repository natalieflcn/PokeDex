import View from '../View.js';
import previewView from './previewView.js';

class savedPokemonView extends View {
  _parentEl = document.querySelector('.profile__preview--container');

  _errorMessage = 'We could not find any caught Pokémon! Please try again.';

  _generateMarkup() {
    console.log(this._data);
    return this._data.map(result => previewView.render(result, false)).join('');
  }

  _clear() {
    this._parentEl.innerHTML = '';
  }
}

export default new savedPokemonView();
