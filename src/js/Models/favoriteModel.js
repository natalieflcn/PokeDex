import favoriteState from './state/favoriteState';
import { persistData } from '../helpers';
import { sortPokemon } from '../services/pokemonService';
import { resetQueryState } from './queryModel';

// To retrieve Favorite Pokémon (favoriteState)
export const getFavoritePokemon = () => favoriteState.favoritePokemon;

export const getFavoriteRender = () => favoriteState.profile.render;

export const getFavoriteSortBy = () => favoriteState.profile.sortBy;

export const setFavoriteRender = function (value) {
  favoriteState.profile.render = value;
};

export const setFavoriteSortBy = function (sort) {
  favoriteState.profile.sortBy = sort;
};

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

    console.log(favoriteState.favoritePokemon);
    return favoritePokemonPreviews;
  } catch (err) {
    console.error(err);
  }
};

// To store Pokémon details in Favorite Pokémon (favoriteState)
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

// To remove Pokémon details from Favorite Pokémon (favoriteState)
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
