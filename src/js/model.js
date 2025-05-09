import {
  MAIN_API_URL,
  DESC_API_URL,
  DETAILS_API_URL,
  MAIN_API_URL,
  POKEMON_NAMES_API_URL,
} from './config.js';
import { AJAX, capitalize } from './helpers.js';

export const state = {
  pokemon: {},
  pokemonNames: [],
  search: {
    query: '',
    results: [],
  },
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

storePokemonNames();

// To create a Pokémon object after parsing PokéAPI data
export const createPokemonObject = async function (data) {
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

  // Loaded from DESC_API_URL
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

// To load Pokémon details for the search panel [screen 2]
export const loadPokemon = async function (pokemon) {
  try {
    const data = await Promise.all([
      AJAX(`${MAIN_API_URL}${pokemon}`),
      AJAX(`${DESC_API_URL}${pokemon}`),
    ]);

    state.pokemon = await createPokemonObject(data);
  } catch (err) {
    throw err;
  }
};

// To load Pokémon previews in the search results screen [screen 1]
export const loadSearchResults = async function (query) {
  state.search.query = query;

  try {
    state.search.query = query;
    console.log(query);
    const data = await AJAX(`${MAIN_API_URL}${query}`);

    const {
      name,
      id,
      sprites: { front_default: img },
    } = data;

    state.search.results = [name, id, img];
  } catch (err) {
    throw err;
  }
};
