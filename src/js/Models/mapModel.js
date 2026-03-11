import mapState from './state/mapState';

export const getMapSortBy = () => mapState.sortBy;

export const setMapSortBy = sortBy => (mapState.sortBy = sortBy);

export const addSavedMarker = (coordinates, name) =>
  mapState.savedMarkers.push({ coordinates, name });

export const getSavedMarkers = () => mapState.savedMarkers;

export const addMarker = coordinates => mapState.allMarkers.push(coordinates);

export const getAllMarkers = () => mapState.allMarkers;
