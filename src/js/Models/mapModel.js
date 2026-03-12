import { persistData } from '../helpers';
import mapState from './state/mapState';

export const getMapSortBy = () => mapState.sortBy;

export const setMapSortBy = sortBy => (mapState.sortBy = sortBy);

export const addSavedMarker = function (coordinates, name) {
  mapState.savedMarkers.push({ coordinates, name });
  persistData('markers', mapState.savedMarkers);
};

export const getSavedMarkers = () => mapState.savedMarkers;

export const removeSavedMarker = function (pokemonName) {
  const removedSavedMarker = mapState.savedMarkers.find(
    marker => marker.name === pokemonName,
  );

  mapState.savedMarkers.splice(
    mapState.savedMarkers.indexOf(removedSavedMarker),
    1,
  );

  persistData('markers', mapState.savedMarkers);
  return removedSavedMarker;
};

export const addMarker = marker => mapState.allMarkers.push(marker);

export const getAllMarkers = () => mapState.allMarkers;

export const editMarker = function (pokemonName, newLat, newLng) {
  // editing saved marker
  const savedMarker = mapState.savedMarkers.find(
    marker => marker.name === pokemonName,
  );
  savedMarker.coordinates = { latitude: newLat, longitude: newLng };

  // editing marker reference
  const markerReference = mapState.allMarkers.find(
    marker => marker.title === pokemonName,
  );
  markerReference.setPosition({ lat: newLat, lng: newLng });

  persistData('markers', mapState.savedMarkers);
};

export const removeMarkerReference = function (targetLat, targetLng) {
  const markerReference = mapState.allMarkers.find(
    marker =>
      marker.position.lat() === targetLat &&
      marker.position.lng() === targetLng,
  );

  mapState.allMarkers.splice(mapState.allMarkers.indexOf(markerReference), 1);

  return markerReference;
};
const init = function () {
  const storageMapMarkers = localStorage.getItem('markers');

  if (storageMapMarkers) mapState.savedMarkers = JSON.parse(storageMapMarkers);
};

init();
