import { getPokemonSortBy } from '../models/pokemonModel';
import {
  navCheckRoute,
  navResolveSortParams,
  navSanitizeSort,
} from '../services/navService';
import navView from '../views/navView';
import categoryView from '../views/ProfileViews/categoryView';
import sortView from '../views/SearchViews/sortView';
import { controlSearchRenderSort } from './searchController';

// Renders the appropriate module by calling their respective navService (based on the URL path)
const controlNavRenderView = function (page) {
  navView.resetNav();

  switch (page) {
    case 'search':
      navView.toggleNavSearch();
      controlSearchRenderSort(getPokemonSortBy());
      navResolveSortParams(getPokemonSortBy());

      break;

    case 'map':
      navView.toggleNavMap();
      break;

    case 'profile':
    case 'profile/caught':
      categoryView.toggleCaughtCategory();

    case 'profile/favorites':
      navView.toggleNavProfile();
      navSanitizeSort();
      break;

    default:
      navView.toggleNavSearch();
      break;
  }
};

// Updates the URL and navigates to appropriate module when user clicks a navigation button
const controlNavBtn = function (page) {
  const route = navCheckRoute(page);

  if (!route) return;

  const currentURL = navResolveSortParams(route);

  window.history.pushState({ page: route }, '', currentURL);
  controlNavRenderView(page);
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
