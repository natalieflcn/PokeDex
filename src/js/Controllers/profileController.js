import queryView from '../views/ProfileViews/queryView.js';
import savedPokemonView from '../views/ProfileViews/savedPokemonView.js';

import categoryView from '../views/ProfileViews/categoryView.js';
import { clearQueryInput } from '../helpers.js';
import sortView from '../views/ProfileViews/sortView.js';
import {
  getQueryResults,
  loadQueryBatch,
  startPokemonQuery,
  storeQueryResults,
} from '../models/queryModel.js';

import navView from '../views/navView.js';
import previewView from '../views/ProfileViews/previewView.js';
import profileView from '../views/ProfileViews/profileView.js';
import { navSanitizeSort } from '../services/navService.js';
import queryState from '../models/state/queryState.js';
import favoriteState from '../models/state/favoriteState.js';
import caughtState from '../models/state/caughtState.js';
import {
  getCaughtPokemon,
  getTypesPokemonCaught,
  loadCaughtPokemon,
  updateTypesPokemonCaught,
} from '../models/caughtModel.js';
import {
  getFavoritePokemon,
  loadFavoritePokemon,
} from '../models/favoriteModel.js';
import pokemonState from '../models/state/pokemonState.js';

// GENERAL PROFILE CONTROLLER FUNCTIONS

// To populate the Profile with the appropriate data upon load
const controlProfileLoad = function () {
  updateTypesPokemonCaught();

  const profileData = {
    typesCaught: getTypesPokemonCaught(),
    caught: getCaughtPokemon(),
    favorites: getFavoritePokemon().length,
  };

  profileView.render(profileData);
};

// To redirect user to the Search Module with the selected Pokémon's details rendered in the panel
const controlProfileClickPreview = function (pokemon) {
  // sortView.toggleProfileSortName();

  window.history.pushState({ page: `/search` }, '', `/search`);
  window.location.hash = pokemon;
  navView.toggleNavSearch();
};

// RENDERING AND ROUTING PROFILE CATEGORY (Caught/Favorite)

// Renders the appropriate category view (Caught/Favorites)
const controlProfileRenderCategory = function (view) {
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
  queryView.clearInput();
  savedPokemonView._clear();
  clearQueryInput();

  window.history.replaceState(
    { page: `profile/${view}` },
    '',
    `/profile/${view}`
  );

  controlProfileRenderCategory(view);
  controlProfileSavedResults();
};

// Reads the URL and navigates to appropriate view when user navigates around browser history stack
const controlProfileCategory = function () {
  const view = window.location.pathname.replace('/profile/', '');
  controlProfileRenderCategory(view);
};

// Replaces the URL with /profile/caught route if user navigates to /profile route to maintain URL consistency
const controlProfileCategoryLoad = function () {
  if (window.location.pathname === '/profile')
    window.history.replaceState(
      { page: `profile/caught` },
      '',
      `/profile/caught`
    );
};

// RENDERING AND ROUTING PROFILE SORTING VIEW (Name/Id)

// Renders the appropriate sorting view (Caught/Favorites)
const controlProfileRenderSort = function (sort) {
  switch (sort) {
    case 'name':
      sortView.toggleProfileSortName();
      break;

    case 'id':
      sortView.toggleProfileSortId();
      break;

    default:
      sortView.toggleProfileSortId();
      break;
  }
};

// Updates the URL search params and renders appropriate view when user clicks a sort button
const controlProfileSortBtn = function (sort) {
  const currentURL = new URL(window.location.href);
  currentURL.searchParams.set('sort', sort);
  window.history.replaceState({}, '', currentURL);

  controlProfileRenderSort(sort);
  controlProfileSavedResults();
};

// Sets the sorting mode to 'id' upon load/reload of the platform
const controlProfileSortLoad = function () {
  const sort = new URL(window.location.href).searchParams.get('sort');

  controlProfileRenderSort(sort);
};

// to refactor later -----
const controlProfileSavedResults = async function () {
  try {
    clearQueryInput();
    const query = queryView.getQuery();
    console.log(query);
    const requestId = startPokemonQuery();

    savedPokemonView.renderSpinner();

    // Rendering all of the caught/favorite Pokémon before working with the query
    const profileCategory = window.location.pathname;
    const pokemonBatch =
      profileCategory === '/profile/caught'
        ? await loadCaughtPokemon()
        : await loadFavoritePokemon();
    savedPokemonView.render(pokemonBatch.length > 0 ? pokemonBatch : '');

    console.log(pokemonBatch);
    // Rendering query results
    if (query) {
      storeQueryResults(query, pokemonBatch);
      loadQueryBatch(requestId, query, true, pokemonBatch);

      const queryBatch = getQueryResults();
      console.log(queryBatch);

      if (queryBatch.length > 0) savedPokemonView.render(queryBatch);
      else savedPokemonView._clear();

      // //TODO
      // if (queryState.queryResults.length === 0) {
      //   savedPokemonView._clear();
      // } else {
      //   savedPokemonView.render(pokemonState.results);
      // }
      // } else if (!query && profileCategory === '/profile/caught') {
      //   //TODO

      //   // categoryView.toggleCaughtCategory();

      //   const caughtPokemon = await loadCaughtPokemon();

      //   console.log(caughtPokemon);

      //   savedPokemonView.render(caughtPokemon.length > 0 ? caughtPokemon : '');
      // } else if (!query && profileCategory === '/profile/favorites') {
      //   //TODO
      //   // categoryView.toggleFavoritesCategory();

      //   const favoritePokemon = await loadFavoritePokemon();
      //   console.log(favoritePokemon.length);

      //   //doesnt render empty string without error -- error coming from view
      //   savedPokemonView.render(
      //     favoritePokemon.length > 0 ? favoritePokemon : ''
      //   );
      // }
    }
  } catch (err) {
    console.error(err);
  }
};

// export const newPokemonResult = async function () {
//   await controlProfileSavedResults();
// };

// const controlCategoryView = function (view) {
//   queryView.clearInput(); //fix later
//   savedPokemonView._clear(); //fix later
//   clearQueryInput(); //fix later

//   //remove this state later, use url state instead
//   // if (view === 'caught') queryState.view = 'caught';
//   // else queryState.view = 'favorites';
//   controlProfileSavedResults();
// };

// To sort Pokémon data by name
// const controlSortName = function () {
//   // sortView.toggleSortName();

//   controlProfileSortBtn();

//   if (pokemonState.results.length <= 1) return;

//   // queryState.mode = 'name';
//   controlProfileSavedResults();
// };

// // To sort Pokémon by ID
// const controlSortId = function () {
//   // sortView.toggleSortId();

//   controlProfileSortBtn();

//   if (pokemonState.results.length <= 1) return;

//   // queryState.mode = 'id';
//   controlProfileSavedResults();
// };

export const controlProfileInit = function () {
  profileView.addHandlerLoadProfile(controlProfileLoad);

  queryView.addHandlerQuery(controlProfileSavedResults);
  previewView.addHandlerRedirect(controlProfileClickPreview);

  categoryView.addHandlerCategoryBtn(controlProfileCategoryBtn);
  categoryView.addHandlerCategory(controlProfileCategory);
  categoryView.addHandlerCategoryLoad(controlProfileCategoryLoad);

  sortView.addHandlerSortBtn(controlProfileSortBtn);
  sortView.addHandlerSortLoad(controlProfileSortLoad);
};
