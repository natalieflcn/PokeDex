import { BASE_POKEDEX_URL } from '../config';
import { reset, search, map, profile } from '../services/navService';
import navView from '../views/navView';

// Renders the appropriate module by calling their respective navService (based on the URL path)
const controlRenderNavView = function (page) {
  reset();

  switch (page) {
    case 'search':
      search();
      break;

    case 'map':
      map();
      break;

    case 'profile':
      profile();
      break;

    default:
      search();
      break;
  }
};

const controlNavBtn = function (page) {
  controlRenderNavView(page);

  window.history.pushState(
    { page: page },
    '',
    new URL(page.toString(), BASE_POKEDEX_URL)
  );
};

//handled in the controller
const controlNavBrowser = function (e) {
  const path = window.location.pathname.replace('/', '');
  controlRenderNavView(path);
};

export const controlNavInit = function () {
  navView.addHandlerNavigateBtn(controlNavBtn);
  navView.addHandlerBrowser(controlNavBrowser);
};
