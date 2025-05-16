import * as profileModel from '../Models/profileModel.js';
import searchView from '../Views/ProfileViews/searchView.js';
import savedPokemonView from '../Views/ProfileViews/savedPokemonView.js';
import { state } from '../Models/state.js';
import categoryView from '../Views/ProfileViews/categoryView.js';
import panelView from '../Views/SearchViews/panelView.js';
import { restartSearchResults } from '../helpers.js';

const controlSavedResults = function () {
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
      savedPokemonView.render(state.caught);
    } else if (!query && state.profile.view === 'favorites') {
      savedPokemonView.render(state.favorites);
      categoryView.toggleFavorites();
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

export const controlProfileInit = function () {
  searchView.addHandlerSearch(controlSavedResults);
  categoryView.addHandlerBtns(controlCategoryView);
};
