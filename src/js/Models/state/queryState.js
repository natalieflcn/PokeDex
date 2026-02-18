import { LIMIT } from '../../config';

const queryState = {
  loading: false,
  currentQueryId: 0,
  query: '',
  queryResults: [],
  currentBatch: [],
  hasMoreResults: true,
  offset: 0,
  limit: LIMIT,
  redirect: false,
};

export default queryState;
