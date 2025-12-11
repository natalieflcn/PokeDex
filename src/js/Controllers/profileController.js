import * as profileModel from '../models/profileModel.js';
import searchView from '../views/ProfileViews/searchView.js';
import savedPokemonView from '../views/ProfileViews/savedPokemonView.js';
import { state } from '../models/state.js';
import categoryView from '../views/ProfileViews/categoryView.js';
import { restartSearchResults } from '../helpers.js';
import sortView from '../views/ProfileViews/sortView.js';
import { loadPokemonResults } from '../models/profileModel.js';
import navView from '../views/navView.js';
import previewView from '../views/ProfileViews/previewView.js';
import profileView from '../views/ProfileViews/profileView.js';

const controlSavedResults = async function () {
  try {
    restartSearchResults();
    const query = searchView.getQuery();
    const requestId = ++state.search.currentRequestId;

    savedPokemonView.renderSpinner();

    if (query) {
      console.log(query);
      profileModel.loadQueryResults(query, requestId);
      if (state.search.results.length === 0) {
        savedPokemonView._clear();
      } else {
        savedPokemonView.render(state.search.results);
      }
    } else if (!query && state.profile.view === 'caught') {
      categoryView.toggleCaught();
      await loadPokemonResults(requestId);
      savedPokemonView.render(state.search.results);
    } else if (!query && state.profile.view === 'favorites') {
      categoryView.toggleFavorites();
      await loadPokemonResults(requestId);
      savedPokemonView.render(state.search.results);
    }
  } catch (err) {
    console.error(err);
  }
};

export const newPokemonResult = async function () {
  await controlSavedResults();
};

const controlCategoryView = function (view) {
  searchView.clearInput();
  savedPokemonView._clear();
  restartSearchResults();
  if (view === 'caught') state.profile.view = 'caught';
  else state.profile.view = 'favorites';
  controlSavedResults();
};

// To sort Pokémon data by name
const controlSortName = function () {
  sortView.toggleSortName();

  if (state.search.results.length <= 1) return;

  state.search.mode = 'name';
  controlSavedResults();
};

// To sort Pokémon by ID
const controlSortId = function () {
  sortView.toggleSortId();

  if (state.search.results.length <= 1) return;

  state.search.mode = 'id';
  controlSavedResults();
};

const controlClickedPreview = function (pokemon) {
  navView.search();
  window.location.hash = pokemon;

  // Remove Profile page styling
  document
    .querySelector('.lights__inner--green')
    .classList.remove('lights__inner--active');

  document
    .querySelector('.header__btn--profile')
    .classList.remove('btn--active');

  // Add Search page styling
  document
    .querySelector('.lights__inner--blue')
    .classList.add('lights__inner--active');

  document.querySelector('.header__btn--search').classList.add('btn--active');

  // Hide profile screen
  document.querySelector('.screen__2--profile').classList.add('hidden');
};

const controlProfile = function () {
  const profileData = {
    ...state.profile,
    caught: state.caught,
    favorites: state.favorites.length,
  };
  profileView.render(profileData);
};

export const controlProfileInit = function () {
  searchView.addHandlerSearch(controlSavedResults);
  categoryView.addHandlerBtns(controlCategoryView);
  sortView.addHandlerSortName(controlSortName);
  sortView.addHandlerSortId(controlSortId);
  previewView.addHandlerRedirect(controlClickedPreview);
  profileView.addHandlerLoad(controlProfile);
};
