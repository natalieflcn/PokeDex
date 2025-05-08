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

// To create a Pokemon object after parsing API data
export const createPokemonObject = async function (data) {
  // Loaded from Basic API URL
  const {
    name,
    id,
    sprites: { front_default: img },
  } = data[0];

  // Loaded from Desc API URL
  const [{ flavor_text: flavor1 }, , { flavor_text: flavor2 }] =
    data[1].flavor_text_entries;

  // Loaded from Details API URL
  const { height, weight } = data[2];
  const moves = data[2].moves.slice(0, 6).map(mov => mov.move.name);
  const stats = data[2].stats.map(stat => [stat.stat.name, stat.base_stat]);

  return {
    name,
    id,
    img,
    desc: `${flavor1} ${flavor2}`,
    height,
    weight,
    stats,
    moves,
  };
};

// To load Pokémon details in the search results panel
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
    console.log(state.pokemon);

    // Loading name, id, and image
    // const data1 = await fetch(`${BASIC_API_URL}${pokemon}`);
    // const basic = await data1.json();

    // console.log(basic);
    // Loading description

    // Loading height, weight, stats, moves
  } catch (err) {
    console.error('you suck ' + err);
  }
};

// To load previews in the search results screen
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
