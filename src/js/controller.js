import * as model from './model.js';
import searchView from './Views/searchView.js';
import panelView from './Views/panelView.js';

// const x = function () {
//   console.log(document.querySelector('.search__input').value);
// };
// document.querySelector('.search__input').addEventListener('input', x);

const controlPokemonPanel = async function () {
  try {
    panelView.renderSpinner();

    // const id = window.location.hash.slice(1);

    // if (!id) return;

    // Update searchResultsView to highlight active search result (screen 1)
    // Load Pokémon (data) panel details
    await model.loadPokemon(1);

    // Render Pokémon panel (screen 2)
    panelView.render(model.state.pokemon);
  } catch (err) {
    console.error(err);
  }
};

document.addEventListener('DOMContentLoaded', function () {
  controlPokemonPanel();
});

const controlSearchResults = async function () {
  try {
    const query = searchView.query();

    if (!query) return;

    console.log(query);
  } catch (err) {
    console.error(err);
  }
};

// const init = function () {
//   panelView.addHandlerRender(controlPokemonPanel);

//   searchView.addHandlerSearch(controlSearchResults);
// };
// init();
