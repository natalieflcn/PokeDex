import navView from '../Views/navView.js';
import { controlProfileInit } from './profileController.js';
import { controlSearchInit } from './searchController.js';

const controlNav = function (page) {
  window.location.hash = '';

  switch (page) {
    case 'search':
      navView.search();
      break;

    case 'map':
      navView.map();
      break;

    case 'profile':
      navView.profile();
      break;

    default:
      navView.search();
      break;
  }
};

const init = function () {
  navView.addHandlerClick(controlNav);
  controlSearchInit();
  controlProfileInit();
};

init();
