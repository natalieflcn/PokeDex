import headerView from '../views/MapViews/headerView';
import navView from '../views/NavViews/navView.js';
import { getCaughtPokemon } from '../models/caughtModel';
import formView from '../views/MapViews/formView.js';

const controlMapLoadSummary = function () {
  const caughtSummary = getCaughtPokemon().length;
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

export const controlMapRevealForm = function () {
  formView.render('hi', true, true);
};

export const controlMapInit = function () {
  headerView.addHandlerLoadSummary(controlMapLoadSummary);
};
