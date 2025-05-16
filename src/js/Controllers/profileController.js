import * as profileModel from '../Models/profileModel.js';
import searchView from '../Views/ProfileViews/searchView.js';
import savedPokemonView from '../Views/ProfileViews/savedPokemonView.js';
import { state } from '../Models/state.js';
import categoryView from '../Views/ProfileViews/categoryView.js';

const controlSavedResults = async function () {
  try {
    if (state.profile.view === 'caught') {
      categoryView.toggleCaught();
      savedPokemonView.render(state.caught);
    } else if (state.profile.view === 'favorites') {
      savedPokemonView.render(state.favorites);
      categoryView.toggleFavorites();
    }
  } catch (err) {
    console.error(err);
  }
};

const controlCategoryView = function (view) {
  if (view === 'caught') state.profile.view = 'caught';
  else state.profile.view = 'favorites';
  controlSavedResults();
};

// To sort Pokémon data by ID
const controlFavorites = function () {
  sortView.toggleSortId();

  state.profile.view = 'favorites';

  state.search.mode = 'id';
  controlSearchResults();
};

export const controlProfileInit = function () {
  searchView.addHandlerSearch(controlSavedResults);
  categoryView.addHandlerBtns(controlCategoryView);
};
