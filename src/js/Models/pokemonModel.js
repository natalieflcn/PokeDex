import pokemonState from './state/pokemonState';
import {
  extractPokemonId,
  fetchPokemon,
  filterPokemonPreviews,
  loadBatch,
  loadPokemonPreviews,
} from '../services/pokemonService';
import {
  AJAX,
  createPokemonPreviewObject,
  sortPokemon,
  sortPokemonName,
} from '../helpers';
import { LIMIT, MAIN_API_URL, POKEMON_NAMES_API_URL } from '../config';

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
export const loadPokemonBatch = async function (requestId, sortParam = 'id') {
  try {
    pokemonState.loading = true;
    pokemonState.currentBatch = [];

    // let pokemonBatch;

    // // fix later TODO
    // if (sortParam === 'name') {
    //   pokemonBatch = sortPokemonName(pokemonState.allPokemonReferences).slice(
    //     pokemonState.offset,
    //     pokemonState.offset + LIMIT
    //   );
    // } else if (sortParam === 'id' || !sortParam) {
    //   pokemonBatch = pokemonState.allPokemonReferences.slice(
    //     pokemonState.offset,
    //     pokemonState.offset + LIMIT
    //   );
    // }

    const sortedPokemon = sortPokemon(pokemonState.allPokemonReferences);

    const pokemonBatch = sortedPokemon.slice(
      pokemonState.offset,
      pokemonState.offset + LIMIT
    );

    const pokemonRequests = loadBatch(pokemonBatch);

    if (isStalePokemonRequest(requestId)) return;

    const pokemonPreviews = await loadPokemonPreviews(pokemonRequests);

    if (isStalePokemonRequest(requestId)) return;

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
