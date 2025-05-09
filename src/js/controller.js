import * as model from './model.js';
import searchView from './Views/searchView.js';
import panelView from './Views/panelView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

const controlPokemonPanel = async function () {
  try {
    // Retrieve hash from URL
    // const id = window.location.hash.slice(1);
    // if (!id) return;

    panelView.renderSpinner();

    // Update searchResultsView to highlight active search result (screen 1)

    // Load Pokémon (data) panel details
    await model.loadPokemon(155);
    console.log(model.state.pokemon);
    // Render Pokémon panel (screen 2 -- search)
    panelView.render(model.state.pokemon);
  } catch (err) {
    panelView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    // Retrieve query from user input
    const query = searchView.getQuery();

    // TODO If there's no query, render all existing Pokémon
    if (!query) return;

    // Load Pokémon search results data
    await model.loadSearchResults(query);

    // Render Pokémon search results (screen 1 -- search)
  } catch (err) {
    searchResults.renderError();
  }
};

const controlInitSearchResults = async function () {
  try {
    // Retrieve all Pokémon names from PokéAPI and store in our state
    await model.storePokemonNames();

    // Render all Pokémon upon initial load of page
  } catch (err) {
    searchResults.renderError();
  }
};

const init = function () {
  panelView.addHandlerRender(controlPokemonPanel);
  searchView.addHandlerSearch(controlSearchResults);
};
init();
