import * as profileModel from '../Models/profileModel.js';
import searchView from '../Views/ProfileViews/searchView.js';
import savedPokemonView from '../Views/ProfileViews/savedPokemonView.js';
import { state } from '../Models/state.js';
import categoryView from '../Views/ProfileViews/categoryView.js';
import { restartSearchResults } from '../helpers.js';
import sortView from '../Views/ProfileViews/sortView.js';
import { loadPokemonResults } from '../Models/profileModel.js';

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
      savedPokemonView.render(state.caught);
    } else if (!query && state.profile.view === 'favorites') {
      categoryView.toggleFavorites();
      await loadPokemonResults(requestId);
      savedPokemonView.render(state.favorites);
    }
  } catch (err) {
    console.error(err);
  }
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

export const controlProfileInit = function () {
  searchView.addHandlerSearch(controlSavedResults);
  categoryView.addHandlerBtns(controlCategoryView);
  sortView.addHandlerSortName(controlSortName);
  sortView.addHandlerSortId(controlSortId);
};
