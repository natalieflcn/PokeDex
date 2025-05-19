import View from '../View.js';
import { state } from '../../Models/state.js';
import { updateCaughtPokemonTypes } from '../../helpers.js';

class ProfileView extends View {
  _parentEl = document.querySelector('.screen__1--profile');

  addHandlerLoad(handler) {
    updateCaughtPokemonTypes();
    ['hashchange', 'load'].forEach(e => window.addEventListener(e, handler));
  }

  _generateMarkup() {
    return `
            <header class="profile__header">
              <img
                class="profile__img img__display"
                src= "${this._data.profileImg}"
              />
              <div class="profile__header--details">
                <h2 class="heading">${this._data.name}'s Pokédex</h2>

                <div class="profile__header--labels">
                  <p class="profile__header--label">
                    Pokémon Caught<span
                      class="profile__header--label label--inset"
                      >${this._data.caught.length}</span
                    >
                  </p>
                  <p class="profile__header--label">
                    Pokémon Favorited<span
                      class="profile__header--label label--inset"
                      >${this._data.favorites}</span
                    >
                  </p>
                </div>

                <p class="profile__header--bio bio">
                  ${this._data.bio}
                </p>
              </div>
            </header>

            <h2>Types of Pokémon Caught</h2>
            <div class="profile__stats">
              <div class="profile__stats--column">
                <div class="profile__stats--row">
                  <p
                    class="profile__stats--type pokemon__type"
                    data-type="Normal"
                    style="background-color: var(--type--Normal)"
                  >
                    Normal
                  </p>
                  <span class="profile__label label--inset">${
                    this._data.typesCaught.Normal
                  }</span>
                  <div
                    class="profile__progress progress__outer"
                  >
                    <span class="profile__progress progress__inner" style="background-color: var(--type--Normal); width:${
                      (this._data.typesCaught.Normal /
                        this._data.caught.length) *
                      100
                    }%"></span>
                  </div>
                </div>
                <div class="profile__stats--row">
                  <p
                    class="profile__stats--type pokemon__type"
                    data-type="Fire" style="background-color: var(--type--Fire)""
                  >
                    Fire
                  </p>
                  <span class="profile__label label--inset">${
                    this._data.typesCaught.Fire
                  }</span>
                  <div
                    class="profile__progress progress__outer"
                  >
                  <span class="profile__progress progress__inner" style="background-color: var(--type--Fire); width:${
                    (this._data.typesCaught.Fire / this._data.caught.length) *
                    100
                  }%"></span>
                  </div>
                </div>
                <div class="profile__stats--row">
                  <p
                    class="profile__stats--type pokemon__type"
                    data-type="Water" style="background-color: var(--type--Water)"
                  >
                    Water
                  </p>
                  <span class="profile__label label--inset">${
                    this._data.typesCaught.Water
                  }</span>
                  <div
                    class="profile__progress progress__outer"
                  ><span class="profile__progress progress__inner" style="background-color: var(--type--Water); width:${
                    (this._data.typesCaught.Water / this._data.caught.length) *
                    100
                  }%"></span>
                  </div>
                </div>
                <div class="profile__stats--row">
                  <p
                    class="profile__stats--type pokemon__type"
                    data-type="Electric" style="background-color: var(--type--Electric)"
                  >
                    Electric
                  </p>
                  <span class="profile__label label--inset">${
                    this._data.typesCaught.Electric
                  }</span>
                  <div
                    class="profile__progress progress__outer"
                  ><span class="profile__progress progress__inner" style="background-color: var(--type--Electric); width:${
                    (this._data.typesCaught.Electric /
                      this._data.caught.length) *
                    100
                  }%"></span>
                  </div>
                </div>
                <div class="profile__stats--row">
                  <p
                    class="profile__stats--type pokemon__type"
                    data-type="Grass" style="background-color: var(--type--Grass)"
                  >
                    Grass
                  </p>
                  <span class="profile__label label--inset">${
                    this._data.typesCaught.Grass
                  }</span>
                  <div
                    class="profile__progress progress__outer"
                  ><span class="profile__progress progress__inner" style="background-color: var(--type--Grass); width:${
                    (this._data.typesCaught.Grass / this._data.caught.length) *
                    100
                  }%"></span>
                  </div>
                </div>
                <div class="profile__stats--row">
                  <p class="profile__stats--type pokemon__type" data-type="ice" style="background-color: var(--type--Ice)">
                    Ice
                  </p>
                  <span class="profile__label label--inset">${
                    this._data.typesCaught.Ice
                  }</span>
                  <div
                    class="profile__progress progress__outer"
                  ><span class="profile__progress progress__inner" style="background-color: var(--type--Ice); width:${
                    (this._data.typesCaught.Ice / this._data.caught.length) *
                    100
                  }%"></span>
                  </div>
                </div>
                <div class="profile__stats--row">
                  <p
                    class="profile__stats--type pokemon__type"
                    data-type="Fighting" style="background-color: var(--type--Fighting)"
                  >
                    Fighting
                  </p>
                  <span class="profile__label label--inset">${
                    this._data.typesCaught.Fighting
                  }</span>
                  <div
                    class="profile__progress progress__outer"
                  ><span class="profile__progress progress__inner" style="background-color: var(--type--Fighting); width:${
                    (this._data.typesCaught.Fighting /
                      this._data.caught.length) *
                    100
                  }%"></span>
                  </div>
                </div>
                <div class="profile__stats--row">
                  <p
                    class="profile__stats--type pokemon__type"
                    data-type="Poison" style="background-color: var(--type--Poison)"
                  >
                    Poison
                  </p>
                  <span class="profile__label label--inset">${
                    this._data.typesCaught.Poison
                  }</span>
                  <div
                    class="profile__progress progress__outer"
                  ><span class="profile__progress progress__inner" style="background-color: var(--type--Poison); width:${
                    (this._data.typesCaught.Poison / this._data.caught.length) *
                    100
                  }%"></span>
                  </div>
                </div>
                <div class="profile__stats--row">
                  <p
                    class="profile__stats--type pokemon__type"
                    data-type="Ground" style="background-color: var(--type--Ground)"
                  >
                    Ground
                  </p>
                  <span class="profile__label label--inset">${
                    this._data.typesCaught.Ground
                  }</span>
                  <div
                    class="profile__progress progress__outer"
                  ><span class="profile__progress progress__inner" style="background-color: var(--type--Ground); width:${
                    (this._data.typesCaught.Ground / this._data.caught.length) *
                    100
                  }%"></span>
                  </div>
                </div>
              </div>

              <div class="profile__stats--column">
                <div class="profile__stats--row">
                  <p
                    class="profile__stats--type pokemon__type"
                    data-type="Flying" style="background-color: var(--type--Flying)"
                  >
                    Flying
                  </p>
                  <span class="profile__label label--inset">${
                    this._data.typesCaught.Flying
                  }</span>
                  <div
                    class="profile__progress progress__outer"
                  ><span class="profile__progress progress__inner" style="background-color: var(--type--Flying); width:${
                    (this._data.typesCaught.Flying / this._data.caught.length) *
                    100
                  }%"></span>
                  </div>
                </div>
                <div class="profile__stats--row">
                  <p
                    class="profile__stats--type pokemon__type"
                    data-type="Psychic" style="background-color: var(--type--Psychic)"
                  >
                    Psychic
                  </p>
                  <span class="profile__label label--inset">${
                    this._data.typesCaught.Psychic
                  }</span>
                  <div
                    class="profile__progress progress__outer"
                  >
                  <span class="profile__progress progress__inner" style="background-color: var(--type--Psychic); width:${
                    (this._data.typesCaught.Psychic /
                      this._data.caught.length) *
                    100
                  }%"></span>
                  </div>
                </div>
                <div class="profile__stats--row">
                  <p class="profile__stats--type pokemon__type" data-type="Bug" style="background-color: var(--type--Bug)"> 
                    Bug
                  </p>
                  <span class="profile__label label--inset">${
                    this._data.typesCaught.Bug
                  }</span>
                  <div
                    class="profile__progress progress__outer"
                  ><span class="profile__progress progress__inner" style="background-color: var(--type--Bug); width:${
                    (this._data.typesCaught.Bug / this._data.caught.length) *
                    100
                  }%"></span>
                  </div>
                </div>
                <div class="profile__stats--row">
                  <p
                    class="profile__stats--type pokemon__type"
                    data-type="Rock" style="background-color: var(--type--Rock)"
                  >
                    Rock
                  </p>
                  <span class="profile__label label--inset">${
                    this._data.typesCaught.Rock
                  }</span>
                  <div
                    class="profile__progress progress__outer"
                  >
                  <span class="profile__progress progress__inner" style="background-color: var(--type--Rock); width:${
                    (this._data.typesCaught.Rock / this._data.caught.length) *
                    100
                  }%"></span>
                  </div>
                </div>
                <div class="profile__stats--row">
                  <p
                    class="profile__stats--type pokemon__type"
                    data-type="Ghost" style="background-color: var(--type--Ghost)"
                  >
                    Ghost
                  </p>
                  <span class="profile__label label--inset">${
                    this._data.typesCaught.Ghost
                  }</span>
                  <div
                    class="profile__progress progress__outer"
                  >
                  <span class="profile__progress progress__inner" style="background-color: var(--type--Ghost); width:${
                    (this._data.typesCaught.Ghost / this._data.caught.length) *
                    100
                  }%"></span>
                  </div>
                </div>
                <div class="profile__stats--row">
                  <p
                    class="profile__stats--type pokemon__type"
                    data-type="Dragon" style="background-color: var(--type--Dragon)"
                  >
                    Dragon
                  </p>
                  <span class="profile__label label--inset">${
                    this._data.typesCaught.Dragon
                  }</span>
                  <div
                    class="profile__progress progress__outer"
                  >
                  <span class="profile__progress progress__inner" style="background-color: var(--type--Dragon); width:${
                    (this._data.typesCaught.Dragon / this._data.caught.length) *
                    100
                  }%"></span>
                  </div>
                </div>
                <div class="profile__stats--row">
                  <p
                    class="profile__stats--type pokemon__type"
                    data-type="Dark" style="background-color: var(--type--Dark)"
                  >
                    Dark
                  </p>
                  <span class="profile__label label--inset">${
                    this._data.typesCaught.Dark
                  }</span>
                  <div
                    class="profile__progress progress__outer"
                  >
                  <span class="profile__progress progress__inner" style="background-color: var(--type--Dark); width:${
                    this._data.typesCaught.Dark / this._data.caught.length
                  }%"></span>
                  </div>
                </div>
                <div class="profile__stats--row">
                  <p
                    class="profile__stats--type pokemon__type"
                    data-type="Steel" style="background-color: var(--type--Steel)"
                  >
                    Steel
                  </p>
                  <span class="profile__label label--inset">${
                    this._data.typesCaught.Steel
                  }</span>
                  <div
                    class="profile__progress progress__outer"
                  >
                  <span class="profile__progress progress__inner" style="background-color: var(--type--Steel); width:${
                    (this._data.typesCaught.Steel / this._data.caught.length) *
                    100
                  }%"></span>
                  </div>
                </div>
                <div class="profile__stats--row">
                  <p
                    class="profile__stats--type pokemon__type"
                    data-type="Fairy" style="background-color: var(--type--Fairy)"
                  >
                    Fairy
                  </p>
                  <span class="profile__label label--inset">${
                    this._data.typesCaught.Fairy
                  }</span>
                  <div
                    class="profile__progress progress__outer"
                  >
                  <span class="profile__progress progress__inner" style="background-color: var(--type--Fairy); width:${
                    (this._data.typesCaught.Fairy / this._data.caught.length) *
                    100
                  }%"></span>
                  </div>
                </div>
              </div>
            </div>
            `;
  }
}

export default new ProfileView();
