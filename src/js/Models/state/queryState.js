import { LIMIT } from '../../config';

const searchState = {
  loading: false,
  query: '',
  queryResults: '',
  results: [],
  currentBatch: [],
  offset: 0,
  limit: LIMIT,
  hasMoreResults: true,
  currentRequestId: 0,
  mode: 'id',
  view: 'caught',
};

export default searchState;
