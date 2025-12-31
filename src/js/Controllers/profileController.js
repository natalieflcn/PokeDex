import queryView from '../views/ProfileViews/queryView.js';
import savedPokemonView from '../views/ProfileViews/savedPokemonView.js';

import categoryView from '../views/ProfileViews/categoryView.js';
import { clearQueryInput } from '../helpers.js';
import sortView from '../views/ProfileViews/sortView.js';
import { loadQueryResults } from '../models/queryModel.js';

import { loadPokemonResults } from '../models/pokemonModel.js';
import navView from '../views/navView.js';
import previewView from '../views/ProfileViews/previewView.js';
import profileView from '../views/ProfileViews/profileView.js';
import { navSanitizeSort } from '../services/navService.js';
import queryState from '../models/state/queryState.js';
import favoriteState from '../models/state/favoriteState.js';
import caughtState from '../models/state/caughtState.js';
import {
  loadCaughtPokemon,
  updateTypesPokemonCaught,
} from '../models/caughtModel.js';
import { loadFavoritePokemon } from '../models/favoriteModel.js';
import pokemonState from '../models/state/pokemonState.js';

// PROFILE CATEGORY RENDERING AND ROUTING (Caught/Favorites)

// Renders the appropriate category view by calling their respective navService (based on the URL path)
const controlProfileRenderCategory = function (view) {
  console.log(view);
  switch (view) {
    case 'caught':
      categoryView.toggleCaughtCategory();
      break;

    case 'favorites':
      categoryView.toggleFavoritesCategory();
      break;
  }
};

// Updates the URL and renders appropriate view when user clicks a category button
const controlProfileCategoryBtn = function (view) {
  controlProfileRenderCategory(view);

  window.history.replaceState(
    { page: `profile/${view}` },
    '',
    `/profile/${view}`
  );
};

// Reads the URL and navigates to appropriate view when user navigates around browser history stack
const controlProfileCategory = function () {
  const view = window.location.pathname.replace('/profile/', '');
  controlProfileRenderCategory(view);
};

const controlProfileCategoryLoad = function () {
  if (window.location.pathname === '/profile')
    window.history.replaceState(
      { page: `profile/caught` },
      '',
      `/profile/caught`
    );
};

// PROFILE SORTING RENDERING AND ROUTING (Name/Id)
const controlProfileRenderSort = function (sort) {
  switch (sort) {
    case 'name':
      sortView.toggleProfileSortName();
      break;

    case 'id':
      sortView.toggleProfileSortId();
      break;

    default:
      sortView.toggleProfileSortName();
      break;
  }
};

const controlProfileSortBtn = function (sort) {
  const currentURL = new URL(window.location.href);
  currentURL.searchParams.set('sort', sort);
  window.history.replaceState({}, '', currentURL);
  controlProfileRenderSort(sort);
};

const controlProfileSortLoad = function () {
  const sort = new URL(window.location.href).searchParams.get('sort');

  if (sort && sort !== 'name' && sort !== 'id') navSanitizeSort();
  sortView.toggleProfileSortName();

  controlProfileRenderSort(sort);
};

// to refactor later -----
const controlSavedResults = async function () {
  try {
    clearQueryInput();
    const query = queryView.getQuery();
    const requestId = ++queryState.currentQueryId;

    savedPokemonView.renderSpinner();

    const currentURL = window.location.pathname;

    if (query) {
      console.log(query);
      loadQueryResults(query, requestId);
      //TODO
      if (pokemonState.results.length === 0) {
        savedPokemonView._clear();
      } else {
        savedPokemonView.render(pokemonState.results);
      }
    } else if (!query && currentURL === '/profile/caught') {
      //TODO

      categoryView.toggleCaughtCategory();

      const caughtPokemon = await loadCaughtPokemon();

      console.log(caughtPokemon);

      savedPokemonView.render(caughtPokemon.length > 0 ? caughtPokemon : '');
    } else if (!query && currentURL === '/profile/favorites') {
      //TODO
      categoryView.toggleFavoritesCategory();

      const favoritePokemon = await loadFavoritePokemon();
      console.log(favoritePokemon.length);

      //doesnt render empty string without error -- error coming from view
      savedPokemonView.render(
        favoritePokemon.length > 0 ? favoritePokemon : ''
      );
    }
  } catch (err) {
    console.error(err);
  }
};

export const newPokemonResult = async function () {
  await controlSavedResults();
};

const controlCategoryView = function (view) {
  queryView.clearInput(); //fix later
  savedPokemonView._clear(); //fix later
  clearQueryInput(); //fix later

  //remove this state later, use url state instead
  // if (view === 'caught') queryState.view = 'caught';
  // else queryState.view = 'favorites';
  controlSavedResults();
};

// To sort Pokémon data by name
const controlSortName = function () {
  // sortView.toggleSortName();

  controlProfileSortBtn();

  if (pokemonState.results.length <= 1) return;

  // queryState.mode = 'name';
  controlSavedResults();
};

// To sort Pokémon by ID
const controlSortId = function () {
  // sortView.toggleSortId();

  controlProfileSortBtn();

  if (pokemonState.results.length <= 1) return;

  // queryState.mode = 'id';
  controlSavedResults();
};

const controlClickedPreview = function (pokemon) {
  sortView.toggleProfileSortName();

  window.history.pushState({ page: `/search` }, '', `/search`);
  window.location.hash = pokemon;
  navView.toggleNavSearch();
};

const controlProfile = function () {
  // updateTypesPokemonCaught();
  const profileData = {
    typesCaught: caughtState.typesCaught,
    caught: caughtState.caughtPokemon,
    favorites: favoriteState.favoritePokemon.length,
  };
  profileView.render(profileData);
};

export const controlProfileInit = function () {
  //refactored controllers
  profileView.addHandlerLoadProfile(controlProfile);
  previewView.addHandlerRedirect(controlClickedPreview);
  sortView.addHandlerSortBtn(controlProfileSortBtn);
  sortView.addHandlerSortLoad(controlProfileSortLoad);

  queryView.addHandlerQuery(controlSavedResults);
  // sortView.addHandlerSortName(controlSortName);
  // sortView.addHandlerSortId(controlSortId);

  categoryView.addHandlerCategoryBtn(controlProfileCategoryBtn);
  categoryView.addHandlerCategory(controlProfileCategory);
  categoryView.addHandlerCategoryLoad(controlProfileCategoryLoad);
};
