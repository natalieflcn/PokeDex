import { state } from './state.js';
import {
  MAIN_API_URL,
  DETAILS_API_URL,
  MOVE_TYPE_URL,
  POKEMON_NAMES_API_URL,
  LIMIT,
} from '../config.js';
import {
  AJAX,
  capitalize,
  createPokemonPreviewObject,
  restartSearchResults,
  sortPokemonResults,
  possiblePokemon,
  sortPokemonName,
  updateCaughtPokemonTypes,
} from '../helpers.js';

// To store all Pokémon names in our state
export const storeAllPokemon = async function () {
  const pokeAPIData = await AJAX(`${POKEMON_NAMES_API_URL}`);
  const { results } = pokeAPIData;

  for (const result of results) {
    const pokemonName = result.name;
    const pokemonId = extractPokemonId(result.url);
    state.allPokemon.pokemonDB.push({ name: pokemonName, id: pokemonId });
  }

  state.allPokemon.pokemonDB.loaded = true;
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
  const eng = data[1].flavor_text_entries.find(
    entry => entry.language.name === 'en'
  );
  const flavor_text = eng?.flavor_text || data[1].flavor_text;
  // find eng flav text

  console.log(data[1].flavor_text_entries);
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

// SEARCH: Rendering search results and Pokémon panel details

// To load Pokémon details for the current batch rendered in search results [screen 1]
export const loadPokemonResults = async function (
  requestId = state.search.currentRequestId
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
        pokemonNames = state.allPokemon.pokemonDB.slice(
          state.search.offset,
          state.search.offset + LIMIT
        );
      } else {
        console.log('loading sorte dby name running');
        // Loading sorted by Name
        pokemonNames = sortPokemonName(state.allPokemon.pokemonDB).slice(
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
      pokemonNames = sortPokemonName(state.allPokemon.pokemonDB).slice(
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
  state.search.queryResults = possiblePokemon(
    query,
    state.allPokemon.pokemonDB
  );

  console.log(state.allPokemon.pokemonDB);

  const sorted = sortPokemonResults(state.search.queryResults);
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

  // Prevent adding duplicates, if already rendered from local storage
  if (state.caught.find(p => p.name === pokemon.name)) return;

  state.caught.push(pokemon);
  persistData('caught', state.caught);
  updateCaughtPokemonTypes();
};

export const removeCaughtPokemon = function (pokemon) {
  pokemon.caught = false;
  const index = state.caught.find(p => p.name === pokemon.name);
  state.caught.splice(index, 1);
  persistData('caught', state.caught);
  updateCaughtPokemonTypes();
};

// To store Pokémon details in Favorite Pokémon
export const addFavoritePokemon = function (pokemon) {
  pokemon.favorite = true;

  // Prevent adding duplicates, if already rendered from local storage
  if (state.favorites.find(p => p.name === pokemon.name)) return;

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
