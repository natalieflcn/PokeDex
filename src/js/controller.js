import * as model from './model.js';
import navView from './Views/navView.js';
import searchView from './Views/searchView.js';
import sortView from './Views/sortView.js';
import resultsView from './Views/resultsView.js';
import previewView from './Views/previewView.js';
import panelView from './Views/panelView.js';
import paginationView from './Views/paginationView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { debounce } from './helpers.js';

const controlNav = function (page) {
  switch (page) {
    case 'search':
      navView.search();
      break;

    case 'map':
      navView.map();
      break;

    case 'profile':
      navView.profile();
      break;

    default:
      navView.search();
      break;
  }
};

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
      panelView._clear();
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
const debouncedControlSearchResults = debounce(controlSearchResults, 300); // Debounce search results to reduce redundant queries

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

// To sort Pokémon data by name
const controlSortName = function () {
  console.log('sorting by name');
  sortView.toggleSortName();
};

// To sort Pokémon data by ID
const controlSortId = function () {
  console.log('sorting by id');
  sortView.toggleSortId();
};

// To highlight active search results [screen 1]
const controlClickActivePreview = function (pokemonName) {
  window.location.hash = pokemonName;
};

const controlPageActivePreview = function () {
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
    await model.loadPokemon(id);

    // Render Pokémon panel (screen 2 -- search)
    panelView.render(model.state.pokemon);

    const currIndex = model.state.search.results.findIndex(
      pokemon => pokemon.name === model.state.pokemon.name
    );

    if (currIndex === 0) paginationView.disableButton('prev');
    if (currIndex === model.state.search.results.length - 1)
      paginationView.disableButton('next');
  } catch (err) {
    panelView.renderError(err);
  }
};

// To control going back and forth between search results
const controlSearchPagination = async function (direction) {
  let currIndex = model.state.search.results.findIndex(
    p => p.name === model.state.pokemon.name
  );

  direction === 'next' ? currIndex++ : currIndex--;

  if (
    currIndex < 0 ||
    (currIndex >= model.state.search.results.length &&
      !model.state.search.hasMoreResults)
  ) {
    paginationView.disableButton(direction);
    resultsView.unobserve();

    return;
  }

  if (
    currIndex >= model.state.search.results.length &&
    model.state.search.hasMoreResults
  ) {
    paginationView.enableButton('next');

    panelView.renderSpinner();

    if (model.state.search.query) {
      await model.loadAdditionalQuery();
    } else {
      await model.loadAdditionalBatch();
    }
  }

  const nextPokemon = model.state.search.results[currIndex];
  window.location.hash = nextPokemon.name;
};

// To add Pokémon to our Caught Pokémon
const controlAddCaught = function () {
  // To add/remove Caught status
  if (!model.state.pokemon.caught) model.addCaughtPokemon(model.state.pokemon);
  else model.removeCaughtPokemon(model.state.pokemon);

  panelView.toggleCaught();
};

// To add Pokémon to our Favorite Pokémon
const controlAddFavorite = function () {
  // To add/remove Caught status
  if (!model.state.pokemon.favorite)
    model.addFavoritePokemon(model.state.pokemon);
  else model.removeFavoritePokemon(model.state.pokemon);

  panelView.toggleFavorite();
  console.log(model.state.favorites);
};

// To initialize all Pokémon names to store in our state
const initPokemonData = async function () {
  await model.storeAllPokemonNames();
};

const controlSearchInit = function () {
  initPokemonData();
  navView.addHandlerClick(controlNav);
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
controlSearchInit();
