import { LIMIT } from '../config.js';
import { state } from './state.js';
import { AJAX, capitalize, createPokemonPreviewObject } from '../helpers.js';

export const loadPokemonResults = async function (
  requestId = state.search.currentRequestId
) {
  state.loading = true;

  let pokemonNames;

  if (state.profile.view === 'caught') {
    pokemonNames = state.caught.slice(
      state.search.offset,
      state.search.offset + LIMIT
    );
    console.log(pokemonNames);
  } else if (state.profile.view === 'favorites') {
    pokemonNames = state.favorites.slice(
      state.search.offset,
      state.search.offset + LIMIT
    );
  }

  state.search.results.push(pokemonNames);
  state.search.offset += pokemonNames.length;
  state.loading = false;
};

export const print = function () {
  console.log('CAUGHT');
  console.log(state.caught);
  console.log('FAVORITE');
  console.log(state.favorites);
};
