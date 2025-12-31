import caughtState from './state/caughtState';
import { clearQueryInput, persistData, sortPokemonResults } from '../helpers';
import { resetTypesPokemonCaught } from '../services/caughtService';

// To retrieve Caught Pokémon (caughtState) for mapController and profileController
export const getCaughtPokemon = () => caughtState.caughtPokemon;

// To load sorted Caught Pokémon (caughtState) for profileController
export const loadCaughtPokemon = async function () {
  clearQueryInput();

  if (caughtState.caughtPokemon.length === 0) return [];

  const caughtPokemonPreviews = [];

  try {
    const caughtPokemon = sortPokemonResults(caughtState.caughtPokemon);

    for (const pokemon of caughtPokemon) {
      const { name, id, img } = pokemon;
      caughtPokemonPreviews.push({ name, id, img });
    }

    return caughtPokemonPreviews;
  } catch (err) {
    console.error(err);
  }
};

// To store Pokémon details in Caught Pokémon (caughtState)
export const addCaughtPokemon = function (newPokemon) {
  newPokemon.caught = true;

  // Prevents user from adding duplicate Pokémon, if already rendered from local storage
  if (
    caughtState.caughtPokemon.find(pokemon => pokemon.name === newPokemon.name)
  )
    return;

  caughtState.caughtPokemon.push(newPokemon);
  persistData('caughtPokemon', caughtState.caughtPokemon);
  updateTypesPokemonCaught();
};

// To remove Pokémon details from Caught Pokémon (caughtState)
export const removeCaughtPokemon = function (newPokemon) {
  newPokemon.caught = false;

  const index = caughtState.caughtPokemon.find(
    pokemon => pokemon.name === newPokemon.name
  );

  caughtState.caughtPokemon.splice(index, 1);
  persistData('caughtPokemon', caughtState.caughtPokemon);
  updateTypesPokemonCaught();
};

// To update the types of Pokémon caught for the Profile
const updateTypesPokemonCaught = function () {
  resetTypesPokemonCaught();

  caughtState.caughtPokemon
    .flatMap(pokemon => pokemon.types)
    .forEach(type => caughtState.typesCaught[type]++);
};

// To check local storage upon initial load and update Caught Pokémon (caughtState) with persisted data
const init = function () {
  const storageCaughtPokemon = localStorage.getItem('caughtPokemon');

  if (storageCaughtPokemon)
    caughtState.caughtPokemon = JSON.parse(storageCaughtPokemon);
};

init();
