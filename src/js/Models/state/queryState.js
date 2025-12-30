import { LIMIT } from '../../config';

const queryState = {
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

export default queryState;
