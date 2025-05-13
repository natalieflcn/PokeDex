import * as model from './model.js';
import searchView from './Views/searchView.js';
import panelView from './Views/panelView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import resultsView from './Views/resultsView.js';

// import { observeSentinel, unobserveSentinel } from './helpers.js';
// To coordinate rendering of the search results [Screen 1]
const controlSearchResults = async function () {
  try {
    // Retrieve query from user input
    const query = searchView.getQuery();

    // TODO If there's a query, render all existing Pokémon for that query
    if (query) {
      await model.loadSearchResults(query);

      // If there's NO query, and default Pokémon is being initially loaded
    } else if (!query && !model.state.search.initialBatchLoaded) {
      console.log('no query 1 running');
      await model.loadSearchResults(0);
      model.state.search.initialBatchLoaded = true;
    }

    if (model.state.search.hasMoreResults) {
      console.log('adding observer');
      // If infinite scroll is being triggered and sequential Pokémon are being loaded
      resultsView.observe(
        document.querySelector('.search__sentinel'),
        controlInfiniteScroll
      );
      console.log(' observer was added');
    }
    // Render Pokémon search results (screen 1 -- search)
    resultsView.render(model.state.search.results);
  } catch (err) {
    searchView.renderError();
  }
};

// To determine the scroll position of the client and to load more data, if necessary
const controlInfiniteScroll = async function () {
  console.log('infinite scroll running');
  if (model.state.loading || !model.state.search.hasMoreResults) return;

  // Load Pokémon data
  await model.loadSearchResults(model.state.offset, true);

  // Determine if this is the end of current Pokémon search results
  if (model.state.search.results.length === 0) {
    model.state.search.hasMoreResults = false;
    resultsView.unobserveSentinel();
    return;
  }

  // Return Pokémon data to controlSearchResults
  console.log(model.state.search.results);
  console.log('batch');
  console.log(model.state.search.currentBatch);
  resultsView.render(model.state.search.currentBatch);
  return model.state.search.results;
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
