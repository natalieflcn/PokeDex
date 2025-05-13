import {
  MAIN_API_URL,
  DETAILS_API_URL,
  MOVE_TYPE_URL,
  POKEMON_NAMES_API_URL,
  LIMIT,
} from './config.js';

import { AJAX, capitalize } from './helpers.js';

export const state = {
  loading: false,
  allPokemonNames: {
    names: [],
    loaded: false,
  },
  search: {
    query: '',
    results: [],
    currentBatch: [], // For loading additional batches of Pokémon
    offset: 0,
    limit: LIMIT,
    initialBatchLoaded: false, // For loading the initial batch of Pokémon without query results
    hasMoreResults: true,
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
export const storeAllPokemonNames = async function () {
  const pokeAPIData = await AJAX(`${POKEMON_NAMES_API_URL}`);
  const { results } = pokeAPIData;
  const pokemonNames = results.map(pokemon => pokemon.name);

  state.allPokemonNames = pokemonNames;
  state.allPokemonNames.loaded = true;
};

// To create a Pokémon object after parsing PokéAPI data
const createPokemonObject = async function (data) {
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

  const moves = [];
  for (const move of data[0].moves.slice(13, 19)) {
    const moveType = await AJAX(`${MOVE_TYPE_URL}${move.move.name}`);
    moves.push([
      move.move.name
        .split('-')
        .map(word => capitalize(word))
        .join(' '),
      capitalize(moveType.type.name),
    ]);
  }

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

// SEARCH: Rendering search results and Pokémon panel details

// To load Pokémon details for the current batch rendered in search results [screen 1]
export const loadSearchResults = async function (offset, moreResults = false) {
  try {
    state.loading = true;
    let pokemonNames;

    // To start a clean slate of search results, if not loading sequential batches of results
    if (!moreResults) {
      state.search.results = [];
      state.search.offset = 0;
      state.initialBatchLoaded = false;
    }

    // Retrieving Pokémon Names -- If page is initially loading (prior to storing PokemonNames)
    if (!state.allPokemonNames.loaded) {
      const pokemon = await AJAX(
        `${DETAILS_API_URL}?limit=${state.search.limit}&offset=${offset}`
      );
      pokemonNames = pokemon.results;
    } else {
      pokemonNames = state.allPokemonNames.slice(
        state.search.offset,
        state.search.offset + LIMIT
      );
    }
    console.log(pokemonNames); //current batch names details

    state.currentBatch = [];
    console.log(state.currentBatch);

    for (const pokemon of pokemonNames) {
      const pokemonName = pokemon.name || pokemon;
      console.log('logging for loop of ' + pokemon);
      const pokemonDetails = await AJAX(`${MAIN_API_URL}${pokemonName}`);
      const pokemonPreview = createPokemonPreviewObject(
        pokemonName,
        pokemonDetails
      );
      state.search.results.push(pokemonPreview);
      state.search.currentBatch.push(pokemonPreview);
    }

    state.search.offset += LIMIT;
    console.log('offset is now ' + state.search.offset);

    state.loading = false;
    console.log(state.search.currentBatch);
    console.log(state.search.results);
    // Retrieving Pokémon Names -- Any default display after page loads (after storing PokemonNames) TODO
  } catch (err) {
    throw err;
  }
};

export const loadAdditionalBatch = async function (offset) {};

// To load Pokémon previews in the search results screen [screen 1] TODO Working on it
export const loadQueryResults = async function (query) {
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
    state.search.results = state.allPokemonNames;
    //console.log(state.search.results);
  } catch (err) {
    throw err;
  }
};

// export const endOfResults = function (pokemonNames) {
//   return state.search.limit + state.search.offset < pokemonNames.length;
// };

// To load Pokémon details for the search panel [screen 2]
export const loadPokemon = async function (pokemon) {
  try {
    const data = await Promise.all([
      AJAX(`${MAIN_API_URL}${pokemon}`),
      AJAX(`${DETAILS_API_URL}${pokemon}`),
    ]);

    state.pokemon = await createPokemonObject(data);
  } catch (err) {
    throw err;
  }
};
