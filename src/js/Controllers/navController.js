import { BASE_POKEDEX_URL } from '../config';
import {
  navReset,
  navSearch,
  navMap,
  navProfile,
  navFavorites,
  navCaught,
  navProfileRoute,
  navResolveRoute,
} from '../services/navService';
import navView from '../views/navView';

// Renders the appropriate module by calling their respective navService (based on the URL path)
const controlNavRenderView = function (page) {
  navReset();

  console.log(page);
  switch (page) {
    case 'search':
      navSearch();
      break;

    case 'map':
      navMap();
      break;

    case 'profile':
    case 'profile/caught':
    case 'profile/favorites':
      navProfile();
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
    { page: navResolveRoute(page) },
    '',
    new URL(navResolveRoute(page).toString(), BASE_POKEDEX_URL)
  );
};

// Reads the URL and navigates to appropriate module when user navigates around browser history stack
const controlNavBrowser = function () {
  const page = window.location.pathname.replace('/', '');

  controlNavRenderView(page);
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
