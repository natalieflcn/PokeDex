import headerView from '../views/MapViews/headerView';
import navView from '../views/NavViews/navView.js';
import {
  getCaughtPokemon,
  getLastCaughtPokemon,
  setLastCaughtPokemonLocation,
} from '../models/caughtModel';
import formView from '../views/MapViews/formView.js';
import { capitalize } from '../helpers.js';

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

const controlMapLogEntry = function () {
  //   const pokemon = getLastCaughtPokemon();
  //   pokemon.location = 'Unknown Location';

  setLastCaughtPokemonLocation('Unknown Location');

  console.log(getLastCaughtPokemon());
  formView.hideMapForm();
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

export const controlMapInit = function () {
  headerView.addHandlerLoadSummary(controlMapLoadSummary);
  formView.addHandlerLogEntry(controlMapLogEntry);
};
