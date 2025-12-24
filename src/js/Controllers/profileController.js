import * as profileModel from '../models/profileModel.js';
import queryView from '../views/ProfileViews/queryView.js';
import savedPokemonView from '../views/ProfileViews/savedPokemonView.js';

import categoryView from '../views/ProfileViews/categoryView.js';
import { restartSearchResults, updateCaughtPokemonTypes } from '../helpers.js';
import sortView from '../views/ProfileViews/sortView.js';
import { loadPokemonResults } from '../models/profileModel.js';
import navView from '../views/navView.js';
import previewView from '../views/ProfileViews/previewView.js';
import profileView from '../views/ProfileViews/profileView.js';
import {
  navProfileSortId,
  navProfileSortName,
  navSearch,
} from '../services/navService.js';
import searchState from '../models/state/queryState.js';
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

//TODO
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

// PROFILE SORTING RENDERING AND ROUTING (Name/Id)
const controlProfileRenderSort = function (sort) {
  switch (sort) {
    case 'name':
      navProfileSortName();
      break;

    case 'id':
      navProfileSortId();
      break;

    default:
      navProfileSortName();
      break;
  }
};

// const controlProfileSortName = function () {
//   const currentURL = new URL(window.location.href);
//   currentURL.searchParams.set('sort', 'name');
//   window.history.pushState({}, '', currentURL);

//   controlProfileRenderSort('name');
// };

// const controlProfileSortId = function () {
//   const currentURL = new URL(window.location.href);
//   currentURL.searchParams.set('sort', 'id');
//   window.history.pushState({}, '', currentURL);

//   navProfileSortId();
// };

const controlProfileSortBtn = function (sort) {
  controlProfileRenderSort(sort);

  const currentURL = new URL(window.location.href);
  currentURL.searchParams.set('sort', sort);
  window.history.pushState({}, '', currentURL);
};

const controlProfileSortLoad = function () {
  let sortBy = 'name';

  const currentURL = new URL(window.location.href);
  if (currentURL.searchParams) {
    const sort = currentURL.search.split('?sort=')[1];

    if (sort === 'name' || sort === 'id') sortBy = sort;
    else {
      currentURL.searchParams.delete('sort');
      console.log(currentURL.search);
      window.history.pushState({}, '', currentURL);
    }
  }

  controlProfileRenderSort(sortBy);
};

// to refactor later -----
const controlSavedResults = async function () {
  try {
    restartSearchResults();
    const query = queryView.getQuery();
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
  queryView.clearInput(); //fix later
  savedPokemonView._clear(); //fix later
  restartSearchResults(); //fix later

  //remove this state later, use url state instead
  if (view === 'caught') searchState.view = 'caught';
  else searchState.view = 'favorites';
  controlSavedResults();
};

// To sort Pokémon data by name
const controlSortName = function () {
  // sortView.toggleSortName();

  controlProfileSortBtn();

  if (searchState.results.length <= 1) return;

  searchState.mode = 'name';
  controlSavedResults();
};

// To sort Pokémon by ID
const controlSortId = function () {
  // sortView.toggleSortId();

  controlProfileSortBtn();

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

  sortView.addHandlerSortBtn(controlProfileSortBtn);
  sortView.addHandlerSortLoad(controlProfileSortLoad);

  queryView.addHandlerQuery(controlSavedResults);
  // sortView.addHandlerSortName(controlSortName);
  // sortView.addHandlerSortId(controlSortId);

  categoryView.addHandlerCategoryBtn(controlProfileCategoryBtn);
  categoryView.addHandlerCategory(controlProfileCategory);
  categoryView.addHandlerCategoryLoad(controlProfileCategoryLoad);
};
