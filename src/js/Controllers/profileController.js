import * as profileModel from '../models/profileModel.js';
import searchView from '../views/ProfileViews/searchView.js';
import savedPokemonView from '../views/ProfileViews/savedPokemonView.js';

import categoryView from '../views/ProfileViews/categoryView.js';
import { restartSearchResults, updateCaughtPokemonTypes } from '../helpers.js';
import sortView from '../views/ProfileViews/sortView.js';
import { loadPokemonResults } from '../models/profileModel.js';
import navView from '../views/navView.js';
import previewView from '../views/ProfileViews/previewView.js';
import profileView from '../views/ProfileViews/profileView.js';
import { navSearch } from '../services/navService.js';
import searchState from '../models/state/searchState.js';
import favoritesState from '../models/state/favoritesState.js';
import caughtState from '../models/state/caughtState.js';
import { navCaught, navFavorites } from '../services/navService.js';

// PROFILE CATEGORY RENDERING AND ROUTING (Caught/Favorites)

// Renders the appropriate category view by calling their respective navService (based on the URL path)
const controlProfileRenderCategory = function (view) {
  switch (view) {
    case 'caught':
      navCaught();
      break;

    case 'favorites':
      navFavorites();
      break;

    default:
      navCaught();
      break;
  }
};

// Updates the URL and renders appropriate view when user clicks a category button
const controlProfileCategoryBtn = function (view) {
  controlProfileRenderCategory(view);

  window.history.pushState({ page: `profile/${view}` }, '', `/profile/${view}`);
};

// Reads the URL and navigates to appropriate view when user navigates around browser history stack
const controlProfileCategory = function () {
  const view = window.location.pathname.replace('/profile/', '');
  controlProfileRenderCategory(view);
};

// Redirects 'profile' to '/profile/caught' to maintain URL consistency across page loads
const controlProfileCategoryLoad = function () {
  if (window.location.pathname === '/profile') {
    window.history.replaceState(
      { page: 'profile/caught' },
      '',
      '/profile/caught'
    );
  }
};

// to refactor later
const controlSavedResults = async function () {
  try {
    restartSearchResults();
    const query = searchView.getQuery();
    const requestId = ++searchState.currentRequestId;

    savedPokemonView.renderSpinner();

    if (query) {
      console.log(query);
      profileModel.loadQueryResults(query, requestId);
      if (searchState.results.length === 0) {
        savedPokemonView._clear();
      } else {
        savedPokemonView.render(searchState.results);
      }
    } else if (!query && searchState.view === 'caught') {
      //TODO
      navCaught();
      await loadPokemonResults(requestId);
      savedPokemonView.render(caughtState.caught || '');
    } else if (!query && searchState.view === 'favorites') {
      //TODO
      navFavorites();
      await loadPokemonResults(requestId);
      savedPokemonView.render(favoritesState.favorites || '');
    }
  } catch (err) {
    console.error(err);
  }
};

export const newPokemonResult = async function () {
  await controlSavedResults();
};

const controlCategoryView = function (view) {
  searchView.clearInput(); //fix later
  savedPokemonView._clear(); //fix later
  restartSearchResults(); //fix later

  //remove this state later, use url state instead
  if (view === 'caught') searchState.view = 'caught';
  else searchState.view = 'favorites';
  controlSavedResults();
};

// To sort Pokémon data by name
const controlSortName = function () {
  sortView.toggleSortName();

  if (searchState.results.length <= 1) return;

  searchState.mode = 'name';
  controlSavedResults();
};

// To sort Pokémon by ID
const controlSortId = function () {
  sortView.toggleSortId();

  if (searchState.results.length <= 1) return;

  searchState.mode = 'id';
  controlSavedResults();
};

const controlClickedPreview = function (pokemon) {
  navSearch();
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
  updateCaughtPokemonTypes();
  const profileData = {
    typesCaught: caughtState.profile.typesCaught,
    caught: caughtState.caught,
    favorites: favoritesState.favorites.length,
  };
  profileView.render(profileData);
};

export const controlProfileInit = function () {
  //refactored controllers
  profileView.addHandlerLoadProfile(controlProfile);

  searchView.addHandlerSearch(controlSavedResults);
  sortView.addHandlerSortName(controlSortName);
  sortView.addHandlerSortId(controlSortId);
  previewView.addHandlerRedirect(controlClickedPreview);

  categoryView.addHandlerCategoryBtn(controlProfileCategoryBtn);
  categoryView.addHandlerCategory(controlProfileCategory);
  categoryView.addHandlerCategoryLoad(controlProfileCategoryLoad);
};
