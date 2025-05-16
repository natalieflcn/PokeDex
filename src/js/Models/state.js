import { LIMIT } from '../config';

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
  profile: {
    name: '',
    typesCaught: {},
    view: 'caught',
  },
};
