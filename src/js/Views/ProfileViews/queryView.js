/**
 * Profile Views – Query View
 * ---------------------
 * Responsible for rendering Pokémon profile form where user can query for (Caught/Favorite) Pokémon and managing query-related DOM interactions.
 *
 * Emits events to the profileController but does not own state, perform data fetching, or implement business logic.
 */

import View from '../View.js';

class QueryView extends View {
  _parentEl = document.querySelector('.profile__input');
  _errorMessage = 'We could not find that Pokémon! Please try again.';

  /**
   * Adds handler for profile input events:
   * - 'input' for live updates
   * - 'keydown' to prevent default submission
   * - 'load' to attach controller handler
   *
   * @param {Function} handler - Profile controller callback (controlProfilePokemonResults)
   */
  addHandlerQuery(handler) {
    ['popstate', 'load'].forEach(e => window.addEventListener(e, handler));

    this._parentEl.addEventListener('input', handler);

    this._parentEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
      }
    });
  }

  // Returns the current value of the profile input field
  getQuery() {
    return this._parentEl.value;
  }

  // Clears the profile input field
  clearInput() {
    this._parentEl.value = '';
  }
}

export default new QueryView();
