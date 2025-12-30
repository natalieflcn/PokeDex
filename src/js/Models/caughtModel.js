// refactor to load all caught pokemon

import {
  restartSearchResults,
  sortPokemonResults,
  updateCaughtPokemonTypes,
} from '../helpers';
import { persistData } from './pokemonModel';
import caughtState from './state/caughtState';
import favoriteState from './state/favoriteState';
import queryState from './state/queryState';

// To retrieve Caught Pokémon (caughtState) for mapController and profileController
export const getCaughtPokemon = () => caughtState.caughtPokemon;

export const loadCaughtPokemon = async function (
  requestId = queryState.currentQueryId
) {
  queryState.loading = true;
  console.log('loadPokemonResults running');
  restartSearchResults();
  let pokemonNames;

  try {
    pokemonNames = sortPokemonResults(caughtState.caughtPokemon);

    for (const pokemon of pokemonNames) {
      const { name, id, img } = pokemon;
      if (requestId !== queryState.currentQueryId) return;
      pokemonState.results.push({ name, id, img });
    }

    // if (state.search.mode === 'id') pokemonNames = sortPokemonID(pokemonNames);
    // else if (state.search.mode === 'name')
    //   pokemonNames = sortPokemonName(pokemonNames);

    if (requestId !== queryState.currentQueryId) return;
  } catch (err) {
    console.error(err);
  }

  queryState.loading = false;
};

// To store Pokémon details in Caught Pokémon (caughtState)
export const addCaughtPokemon = function (pokemon) {
  pokemon.caught = true;

  // Prevent adding duplicates, if already rendered from local storage
  if (caughtState.caughtPokemon.find(p => p.name === pokemon.name)) return;

  caughtState.caughtPokemon.push(pokemon);
  persistData('caught', caughtState.caughtPokemon);
  updateCaughtPokemonTypes();
};

// To remove Pokémon details from Caught Pokémon (caughtState)
export const removeCaughtPokemon = function (pokemon) {
  pokemon.caught = false;
  const index = caughtState.caughtPokemon.find(p => p.name === pokemon.name);
  caughtState.caughtPokemon.splice(index, 1);
  persistData('caught', caughtState.caughtPokemon);
  updateCaughtPokemonTypes();
};

// To check local storage and update Caught/Favorite Pokémon with persisted data
const init = function () {
  const storageCaught = localStorage.getItem('caught');
  if (storageCaught) caughtState.caughtPokemon = JSON.parse(storageCaught);
};

init();
