import { persistData } from '../helpers';
import mapState from './state/mapState';

export const getMapSortBy = () => mapState.sortBy;

export const setMapSortBy = sortBy => (mapState.sortBy = sortBy);

export const addSavedMarker = function (coordinates, name) {
  mapState.savedMarkers.push({ coordinates, name });
  persistData('markers', mapState.savedMarkers);
};

export const getSavedMarkers = () => mapState.savedMarkers;

export const addMarker = coordinates => mapState.allMarkers.push(coordinates);

export const getAllMarkers = () => mapState.allMarkers;

const init = function () {
  const storageMapMarkers = localStorage.getItem('markers');

  if (storageMapMarkers) mapState.savedMarkers = JSON.parse(storageMapMarkers);
};

init();
