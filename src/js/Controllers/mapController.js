import headerView from '../views/MapViews/headerView';
import navView from '../views/NavViews/navView.js';
import {
  getCaughtPokemon,
  getLastCaughtPokemon,
  loadCaughtPokemon,
  removeCaughtPokemon,
  setCaughtPokemonLocation,
  setLastCaughtPokemonLocation,
} from '../models/caughtModel';
import formView from '../views/MapViews/formView.js';
import { capitalize } from '../helpers.js';
import mapEntriesView from '../views/MapViews/mapEntriesView.js';
import deleteEntryView from '../views/MapViews/deleteEntryView.js';
import editEntryView from '../views/MapViews/editEntryView.js';
import {
  getQueryResults,
  loadQueryBatch,
  resetQueryState,
  startPokemonQuery,
  storeQueryResults,
} from '../models/queryModel.js';
import { controlAppError } from './appController.js';
import queryView from '../views/MapViews/queryView.js';
import sortView from '../views/MapViews/sortView.js';
import {
  navResolveSortParams,
  navSanitizeSort,
} from '../services/navService.js';
import { getMapSortBy, setMapSortBy } from '../models/mapModel.js';
import { sortPokemon } from '../services/pokemonService.js';

let map;

export const controlMapLoadSummary = function () {
  const caughtSummary = getCaughtPokemon().length || 0;
  headerView.render(caughtSummary);
};

export const controlMapRedirect = function () {
  setTimeout(() => {
    navView.resetNav();
    navView.toggleNavMap();
    controlMapNewEntry();
    formView.scrollIntoView();
  }, 200); // 3000 milliseconds = 3 seconds

  //   navView.resetNav();
  //   navView.toggleNavMap();
};

export const controlMapLoadEntries = async function () {
  try {
    resetQueryState();
    const requestId = startPokemonQuery();
    const query = queryView.getQuery();
    mapEntriesView.renderSpinner();

    const pokemonBatch = await loadCaughtPokemon();

    if (!query && pokemonBatch.length > 0) mapEntriesView.render(pokemonBatch);
    else if (!query && pokemonBatch.length < 1)
      controlAppError(
        new Error('Pokemon Not Found'),
        mapEntriesView,
        "You haven't caught any Pokémon yet! Start catching Pokémon from the Search module.",
      );

    if (query) {
      storeQueryResults(query, pokemonBatch);
      await loadQueryBatch(requestId);
      const queryBatch = getQueryResults();

      // console.log(queryBatch);
      if (queryBatch.length > 0) {
        const sortedQueryBatch = sortPokemon(queryBatch, getMapSortBy());

        mapEntriesView.render(sortedQueryBatch);
      } else {
        controlAppError(
          new Error('Pokemon Not Found'),
          mapEntriesView,
          `We couldn't find the Pokémon, ${capitalize(query)}!`,
        );
      }
    }
  } catch (err) {
    console.error(err);
    controlAppError(err, mapEntriesView);
  }
};

const controlMapLogEntry = function () {
  //   const pokemon = getLastCaughtPokemon();
  //   pokemon.location = 'Unknown Location';

  const formData = formView.getFormData();
  const name = formData['pokemon-name'];
  const location = formData['pokemon-location'];
  // console.log(name);
  // console.log(location);
  // setLastCaughtPokemonLocation(location || 'Unknown Location');

  setCaughtPokemonLocation(name, location);

  formView.clearForm();
  formView.hideMapForm();
  controlMapLoadEntries();
  controlMapLoadSummary();
};

export const controlMapNewEntry = function () {
  const { name, id } = controlMapCalculateFormData();
  // console.log('controlmap' + name);
  formView.showMapForm();
  formView.updateFormNameAndId(name, id);
};

const controlMapCalculateFormData = function () {
  const { name, id } = getLastCaughtPokemon();

  return { name: capitalize(name), id };
};

const controlMapDeleteEntry = function (pokemonName) {
  const removePokemon = getCaughtPokemon().find(
    pokemon => pokemon.name === pokemonName,
  );

  removeCaughtPokemon(removePokemon);
  controlMapLoadSummary();
  controlMapLoadEntries();
};

const controlMapEditEntry = function (pokemonName) {
  const id = getCaughtPokemon().find(
    pokemon => pokemon.name === pokemonName,
  ).id;

  formView.showMapForm();
  formView.updateFormNameAndId(pokemonName, id);
  formView.scrollIntoView();
};

const controlMapRenderSort = function (sort) {
  switch (sort) {
    case 'name':
      sortView.toggleMapSortName();
      break;

    case 'id':
      sortView.toggleMapSortId();
      break;

    case 'date':
    default:
      sortView.toggleMapSortDate();
      break;
  }
};

const controlMapSortBtn = async function (sort) {
  // console.log(sort);

  const currentURL = navResolveSortParams(window.location.pathname);

  if (sort === 'name' || sort === 'id') {
    currentURL.searchParams.set('sort', sort);
    window.history.replaceState({}, '', currentURL);
  } else if (sort === 'date') {
    navSanitizeSort();
  }

  setMapSortBy(sort);
  controlMapRenderSort(sort);

  await controlMapLoadEntries();
};

const controlMapSortLoad = function () {
  const route = window.location.pathname;

  const currentURL = navResolveSortParams(route);

  window.history.replaceState({ page: route }, '', currentURL);

  const sort = currentURL.searchParams.get('sort');
  controlMapRenderSort(sort);
};

const initMap = async function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const { longitude, latitude } = position.coords;
        console.log(longitude, latitude);

        // refactor into mapView.js later
        map = new google.maps.Map(document.getElementById('map'), {
          center: { lat: latitude, lng: longitude },
          zoom: 13,
          styles: [
            {
              elementType: 'geometry',
              stylers: [
                {
                  color: '#ebe3cd',
                },
              ],
            },
            {
              elementType: 'labels.text.fill',
              stylers: [
                {
                  color: '#523735',
                },
              ],
            },
            {
              elementType: 'labels.text.stroke',
              stylers: [
                {
                  color: '#f5f1e6',
                },
              ],
            },
            {
              featureType: 'administrative',
              elementType: 'geometry.stroke',
              stylers: [
                {
                  color: '#c9b2a6',
                },
              ],
            },
            {
              featureType: 'administrative.land_parcel',
              elementType: 'geometry.stroke',
              stylers: [
                {
                  color: '#dcd2be',
                },
              ],
            },
            {
              featureType: 'administrative.land_parcel',
              elementType: 'labels',
              stylers: [
                {
                  visibility: 'off',
                },
              ],
            },
            {
              featureType: 'administrative.land_parcel',
              elementType: 'labels.text.fill',
              stylers: [
                {
                  color: '#ae9e90',
                },
              ],
            },
            {
              featureType: 'landscape.natural',
              elementType: 'geometry',
              stylers: [
                {
                  color: '#dfd2ae',
                },
              ],
            },
            {
              featureType: 'poi',
              elementType: 'geometry',
              stylers: [
                {
                  color: '#dfd2ae',
                },
              ],
            },
            {
              featureType: 'poi',
              elementType: 'labels.text',
              stylers: [
                {
                  visibility: 'off',
                },
              ],
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [
                {
                  color: '#93817c',
                },
              ],
            },
            {
              featureType: 'poi.business',
              stylers: [
                {
                  visibility: 'off',
                },
              ],
            },
            {
              featureType: 'poi.medical',
              stylers: [
                {
                  visibility: 'off',
                },
              ],
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry.fill',
              stylers: [
                {
                  color: '#a5b076',
                },
              ],
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [
                {
                  color: '#447530',
                },
              ],
            },
            {
              featureType: 'poi.school',
              stylers: [
                {
                  visibility: 'off',
                },
              ],
            },
            {
              featureType: 'poi.sports_complex',
              stylers: [
                {
                  visibility: 'off',
                },
              ],
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [
                {
                  color: '#f5f1e6',
                },
              ],
            },
            {
              featureType: 'road.arterial',
              elementType: 'geometry',
              stylers: [
                {
                  color: '#fdfcf8',
                },
              ],
            },
            {
              featureType: 'road.highway',
              stylers: [
                {
                  visibility: 'simplified',
                },
              ],
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [
                {
                  color: '#f8c967',
                },
              ],
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [
                {
                  color: '#e9bc62',
                },
              ],
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.icon',
              stylers: [
                {
                  visibility: 'off',
                },
              ],
            },
            {
              featureType: 'road.highway.controlled_access',
              elementType: 'geometry',
              stylers: [
                {
                  color: '#e98d58',
                },
              ],
            },
            {
              featureType: 'road.highway.controlled_access',
              elementType: 'geometry.stroke',
              stylers: [
                {
                  color: '#db8555',
                },
              ],
            },
            {
              featureType: 'road.local',
              elementType: 'labels',
              stylers: [
                {
                  visibility: 'off',
                },
              ],
            },
            {
              featureType: 'road.local',
              elementType: 'labels.text.fill',
              stylers: [
                {
                  color: '#806b63',
                },
              ],
            },
            {
              featureType: 'transit',
              stylers: [
                {
                  visibility: 'off',
                },
              ],
            },
            {
              featureType: 'transit.line',
              elementType: 'geometry',
              stylers: [
                {
                  color: '#dfd2ae',
                },
              ],
            },
            {
              featureType: 'transit.line',
              elementType: 'labels.text.fill',
              stylers: [
                {
                  color: '#8f7d77',
                },
              ],
            },
            {
              featureType: 'transit.line',
              elementType: 'labels.text.stroke',
              stylers: [
                {
                  color: '#ebe3cd',
                },
              ],
            },
            {
              featureType: 'transit.station',
              elementType: 'geometry',
              stylers: [
                {
                  color: '#dfd2ae',
                },
              ],
            },
            {
              featureType: 'water',
              elementType: 'geometry.fill',
              stylers: [
                {
                  color: '#b9d3c2',
                },
              ],
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [
                {
                  color: '#92998d',
                },
              ],
            },
          ],
        });
      },
      function () {
        alert(
          'Please enable your browser to access your location to use the Map feature.',
        );
      },
    );
  }
};

export const controlMapInit = function () {
  // controlMapLoadEntries();
  // mapEntriesView.addHandlerLoadEntries(controlMapLoadEntries);
  initMap();
  headerView.addHandlerLoadSummary(controlMapLoadSummary);
  formView.addHandlerLogEntry(controlMapLogEntry);
  deleteEntryView.addHandlerDeleteBtn(controlMapDeleteEntry);
  editEntryView.addHandlerEditBtn(controlMapEditEntry);
  queryView.addHandlerQuery(controlMapLoadEntries);
  sortView.addHandlerSortBtn(controlMapSortBtn);
  sortView.addHandlerSortLoad(controlMapSortLoad);
};
