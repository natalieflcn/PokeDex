/**
 * Profile Views – Saved Pokemon View
 * ---------------------
 * Responsible for rendering Pokémon profile results. Holds the space to either render Caught Pokemon or Favorite Pokemon, depending on active category.
 *
 * Emits events to the profileController but does not own state, perform data fetching, or implement business logic.
 */

import View from '../View.js';
import previewView from './previewView.js';

class savedPokemonView extends View {
  _parentEl = document.querySelector('.profile__preview--container');

  _errorMessage = 'We could not find any caught Pokémon! Please try again.';

  // Maps an array of previewViews to be rendered and appended to the savedPokemonView
  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }

  // Clears the savedPokemonView container
  _clear() {
    this._parentEl.innerHTML = '';
  }
}

export default new savedPokemonView();
