/**
 * Search Controller
 * ---------------------
 * Orchestrates Search module: loading data, managing sorting state, handling queries, implementing infinite scroll and lazy loading of search results, initializing all Pokémon references, pagination of search results, managing Pokémon in Caught/Favorite states.
 *
 * Emits actions to Search views but does not own state, perform data fetching, or manipulate the DOM.
 */

import {
  getHasMoreResults,
  getPokemonCurrentBatch,
  getPokemonLoading,
  getPokemonResults,
  getPokemonSortBy,
  loadNextPokemon,
  loadPokemonBatch,
  resetPokemonState,
  setPokemonSortBy,
  startPokemonRequest,
  storeAllPokemonReferences,
} from '../models/pokemonModel.js';
import {
  getHasMoreQueryResults,
  getQuery,
  getQueryCurrentBatch,
  getQueryLoading,
  getQueryResults,
  loadQueryBatch,
  resetQueryState,
  startPokemonQuery,
  storeQueryResults,
  updateHasMoreQueryResults,
} from '../models/queryModel.js';
import {
  addCaughtPokemon,
  removeCaughtPokemon,
} from '../models/caughtModel.js';
import {
  addFavoritePokemon,
  removeFavoritePokemon,
} from '../models/favoriteModel.js';
import { getPokemon, loadPokemon } from '../models/panelModel.js';
import pokemonState from '../models/state/pokemonState.js';
import caughtState from '../models/state/caughtState.js';
import favoriteState from '../models/state/favoriteState.js';
import {
  navResolveSortParams,
  navSanitizeSort,
} from '../services/navService.js';
import { getPokemonPagination } from '../services/pokemonService.js';
import navView from '../views/navView.js';
import queryView from '../views/SearchViews/queryView.js';
import resultsView from '../views/SearchViews/resultsView.js';
import previewView from '../views/SearchViews/previewView.js';
import sortView from '../views/SearchViews/sortView.js';
import panelView from '../views/SearchViews/panelView.js';
import paginationView from '../views/SearchViews/paginationView.js';
import { debounce } from '../helpers.js';

// import 'core-js/stable';
// import 'regenerator-runtime/runtime';

// SEARCH CONTROLLER FUNCTIONS

// To coordinate rendering of the Pokémon search results
const controlSearchResults = async function () {
  try {
    // Retrieve query from user input
    resetQueryState();
    resetPokemonState();

    if (resultsView._observer) resultsView.unobserveSentinel();

    const query = queryView.getQuery();

    let requestId, pokemonResults, hasMoreResults;

    resultsView.renderSpinner();

    if (query) {
      requestId = startPokemonQuery();

      storeQueryResults(query, pokemonState.allPokemonReferences);
      await loadQueryBatch(requestId);

      pokemonResults = getQueryResults();
      hasMoreResults = getHasMoreQueryResults();
    } else {
      console.log(getPokemonSortBy());
      requestId = startPokemonRequest();

      await loadPokemonBatch(requestId);

      pokemonResults = getPokemonResults();
      hasMoreResults = getHasMoreQueryResults();
    }

    if (pokemonResults.length < 1) {
      resultsView._clear();
      // resultsView.renderError('pokemon not found!');
      return;
    }

    if (hasMoreResults) {
      resultsView.observeSentinel(controlSearchInfiniteScroll);
    }

    resultsView.render(pokemonResults);
  } catch (err) {
    resultsView.renderError('pokemon not found!');
  }
};

// Debounce search results to reduce redundant queries
const debouncedControlSearchResults = debounce(controlSearchResults, 300);

// To determine the scroll position of the client and to load more data, if necessary
const controlSearchInfiniteScroll = async function () {
  const query = getQuery();

  let requestId,
    loading,
    hasMoreResults,
    currentBatch,
    loadBatch,
    updateHasMoreResults;

  if (query) {
    requestId = startPokemonQuery();
    loading = getQueryLoading();
    hasMoreResults = getHasMoreQueryResults();
    loadBatch = loadQueryBatch;
    updateHasMoreResults = updateHasMoreQueryResults;
  } else {
    requestId = startPokemonRequest();
    loading = getPokemonLoading();
    hasMoreResults = getHasMoreResults();
    loadBatch = loadPokemonBatch;
    updateHasMoreResults = updateHasMoreResults;
  }

  if (loading || !hasMoreResults) return;

  await loadBatch(requestId);

  currentBatch = query ? getQueryCurrentBatch() : getPokemonCurrentBatch();

  if (currentBatch.length === 0) {
    updateHasMoreResults();
    resultsView.unobserveSentinel();
    return;
  }

  // Return Pokémon data to controlSearchResults
  resultsView.render(currentBatch, true, true);
};

export const controlSearchRenderSort = function (sort) {
  switch (sort) {
    case 'name':
      sortView.toggleSearchSortName();
      break;

    case 'id':
    default:
      sortView.toggleSearchSortId();
      break;
  }
};

/**
 * Handles sort button click and keeps URL search params in sync with sorting mode
 *
 * @param {string} sort - Sort mode ('name' or 'id)
 */
const controlSearchSortBtn = async function (sort) {
  const currentURL = new URL(window.location.href);

  console.log(sort);
  if (sort === 'name') {
    currentURL.searchParams.set('sort', sort);
    window.history.replaceState({}, '', currentURL);
  } else if (sort === 'id') {
    navSanitizeSort();
  }

  setPokemonSortBy(sort);
  console.log(getPokemonSortBy());

  controlSearchRenderSort(sort);
  await controlSearchResults();
};

const controlSearchSortLoad = function () {
  const currentURL = new URL(window.location.href);
  const sort = currentURL.searchParams.get('sort');

  // console.log();
  if (!sort || sort !== 'name') navSanitizeSort();

  // const route = window.location.href;

  // const currentURL = navResolveSortParams(new URL(route));

  window.history.replaceState({ page: '/search ' }, '', currentURL);

  // const sort = currentURL.searchParams.get('sort');

  controlSearchRenderSort(sort);
};

/**
 * Updates URL to reflect current Pokémon being rendered.
 * Renders specified Pokémon in Pokémon panel.
 *
 * @param {string} pokemon - Pokémon name (unique identifier)
 */
const controlSearchClickPreview = function (pokemon) {
  const pokemonName = pokemon.toLowerCase();

  window.history.replaceState(
    { page: `search/${pokemonName}` },
    '',
    `/search/${pokemonName}`
  );

  controlSearchPokemonPanel();
};

const controlSearchLoadActivePreview = function () {
  const query = getQuery();

  if (query) resultsView.render(getQueryResults());
  else resultsView.render(getPokemonResults());
};

// To render Pokémon details (desc, stats, moves) for the Pokémon panel
const controlSearchPokemonPanel = async function () {
  try {
    // Retrieve Pokémon name from URL
    const pokemonName = window.location.pathname.split('/search/')[1];

    if (!pokemonName) return;

    // Load Pokémon (data) panel details
    panelView.renderSpinner();

    await loadPokemon(pokemonName);

    // Render Pokémon panel
    const pokemon = getPokemon();

    panelView.render(pokemon);

    // Configuring pagination buttons of Pokémon panel
    let pokemonResults, loadMoreResults;

    if (getQuery()) {
      pokemonResults = getQueryResults();
      loadMoreResults = getHasMoreQueryResults();
    } else {
      pokemonResults = getPokemonResults();
      loadMoreResults = getHasMoreResults();
    }

    const { prev, next } = getPokemonPagination(
      pokemon.name,
      pokemonResults,
      loadMoreResults
    );

    if (!prev) paginationView.disablePaginationBtn('prev');
    if (!next) paginationView.disablePaginationBtn('next');
  } catch (err) {
    panelView.renderError(err);
  }
};

/**
 * Manages pagination buttons on Pokémon panel.
 * Determines if pagination buttons should be enabled/disabled based on length of Pokémon results.
 *
 * @param {string} direction - 'prev' or 'next pagination button
 */
const controlSearchPagination = async function (direction) {
  const query = getQuery();
  let pokemonResults, loadMoreResults;

  // Determining if the pokemonResults should reflect the entire Pokémon database or the query results
  if (query) {
    pokemonResults = getQueryResults();
    loadMoreResults = getHasMoreQueryResults();
  } else {
    pokemonResults = getPokemonResults();
    loadMoreResults = getHasMoreResults();
  }

  // Loading the prev/next Pokémon based on the user-selected direction
  let nextPokemon = loadNextPokemon(direction, pokemonResults);

  // Loading more Pokémon preview results (if the user navigates to a Pokémon that hasn't been rendered yet)

  if (!nextPokemon && loadMoreResults) {
    paginationView.enablePaginationBtn('next');
    panelView.renderSpinner();

    const numResults = getPokemonResults().length;

    // Loading the next appropriate Pokémon batch
    if (query) await loadQueryBatch();
    else await loadPokemonBatch();

    // Updating the Pokémon preview search results
    await controlSearchResults();

    // Manually setting the next Pokémon to the first element of the updated Pokémon preview search results
    nextPokemon = getPokemonResults()[numResults];
  }

  // Updating the url to reflect the Pokémon that will be navigated to via pagination button
  if (nextPokemon) {
    const pokemonName = nextPokemon.name.toLowerCase();

    window.history.replaceState(
      { page: `search/${pokemonName}` },
      '',
      `/search/${pokemonName}`
    );
  }

  // Updating the Pokémon panel (for the Pokémon that has been navigated to via pagination button, now reflected in the url)
  controlSearchLoadActivePreview();
  await controlSearchPokemonPanel();
};

// To add/remove Pokémon from our active Pokémon panel to our Caught Pokémon
const controlSearchCaughtBtn = function () {
  // Retrieve Pokémon that is highlighted on the Pokémon Panel
  const pokemon = getPokemon();

  // To add/remove Caught status
  if (!pokemon.caught) addCaughtPokemon(pokemon);
  else removeCaughtPokemon(pokemon);

  panelView.toggleCaughtBtn();
};

// To add/remove Pokémon from our active Pokémon panel to our Favorite Pokémon
const controlSearchFavoriteBtn = function () {
  // Retrieve Pokémon that is highlighted on the Pokémon Panel
  const pokemon = getPokemon();

  // To add/remove Favorite status
  if (!pokemon.favorite) addFavoritePokemon(pokemon);
  else removeFavoritePokemon(pokemon);

  panelView.toggleFavoriteBtn();
};

// To reset the navView and load the Search module when user is redirected from Profile module
export const controlSearchRedirect = async function () {
  navView.resetNav();
  navView.toggleNavSearch();
  controlSearchLoadActivePreview();
  await controlSearchPokemonPanel();
};

// To initialize all Pokémon references to store in our state (pokemonState)
const initPokemonData = async function () {
  await storeAllPokemonReferences();
};

/**
 * Initializes Search Controller event handlers and attach them to Search Views
 */
export const controlSearchInit = function () {
  initPokemonData();

  queryView.addHandlerQuery(debouncedControlSearchResults);
  sortView.addHandlerSortBtn(controlSearchSortBtn);
  sortView.addHandlerSortLoad(controlSearchSortLoad);
  previewView.addHandlerClickActivePreview(controlSearchClickPreview);

  panelView.addHandlerRenderPanel(controlSearchPokemonPanel);

  panelView.addHandlerCaughtBtn(controlSearchCaughtBtn);
  panelView.addHandlerFavoriteBtn(controlSearchFavoriteBtn);

  paginationView.addHandlerPaginationClick(controlSearchPagination);
};
