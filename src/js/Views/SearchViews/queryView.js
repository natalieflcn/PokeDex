/**
 * Search Views – Query View
 * ---------------------
 * Responsible for rendering Pokémon Search module form where user can query for any Pokémon and managing query-related DOM interactions.
 *
 * Emits events to the searchController but does not own state, perform data fetching, or implement business logic.
 */

import View from '../View.js';

class QueryView extends View {
  _parentEl = document.querySelector('.search__input');
  _errorMessage = 'We could not find that Pokémon! Please try again.';

  /**
   * Adds handler for search input events:
   * - 'input' for live updates
   * - 'keydown' to prevent default submission
   * - 'load' to attach controller handler
   *
   * @param {Function} handler - Profile controller callback (debouncedControlSearchResults)
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

  addHandlerLoadQuery(handler) {
    ['popstate', 'load'].forEach(e => window.addEventListener(e, handler));
  }

  // Returns the current value of the search input field
  getQuery() {
    return this._parentEl.value;
  }

  setQuery(query) {
    this._parentEl.value = query;
  }
}

export default new QueryView();
