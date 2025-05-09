import { BASIC_API_URL, DESC_API_URL, DETAILS_API_URL } from './config';

export const state = {
  pokemon: {},
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

// To create a Pokemon object after parsing PokeAPI data
export const createPokemonObject = async function (data) {
  // Loaded from Basic API URL
  const {
    name,
    id,
    sprites: { front_default: img },
  } = data[0];
  const types = data[0].types.map(entry => entry.type.name);

  // Loaded from Desc API URL
  const [{ flavor_text }] = data[1].flavor_text_entries;

  // Loaded from Details API URL
  const { height, weight } = data[2];
  const stats = data[2].stats.map(stat => [stat.stat.name, stat.base_stat]);
  const moves = data[2].moves.slice(0, 6).map(mov => {
    return mov.move.name
      .split('-')
      .map(word => capitalize(word))
      .join('-');
  });

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

// To load Pokemon details for the search panel [screen 2]
export const loadPokemon = async function (pokemon) {
  try {
    const data = await Promise.all([
      fetch(`${BASIC_API_URL}${pokemon}`),
      fetch(`${DESC_API_URL}${pokemon}`),
      fetch(`${DETAILS_API_URL}${pokemon}`),
    ]);

    const parsedData = await Promise.all([
      data[0].json(),
      data[1].json(),
      data[2].json(),
    ]);

    state.pokemon = await createPokemonObject(parsedData);
  } catch (err) {
    console.error('Something went wrong! ' + err);
  }
};

// To load Pokemon previews in the search results screen [screen 1]
export const loadSearchResults = async function (query) {
  state.search.query = query;

  try {
    const data = await fetch(`${API_URL}/`);
    const json = await data.json();
    // console.log(`json is ${json}`);

    state.search.results = json;

    return json;
  } catch (err) {
    console.log(`Something went wrong! ${err}`);
  }
};

// HELPER METHODS

const capitalize = function (word) {
  return word[0].toUpperCase().concat(word.slice(1));
};
