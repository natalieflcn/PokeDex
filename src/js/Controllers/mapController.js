import headerView from '../views/MapViews/headerView';
import navView from '../views/NavViews/navView.js';
import {
  getCaughtPokemon,
  getLastCaughtPokemon,
  removeCaughtPokemon,
  setCaughtPokemonLocation,
  setLastCaughtPokemonLocation,
} from '../models/caughtModel';
import formView from '../views/MapViews/formView.js';
import { capitalize } from '../helpers.js';
import mapEntriesView from '../views/MapViews/mapEntriesView.js';
import deleteEntryView from '../views/MapViews/deleteEntryView.js';
import editEntryView from '../views/MapViews/editEntryView.js';

const controlMapLoadSummary = function () {
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

export const controlMapLoadEntries = function () {
  console.log('controlmapentries running');
  mapEntriesView.render(getCaughtPokemon().toReversed());
};

const controlMapLogEntry = function () {
  //   const pokemon = getLastCaughtPokemon();
  //   pokemon.location = 'Unknown Location';

  const formData = formView.getFormData();
  const name = formData['pokemon-name'];
  const location = formData['pokemon-location'];
  console.log(name);
  console.log(location);
  // setLastCaughtPokemonLocation(location || 'Unknown Location');

  setCaughtPokemonLocation(name, location);

  formView.clearForm();
  formView.hideMapForm();
  controlMapLoadEntries();
};

export const controlMapNewEntry = function () {
  const { name, id } = controlMapCalculateFormData();
  console.log('controlmap' + name);
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

export const controlMapInit = function () {
  controlMapLoadEntries();
  // mapEntriesView.addHandlerLoadEntries(controlMapLoadEntries);
  headerView.addHandlerLoadSummary(controlMapLoadSummary);
  formView.addHandlerLogEntry(controlMapLogEntry);
  deleteEntryView.addHandlerDeleteBtn(controlMapDeleteEntry);
  editEntryView.addHandlerEditBtn(controlMapEditEntry);
};
