import {
  DETAILS_API_URL,
  LIMIT,
  MAIN_API_URL,
  MOVE_TYPE_URL,
  POKEMON_NAMES_API_URL,
} from '../config';
import {
  AJAX,
  capitalize,
  createPokemonPreviewObject,
  sortPokemonName,
} from '../helpers';
import caughtState from './state/caughtState';
import favoriteState from './state/favoriteState';
import panelState from './state/panelState';
import pokemonState from './state/pokemonState';
import queryState from './state/queryState';

// To load Pokémon details for the current batch rendered in search results [screen 1]
export const loadPokemonResults = async function (
  requestId = queryState.currentQueryId
) {
  try {
    queryState.loading = true;

    // restartSearchResults();

    let pokemonNames;

    const currentURL = new URL(window.location.href);
    console.log(currentURL);

    // Retrieving Pokémon Names -- If page is initially loading (prior to storing PokemonNames)
    if (!pokemonState.loaded) {
      const pokemon = await AJAX(
        `${DETAILS_API_URL}?limit=${queryState.limit}&offset=${0}`
      );
      pokemonNames = pokemon.results;
    } else {
      if (
        currentURL.searchParams.get('sort') === 'id' ||
        !currentURL.searchParams.get('sort')
      ) {
        // Loading sorted by ID
        pokemonNames = pokemonState.allPokemon.slice(
          queryState.offset,
          queryState.offset + LIMIT
        );
      } else if (currentURL.searchParams.get('sort') === 'name') {
        // Loading sorted by Name
        pokemonNames = sortPokemonName(pokemonState.allPokemon).slice(
          queryState.offset,
          queryState.offset + LIMIT
        );
      }
    }

    for (const pokemon of pokemonNames) {
      try {
        const pokemonName = pokemon.name || pokemon;
        if (requestId !== queryState.currentQueryId) return;

        // console.log(pokemon);
        const pokemonDetails = await AJAX(`${MAIN_API_URL}${pokemonName}`);
        const pokemonPreview = createPokemonPreviewObject(
          pokemonName,
          pokemonDetails
        );

        if (requestId !== queryState.currentQueryId) return;
        pokemonState.results.push(pokemonPreview);
      } catch (err) {
        console.error(err);
      }
    }

    queryState.offset += LIMIT;
    queryState.loading = false;
  } catch (err) {
    throw err;
  }
};

// To load additional Pokémon results
export const loadAdditionalBatch = async function () {
  try {
    queryState.loading = true;
    queryState.currentBatch = [];
    let pokemonNames = [];

    const currentURL = window.location.href;

    if (
      currentURL.searchParams.get('sort') === 'id' ||
      !currentURL.searchParams.get('sort')
    ) {
      // Loading sorted by ID

      pokemonNames = pokemonState.allPokemon.slice(
        queryState.offset,
        queryState.offset + LIMIT
      );
    } else {
      // Loading sorted by Name
      pokemonNames = sortPokemonName(pokemonState.allPokemon).slice(
        queryState.offset,
        queryState.offset + LIMIT
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
        queryState.currentBatch.push(pokemonPreview);
      } catch (err) {
        console.error(err);
      }
    }

    pokemonState.results.push(...queryState.currentBatch);

    queryState.offset += LIMIT;
    queryState.loading = false;
  } catch (err) {
    throw err;
  }
};

// To store all Pokémon names in our state
export const storeAllPokemon = async function () {
  const pokeAPIData = await AJAX(`${POKEMON_NAMES_API_URL}`);
  const { results } = pokeAPIData;

  for (const result of results) {
    const pokemonName = result.name;
    const pokemonId = extractPokemonId(result.url);
    pokemonState.allPokemon.push({
      name: pokemonName,
      id: pokemonId,
    });
  }

  pokemonState.loaded = true;
};

// To extract IDs for all Pokemon
const extractPokemonId = function (url) {
  const id = url.match(/\/(\d+)\/?$/);
  return id ? Number(id[1]) : null;
};

// To store Caught Pokémon and Favorite Pokémon in Local Storage
export const persistData = function (type, data) {
  localStorage.setItem(type, JSON.stringify(data));
};
