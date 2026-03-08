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

export const controlMapInit = function () {
  // controlMapLoadEntries();
  // mapEntriesView.addHandlerLoadEntries(controlMapLoadEntries);
  headerView.addHandlerLoadSummary(controlMapLoadSummary);
  formView.addHandlerLogEntry(controlMapLogEntry);
  deleteEntryView.addHandlerDeleteBtn(controlMapDeleteEntry);
  editEntryView.addHandlerEditBtn(controlMapEditEntry);
  queryView.addHandlerQuery(controlMapLoadEntries);
  sortView.addHandlerSortBtn(controlMapSortBtn);
  sortView.addHandlerSortLoad(controlMapSortLoad);
};
