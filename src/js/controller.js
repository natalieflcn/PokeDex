import * as model from './model.js';
import searchView from './Views/searchView.js';
import panelView from './Views/panelView.js';
import resultsView from './Views/resultsView.js';
import previewView from './Views/previewView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { debounce } from './helpers.js';

// import { observeSentinel, unobserveSentinel } from './helpers.js';
// To coordinate rendering of the search results [Screen 1]
const controlSearchResults = async function () {
  try {
    // Retrieve query from user input
    model.restartSearchResults();
    if (resultsView._observer) resultsView.unobserve();

    const query = searchView.getQuery();
    const requestId = ++model.state.search.currentRequestId;
    console.log(model.state.search.currentRequestId, requestId);

    resultsView.renderSpinner();

    // If there's a query, render all existing Pokémon for that query
    if (query) {
      await model.loadQueryResults(query, requestId);

      // If there's NO query, render all existing Pokémon from PokéAPI database
    } else if (!query) {
      await model.loadPokemonResults(requestId);
      console.log('working');
    }

    // If there's  additional results
    if (model.state.search.hasMoreResults)
      resultsView.observe(controlInfiniteScroll);

    if (model.state.search.currentRequestId !== requestId) return; // Abort render if the requestId is not up-to-date

    // Render Pokémon search results (screen 1 -- search)
    resultsView.render(model.state.search.results);
  } catch (err) {
    searchView.renderError();
  }
};
const debouncedControlSearchResults = debounce(controlSearchResults, 300);

// To determine the scroll position of the client and to load more data, if necessary
const controlInfiniteScroll = async function () {
  const requestId = model.state.search.currentRequestId;
  if (model.state.loading || !model.state.search.hasMoreResults) return;

  // Load additional query data
  if (model.state.search.query) {
    await model.loadAdditionalQuery(requestId);
    // Load additional Pokémon data
  } else {
    await model.loadAdditionalBatch(requestId);
  }

  //   if (requestId !== model.state.search.currentRequestId) return;

  // Determine if this is the end of current Pokémon search results
  if (model.state.search.currentBatch.length === 0) {
    model.state.search.hasMoreResults = false;
    resultsView.unobserve();
    return;
  }

  // Return Pokémon data to controlSearchResults
  resultsView.render(model.state.search.currentBatch, true, true);
  return model.state.search.results;
};

// To coordinate rendering of the Pokémon Panel [Screen 2]
const controlPokemonPanel = async function () {
  try {
    // Retrieve hash from URL
    const id = window.location.hash.slice(1);
    if (!id) return;

    panelView.renderSpinner();

    // Load Pokémon (data) panel details
    await model.loadPokemon(id);

    // Render Pokémon panel (screen 2 -- search)
    panelView.render(model.state.pokemon);
  } catch (err) {
    panelView.renderError();
  }
};

const controlActivePreview = function (pokemonName) {
  window.location.hash = pokemonName;
};

// To initialize all Pokémon names to store in our state
const initPokemonData = async function () {
  await model.storeAllPokemonNames();
};

const init = function () {
  initPokemonData();
  panelView.addHandlerRender(controlPokemonPanel);
  searchView.addHandlerSearch(debouncedControlSearchResults);
  previewView.addHandlerActive(controlActivePreview);
};
init();
