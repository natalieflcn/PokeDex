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
    queryResults: '',
    results: [],
    currentBatch: [], // For loading additional batches of Pokémon
    offset: 0,
    limit: LIMIT,
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
export const loadPokemonResults = async function () {
  try {
    state.loading = true;
    let pokemonNames;

    // Retrieving Pokémon Names -- If page is initially loading (prior to storing PokemonNames)
    if (!state.allPokemonNames.loaded) {
      const pokemon = await AJAX(
        `${DETAILS_API_URL}?limit=${state.search.limit}&offset=${0}`
      );
      pokemonNames = pokemon.results;
    } else {
      pokemonNames = state.allPokemonNames.slice(
        state.search.offset,
        state.search.offset + LIMIT
      );
    }

    for (const pokemon of pokemonNames) {
      const pokemonName = pokemon.name || pokemon;
      const pokemonDetails = await AJAX(`${MAIN_API_URL}${pokemonName}`);
      const pokemonPreview = createPokemonPreviewObject(
        pokemonName,
        pokemonDetails
      );
      state.search.results.push(pokemonPreview);
    }

    state.search.offset += LIMIT;
    state.loading = false;
  } catch (err) {
    throw err;
  }
};

// To load additional Pokémon results
export const loadAdditionalBatch = async function () {
  try {
    state.loading = true;
    state.search.currentBatch = [];

    const pokemonNames = state.allPokemonNames.slice(
      state.search.offset,
      state.search.offset + LIMIT
    );

    for (const pokemon of pokemonNames) {
      const pokemonDetails = await AJAX(`${MAIN_API_URL}${pokemon}`);
      const pokemonPreview = createPokemonPreviewObject(
        pokemon,
        pokemonDetails
      );
      state.search.currentBatch.push(pokemonPreview);
    }

    state.search.results.push(...state.search.currentBatch);

    state.search.offset += LIMIT;
    state.loading = false;
  } catch (err) {
    throw err;
  }
};

// To load Pokémon previews in the search results screen [screen 1]
export const loadQueryResults = async function (query) {
  state.loading = true;
  restartSearchResults();
  state.search.query = query;
  state.search.queryResults = possiblePokemon(query);

  const pokemonNames = state.search.queryResults.slice(
    state.search.offset,
    state.search.offset + LIMIT
  );

  for (const pokemon of pokemonNames) {
    try {
      const pokemonDetails = await AJAX(`${MAIN_API_URL}${pokemon}`);
      const pokemonPreview = createPokemonPreviewObject(
        pokemon,
        pokemonDetails
      );
      state.search.results.push(pokemonPreview);
    } catch (err) {
      console.error(err);
    }
  }

  state.search.offset += LIMIT;
  state.loading = false;
};

// To load additional query results
export const loadAdditionalQuery = async function () {
  state.loading = true;
  state.search.currentBatch = [];

  console.log(state.search.queryResults);
  const pokemonNames = state.search.queryResults.slice(
    state.search.offset,
    state.search.offset + LIMIT
  );

  for (const pokemon of pokemonNames) {
    try {
      const pokemonDetails = await AJAX(`${MAIN_API_URL}${pokemon}`);
      const pokemonPreview = createPokemonPreviewObject(
        pokemon,
        pokemonDetails
      );
      state.search.currentBatch.push(pokemonPreview);
    } catch (err) {
      console.error(err);
    }
    state.search.results.push(...state.search.currentBatch);
  }
  state.search.offset += LIMIT;
  state.loading = false;
};

// To load Pokémon details for the search panel [screen 2]
export const loadPokemon = async function (pokemon) {
  try {
    const data = await Promise.all([
      AJAX(`${MAIN_API_URL}${pokemon}`),
      AJAX(`${DETAILS_API_URL}${pokemon}`),
    ]);

    state.pokemon = await createPokemonObject(data);
  } catch (err) {
    console.error(err);
  }
};

const possiblePokemon = function (substring) {
  return state.allPokemonNames.filter(pokemon => pokemon.startsWith(substring));
};

export const restartSearchResults = function () {
  state.search.offset = 0;
  state.search.results = [];
  state.search.query = '';
  state.search.queryResults = '';
  console.log('clening search results');
};
