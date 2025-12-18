import favoritesState from './state/favoritesState.js';
import caughtState from './state/caughtState.js';
import searchState from './state/searchState.js';

import {
  restartSearchResults,
  sortPokemonResults,
  possiblePokemon,
  sortPokemonName,
  sortPokemonID,
} from '../helpers.js';

export const loadPokemonResults = async function (
  requestId = searchState.currentRequestId
) {
  searchState.loading = true;
  console.log('loadPokemonResults running');
  restartSearchResults();
  let pokemonNames;

  try {
    if (searchState.view === 'caught') {
      pokemonNames = sortPokemonResults(caughtState.caught);
    } else if (searchState.view === 'favorites') {
      pokemonNames = sortPokemonResults(favoritesState.favorites);
    }

    for (const pokemon of pokemonNames) {
      const { name, id, img } = pokemon;
      if (requestId !== searchState.currentRequestId) return;
      searchState.results.push({ name, id, img });
    }

    // if (state.search.mode === 'id') pokemonNames = sortPokemonID(pokemonNames);
    // else if (state.search.mode === 'name')
    //   pokemonNames = sortPokemonName(pokemonNames);

    if (requestId !== searchState.currentRequestId) return;
  } catch (err) {
    console.error(err);
  }

  searchState.loading = false;
};

export const loadQueryResults = function (
  query,
  requestId = searchState.currentRequestId
) {
  searchState.loading = true;
  restartSearchResults();
  searchState.query = query;

  try {
    const currentData =
      searchState.view == 'caught'
        ? caughtState.caught
        : favoritesState.favorites;

    search.queryResults = possiblePokemon(query, currentData);

    if (searchState.queryResults.length === 0) return;

    const pokemonNames = sortPokemonResults(searchState.queryResults);

    for (const pokemon of pokemonNames) {
      const { name, id, img } = pokemon;
      if (requestId !== searchState.currentRequestId) return;
      searchState.results.push({ name, id, img });
    }
  } catch (err) {
    console.error(err);
  }

  searchState.loading = false;
};
