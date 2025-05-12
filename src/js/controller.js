import * as model from './model.js';
import searchView from './Views/searchView.js';
import panelView from './Views/panelView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import resultsView from './Views/resultsView.js';

const controlPokemonPanel = async function () {
  try {
    // Retrieve hash from URL
    // const id = window.location.hash.slice(1);
    // if (!id) return;

    panelView.renderSpinner();

    // Update searchResultsView to highlight active search result (screen 1)

    // Load Pokémon (data) panel details
    await model.loadPokemon(155);

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
    if (!query) {
      await model.loadPokemonBatch(0, true);
    } else {
      // Load Pokémon search results data
      await model.loadSearchResults(query, true);
    }
    // Render Pokémon search results (screen 1 -- search)
    resultsView.render(model.state.search.results);
  } catch (err) {
    searchView.renderError();
  }
};

const initPokemonData = async function () {
  // Load initial Pokémon search results

  // Load all Pokémon names and store them into our state
  await model.storePokemonNames();
};

const init = async function () {
  initPokemonData();
  panelView.addHandlerRender(controlPokemonPanel);
  searchView.addHandlerSearch(controlSearchResults);
};
init();
