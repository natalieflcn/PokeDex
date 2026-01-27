/**
 * Profile Views – Preview View
 * ---------------------
 * Responsible for rendering Pokémon profile previews (for the Saved Pokemon View results) and managing preview-related DOM interactions.
 *
 * Emits events to the profileController but does not own state, perform data fetching, or implement business logic.
 */

import View from '../View.js';

class PreviewView extends View {
  _parentEl = document.querySelector('.profile__preview--container');
  _errorMessage = 'There was an error Pokémon previews for the profile.';

  /**
   * Adds handler to redirect user to the Search module and view more details on the selected Pokémon
   *
   * @param {Function} handler - Profile controller callback (controlProfileClickPreview)
   */
  addHandlerRedirect(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const preview = e.target.closest('.profile__preview');
      if (!preview) return;

      const pokemonName = preview.querySelector(
        '.profile__preview--name'
      ).textContent;
      handler(pokemonName);
    });
  }

  _generateMarkup() {
    return `
            <div class="profile__preview ">
                <span class="pokemon__id profile__preview--id">#${this._data.id}</span
                ><img
                  class="profile__preview--img"
                  src=${this._data.img}
                  alt=""
                />
                <p class="profile__preview--name">${this._data.name}</p>
            </div>
            `;
  }
}

export default new PreviewView();
