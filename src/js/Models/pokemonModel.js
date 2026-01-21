/**
 * Pokémon Model
 * ---------------------
 * Manages business logic and data related to pokemonState.
 * Responsible for handling requests for data, updating state, initializing all Pokémon references, and loading Pokémon data.
 *
 * Directly reads and modifies pokemonState.
 * Fetches data from external APIs.
 * Does not manipulate the DOM.
 */

import pokemonState from './state/pokemonState';
import { getPokemon } from './panelModel';
import {
  filterPokemonPreviews,
  loadBatch,
  loadPokemonPreviews,
  sortPokemon,
} from '../services/pokemonService';
import { AJAX, extractPokemonId } from '../helpers';
import { LIMIT, POKEMON_NAMES_API_URL } from '../config';

/**
 * ======================
 * Type Definitions
 * ======================
 */

/**
 * @typedef {Object} Pokemon
 * @property {string} name
 * @property {number} id
 */

/**
 * ======================
 * Pokemon Model Functions
 * ======================
 */

export const getPokemonResults = () => pokemonState.results;

export const getPokemonCurrentBatch = () => pokemonState.currentBatch;

export const getPokemonLoading = () => pokemonState.loading;

// To determine whether or not there are additional Pokémon (pokemonState) results that can be rendered
export const getHasMoreResults = () => pokemonState.hasMoreResults;

export const getPokemonSortBy = () => pokemonState.sortBy;

export const setPokemonSortBy = sortBy => (pokemonState.sortBy = sortBy);

// To initiate a new request for general Pokémon
export const startPokemonRequest = function () {
  const requestId = ++pokemonState.currentRequestId;
  return requestId;
};

/**
 * To determine whether the current request for Pokémon is stale, preventing race conditions
 *
 * @param {number} requestId - Id of current request being made
 */
export const isStalePokemonRequest = requestId =>
  pokemonState.currentRequestId !== requestId;

const addPokemonToState = function (pokemon) {
  pokemonState.currentBatch.push(...pokemon);
  pokemonState.results.push(...pokemon);
};

export const updateHasMoreResults = function () {
  if (pokemonState.results.length === pokemonState.allPokemonReferences.length)
    pokemonState.hasMoreResults = false;
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

/**
 * To load general Pokémon (preview) details for the current batch to be rendered in Search module results
 *
 * @param {number} requestId - Id of current request being made
 */
export const loadPokemonBatch = async function (requestId) {
  try {
    pokemonState.loading = true;
    pokemonState.currentBatch = [];

    console.log(getPokemonSortBy());

    // Sort Pokémon by Name or ID according to (global) sort search param
    const sortedPokemon = sortPokemon(
      pokemonState.allPokemonReferences,
      getPokemonSortBy()
    );

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
    updateHasMoreResults();

    pokemonState.offset += LIMIT;
    pokemonState.loading = false;
  } catch (err) {
    throw err;
  }
};

/**
 * To load next Pokémon that will render upon pagination click
 *
 * @param {string} direction - 'prev' or 'next pagination button
 * @param {Array<Pokemon>} pokemonResults - Pokémon dataset
 */
export const loadNextPokemon = function (direction, pokemonResults) {
  const activePokemon = getPokemon();

  let currIndex = pokemonResults.findIndex(
    pokemon => pokemon.name === activePokemon.name
  );

  // To increment/decrement the index based on next/prev direction (passed from button dataset property)
  direction === 'next' ? currIndex++ : currIndex--;

  // If there are no more results in that direction (first result of the array or last result of the array)
  if (currIndex < 0 || currIndex >= pokemonResults.length) {
    return null;
  }

  // If there is a Pokémon to be loaded in the respective direction
  else {
    return pokemonResults[currIndex];
  }
};

export const resetPokemonState = function () {
  pokemonState.offset = 0;
  pokemonState.results = [];
  pokemonState.hasMoreResults = true;
};
