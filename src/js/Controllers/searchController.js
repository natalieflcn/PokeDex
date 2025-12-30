import queryView from '../views/SearchViews/queryView.js';
import sortView from '../views/SearchViews/sortView.js';
import resultsView from '../views/SearchViews/resultsView.js';
import previewView from '../views/SearchViews/previewView.js';
import panelView from '../views/SearchViews/panelView.js';
import paginationView from '../views/SearchViews/paginationView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { debounce, restartSearchResults } from '../helpers.js';
import queryState from '../models/state/queryState.js';

import { navSanitizeSort } from '../services/navService.js';
import { loadAdditionalQuery, loadQueryResults } from '../models/queryModel.js';
import {
  loadAdditionalBatch,
  loadPokemonResults,
  storeAllPokemon,
} from '../models/pokemonModel.js';
import {
  addCaughtPokemon,
  removeCaughtPokemon,
} from '../models/caughtModel.js';
import {
  addFavoritePokemon,
  removeFavoritePokemon,
} from '../models/favoritesModel.js';
import panelState from '../models/state/panelState.js';
import { loadPokemon } from '../models/panelModel.js';
import pokemonState from '../models/state/pokemonState.js';

// SEARCH CONTROLLER ---

// REFACTORED HANDLERS

// To coordinate rendering of the search results [Screen 1]
const controlSearchResults = async function () {
  try {
    // Retrieve query from user input
    restartSearchResults();

    if (resultsView._observer) resultsView.unobserveSentinel();

    const query = queryView.getQuery();
    console.log(query);

    const requestId = ++queryState.currentQueryId;

    console.log(requestId);
    resultsView.renderSpinner();

    // If there's a query, render all existing Pokémon for that query
    if (query) {
      console.log('query is running');
      panelView._clear();
      await loadQueryResults(query, requestId);

      // If there's NO query, render all existing Pokémon from PokéAPI database
    } else if (!query) {
      await loadPokemonResults(requestId);
    }

    // If there's  additional results
    if (queryState.hasMoreResults)
      resultsView.observeSentinel(controlInfiniteScroll);

    if (queryState.currentQueryId !== requestId) return; // Abort render if the requestId is not up-to-date

    // Render Pokémon search results (screen 1 -- search)

    resultsView.render(pokemonState.results);
    console.log('controlsearchresults ends here');
  } catch (err) {
    queryView.renderError();
  }
};
const debouncedControlSearchResults = debounce(controlSearchResults, 300); // Debounce search results to reduce redundant queries

// To determine the scroll position of the client and to load more data, if necessary
const controlInfiniteScroll = async function () {
  const requestId = queryState.currentQueryId;
  if (queryState.loading || !queryState.hasMoreResults) return;

  // Load additional query data
  if (queryState.query) {
    await loadAdditionalQuery(requestId);
    // Load additional Pokémon data
  } else {
    await loadAdditionalBatch(requestId);
  }

  // Determine if this is the end of current Pokémon search results
  if (queryState.currentBatch.length === 0) {
    queryState.hasMoreResults = false;
    resultsView.unobserveSentinel();
    return;
  }

  // Sort data before rendering
  if (sortView._mode === 'name') {
  } else {
  }

  // Return Pokémon data to controlSearchResults
  resultsView.render(queryState.currentBatch, true, true);
  return pokemonState.results;
};

const controlSearchRenderSort = function (sort) {
  switch (sort) {
    case 'name':
      sortView.toggleSearchSortName();
      break;

    case 'id':
      sortView.toggleSearchSortId();
      break;

    default:
      sortView.toggleSearchSortId();
      break;
  }
};

const controlSearchSortBtn = function (sort) {
  const currentURL = new URL(window.location.href);
  currentURL.searchParams.set('sort', sort);
  window.history.replaceState({}, '', currentURL);
  controlSearchRenderSort(sort);
};

const controlSearchSortLoad = function () {
  const sort = new URL(window.location.href).searchParams.get('sort');

  if (sort && sort !== 'name' && sort !== 'id') navSanitizeSort();

  sortView.toggleSearchSortId();

  controlSearchRenderSort(sort);
};

// To sort Pokémon data by name
const controlSortName = function () {
  // sortView.toggleSortName();

  if (pokemonState.results.length <= 1) return;

  // queryState.mode = 'name';
  controlSearchResults();
};

// To sort Pokémon data by ID
const controlSortId = function () {
  // sortView.toggleSortId();

  if (pokemonState.results.length <= 1) return;

  // queryState.mode = 'id';
  controlSearchResults();
};

// To highlight active search results [screen 1]
const controlClickActivePreview = function (preview) {
  window.location.hash = preview;
};

// const controlPageActivePreview = function () {
//   // TODO Need to refactor DOM logic into Views
//   const currentlyActive = document.querySelector('.search__preview--active');

//   if (currentlyActive)
//     currentlyActive.classList.remove('search__preview--active');

//   const previews = Array.from(document.querySelectorAll('.search__preview'));

//   const targetPreview = previews.find(preview => {
//     const nameEl = preview.querySelector('.search__preview--name');
//     return nameEl?.textContent === window.location.hash.slice(1);
//   });

//   if (targetPreview) targetPreview.classList.add('search__preview--active');
// };

// To coordinate rendering of the Pokémon Panel [Screen 2]
const controlPokemonPanel = async function () {
  try {
    // Retrieve hash from URL
    const id = window.location.hash.slice(1);
    if (!id) return;

    panelView.renderSpinner();

    // Load Pokémon (data) panel details

    await loadPokemon(id);

    // Render Pokémon panel (screen 2 -- search)
    console.log(panelState.pokemon);
    panelView.render(panelState.pokemon);
    console.log('controlpokemon panel ends here');
    const currIndex = pokemonState.results.findIndex(
      pokemon => pokemon.name === panelState.pokemon.name
    );

    if (currIndex === 0) paginationView.disablePaginationBtn('prev');
    if (currIndex === pokemonState.results.length - 1)
      paginationView.disablePaginationBtn('next');
  } catch (err) {
    panelView.renderError(err);
  }
};

// To control going back and forth between search results
const controlSearchPagination = async function (direction) {
  let currIndex = pokemonState.results.findIndex(
    p => p.name === panelState.pokemon.name
  );

  direction === 'next' ? currIndex++ : currIndex--;

  if (
    currIndex < 0 ||
    (currIndex >= pokemonState.results.length && !queryState.hasMoreResults)
  ) {
    paginationView.disablePaginationBtn(direction);
    resultsView.unobserveSentinel();

    return;
  }

  if (currIndex >= pokemonState.results.length && queryState.hasMoreResults) {
    paginationView.enablePaginationBtn('next');

    panelView.renderSpinner();

    if (queryState.query) {
      await loadAdditionalQuery();
    } else {
      await loadAdditionalBatch();
    }
  }

  const nextPokemon = pokemonState.results[currIndex];
  window.location.hash = nextPokemon.name;
};

// To add Pokémon to our Caught Pokémon
const controlAddCaught = function () {
  // To add/remove Caught status
  if (!panelState.pokemon.caught) addCaughtPokemon(panelState.pokemon);
  else removeCaughtPokemon(panelState.pokemon);

  panelView.toggleCaughtBtn();
};

// To add Pokémon to our Favorite Pokémon
const controlAddFavorite = function () {
  // To add/remove Caught status
  if (!panelState.pokemon.favorite) addFavoritePokemon(panelState.pokemon);
  else removeFavoritePokemon(panelState.pokemon);

  panelView.toggleFavoriteBtn();
};

// To initialize all Pokémon names to store in our state
const initPokemonData = async function () {
  await storeAllPokemon();
};

export const controlSearchInit = function () {
  initPokemonData();
  queryView.addHandlerQuery(debouncedControlSearchResults);
  sortView.addHandlerSortBtn(controlSearchSortBtn);
  sortView.addHandlerSortLoad(controlSearchSortLoad);
  previewView.addHandlerClickActivePreview(controlClickActivePreview);
  // previewView.addHandlerHashChange(controlPageActivePreview);
  panelView.addHandlerRenderPanel(controlPokemonPanel);
  panelView.addHandlerCaughtBtn(controlAddCaught);
  panelView.addHandlerFavoriteBtn(controlAddFavorite);
  paginationView.addHandlerPaginationClick(controlSearchPagination);
};
