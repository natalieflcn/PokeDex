// searchModel.js methods
// SEARCH: Rendering search results and Pokémon panel details

import { LIMIT, MAIN_API_URL } from '../config';
import {
  AJAX,
  createPokemonPreviewObject,
  possiblePokemon,
  clearQueryInput,
  sortPokemonResults,
} from '../helpers';
import pokemonState from './state/pokemonState';
import queryState from './state/queryState';

// To load Pokémon previews in the search results screen [screen 1]
export const loadQueryResults = async function (query, requestId) {
  queryState.loading = true;

  clearQueryInput();

  queryState.query = query;

  queryState.queryResults = possiblePokemon(
    query,
    pokemonState.allPokemonReferences
  );

  const sorted = sortPokemonResults(queryState.queryResults);

  const pokemonNames = queryState.queryResults.slice(
    queryState.offset,
    queryState.offset + LIMIT
  );

  for (const pokemon of pokemonNames) {
    try {
      if (requestId !== queryState.currentQueryId) return;
      const pokemonDetails = await AJAX(`${MAIN_API_URL}${pokemon.name}`);
      const pokemonPreview = createPokemonPreviewObject(
        pokemon.name,
        pokemonDetails
      );

      //   if(!pokemonPreview.id || pokemonPreview.img) return;
      if (requestId !== queryState.currentQueryId) return;
      pokemonState.results.push(pokemonPreview);
    } catch (err) {
      console.error(err);
    }
  }

  //   sortSearchResults(state.search.mode);
  queryState.offset += LIMIT;
  queryState.loading = false;
};

// To load additional query results
export const loadAdditionalQuery = async function (requestId) {
  queryState.loading = true;
  queryState.currentBatch = [];

  const pokemonNames = queryState.queryResults.slice(
    queryState.offset,
    queryState.offset + LIMIT
  );

  for (const pokemon of pokemonNames) {
    try {
      const pokemonDetails = await AJAX(`${MAIN_API_URL}${pokemon.name}`);
      const pokemonPreview = createPokemonPreviewObject(
        pokemon.name,
        pokemonDetails
      );
      queryState.currentBatch.push(pokemonPreview);
    } catch (err) {
      console.error(err);
    }
  }
  pokemonState.results.push(...queryState.currentBatch);
  queryState.offset += LIMIT;
  queryState.loading = false;
};

// // profileModel.js methods
// export const loadQueryResults = function (
//   query,
//   requestId = queryState.currentQueryId
// ) {
//   queryState.loading = true;
//   clearQueryInput();
//   queryState.query = query;

//   try {
//     const currentData =
//       queryState.view == 'caught'
//         ? caughtState.caughtPokemon
//         : favoritesState.favorites;

//     search.queryResults = possiblePokemon(query, currentData);

//     if (queryState.queryResults.length === 0) return;

//     const pokemonNames = sortPokemonResults(queryState.queryResults);

//     for (const pokemon of pokemonNames) {
//       const { name, id, img } = pokemon;
//       if (requestId !== queryState.currentQueryId) return;
//       queryState.results.push({ name, id, img });
//     }
//   } catch (err) {
//     console.error(err);
//   }

//   queryState.loading = false;
// };
