// refactor to load all favorites pokemon

import { persistData } from './pokemonModel';
import favoriteState from './state/favoriteState';

export const loadPokemonResults = async function (
  requestId = queryState.currentRequestId
) {
  queryState.loading = true;
  console.log('loadPokemonResults running');
  restartSearchResults();
  let pokemonNames;

  try {
    if (queryState.view === 'caught') {
      pokemonNames = sortPokemonResults(caughtState.caughtPokemon);
    } else if (queryState.view === 'favorites') {
      pokemonNames = sortPokemonResults(favoriteState.favoritePokemon);
    }

    for (const pokemon of pokemonNames) {
      const { name, id, img } = pokemon;
      if (requestId !== queryState.currentRequestId) return;
      queryState.results.push({ name, id, img });
    }

    // if (state.search.mode === 'id') pokemonNames = sortPokemonID(pokemonNames);
    // else if (state.search.mode === 'name')
    //   pokemonNames = sortPokemonName(pokemonNames);

    if (requestId !== queryState.currentRequestId) return;
  } catch (err) {
    console.error(err);
  }

  queryState.loading = false;
};

// To store Pokémon details in Favorite Pokémon
export const addFavoritePokemon = function (pokemon) {
  pokemon.favorite = true;

  // Prevent adding duplicates, if already rendered from local storage
  if (favoriteState.favoritePokemon.find(p => p.name === pokemon.name)) return;

  favoriteState.favoritePokemon.push(pokemon);
  for (const pokemon of favoriteState.favoritePokemon) {
    console.log(pokemon);
  }
  console.log(favoriteState.favoritePokemon.length);
  persistData('favorites', favoriteState.favoritePokemon);
};

export const removeFavoritePokemon = function (pokemon) {
  pokemon.favorite = false;
  const index = favoriteState.favoritePokemon.find(
    p => p.name === pokemon.name
  );
  favoriteState.favoritePokemon.splice(index, 1);
  persistData('favorites', favoriteState.favoritePokemon);
};

// To export Favorite Pokémon for Profile View
export const getFavoritePokemon = () => favoriteState.favoritePokemon;

// To check local storage and update Caught/Favorite Pokémon with persisted data
const init = function () {
  const storageFavorites = localStorage.getItem('favorites');
  if (storageFavorites)
    favoriteState.favoritePokemon = JSON.parse(storageFavorites);
};
init();
