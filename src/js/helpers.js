import { TIMEOUT_SEC } from './config.js';
import { state } from './Models/state.js';

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

// To observe a sentinel with IntersectionObserverAPI
export const observeSentinel = function (sentinel, handler, options) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(
      entry => {
        if (entry.isIntersecting) handler();
      },
      {
        root: options.root,
        threshold: options.threshold,
        rootMargin: options.rootMargin,
      }
    );
  });

  observer.observe(sentinel);

  return observer;
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

export const restartSearchResults = function () {
  state.search.offset = 0;
  state.search.results = [];
  state.search.query = '';
  state.search.queryResults = '';
  state.search.hasMoreResults = true;
};

// To sort Pokémon search results by name OR id -- for queries ONLY
export const sortPokemonResults = function (pokemonSet) {
  let sort;
  console.log(state.search.queryResults);

  // Sorting the Pokémon results
  if (state.search.mode === 'name') {
    // Sorting my name

    sort = pokemonSet.sort((a, b) => a.name.localeCompare(b.name));
  } else if (state.search.mode === 'id') {
    // Sorting by ID
    sort = pokemonSet.sort((a, b) => a.id - b.id);
  }
  console.log(sort);
  return sort;
};

// To find Pokémon that begin with the passed-in substring
export const possiblePokemon = function (substring, pokemonSet) {
  return pokemonSet.filter(pokemon =>
    capitalize(pokemon.name).startsWith(capitalize(substring))
  );
};

// To return sorted general Pokémon results by name
export const sortPokemonName = function (pokemonSet) {
  const names = pokemonSet.map(p => p.name);
  const sortedNames = names.sort((a, b) => a.localeCompare(b));
  return sortedNames;
};

// To return sorted general Pokémon results by ID
export const sortPokemonID = function (pokemonSet) {
  const ids = pokemonSet.map(p => p.id);
  const sortedIds = ids.sort((a, b) => a.id - b.id);
  return sortedIds;
};
