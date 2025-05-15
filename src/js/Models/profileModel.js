import { LIMIT } from '../config.js';
import { state } from './searchModel.js';
import { AJAX, capitalize } from '../helpers.js';

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
  },
  profile: {
    name: '',
    typesCaught: {},
  },
};

export const print = function () {
  console.log('CAUGHT');
  console.log(state.caught);
  console.log('FAVORITE');
  console.log(state.favorites);
};
