import mapState from './state/mapState';

export const getMapSortBy = () => mapState.sortBy;

export const setMapSortBy = sortBy => (mapState.sortBy = sortBy);
