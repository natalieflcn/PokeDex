import { LIMIT } from '../config.js';
import { state } from './searchModel.js';
import { AJAX, capitalize, createPokemonPreviewObject } from '../helpers.js';

export const state = {
  loading: false,
  favorites: state.favorites,
  caught: state.caught,
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
    view: 'caught',
  },
  profile: {
    name: '',
    typesCaught: {},
  },
};

export const loadPokemonResults = async function (
  requestId = state.search.currentRequestId
) {
  state.loading = true;

  let pokemonNames;

  if (view === 'caught') {
    pokemonNames = state.caught.slice(
      state.search.offset,
      state.search.offset + LIMIT
    );
  } else if (view === 'favorites') {
    pokemonNames = state.favorites.slice(
      state.search.offset,
      state.search.offset + LIMIT
    );
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
  state.loading = false;
};

export const print = function () {
  console.log('CAUGHT');
  console.log(state.caught);
  console.log('FAVORITE');
  console.log(state.favorites);
};
