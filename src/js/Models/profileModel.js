import { LIMIT } from '../config.js';
import { state } from './state.js';
import {
  AJAX,
  capitalize,
  createPokemonPreviewObject,
  sortQueryResults,
} from '../helpers.js';
import {
  restartSearchResults,
  sortQueryResults,
  possiblePokemon,
} from '../helpers.js';

export const loadPokemonResults = async function (
  requestId = state.search.currentRequestId
) {
  state.loading = true;

  let pokemonNames;

  if (state.profile.view === 'caught') {
    pokemonNames = state.caught;

    console.log(pokemonNames);
  } else if (state.profile.view === 'favorites') {
    pokemonNames = state.favorites;
  }

  if (requestId !== state.search.currentRequestId) return;
  state.search.results.push(pokemonNames);
  state.search.offset += pokemonNames.length;
  state.loading = false;
};

export const loadQueryResults = function (
  query,
  requestId = state.search.currentRequestId
) {
  state.loading = true;
  restartSearchResults();
  state.search.query = query;

  try {
    const currentData =
      state.profile.view == 'caught' ? state.caught : state.favorites;

    state.search.queryResults = possiblePokemon(query, currentData);

    if (state.search.queryResults.length === 0) return;

    console.log(possiblePokemon(query, currentData));
    console.log(state.search.queryResults);
    const pokemonNames = sortQueryResults();

    for (const pokemon of pokemonNames) {
      const { name, id, img } = pokemon;
      if (requestId !== state.search.currentRequestId) return;
      state.search.results.push({ name, id, img });
    }
  } catch (err) {
    console.error(err);
  }

  state.loading = false;
};

export const print = function () {
  console.log('CAUGHT');
  console.log(state.caught);
  console.log('FAVORITE');
  console.log(state.favorites);
};
