import {
  MAIN_API_URL,
  DETAILS_API_URL,
  MOVE_TYPE_URL,
  POKEMON_NAMES_API_URL,
  LIMIT,
} from '../config.js';

import { AJAX, capitalize } from '../helpers.js';

// TODO Change this file to searchModel.js, implement models for other views (Map and Profile)

export const state = {
  loading: false,
  allPokemon: {
    pokemonDB: [],
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
    currentRequestId: 0,
    mode: 'id',
  },
  pokemon: {},
  favorites: [],
  caught: [],
};

// To store all Pokémon names in our state
export const storeAllPokemon = async function () {
  const pokeAPIData = await AJAX(`${POKEMON_NAMES_API_URL}`);
  const { results } = pokeAPIData;

  console.log(results);
  for (const result of results) {
    const pokemonName = result.name;
    const pokemonId = extractPokemonId(result.url);
    state.allPokemon.pokemonDB.push({ name: pokemonName, id: pokemonId });
  }

  state.allPokemon.pokemonDB.loaded = true;

  console.log(state.allPokemon.pokemonDB);
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

  // Properties created from Caught and Favorites in state
  const caught = state.caught.some(p => p.id === id) ? true : false;
  const favorite = state.favorites.some(p => p.id === id) ? true : false;

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
    caught,
    favorite,
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
export const loadPokemonResults = async function (
  requestId = state.currentRequestId
) {
  try {
    state.loading = true;

    // restartSearchResults();

    let pokemonNames;

    // Retrieving Pokémon Names -- If page is initially loading (prior to storing PokemonNames)
    if (!state.allPokemon.pokemonDB.loaded) {
      const pokemon = await AJAX(
        `${DETAILS_API_URL}?limit=${state.search.limit}&offset=${0}`
      );
      pokemonNames = pokemon.results;
    } else {
      if (state.search.mode === 'id') {
        // Loading sorted by ID

        console.log('loading sorted by id running');
        pokemonNames = state.allPokemon.pokemonDB.slice(
          state.search.offset,
          state.search.offset + LIMIT
        );
      } else {
        console.log('loading sorte dby name running');
        // Loading sorted by Name
        pokemonNames = sortPokemonName().slice(
          state.search.offset,
          state.search.offset + LIMIT
        );
      }
    }

    for (const pokemon of pokemonNames) {
      try {
        const pokemonName = pokemon.name || pokemon;
        if (requestId !== state.search.currentRequestId) return;
        const pokemonDetails = await AJAX(`${MAIN_API_URL}${pokemonName}`);
        const pokemonPreview = createPokemonPreviewObject(
          pokemonName,
          pokemonDetails
        );

        if (requestId !== state.search.currentRequestId) return;
        state.search.results.push(pokemonPreview);
      } catch (err) {
        console.error(err);
      }
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
    let pokemonNames = [];

    if (state.search.mode === 'id') {
      // Loading sorted by ID
      console.log('loading sorted by id running');
      pokemonNames = state.allPokemon.pokemonDB.slice(
        state.search.offset,
        state.search.offset + LIMIT
      );
    } else {
      console.log('loading sorte dby name running');
      // Loading sorted by Name
      pokemonNames = sortPokemonName().slice(
        state.search.offset,
        state.search.offset + LIMIT
      );
    }

    for (const pokemon of pokemonNames) {
      try {
        const pokemonName = pokemon.name || pokemon;
        const pokemonDetails = await AJAX(`${MAIN_API_URL}${pokemonName}`);
        const pokemonPreview = createPokemonPreviewObject(
          pokemonName,
          pokemonDetails
        );
        state.search.currentBatch.push(pokemonPreview);
      } catch (err) {
        console.error(err);
      }
    }

    state.search.results.push(...state.search.currentBatch);

    state.search.offset += LIMIT;
    state.loading = false;
  } catch (err) {
    throw err;
  }
};

// To load Pokémon previews in the search results screen [screen 1]
export const loadQueryResults = async function (query, requestId) {
  state.loading = true;
  restartSearchResults();
  state.search.query = query;
  state.search.queryResults = possiblePokemon(query);

  const sorted = sortQueryResults();
  console.log(sorted);
  const pokemonNames = state.search.queryResults.slice(
    state.search.offset,
    state.search.offset + LIMIT
  );

  console.log(pokemonNames);
  for (const pokemon of pokemonNames) {
    try {
      if (requestId !== state.search.currentRequestId) return;
      const pokemonDetails = await AJAX(`${MAIN_API_URL}${pokemon.name}`);
      const pokemonPreview = createPokemonPreviewObject(
        pokemon.name,
        pokemonDetails
      );
      console.log(pokemonPreview);

      //   if(!pokemonPreview.id || pokemonPreview.img) return;
      if (requestId !== state.search.currentRequestId) return;
      state.search.results.push(pokemonPreview);
    } catch (err) {
      console.error(err);
    }
  }

  //   sortSearchResults(state.search.mode);
  state.search.offset += LIMIT;
  state.loading = false;
};

// To load additional query results
export const loadAdditionalQuery = async function (requestId) {
  state.loading = true;
  state.search.currentBatch = [];

  console.log(state.search.queryResults);
  const pokemonNames = state.search.queryResults.slice(
    state.search.offset,
    state.search.offset + LIMIT
  );

  for (const pokemon of pokemonNames) {
    try {
      const pokemonDetails = await AJAX(`${MAIN_API_URL}${pokemon.name}`);
      const pokemonPreview = createPokemonPreviewObject(
        pokemon.name,
        pokemonDetails
      );
      state.search.currentBatch.push(pokemonPreview);
    } catch (err) {
      console.error(err);
    }
  }
  state.search.results.push(...state.search.currentBatch);
  state.search.offset += LIMIT;
  state.loading = false;
};

// To sort Pokémon search results by name OR id -- for queries ONLY
export const sortQueryResults = async function () {
  let sort;
  // Sorting the Pokémon results
  if (state.search.mode === 'name') {
    // Sorting my name

    sort = state.search.queryResults.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  } else if (state.search.mode === 'id') {
    // Sorting by ID
    sort = state.search.queryResults.sort((a, b) => a.id - b.id);
  }
  console.log(sort);
  return sort;
};

// To return sorted general Pokémon results by name
export const sortPokemonName = function () {
  const names = state.allPokemon.pokemonDB.map(p => p.name);
  const sortedNames = names.sort((a, b) => a.localeCompare(b));
  return sortedNames;
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

// To store Pokémon details in Caught Pokémon
export const addCaughtPokemon = function (pokemon) {
  pokemon.caught = true;
  state.caught.push(pokemon);
  persistData('caught', state.caught);
};

export const removeCaughtPokemon = function (pokemon) {
  pokemon.caught = false;
  const index = state.caught.find(p => p.name === pokemon.name);
  state.caught.splice(index, 1);
  persistData('caught', state.caught);
};

// To store Pokémon details in Favorite Pokémon
export const addFavoritePokemon = function (pokemon) {
  pokemon.favorite = true;
  state.favorites.push(pokemon);
  persistData('favorites', state.favorites);
};

export const removeFavoritePokemon = function (pokemon) {
  pokemon.favorite = false;
  const index = state.favorites.find(p => p.name === pokemon.name);
  state.favorites.splice(index, 1);
  persistData('favorites', state.favorites);
};

// Search -- HELPER METHODS

// To clear search results
export const restartSearchResults = function () {
  state.search.offset = 0;
  state.search.results = [];
  state.search.query = '';
  state.search.queryResults = '';
  state.search.hasMoreResults = true;
};

// To find Pokémon that begin with the passed-in substring
const possiblePokemon = function (substring) {
  return state.allPokemon.pokemonDB.filter(pokemon =>
    pokemon.name.startsWith(substring)
  );
};

// To extract IDs for all Pokemon
const extractPokemonId = function (url) {
  const id = url.match(/\/(\d+)\/?$/);
  return id ? Number(id[1]) : null;
};

// To export Caught Pokémon for Map and Profile View
export const getCaughtPokemon = () => state.caught;

// To export Favorite Pokémon for Profile View
export const getFavoritePokemon = () => state.favorites;
// To store Caught Pokémon and Favorite Pokémon in Local Storage
const persistData = function (type, data) {
  localStorage.setItem(type, JSON.stringify(data));
};

// To check local storage and update Caught/Favorite Pokémon with persisted data
const init = function () {
  const storageCaught = localStorage.getItem('caught');
  if (storageCaught) state.caught = JSON.parse(storageCaught);

  const storageFavorites = localStorage.getItem('favorites');
  if (storageCaught) state.favorites = JSON.parse(storageFavorites);
};
init();
