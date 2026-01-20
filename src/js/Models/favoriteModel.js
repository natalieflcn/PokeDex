/**
 * Favorite Pokémon Model
 * ---------------------
 * Manages Favorite Pokémon data and state (favorite Pokémon list, types caught, sort/render flags).
 * Handles state updates and persistence with local storage.
 *
 * Directly reads and modifies favoriteState.
 * Does not fetch external data or manipulate the DOM.
 */

import favoriteState from './state/favoriteState';
import { resetQueryState } from './queryModel';
import { sortPokemon } from '../services/pokemonService';
import { persistData } from '../helpers';

/**
 * ======================
 * Type Definitions
 * ======================
 */

/**
 * A Pokémon Preview object stored in state.
 *
 * @typedef {Object} Pokemon
 * @property {string} name - Pokémon name
 * @property {number} id - Pokémon ID
 * @property {string} [img] - Pokémon image
 */

/**
 * ======================
 * Favorite Model Functions
 * ======================
 */

export const getFavoritePokemon = () => favoriteState.favoritePokemon;

export const getFavoriteRender = () => favoriteState.profile.render;

export const getFavoriteSortBy = () => favoriteState.profile.sortBy;

// Sets render to 'true' or 'false' depending on active category
export const setFavoriteRender = value =>
  (favoriteState.profile.render = value);

// Sets sort value to 'name' or 'id' depending on value maintained in favoriteState
export const setFavoriteSortBy = sort => (favoriteState.profile.sortBy = sort);

// To load sorted Favorite Pokémon (favoriteState)
export const loadFavoritePokemon = async function () {
  resetQueryState();

  if (favoriteState.favoritePokemon.length === 0) return [];

  const favoritePokemonPreviews = [];

  try {
    const favoritePokemon = sortPokemon(favoriteState.favoritePokemon);

    for (const pokemon of favoritePokemon) {
      const { name, id, img } = pokemon;

      favoritePokemonPreviews.push({ name, id, img });
    }

    return favoritePokemonPreviews;
  } catch (err) {
    console.error(err);
  }
};

/**
 * To store Pokémon details in Favorite State and updates local storage
 *
 * @param {PokemonPreview} newPokemon - Pokémon being added to Favorite state
 */
export const addFavoritePokemon = function (newPokemon) {
  newPokemon.favorite = true;

  // Prevents user from adding duplicate Pokémon, if already rendered from local storage
  if (
    favoriteState.favoritePokemon.find(
      pokemon => pokemon.name === newPokemon.name
    )
  )
    return;

  favoriteState.favoritePokemon.push(newPokemon);
  persistData('favoritePokemon', favoriteState.favoritePokemon);
};

/**
 * To remove Pokémon details from Favorite State and updates local storage
 *
 * @param {PokemonPreview} pokemon - Pokémon being removed from Favorite state
 */
export const removeFavoritePokemon = function (pokemon) {
  pokemon.favorite = false;

  const index = favoriteState.favoritePokemon.findIndex(
    currPokemon => currPokemon.name === pokemon.name
  );

  favoriteState.favoritePokemon.splice(index, 1);

  persistData('favoritePokemon', favoriteState.favoritePokemon);
};

// To check local storage and update Favorite Pokémon (favoriteState) with persisted data
const init = function () {
  const storageFavoritePokemon = localStorage.getItem('favoritePokemon');

  if (storageFavoritePokemon)
    favoriteState.favoritePokemon = JSON.parse(storageFavoritePokemon);
};

init();
