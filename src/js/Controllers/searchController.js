import * as searchModel from '../models/searchModel.js';

import queryView from '../views/SearchViews/queryView.js';
import sortView from '../views/SearchViews/sortView.js';
import resultsView from '../views/SearchViews/resultsView.js';
import previewView from '../views/SearchViews/previewView.js';
import panelView from '../views/SearchViews/panelView.js';
import paginationView from '../views/SearchViews/paginationView.js';

import { print } from '../models/profileModel.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { debounce, restartSearchResults } from '../helpers.js';
import searchState from '../models/state/queryState.js';
import pokemonState from '../models/state/pokemonState.js';
import favoritesState from '../models/state/favoritesState.js';
import caughtState from '../models/state/caughtState.js';
import { togglePanelFavoriteBtn } from '../services/favoritesService.js';
import { togglePanelCaughtBtn } from '../services/caughtService.js';
import { navSanitizeSort } from '../services/navService.js';

// SEARCH CONTROLLER ---

// REFACTORED HANDLERS
const controlSearchDisablePaginationBtn = function (btn) {
  // btn.disabled = true; refactor later, these functions should actually accept the button itself instead of the direction
  document.querySelector(`.search__btn--${btn}`).classList.add('btn--disabled');
};

const controlSearchEnablePaginationBtn = function (btn) {
  // btn.disabled = false;
  document
    .querySelector(`.search__btn--${btn}`)
    .classList.remove('btn--disabled');
};

// To coordinate rendering of the search results [Screen 1]
const controlSearchResults = async function () {
  try {
    // Retrieve query from user input
    restartSearchResults();

    if (resultsView._observer) resultsView.unobserveSentinel();

    const query = queryView.getQuery();

    const requestId = ++searchState.currentRequestId;

    resultsView.renderSpinner();

    // If there's a query, render all existing Pokémon for that query
    if (query) {
      panelView._clear();
      await searchModel.loadQueryResults(query, requestId);

      // If there's NO query, render all existing Pokémon from PokéAPI database
    } else if (!query) {
      await searchModel.loadPokemonResults(requestId);
    }

    // If there's  additional results
    if (searchState.hasMoreResults)
      resultsView.observeSentinel(controlInfiniteScroll);

    if (searchState.currentRequestId !== requestId) return; // Abort render if the requestId is not up-to-date

    // Render Pokémon search results (screen 1 -- search)
    resultsView.render(searchState.results);
  } catch (err) {
    queryView.renderError();
  }
};
const debouncedControlSearchResults = debounce(controlSearchResults, 300); // Debounce search results to reduce redundant queries

// To determine the scroll position of the client and to load more data, if necessary
const controlInfiniteScroll = async function () {
  const requestId = searchState.currentRequestId;
  if (searchState.loading || !searchState.hasMoreResults) return;

  // Load additional query data
  if (searchState.query) {
    await searchModel.loadAdditionalQuery(requestId);
    // Load additional Pokémon data
  } else {
    await searchModel.loadAdditionalBatch(requestId);
  }

  // Determine if this is the end of current Pokémon search results
  if (searchState.currentBatch.length === 0) {
    searchState.hasMoreResults = false;
    resultsView.unobserveSentinel();
    return;
  }

  // Sort data before rendering
  if (sortView._mode === 'name') {
  } else {
  }

  // Return Pokémon data to controlSearchResults
  resultsView.render(searchState.currentBatch, true, true);
  return searchState.results;
};

const controlSearchRenderSort = function (sort) {
  switch (sort) {
    case 'name':
      sortView.toggleSortName();
      break;

    case 'id':
      sortView.toggleSortId();
      break;

    default:
      sortView.toggleSortId();
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

  sortView.toggleSortId();

  controlSearchRenderSort(sort);
};

// To sort Pokémon data by name
const controlSortName = function () {
  sortView.toggleSortName();

  if (searchState.results.length <= 1) return;

  searchState.mode = 'name';
  controlSearchResults();
};

// To sort Pokémon data by ID
const controlSortId = function () {
  sortView.toggleSortId();

  if (searchState.results.length <= 1) return;

  searchState.mode = 'id';
  controlSearchResults();
};

// To highlight active search results [screen 1]
const controlClickActivePreview = function (preview) {
  window.location.pathname = preview;
};

const controlPageActivePreview = function () {
  // TODO Need to refactor DOM logic into Views
  const currentlyActive = document.querySelector('.search__preview--active');

  if (currentlyActive)
    currentlyActive.classList.remove('search__preview--active');

  const previews = Array.from(document.querySelectorAll('.search__preview'));

  const targetPreview = previews.find(preview => {
    const nameEl = preview.querySelector('.search__preview--name');
    return nameEl?.textContent === window.location.hash.slice(1);
  });

  if (targetPreview) targetPreview.classList.add('search__preview--active');
};

// To coordinate rendering of the Pokémon Panel [Screen 2]
const controlPokemonPanel = async function () {
  try {
    // Retrieve hash from URL
    const id = window.location.hash.slice(1);
    if (!id) return;

    panelView.renderSpinner();

    // Load Pokémon (data) panel details
    await searchModel.loadPokemon(id);

    // Render Pokémon panel (screen 2 -- search)
    panelView.render(pokemonState.pokemon);

    const currIndex = searchState.results.findIndex(
      pokemon => pokemon.name === pokemonState.pokemon.name
    );

    if (currIndex === 0) controlSearchDisablePaginationBtn('prev');
    if (currIndex === searchState.results.length - 1)
      controlSearchDisablePaginationBtn('next');
  } catch (err) {
    panelView.renderError(err);
  }
};

// To control going back and forth between search results
const controlSearchPagination = async function (direction) {
  let currIndex = searchState.results.findIndex(
    p => p.name === pokemonState.pokemon.name
  );

  direction === 'next' ? currIndex++ : currIndex--;

  if (
    currIndex < 0 ||
    (currIndex >= searchState.results.length && !searchState.hasMoreResults)
  ) {
    controlSearchDisablePaginationBtn(direction);
    resultsView.unobserveSentinel();

    return;
  }

  if (currIndex >= searchState.results.length && searchState.hasMoreResults) {
    controlSearchEnablePaginationBtn('next');

    panelView.renderSpinner();

    if (searchState.query) {
      await searchModel.loadAdditionalQuery();
    } else {
      await searchModel.loadAdditionalBatch();
    }
  }

  const nextPokemon = searchState.results[currIndex];
  window.location.hash = nextPokemon.name;
};

// To add Pokémon to our Caught Pokémon
const controlAddCaught = function () {
  // To add/remove Caught status
  if (!pokemonState.pokemon.caught)
    searchModel.addCaughtPokemon(pokemonState.pokemon);
  else searchModel.removeCaughtPokemon(pokemonState.pokemon);

  togglePanelCaughtBtn();
};

// To add Pokémon to our Favorite Pokémon
const controlAddFavorite = function () {
  // To add/remove Caught status
  if (!pokemonState.pokemon.favorite)
    searchModel.addFavoritePokemon(pokemonState.pokemon);
  else searchModel.removeFavoritePokemon(pokemonState.pokemon);

  togglePanelFavoriteBtn();
};

// To initialize all Pokémon names to store in our state
const initPokemonData = async function () {
  await searchModel.storeAllPokemon();
};

export const controlSearchInit = function () {
  initPokemonData();
  queryView.addHandlerQuery(debouncedControlSearchResults);
  sortView.addHandlerSortBtn(controlSearchSortBtn);
  sortView.addHandlerSortLoad(controlSearchSortLoad);
  previewView.addHandlerActivePreview(controlClickActivePreview);
  previewView.addHandlerHashChange(controlPageActivePreview);
  panelView.addHandlerRenderPanel(controlPokemonPanel);
  panelView.addHandlerCaughtBtn(controlAddCaught);
  panelView.addHandlerFavoriteBtn(controlAddFavorite);
  paginationView.addHandlerPaginationClick(controlSearchPagination);
};

// MAP CONTROLLER ---
