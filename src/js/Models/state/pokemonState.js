import { LIMIT } from '../../config';

const pokemonState = {
  loaded: false,
  allPokemon: [],
  results: [], //need to refactor and just use allpokemon array?
  currentBatch: [],
  hasMoreResults: true,
  offset: 0,
  limit: LIMIT,
};

export default pokemonState;
