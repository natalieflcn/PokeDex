import { state } from './state.js';
import {
  restartSearchResults,
  sortPokemonResults,
  possiblePokemon,
  sortPokemonName,
  sortPokemonID,
} from '../helpers.js';

export const loadPokemonResults = async function (
  requestId = state.search.currentRequestId
) {
  state.loading = true;
  restartSearchResults();
  let pokemonNames;

  try {
    if (state.profile.view === 'caught') {
      pokemonNames = sortPokemonResults(state.caught);
    } else if (state.profile.view === 'favorites') {
      pokemonNames = sortPokemonResults(state.favorites);
    }

    for (const pokemon of pokemonNames) {
      const { name, id, img } = pokemon;
      if (requestId !== state.search.currentRequestId) return;
      state.search.results.push({ name, id, img });
    }

    // if (state.search.mode === 'id') pokemonNames = sortPokemonID(pokemonNames);
    // else if (state.search.mode === 'name')
    //   pokemonNames = sortPokemonName(pokemonNames);

    if (requestId !== state.search.currentRequestId) return;
  } catch (err) {
    console.error(err);
  }

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

    const pokemonNames = sortPokemonResults(state.search.queryResults);

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
