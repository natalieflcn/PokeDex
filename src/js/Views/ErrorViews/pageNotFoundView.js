import View from '../View.js';

class PageNotFoundView extends View {
  _parentEl = document.querySelector('.screen__2--page-not-found');
  _errorMessage = "The page you were looking for doesn't exist.";

  addHandlerBackToSearchBtn(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.error__btn');

      console.log(btn);
      if (!btn) return;

      handler();
    });
  }

  _generateMarkup() {
    return `
    <div class="profile__header--container">
    <img
                class="profile__img img__display"
                src= "${PROFILE_IMG}"
              />
            <header class="profile__header">
              
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
            </div>
            `;
  }
}

export default new PageNotFoundView();
