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
import pokemonState from './state/pokemonState.js';
import caughtState from './state/caughtState.js';
import favoritesState from './state/favoritesState.js';
import searchState from './state/searchState.js';

// To store all Pokémon names in our state
export const storeAllPokemon = async function () {
  const pokeAPIData = await AJAX(`${POKEMON_NAMES_API_URL}`);
  const { results } = pokeAPIData;

  for (const result of results) {
    const pokemonName = result.name;
    const pokemonId = extractPokemonId(result.url);
    pokemonState.allPokemon.pokemonDB.push({
      name: pokemonName,
      id: pokemonId,
    });
  }

  pokemonState.allPokemon.pokemonDB.loaded = true;
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

  // Properties created from Caught and Favorites in state
  const caught = caughtState.caught.some(p => p.id === id) ? true : false;
  const favorite = favoritesState.favorites.some(p => p.id === id)
    ? true
    : false;

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
  requestId = searchState.currentRequestId
) {
  try {
    searchState.loading = true;

    // restartSearchResults();

    let pokemonNames;

    // Retrieving Pokémon Names -- If page is initially loading (prior to storing PokemonNames)
    if (!pokemonState.allPokemon.pokemonDB.loaded) {
      const pokemon = await AJAX(
        `${DETAILS_API_URL}?limit=${searchState.limit}&offset=${0}`
      );
      pokemonNames = pokemon.results;
    } else {
      if (searchState.mode === 'id') {
        // Loading sorted by ID
        pokemonNames = pokemonState.allPokemon.pokemonDB.slice(
          searchState.offset,
          searchState.offset + LIMIT
        );
      } else {
        // Loading sorted by Name
        pokemonNames = sortPokemonName(pokemonState.allPokemon.pokemonDB).slice(
          searchState.offset,
          searchState.offset + LIMIT
        );
      }
    }

    for (const pokemon of pokemonNames) {
      try {
        const pokemonName = pokemon.name || pokemon;
        if (requestId !== searchState.currentRequestId) return;
        const pokemonDetails = await AJAX(`${MAIN_API_URL}${pokemonName}`);
        const pokemonPreview = createPokemonPreviewObject(
          pokemonName,
          pokemonDetails
        );

        if (requestId !== searchState.currentRequestId) return;
        searchState.results.push(pokemonPreview);
      } catch (err) {
        console.error(err);
      }
    }

    searchState.offset += LIMIT;
    searchState.loading = false;
  } catch (err) {
    throw err;
  }
};

// To load additional Pokémon results
export const loadAdditionalBatch = async function () {
  try {
    searchState.loading = true;
    searchState.currentBatch = [];
    let pokemonNames = [];

    if (searchState.mode === 'id') {
      // Loading sorted by ID

      pokemonNames = pokemonState.allPokemon.pokemonDB.slice(
        searchState.offset,
        searchState.offset + LIMIT
      );
    } else {
      // Loading sorted by Name
      pokemonNames = sortPokemonName(pokemonState.allPokemon.pokemonDB).slice(
        searchState.offset,
        searchState.offset + LIMIT
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
        searchState.currentBatch.push(pokemonPreview);
      } catch (err) {
        console.error(err);
      }
    }

    searchState.results.push(...searchState.currentBatch);

    searchState.offset += LIMIT;
    searchState.loading = false;
  } catch (err) {
    throw err;
  }
};

// To load Pokémon previews in the search results screen [screen 1]
export const loadQueryResults = async function (query, requestId) {
  searchState.loading = true;
  restartSearchResults();
  searchState.query = query;
  searchState.queryResults = possiblePokemon(
    query,
    pokemonState.allPokemon.pokemonDB
  );

  const sorted = sortPokemonResults(searchState.queryResults);

  const pokemonNames = searchState.queryResults.slice(
    searchState.offset,
    searchState.offset + LIMIT
  );

  for (const pokemon of pokemonNames) {
    try {
      if (requestId !== searchState.currentRequestId) return;
      const pokemonDetails = await AJAX(`${MAIN_API_URL}${pokemon.name}`);
      const pokemonPreview = createPokemonPreviewObject(
        pokemon.name,
        pokemonDetails
      );

      //   if(!pokemonPreview.id || pokemonPreview.img) return;
      if (requestId !== searchState.currentRequestId) return;
      searchState.results.push(pokemonPreview);
    } catch (err) {
      console.error(err);
    }
  }

  //   sortSearchResults(state.search.mode);
  searchState.offset += LIMIT;
  searchState.loading = false;
};

// To load additional query results
export const loadAdditionalQuery = async function (requestId) {
  searchState.loading = true;
  searchState.currentBatch = [];

  const pokemonNames = searchState.queryResults.slice(
    searchState.offset,
    searchState.offset + LIMIT
  );

  for (const pokemon of pokemonNames) {
    try {
      const pokemonDetails = await AJAX(`${MAIN_API_URL}${pokemon.name}`);
      const pokemonPreview = createPokemonPreviewObject(
        pokemon.name,
        pokemonDetails
      );
      searchState.currentBatch.push(pokemonPreview);
    } catch (err) {
      console.error(err);
    }
  }
  searchState.results.push(...searchState.currentBatch);
  searchState.offset += LIMIT;
  searchState.loading = false;
};

// To load Pokémon details for the search panel [screen 2]
export const loadPokemon = async function (pokemon) {
  try {
    const data = await Promise.all([
      AJAX(`${MAIN_API_URL}${pokemon}`),
      AJAX(`${DETAILS_API_URL}${pokemon}`),
    ]);

    pokemonState.pokemon = await createPokemonObject(data);
  } catch (err) {
    console.error(err);
  }
};

// To store Pokémon details in Caught Pokémon
export const addCaughtPokemon = function (pokemon) {
  pokemon.caught = true;

  // Prevent adding duplicates, if already rendered from local storage
  if (caughtState.caught.find(p => p.name === pokemon.name)) return;

  caughtState.caught.push(pokemon);
  persistData('caught', caughtState.caught);
  updateCaughtPokemonTypes();
};

export const removeCaughtPokemon = function (pokemon) {
  pokemon.caught = false;
  const index = caughtState.caught.find(p => p.name === pokemon.name);
  caughtState.caught.splice(index, 1);
  persistData('caught', caughtState.caught);
  updateCaughtPokemonTypes();
};

// To store Pokémon details in Favorite Pokémon
export const addFavoritePokemon = function (pokemon) {
  pokemon.favorite = true;

  // Prevent adding duplicates, if already rendered from local storage
  if (favoritesState.favorites.find(p => p.name === pokemon.name)) return;

  favoritesState.favorites.push(pokemon);
  console.log(`favorites state is now ${favoritesState.favorites}`);
  persistData('favorites', favoritesState.favorites);
};

export const removeFavoritePokemon = function (pokemon) {
  pokemon.favorite = false;
  const index = favoritesState.favorites.find(p => p.name === pokemon.name);
  favoritesState.favorites.splice(index, 1);
  persistData('favorites', favoritesState.favorites);
};

// Search -- HELPER METHODS

// To clear search results

// To extract IDs for all Pokemon
const extractPokemonId = function (url) {
  const id = url.match(/\/(\d+)\/?$/);
  return id ? Number(id[1]) : null;
};

// To export Caught Pokémon for Map and Profile View
export const getCaughtPokemon = () => caughtState.caught;

// To export Favorite Pokémon for Profile View
export const getFavoritePokemon = () => favoritesState.favorites;
// To store Caught Pokémon and Favorite Pokémon in Local Storage
const persistData = function (type, data) {
  localStorage.setItem(type, JSON.stringify(data));
};

// To check local storage and update Caught/Favorite Pokémon with persisted data
const init = function () {
  const storageCaught = localStorage.getItem('caught');
  if (storageCaught) caughtState.caught = JSON.parse(storageCaught);

  const storageFavorites = localStorage.getItem('favorites');
  if (storageCaught) favoritesState.favorites = JSON.parse(storageFavorites);
};
init();
