import headerView from '../views/MapViews/headerView';
import navView from '../views/NavViews/navView.js';
import {
  getCaughtPokemon,
  getLastCaughtPokemon,
  removeCaughtPokemon,
  setLastCaughtPokemonLocation,
} from '../models/caughtModel';
import formView from '../views/MapViews/formView.js';
import { capitalize } from '../helpers.js';
import mapEntriesView from '../views/MapViews/mapEntriesView.js';
import deleteEntryView from '../views/MapViews/deleteEntryView.js';

const controlMapLoadSummary = function () {
  const caughtSummary = getCaughtPokemon().length || 0;
  headerView.render(caughtSummary);
};

export const controlMapRedirect = function () {
  setTimeout(() => {
    navView.resetNav();
    navView.toggleNavMap();
  }, 200); // 3000 milliseconds = 3 seconds

  controlMapRevealForm();
  //   navView.resetNav();
  //   navView.toggleNavMap();
};

export const controlMapLoadEntries = function () {
  console.log('controlmapentries running');
  mapEntriesView.render(getCaughtPokemon().toReversed());
};

const controlMapLogEntry = function () {
  //   const pokemon = getLastCaughtPokemon();
  //   pokemon.location = 'Unknown Location';
  const location = formView.getFormData()['pokemon-location'];
  setLastCaughtPokemonLocation(location || 'Unknown Location');

  console.log(getLastCaughtPokemon());
  formView.hideMapForm();
  console.log(formView.getFormData());
  controlMapLoadEntries();
};

export const controlMapRevealForm = function () {
  const { name, id } = controlMapCalculateFormData();
  console.log('controlmap' + name);
  formView.showMapForm();
  formView.updateFormNameAndId(name, id);
};

const controlMapCalculateFormData = function () {
  const { name, id } = getLastCaughtPokemon();

  return { name: capitalize(name), id };
};

const controlMapDeleteEntry = function (pokemon) {
  const removePokemon = getCaughtPokemon().find(
    currPokemon => currPokemon.name === pokemon,
  );

  removeCaughtPokemon(removePokemon);

  controlMapLoadEntries();
};

export const controlMapInit = function () {
  controlMapLoadEntries();
  // mapEntriesView.addHandlerLoadEntries(controlMapLoadEntries);
  headerView.addHandlerLoadSummary(controlMapLoadSummary);
  formView.addHandlerLogEntry(controlMapLogEntry);
  deleteEntryView.addHandlerDeleteBtn(controlMapDeleteEntry);
};
