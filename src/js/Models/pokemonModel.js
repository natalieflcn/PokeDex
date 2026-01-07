import pokemonState from './state/pokemonState';
import {
  filterPokemonPreviews,
  loadBatch,
  loadPokemonPreviews,
  sortPokemon,
} from '../services/pokemonService';
import { AJAX, extractPokemonId } from '../helpers';
import { LIMIT, POKEMON_NAMES_API_URL } from '../config';

// To initiate a new request for general Pokémon
export const startPokemonRequest = function () {
  const requestId = ++pokemonState.currentRequestId;
  return requestId;
};

// To determine whether the current request for general Pokémon is the latest request, preventing race conditions
export const isStalePokemonRequest = function (requestId) {
  return pokemonState.currentRequestId !== requestId;
};

// To retrieve the general Pokémon (pokemonState) results
export const getPokemonResults = function () {
  return pokemonState.results;
};

// To determine whether or not there are more general Pokémon (pokemonState) results that can be rendered
export const getHasMoreResults = function () {
  return pokemonState.hasMoreResults;
};

export const getPokemonSortBy = function () {
  return pokemonState.sortBy;
};

export const setPokemonSortBy = function (sortBy) {
  pokemonState.sortBy = sortBy;
};

// To add general Pokémon to our state (pokemonState)
const addPokemonToState = function (pokemon) {
  pokemonState.currentBatch.push(...pokemon);
  pokemonState.results.push(...pokemon);
};

// To store all Pokémon names and IDs in our state (This shallow dataset will later be referenced to fetch more Pokémon details as needed)
export const storeAllPokemonReferences = async function () {
  const pokeAPIData = await AJAX(`${POKEMON_NAMES_API_URL}`);
  const { results } = pokeAPIData;

  for (const result of results) {
    const pokemonName = result.name;
    const pokemonId = extractPokemonId(result.url);

    pokemonState.allPokemonReferences.push({
      name: pokemonName,
      id: pokemonId,
    });
  }

  pokemonState.loadedReferences = true;
};

// To load general Pokémon (preview) details for the current batch to be rendered in Search module results
export const loadPokemonBatch = async function (requestId) {
  try {
    pokemonState.loading = true;
    pokemonState.currentBatch = [];

    // Sort Pokémon by Name or ID according to (global) sort search param
    const sortedPokemon = sortPokemon(pokemonState.allPokemonReferences);

    const pokemonBatch = sortedPokemon.slice(
      pokemonState.offset,
      pokemonState.offset + LIMIT
    );

    // Fetch Pokémon name, ID, and img to later create Pokémon previews (this stores an array of promises)
    const pokemonBatchDetails = loadBatch(pokemonBatch);

    if (isStalePokemonRequest(requestId)) return;

    // Resolves the aforementioned array of promises and creates Pokémon preview objects
    const pokemonPreviews = await loadPokemonPreviews(pokemonBatchDetails);

    if (isStalePokemonRequest(requestId)) return;

    // Removes the invalid (null, non-existent) entries from the array of Pokémon preview obejcts
    const validPokemonPreviews = filterPokemonPreviews(pokemonPreviews);

    addPokemonToState(validPokemonPreviews);
    pokemonState.offset += LIMIT;
    pokemonState.loading = false;
  } catch (err) {
    throw err;
  }
};

// // Parallel fetching Pokémon details and creating Pokémon previews
// const pokemonRequests = pokemonBatch.map(pokemon => {
//   const pokemonName = pokemon.name || pokemon;

//   return fetchPokemon(pokemonName)
//     .then(pokemonDetails =>
//       createPokemonPreviewObject(pokemonName, pokemonDetails)
//     )
//     .catch(err => {
//       console.error(`Failed to load Pokémon: ${pokemonName}`, err);
//       return null;
//     });
// });

// const pokemonPreviews = await Promise.all(pokemonRequests);

// if (isStalePokemonRequest(requestId)) return;

// // Filtering out failed Pokémon preview objects
// const validPokemonPreviews = pokemonPreviews.filter(Boolean);
