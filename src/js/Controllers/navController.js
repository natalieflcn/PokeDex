import { BASE_POKEDEX_URL } from '../config';
import {
  navReset,
  navSearch,
  navMap,
  navProfile,
  navFavorites,
  navCaught,
} from '../services/navService';
import navView from '../views/navView';

// Renders the appropriate module by calling their respective navService (based on the URL path)
const controlNavRenderView = function (page) {
  navReset();

  switch (page) {
    case 'search':
      navSearch();
      break;

    case 'map':
      navMap();
      break;

    // RENDERING SUB ROUTES
    case 'profile/caught':
      navProfile();
      navCaught();
      break;

    case 'profile/favorites':
      navProfile();
      navFavorites();
      break;

    default:
      navSearch();
      break;
  }
};

// Updates the URL and navigates to appropriate module when user clicks a navigation button
const controlNavBtn = function (page) {
  controlNavRenderView(page);

  window.history.pushState(
    { page: page },
    '',
    new URL(page.toString(), BASE_POKEDEX_URL)
  );
};

// Reads the URL and navigates to appropriate module when user navigates around browser history stack
const controlNavBrowser = function () {
  const path = window.location.pathname.replace('/', '');

  controlNavRenderView(path);
};

// Rewrites the root URL '/' to '/search' to maintain URL consistency across page loads
const controlNavInitialLoad = function () {
  if (window.location.pathname === '/') {
    window.history.replaceState({ page: 'search' }, '', '/search');
  }
};

export const controlNavInit = function () {
  navView.addHandlerNavigateBtn(controlNavBtn);
  navView.addHandlerBrowser(controlNavBrowser);
  navView.addHandlerInitialLoad(controlNavInitialLoad);
};
