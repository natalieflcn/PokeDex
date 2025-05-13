import * as model from './model.js';
import searchView from './Views/searchView.js';
import panelView from './Views/panelView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import resultsView from './Views/resultsView.js';

// To coordinate rendering of the search results [Screen 1]
const controlSearchResults = async function () {
  try {
    // Retrieve query from user input
    const query = searchView.getQuery();

    // TODO If there's no query, render all existing Pokémon
    if (!query) {
      await model.loadSearchResults(0);
    } else {
      // Load Pokémon search results data
      await model.loadSearchResults(query);
    }
    // Render Pokémon search results (screen 1 -- search)
    resultsView.render(model.state.search.results);
  } catch (err) {
    searchView.renderError();
  }
};

// To determine the scroll position of the client and to load more data, if necessary
const controlScrollLoad = async function () {
  //if state.loading, state.endofresults, return TODO
  if (state.loading || model.endOfResults()) return;

  state.loading = true;
  await model.loadSearchResults(state.offset, true);
  state.loading = false;
};

// To coordinate rendering of the Pokémon Panel [Screen 2]
const controlPokemonPanel = async function () {
  try {
    // Retrieve hash from URL
    // const id = window.location.hash.slice(1);
    // if (!id) return;

    panelView.renderSpinner();

    // Update searchResultsView to highlight active search result (screen 1)

    // Load Pokémon (data) panel details
    await model.loadPokemon(4);

    // Render Pokémon panel (screen 2 -- search)
    panelView.render(model.state.pokemon);
  } catch (err) {
    panelView.renderError();
  }
};

// To initialize all Pokémon names to store in our state
const initPokemonData = async function () {
  await model.storeAllPokemonNames();
};

const init = function () {
  initPokemonData();
  panelView.addHandlerRender(controlPokemonPanel);
  searchView.addHandlerSearch(controlSearchResults);
};
init();
