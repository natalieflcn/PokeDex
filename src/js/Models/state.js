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
    typesCaught: {
      Normal: 0,
      Fire: 0,
      Water: 0,
      Electric: 0,
      Grass: 0,
      Ice: 0,
      Fighting: 0,
      Poison: 0,
      Ground: 0,
      Flying: 0,
      Psychic: 0,
      Bug: 0,
      Rock: 0,
      Ghost: 0,
      Dragon: 0,
      Dark: 0,
      Steel: 0,
      Fairy: 0,
    },
    view: 'caught',
  },
};
