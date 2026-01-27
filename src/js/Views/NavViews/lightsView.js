/**
 * Lights View
 * ---------------------
 * Responsible for rendering Pokédex bulbs that offer another method of navigation for the user.
 *
 * Emits events to navController and interacts with searchController when redirecting from Profile to Search module.
 * Does not own state, perform data fetching, or implement business logic.
 */

import View from '../View.js';

class LightsView extends View {
  _parentEl = document.querySelector('.lights');
  _errorMessage = 'There was an error rendering the Pokédex bulbs.';

  /**
   * Adds handler to navigation light bulbs (another way to navigate across pages besides navigation menu buttons).
   *
   * @param {Function} handler - Navigation controller callback (controlNavBtn)
   */
  addHandlerLightBtn(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const light = e.target.closest('.lights__inner');
      if (!light) return;

      const page = light.dataset.page;
      if (!page) return;

      handler(page);
    });
  }
}

export default new LightsView();
