import { TIMEOUT_SEC } from './config.js';

import caughtState from './models/state/caughtState.js';
import pokemonState from './models/state/pokemonState.js';
import queryState from './models/state/queryState.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} seconds.`));
    }, s * 1000);
  });
};

// To consolidate fetching data and parsing the JSON response
export const AJAX = async function (url) {
  try {
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    return data;
  } catch (err) {
    throw err;
  }
};

// To capitalize a word
export const capitalize = function (word) {
  return word[0].toUpperCase().concat(word.slice(1));
};

// To debounce a function
export const debounce = function (func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId); // Clear previous timer
    timeoutId = setTimeout(() => {
      func.apply(this, args); // Call the function after delay
    }, delay);
  };
};

// To create a Pokémon preview object after parsing PokéAPI data
export const createPokemonPreviewObject = function (name, details) {
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

export const clearQueryInput = function () {
  queryState.offset = 0;
  queryState.queryResults = [];
  queryState.query = '';
  queryState.hasMoreResults = true;
};

// To sort Pokémon search results by name OR id -- for queries ONLY
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

// To find Pokémon that begin with the passed-in substring
export const possiblePokemon = function (substring, pokemonSet) {
  return pokemonSet.filter(pokemon =>
    capitalize(pokemon.name).startsWith(capitalize(substring))
  );
};

// To return sorted general Pokémon results by name
export const sortPokemonName = function (pokemonSet) {
  const names = pokemonSet.map(pokemon => pokemon.name);
  const sortedNames = names.sort((a, b) => a.localeCompare(b));

  console.log(sortedNames);
  return sortedNames;
};

// To return sorted general Pokémon results by ID
export const sortPokemonID = function (pokemonSet) {
  const ids = pokemonSet.map(pokemon => pokemon.id);
  const sortedIds = ids.sort((a, b) => a.id - b.id);

  console.log(sortedIds);
  return sortedIds;
};

// export const updateCaughtPokemonTypes = function () {
//   resetCaughtPokemonTypes();
//   const types = caughtState.caughtPokemon
//     .flatMap(pokemon => pokemon.types)
//     .forEach(type => caughtState.typesCaught[type]++);
// };

// To store Caught Pokémon and Favorite Pokémon in Local Storage
export const persistData = function (type, data) {
  localStorage.setItem(type, JSON.stringify(data));
};
