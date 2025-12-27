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
  navCheckRoute,
  navSanitizeSort,
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

    case 'profile':
    case 'profile/caught':
    case 'profile/favorites':
      navProfile();
      navProfileSanitizeSort();
      break;

    default:
      navSearch();
      break;
  }
};

// Updates the URL and navigates to appropriate module when user clicks a navigation button
const controlNavBtn = function (page) {
  const route = navCheckRoute(page);

  if (!route) return;

  controlNavRenderView(page);

  window.history.pushState(
    { page: route },
    '',
    new URL(route.toString(), BASE_POKEDEX_URL)
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
