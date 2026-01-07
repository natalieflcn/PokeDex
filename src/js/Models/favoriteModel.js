import favoriteState from './state/favoriteState';
import { persistData } from '../helpers';
import { sortPokemon } from '../services/pokemonService';
import { clearQueryInput } from './queryModel';

// To retrieve Favorite Pokémon (favoriteState)
export const getFavoritePokemon = () => favoriteState.favoritePokemon;

// To load sorted Favorite Pokémon (favoriteState)
export const loadFavoritePokemon = async function () {
  clearQueryInput();

  console.log(favoriteState.favoritePokemon);
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
