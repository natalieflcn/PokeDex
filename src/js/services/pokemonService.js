/**
 * Pokémon Service
 * ---------------------
 * Responsible for filtering for queried Pokémon, fetching Pokémon data from PokéAPI resource, creating Pokémon objects, sorting Pokémon data, loading Pokémon batches, and determining pagination state of a Pokémon panel.
 * Encapsulates domain-level Pokémon operations shared across multiple models.
 *
 * This service does not own state or perform DOM manipulation.
 */

import { AJAX, capitalize } from '../helpers';
import { MAIN_API_URL } from '../config';

/**
 * ======================
 * Type Definitions
 * ======================
 */

/**
 * A raw Pokémon reference stored in state.
 *
 * @typedef {Object} Pokemon
 * @property {string} name - Pokémon name
 * @property {number} id - Pokémon ID
 */

/**
 * A promise that resolves to a Pokémon Preview object.
 *
 * @typedef {Promise<PokemonPreview>} PokemonPreviewRequest
 */

/**
 * A lightweight Pokémon object that is only used for grid previews in search results.
 *
 * @typedef {Object} PokemonPreview
 * @property {string} name - Pokémon name
 * @property {number} id - Pokémon ID
 * @property {string} [img] - Pokémon image URL
 */

/**
 * ========================
 * Pokémon Service Methods
 * ========================
 */

/**
 * Filters Pokémon data for Pokémon that begins with the specified substring (for queries)
 *
 * @param {string} substring - Query derived from user input
 * @param {Pokemon[]} pokemonSet - Pokémon dataset (All Pokémon, Caught Pokémon, or Favorite Pokémon)
 */
export const possiblePokemon = function (substring, pokemonSet) {
  return pokemonSet.filter(pokemon =>
    capitalize(pokemon.name).startsWith(capitalize(substring))
  );
};

// Fetching Pokémon data from https://pokeapi.co/api/v2/pokemon/
const fetchPokemon = async function (pokemonName) {
  return await AJAX(`${MAIN_API_URL}${pokemonName}`);
};

// Creating a PokemonPreview object after parsing PokéAPI data
const createPokemonPreviewObject = function (name, details) {
  const {
    id,
    sprites: { front_default: img },
  } = details;

  return {
    name: capitalize(name),
    id,
    img,
  };
};

/**
 * Loads Pokémon details for the next batch of Pokémon in the specified set. Maps each Pokémon into an array of PokemonPreview objects to be created.
 *
 * @param {Pokemon[]} pokemonSet - Pokémon dataset (All Pokémon, Caught Pokémon, or Favorite Pokémon)
 * @returns {PokemonPreviewRequest[]}
 */
export const loadBatch = function (pokemonBatch) {
  const pokemonBatchDetails = pokemonBatch.map(pokemon => {
    const pokemonName = pokemon.name || pokemon;

    return fetchPokemon(pokemonName)
      .then(pokemonDetails =>
        createPokemonPreviewObject(pokemonName, pokemonDetails)
      )
      .catch(err => {
        console.error(`Failed to load Pokémon: ${pokemonName}`, err);
        return null;
      });
  });

  return pokemonBatchDetails;
};

/**
 * Receives an array of promises (PokemonPreviewRequests) and runs them concurrently to avoid race conditions.
 *
 * @param {PokemonPreviewRequest[]} pokemonRequests - An array of promises to create PokemonPreview objects
 */
export const loadPokemonPreviews = async pokemonRequests => {
  return await Promise.all(pokemonRequests);
};

/**
 * Receives an array of PokemonPreview objects and filters out invalid (null) objects.
 *
 * @param {PokemonPreview[]} pokemonPreviews - An array of PokemonPreview objects
 */
export const filterPokemonPreviews = pokemonPreviews =>
  pokemonPreviews.filter(Boolean);

/**
 * Sorts the specified Pokémon set according to the sort search parameters defined in the URL.
 *
 * @param {Pokemon[]} pokemon - An array of Pokémon to be sorted
 */
export const sortPokemon = function (pokemon) {
  let sortedPokemon;

  const sortParam = new URL(window.location.href).searchParams.get('sort');

  if (sortParam === 'name') {
    sortedPokemon = pokemon.toSorted((a, b) => a.name.localeCompare(b.name));
  } else {
    sortedPokemon = pokemon.toSorted((a, b) => a.id - b.id);
  }

  return sortedPokemon;
};

/**
 * Determines the pagination state for the Pokémon being displayed in the Pokémon panel of the Search module.
 *
 * @param {string} pokemonName - Name of the current Pokemon
 * @param {Pokemon[]} pokemonResults - Pokémon batch that is being examined (pokemonState or queryState)
 * @param {boolean} loadMoreResults - An indicator of whether there is a subsequent batch of Pokémon to be loaded
 */
export const getPokemonPagination = function (
  pokemonName,
  pokemonResults,
  loadMoreResults
) {
  let prev = true,
    next = true;

  const currIndex = pokemonResults.findIndex(
    currPokemon => currPokemon.name === pokemonName
  );

  if (currIndex === 0) prev = false;
  if (currIndex === pokemonResults.length - 1 && !loadMoreResults) next = false;

  return { prev, next };
};
