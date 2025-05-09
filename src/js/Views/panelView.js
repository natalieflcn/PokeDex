import View from './View.js';

class PanelView extends View {
  _parentEl = document.querySelector('.screen__2--search');
  _errorMessage = 'oops';

  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(e => window.addEventListener(e, handler));
  }

  _generateMarkup() {
    return `
    <div class="search__panel">
              <img
                class="img__display"
                src=${this._data.img}
                alt="Fletchinder"
              />
              <header class="search__panel--header">
                <h2 class="heading">
                  ${this._data.name}<span class="pokemon__id">#${this._data.id}</span>
                </h2>

                <div class="search__panel--types">
                  <span
                    class="profile__stats--type pokemon__type"
                    data-type=""
                    style="background-color: green"
                    >Grass</span
                  ><span
                    class="profile__stats--type pokemon__type"
                    data-type=""
                    style="background-color: purple"
                    >Poison</span
                  >
                </div>

                <div class="search__panel--measurements">
                  <p>Height <span class="label--inset">${this._data.height}m</span></p>
                  <p>Weight <span class="label--inset">${this._data.weight}kg</span></p>
                </div>
                <p class="search__panel--bio bio">
                  ${this._data.desc}
                </p>
              </header>
            </div>

            <div class="search__abilities">
              <div class="search__stats">
                <h2 class="heading--2">Base Stats</h2>
                <div class="search__stats--row">
                  <p>HP</p>
                  <span class="label--inset">${this._data.stats[0][1]}</span>
                  <progress
                    class="profile__progress"
                    value="${this._data.stats[0][1]}"
                    max="255"
                  ></progress>
                </div>
                <div class="search__stats--row">
                  <p>ATK</p>
                  <span class="label--inset">${this._data.stats[1][1]}</span>
                  <progress
                    class="profile__progress"
                    value="${this._data.stats[1][1]}"
                    max="255"
                  ></progress>
                </div>
                <div class="search__stats--row">
                  <p>DEF</p>
                  <span class="label--inset">${this._data.stats[2][1]}</span>
                  <progress
                    class="profile__progress"
                    value="${this._data.stats[2][1]}"
                    max="255"
                  ></progress>
                </div>
                <div class="search__stats--row">
                  <p>SATK</p>
                  <span class="label--inset">${this._data.stats[3][1]}</span>
                  <progress
                    class="profile__progress"
                    value="${this._data.stats[3][1]}"
                    max="255"
                  ></progress>
                </div>
                <div class="search__stats--row">
                  <p>SDEF</p>
                  <span class="label--inset">${this._data.stats[4][1]}</span>
                  <progress
                    class="profile__progress"
                    value="${this._data.stats[4][1]}"
                    max="255"
                  ></progress>
                </div>
                <div class="search__stats--row">
                  <p>SPD</p>
                  <span class="label--inset">${this._data.stats[5][1]}</span>
                  <progress
                    class="profile__progress"
                    value="${this._data.stats[5][1]}"
                    max="255"
                  ></progress>
                </div>
              </div>

              <div class="search__moves">
                <h2 class="heading--2">Moves</h2>
                <p>1<span class="search__moves--known">${this._data.moves[0]}</span></p>

                <p>2<span class="search__moves--known">${this._data.moves[1]}</span></p>

                <p>3<span class="search__moves--known">${this._data.moves[2]}</span></p>

                <p>4<span class="search__moves--known">${this._data.moves[3]}</span></p>

                <p>5<span class="search__moves--known">${this._data.moves[4]}</span></p>

                <p>6<span class="search__moves--unknown">${this._data.moves[5]}</span></p>
              </div>
            </div>

            <div class="search__pagination">
              <button class="btn search__btn--prev btn--blue">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  fill="currentColor"
                  class="bi bi-arrow-left-short"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5"
                  />
                </svg>
              </button>
              <button class="btn search__btn--favorite btn--red">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="13"
                  height="13"
                  fill="currentColor"
                  class="bi bi-suit-heart-fill"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1"
                  />
                </svg>
                Favorite
              </button>
              <button class="btn search__btn--caught btn--yellow">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="13"
                  height="13"
                  fill="currentColor"
                  class="bi bi-geo-alt-fill"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"
                  />
                </svg>
                Caught This Pokémon
              </button>
              <button class="btn search__btn--next btn--blue">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  fill="currentColor"
                  class="bi bi-arrow-right-short"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8"
                  />
                </svg>
              </button>
            </div>
    `;
  }
}

export default new PanelView();
