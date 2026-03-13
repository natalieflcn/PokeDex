import View from '../View.js';
import mapEntryView from './mapEntryView.js';

class mapEntriesView extends View {
  _parentEl = document.querySelector('.map__entry--container');
  _errorMessage = 'We could not load your Caught Pokémon. Please try again!';

  // addHandlerLoadEntries(handler) {
  //   this._parentEl.addEventListener('load', handler);
  // }

  addHandlerClickEntry(handler) {
    this._parentEl.addEventListener('click', e => {
      const entry = e.target.closest('.map__entry');
      if (!entry) return;

      const currentlyActive = this._parentEl.querySelector(
        '.map__entry--active',
      );

      if (currentlyActive && currentlyActive !== entry)
        currentlyActive.classList.remove('map__entry--active');

      entry.classList.add('map__entry--active');

      const pokemonName = entry
        .querySelector('.map__entry--name')
        .textContent.trim()
        .split('#')[0];

      handler(pokemonName);
    });
  }

  // Maps an array of previewViews to be rendered and appended to the savedPokemonView
  _generateMarkup() {
    return this._data.map(entry => mapEntryView.render(entry, false)).join('');
  }

  // Clears the mapEntries container
  _clear() {
    this._parentEl.innerHTML = '';
  }
}

export default new mapEntriesView();
