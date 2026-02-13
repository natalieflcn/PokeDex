/**
 * Profile Views – Profile View
 * ---------------------
 * Responsible for rendering Pokémon profile details and managing profile-related DOM interactions.
 *
 * Emits events to the profileController but does not own state, perform data fetching, or implement business logic.
 */

import View from '../View.js';
import { PROFILE_IMG, PROFILE_NAME, PROFILE_BIO } from '../../config.js';

class ProfileView extends View {
  _parentEl = document.querySelector('.screen__1--profile');
  _errorMessage = 'There was an error loading the profile.';

  /**
   * Adds handler to trigger rendering of profile details during browser navigation events
   *
   * @param {Function} handler - Profile controller callback (controlProfileLoad)
   */
  addHandlerLoadProfile(handler) {
    ['popstate', 'load'].forEach(e => window.addEventListener(e, handler));
  }

  addHandlerLabels(handler) {
    this._parentEl.addEventListener('click', function (e) {
      e.preventDefault();

      const label = e.target.closest('.profile__header--label');
      if (!label || label.classList.contains('label--active')) return;

      const view = label.dataset.view;
      if (!view) return;

      handler(view);
    });
  }

  _generateMarkup() {
    return `
            <header class="profile__header">
              <img
                class="profile__img img__display"
                src= "${PROFILE_IMG}"
              />
              <div class="profile__header--details">
                <h2 class="heading">${PROFILE_NAME}'s Pokédex</h2>

                <div class="profile__header--labels">
                  <p class="profile__header--label" data-view="caught">
                    Pokémon Caught<span
                      class="profile__header--label label--inset" data-view="caught"
                      >${this._data.caught.length}</span
                    >
                  </p>
                  <p class="profile__header--label" data-view="favorites">
                    Pokémon Favorited<span
                      class="profile__header--label label--inset" data-view="favorites"
                      >${this._data.favorites.length}</span
                    >
                  </p>
                </div>

                <p class="profile__header--bio bio">
                  ${PROFILE_BIO}
                </p>
              </div>
            </header>

            
            
            </div>
            `;
  }
}

export default new ProfileView();
