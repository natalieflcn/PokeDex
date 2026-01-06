import queryState from './state/queryState';
import pokemonState from './state/pokemonState';
import {
  AJAX,
  createPokemonPreviewObject,
  possiblePokemon,
  clearQueryInput,
  sortPokemon,
} from '../helpers';
import { LIMIT, MAIN_API_URL } from '../config';
import {
  fetchPokemon,
  filterPokemonPreviews,
  loadBatch,
  loadPokemonPreviews,
} from '../services/pokemonService';

// To initiate a new request for a Pokémon query
export const startPokemonQuery = function () {
  const requestId = ++queryState.currentQueryId;
  return requestId;
};

// To determine whether the current request for a queried Pokémon is the latest request, preventing race conditions
export const isStalePokemonQuery = function (requestId) {
  return queryState.currentQueryId !== requestId;
};

// To retrieve the queried Pokémon (queryState) results
export const getQueryResults = function () {
  return queryState.queryResults;
};

// To determine whether or not there are more queried Pokémon (queryState) results that can be rendered
export const getHasMoreQueryResults = function () {
  return queryState.hasMoreResults;
};

const addQueryPokemonToState = function (pokemon) {
  queryState.currentBatch.push(...pokemon);
  queryState.queryResults.push(...pokemon);
};

// To store all possible Pokémon references in the query results (queryState)
export const storeQueryResults = async function (query, querySet) {
  queryState.loading = true;

  clearQueryInput();

  queryState.query = query;
  console.log(query, querySet);
  queryState.queryReferences = possiblePokemon(query, querySet);

  queryState.loading = false;
};

// To load queried Pokémon (preview) details for the current batch to be rendered in the results
export const loadQueryBatch = async function (requestId) {
  queryState.loading = true;
  queryState.currentBatch = [];

  const sortedPokemon = sortPokemon(queryState.queryReferences);

  const pokemonBatch = sortedPokemon.slice(
    queryState.offset,
    queryState.offset + LIMIT
  );

  const pokemonRequests = loadBatch(pokemonBatch);
  if (isStalePokemonQuery(requestId)) return;

  const pokemonPreviews = await loadPokemonPreviews(pokemonRequests);

  if (isStalePokemonQuery(requestId)) return;

  const validPokemonPreviews = filterPokemonPreviews(pokemonPreviews);

  addQueryPokemonToState(validPokemonPreviews);
  queryState.offset += LIMIT;
  queryState.loading = false;
};

// const pokemonRequests = pokemonBatch.map(pokemon => {
//     const pokemonName = pokemon.name || pokemon;

//     return fetchPokemon(pokemonName)
//       .then(pokemonDetails =>
//         createPokemonPreviewObject(pokemonName, pokemonDetails)
//       )
//       .catch(err => {
//         console.error(`Failed to load Pokémon: ${pokemonName}`, err);
//         return null;
//       });
//   });

//   const pokemonPreviews = await Promise.all(pokemonRequests);

//   if (isStalePokemonQuery(requestId)) return;

//   const validPokemonPreviews = pokemonPreviews.filter(Boolean);
