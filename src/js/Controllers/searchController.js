import { state } from '../Models/state.js';
import * as searchModel from '../Models/searchModel.js';

import searchView from '../Views/SearchViews/searchView.js';
import sortView from '../Views/SearchViews/sortView.js';
import resultsView from '../Views/SearchViews/resultsView.js';
import previewView from '../Views/SearchViews/previewView.js';
import panelView from '../Views/SearchViews/panelView.js';
import paginationView from '../Views/SearchViews/paginationView.js';

import { print } from '../Models/profileModel.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { debounce, restartSearchResults } from '../helpers.js';

// SEARCH CONTROLLER ---

// To coordinate rendering of the search results [Screen 1]
const controlSearchResults = async function () {
  try {
    // Retrieve query from user input
    restartSearchResults();

    if (resultsView._observer) resultsView.unobserve();

    const query = searchView.getQuery();

    const requestId = ++state.search.currentRequestId;

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
    if (state.search.hasMoreResults) resultsView.observe(controlInfiniteScroll);

    if (state.search.currentRequestId !== requestId) return; // Abort render if the requestId is not up-to-date

    // Render Pokémon search results (screen 1 -- search)
    resultsView.render(state.search.results);
  } catch (err) {
    searchView.renderError();
  }
};
const debouncedControlSearchResults = debounce(controlSearchResults, 300); // Debounce search results to reduce redundant queries

// To determine the scroll position of the client and to load more data, if necessary
const controlInfiniteScroll = async function () {
  const requestId = state.search.currentRequestId;
  if (state.loading || !state.search.hasMoreResults) return;

  // Load additional query data
  if (state.search.query) {
    await searchModel.loadAdditionalQuery(requestId);
    // Load additional Pokémon data
  } else {
    await searchModel.loadAdditionalBatch(requestId);
  }

  // Determine if this is the end of current Pokémon search results
  if (state.search.currentBatch.length === 0) {
    state.search.hasMoreResults = false;
    resultsView.unobserve();
    return;
  }

  // Sort data before rendering
  if (sortView._mode === 'name') {
  } else {
  }

  // Return Pokémon data to controlSearchResults
  resultsView.render(state.search.currentBatch, true, true);
  return state.search.results;
};

// To sort Pokémon data by name
const controlSortName = function () {
  sortView.toggleSortName();

  if (state.search.results.length <= 1) return;

  state.search.mode = 'name';
  controlSearchResults();
};

// To sort Pokémon data by ID
const controlSortId = function () {
  sortView.toggleSortId();

  if (state.search.results.length <= 1) return;

  state.search.mode = 'id';
  controlSearchResults();
};

// To highlight active search results [screen 1]
const controlClickActivePreview = function (pokemonName) {
  window.location.hash = pokemonName;
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
    panelView.render(state.pokemon);

    const currIndex = state.search.results.findIndex(
      pokemon => pokemon.name === state.pokemon.name
    );

    if (currIndex === 0) paginationView.disableButton('prev');
    if (currIndex === state.search.results.length - 1)
      paginationView.disableButton('next');
  } catch (err) {
    panelView.renderError(err);
  }
};

// To control going back and forth between search results
const controlSearchPagination = async function (direction) {
  let currIndex = state.search.results.findIndex(
    p => p.name === state.pokemon.name
  );

  direction === 'next' ? currIndex++ : currIndex--;

  if (
    currIndex < 0 ||
    (currIndex >= state.search.results.length && !state.search.hasMoreResults)
  ) {
    paginationView.disableButton(direction);
    resultsView.unobserve();

    return;
  }

  if (currIndex >= state.search.results.length && state.search.hasMoreResults) {
    paginationView.enableButton('next');

    panelView.renderSpinner();

    if (state.search.query) {
      await searchModel.loadAdditionalQuery();
    } else {
      await searchModel.loadAdditionalBatch();
    }
  }

  const nextPokemon = state.search.results[currIndex];
  window.location.hash = nextPokemon.name;
};

// To add Pokémon to our Caught Pokémon
const controlAddCaught = function () {
  // To add/remove Caught status
  if (!state.pokemon.caught) searchModel.addCaughtPokemon(state.pokemon);
  else searchModel.removeCaughtPokemon(state.pokemon);

  panelView.toggleCaught();
};

// To add Pokémon to our Favorite Pokémon
const controlAddFavorite = function () {
  // To add/remove Caught status
  if (!state.pokemon.favorite) searchModel.addFavoritePokemon(state.pokemon);
  else searchModel.removeFavoritePokemon(state.pokemon);

  panelView.toggleFavorite();
};

// To initialize all Pokémon names to store in our state
const initPokemonData = async function () {
  await searchModel.storeAllPokemon();
};

export const controlSearchInit = function () {
  initPokemonData();
  searchView.addHandlerSearch(debouncedControlSearchResults);
  sortView.addHandlerSortName(controlSortName);
  sortView.addHandlerSortId(controlSortId);
  previewView.addHandlerActive(controlClickActivePreview);
  previewView.addHandlerHashChange(controlPageActivePreview);
  panelView.addHandlerRender(controlPokemonPanel);
  panelView.addHandlerCaught(controlAddCaught);
  panelView.addHandlerFavorite(controlAddFavorite);
  paginationView.addHandlerClick(controlSearchPagination);
};

// MAP CONTROLLER ---
