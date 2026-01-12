import caughtState from './state/caughtState';
import { persistData } from '../helpers';
import { sortPokemon } from '../services/pokemonService';

import favoriteState from './state/favoriteState';
import { resetQueryState } from './queryModel';

// To retrieve Caught Pokémon (caughtState)
export const getCaughtPokemon = () => caughtState.caughtPokemon;

// To retrieve the types of Pokémon caught for the Profile module
export const getTypesPokemonCaught = () => caughtState.typesCaught;

export const getCaughtRender = () => caughtState.profile.render;

export const getCaughtSortBy = () => caughtState.profile.sortBy;

export const setCaughtRender = function (value) {
  caughtState.profile.render = value;
};

export const setCaughtSortBy = function (sort) {
  caughtState.profile.sortBy = sort;
};

// To load sorted Caught Pokémon (caughtState)
export const loadCaughtPokemon = async function () {
  resetQueryState();

  if (caughtState.caughtPokemon.length === 0) return [];

  const caughtPokemonPreviews = [];

  try {
    const caughtPokemon = sortPokemon(caughtState.caughtPokemon);

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
export const removeCaughtPokemon = function (pokemon) {
  pokemon.caught = false;

  const index = caughtState.caughtPokemon.findIndex(
    currPokemon => currPokemon.name === pokemon.name
  );

  caughtState.caughtPokemon.splice(index, 1);

  persistData('caughtPokemon', caughtState.caughtPokemon);
  updateTypesPokemonCaught();
};

const resetTypesPokemonCaught = function () {
  caughtState.typesCaught = {
    Normal: 0,
    Fire: 0,
    Water: 0,
    Electric: 0,
    Grass: 0,
    Ice: 0,
    Fighting: 0,
    Poison: 0,
    Ground: 0,
    Flying: 0,
    Psychic: 0,
    Bug: 0,
    Rock: 0,
    Ghost: 0,
    Dragon: 0,
    Dark: 0,
    Steel: 0,
    Fairy: 0,
  };
};

// To update the types of Pokémon caught for the Profile
export const updateTypesPokemonCaught = function () {
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
