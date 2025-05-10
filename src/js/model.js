import {
  MAIN_API_URL,
  DETAILS_API_URL,
  POKEMON_NAMES_API_URL,
  LIMIT,
} from './config.js';
import { AJAX, capitalize } from './helpers.js';

export const state = {
  pokemonNames: [],
  search: {
    query: '',
    results: [],
    offset: 0,
    limit: LIMIT,
  },
  pokemon: {},
  profile: {
    name: '',
    types: [],
  },
  favorites: [],
  caught: [],
};

// To store all Pokémon names in our state
export const storePokemonNames = async function () {
  const pokeAPIData = await AJAX(`${POKEMON_NAMES_API_URL}`);
  const { results } = pokeAPIData;
  const pokemonNames = results.map(pokemon => pokemon.name);

  state.pokemonNames = pokemonNames;
};

// To store 25 Pokémon (names, IDs, and imgs) in our state for initial/default resultsView
// export const storeAllPokemon = async function () {
//   const pokeAPIData = await AJAX(`${POKEMON_NAMES_API_URL}`);
//   const { results } = pokeAPIData;
//   const pokemonNames = results.map(pokemon => pokemon.name);

//   state.pokemonNames = pokemonNames;
// };

// To create a Pokémon object after parsing PokéAPI data
const createPokemonObject = function (data) {
  // Loaded from MAIN_API_URL
  const {
    name,
    id,
    sprites: { front_default: img },
    height,
    weight,
  } = data[0];

  const types = data[0].types.map(entry => capitalize(entry.type.name));
  const stats = data[0].stats.map(stat => [stat.stat.name, stat.base_stat]);
  const moves = data[0].moves.slice(0, 6).map(mov => {
    return mov.move.name
      .split('-')
      .map(word => capitalize(word))
      .join(' ');
  });

  // Loaded from DETAILS_API_URL
  const [{ flavor_text }] = data[1].flavor_text_entries;

  return {
    name: capitalize(name),
    id,
    img,
    types,
    desc: flavor_text,
    height,
    weight,
    stats,
    moves,
  };
};

// To create a Pokémon preview object after parsing PokéAPI data
const createPokemonPreviewObject = function (name, details) {
  const {
    id,
    sprites: { front_default: img },
  } = details;

  console.log(name, id, img);

  return {
    name: capitalize(name),
    id,
    img,
  };
};

// To load Pokémon details for the current batch rendered in search results [screen 1]
export const loadPokemonBatch = async function (
  offset = 0,
  initialPageLoad = false
) {
  try {
    state.search.results = [];

    // Retrieving Pokémon Names -- If page is initially loading (prior to storing PokemonNames)
    let currPokemon = 1;

    const pokemonNames = await AJAX(
      `${DETAILS_API_URL}?limit=${state.search.limit}&offset=${offset}`
    );

    for (const pokemon of pokemonNames.results) {
      const pokemonName = pokemon.name;
      const pokemonDetails = await AJAX(`${MAIN_API_URL}${pokemonName}`);
      state.search.results.push(
        createPokemonPreviewObject(pokemonName, pokemonDetails)
      );
    }

    // Retrieving Pokémon Names -- Any default display after page loads (after storing PokemonNames) TODO
  } catch (err) {
    throw err;
  }
};

loadPokemonBatch();
// To load Pokémon details for the search panel [screen 2]
export const loadPokemon = async function (pokemon) {
  try {
    const data = await Promise.all([
      AJAX(`${MAIN_API_URL}${pokemon}`),
      AJAX(`${DETAILS_API_URL}${pokemon}`),
    ]);

    state.pokemon = createPokemonObject(data);
  } catch (err) {
    throw err;
  }
};

// To load Pokémon previews in the search results screen [screen 1] TODO Working on it
export const loadSearchResults = async function (query, allPokemon = false) {
  state.search.query = query; //array of pokemon names, need to pull name out of array, ajax call, store data into array
  //console.log(query);

  try {
    //const data1 = await AJAX(`${MAIN_API_URL}${query}`);

    // if allPokemon is false, use helper method to determine search results array
    for (pokemon of query) {
      //const data = await AJAX(`${MAIN_API_URL}${pokemon}`);

      const {
        name,
        id,
        sprites: { front_default: img },
      } = data;

      state.search.results.push({ name, id, img });
    }
    state.search.results = state.pokemonNames;
    //console.log(state.search.results);
  } catch (err) {
    throw err;
  }
};
