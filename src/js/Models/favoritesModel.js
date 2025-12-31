import favoriteState from './state/favoriteState';
import { clearQueryInput, persistData, sortPokemonResults } from '../helpers';

// To export Favorite Pokémon for Profile View
export const getFavoritePokemon = () => favoriteState.favoritePokemon;

// To load sorted Favorite Pokémon (favoriteState) for profileController
export const loadFavoritePokemon = async function () {
  clearQueryInput();

  console.log(favoriteState.favoritePokemon);
  if (favoriteState.favoritePokemon.length === 0) return [];

  const favoritePokemonPreviews = [];

  try {
    const favoritePokemon = sortPokemonResults(favoriteState.favoritePokemon);

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
export const removeFavoritePokemon = function (newPokemon) {
  newPokemon.favorite = false;

  const index = favoriteState.favoritePokemon.find(
    pokemon => pokemon.name === newPokemon.name
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
