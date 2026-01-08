import queryView from '../views/SearchViews/queryView.js';
import sortView from '../views/SearchViews/sortView.js';
import resultsView from '../views/SearchViews/resultsView.js';
import previewView from '../views/SearchViews/previewView.js';
import panelView from '../views/SearchViews/panelView.js';
import paginationView from '../views/SearchViews/paginationView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { debounce } from '../helpers.js';
import queryState from '../models/state/queryState.js';

import { navSanitizeSort } from '../services/navService.js';
import {
  clearQueryInput,
  getHasMoreQueryResults,
  getQueryResults,
  isStalePokemonQuery,
  loadAdditionalQuery,
  loadQueryBatch,
  startPokemonQuery,
  storeQueryResults,
} from '../models/queryModel.js';
import {
  getHasMoreResults,
  getPokemonResults,
  isLatestPokemonRequest,
  isStalePokemonRequest,
  loadAdditionalBatch,
  loadPokemonBatch,
  setPokemonSortBy,
  startPokemonRequest,
  storeAllPokemon,
  storeAllPokemonNames,
  storeAllPokemonReferences,
} from '../models/pokemonModel.js';
import {
  addCaughtPokemon,
  removeCaughtPokemon,
} from '../models/caughtModel.js';
import {
  addFavoritePokemon,
  removeFavoritePokemon,
} from '../models/favoriteModel.js';
import panelState from '../models/state/panelState.js';
import { loadPokemon } from '../models/panelModel.js';
import pokemonState from '../models/state/pokemonState.js';

// SEARCH CONTROLLER ---

// REFACTORED HANDLERS

// To coordinate rendering of the search results [Screen 1]
const controlSearchResults = async function () {
  try {
    // Retrieve query from user input
    clearQueryInput();

    if (resultsView._observer) resultsView.unobserveSentinel();

    const query = queryView.getQuery();

    // const requestId = ++pokemonState.currentRequestId;
    // const queryId = ++queryState.currentQueryId;

    resultsView.renderSpinner();

    let pokemonResults;

    if (query) {
      storeQueryResults(query, pokemonState.allPokemonReferences);

      pokemonResults = await controlSearchQueryPokemon(query);
    } else {
      pokemonResults = await controlSearchGeneralPokemon();
    }

    if (!pokemonResults) return;
    /// refactoring above here
    // const requestId = startPokemonRequest();

    // console.log(requestId);
    // resultsView.renderSpinner();

    // If there's a query, render all existing Pokémon for that query
    // if (query) {
    //   console.log('query is running');
    //   panelView._clear();
    //   await loadQueryBatch(requestId, query, true);

    //   // If there's NO query, render all existing Pokémon from PokéAPI database
    // } else if (!query) {
    //   await loadPokemonBatch(requestId);
    //   console.log('searchrseults working until here');
    // }

    // // If there's  additional results
    // if (queryState.hasMoreResults)
    //   resultsView.observeSentinel(controlInfiniteScroll);

    // if (isStalePokemonRequest(requestId)) return; // Abort render if the requestId is not up-to-date

    // Render Pokémon search results (screen 1 -- search)

    resultsView.render(pokemonResults);
  } catch (err) {
    queryView.renderError();
  }
};

const controlSearchGeneralPokemon = async function () {
  const requestId = startPokemonRequest();

  // Parsing the URL for any sorting parameters (name/id) to organize data accordingly
  const sortParam = new URL(window.location.href).searchParams.get('sort');

  await loadPokemonBatch(requestId, sortParam);

  const pokemonResults = getPokemonResults();
  const hasMoreResults = getHasMoreResults();

  if (hasMoreResults) {
    resultsView.observeSentinel(controlInfiniteScroll);
  }

  if (isStalePokemonRequest(requestId)) return null;
  return pokemonResults;
};

const controlSearchQueryPokemon = async function (query) {
  panelView._clear();

  const requestId = startPokemonQuery();
  await loadQueryBatch(requestId, query, true);

  const pokemonResults = getQueryResults();

  const hasMoreResults = getHasMoreQueryResults();

  if (hasMoreResults) {
    resultsView.observeSentinel(controlInfiniteScroll);
  }

  if (isStalePokemonQuery(requestId)) return null;
  return pokemonResults;
};
// loadAllPokemon, loadQueryPokemon

const debouncedControlSearchResults = debounce(controlSearchResults, 300); // Debounce search results to reduce redundant queries

// To determine the scroll position of the client and to load more data, if necessary
const controlInfiniteScroll = async function () {
  const requestId = startPokemonRequest();

  // Parsing the URL for any sorting parameters (name/id) to organize data accordingly
  const sortParam = new URL(window.location.href).searchParams.get('sort');

  if (pokemonState.loading || !pokemonState.hasMoreResults) return;

  // Load additional query data
  if (queryState.query) {
    await loadQueryBatch(requestId);
    // Load additional Pokémon data
  } else {
    const newRequestId = startPokemonRequest();
    await loadPokemonBatch(newRequestId, sortParam);
  }

  // Determine if this is the end of current Pokémon search results
  if (pokemonState.currentBatch.length === 0) {
    queryState.hasMoreResults = false;
    resultsView.unobserveSentinel();
    return;
  }

  // Sort data before rendering
  if (sortView._mode === 'name') {
  } else {
  }

  // Return Pokémon data to controlSearchResults
  resultsView.render(pokemonState.currentBatch, true, true);
  return pokemonState.results;
};

export const controlSearchRenderSort = function (sort) {
  switch (sort) {
    case 'name':
      sortView.toggleSearchSortName();

      break;

    case 'id':
    default:
      sortView.toggleSearchSortId();
      // setPokemonSortBy('id');
      break;
  }
};

const controlSearchSortBtn = function (sort) {
  const currentURL = new URL(window.location.href);

  if (sort === 'name') {
    currentURL.searchParams.set('sort', sort);
    window.history.replaceState({}, '', currentURL);
  } else if (sort === 'id') {
    navSanitizeSort();
  }

  setPokemonSortBy(sort);
  controlSearchRenderSort(sort);
  controlSearchResults();
};

const controlSearchSortLoad = function () {
  const sort = new URL(window.location.href).searchParams.get('sort');

  if (!sort || sort !== 'name') navSanitizeSort();

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

    panelView.render(panelState.pokemon);

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
      await loadQueryBatch();
    } else {
      await loadPokemonBatch();
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
  await storeAllPokemonReferences();
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
