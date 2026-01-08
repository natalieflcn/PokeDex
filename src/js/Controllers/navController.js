import { getCaughtRender } from '../models/caughtModel';
import { getPokemon } from '../models/panelModel';
import { getPokemonSortBy } from '../models/pokemonModel';
import {
  navCheckRoute,
  navResolveSortParams,
  navSanitizeSort,
} from '../services/navService';
import navView from '../views/navView';
import categoryView from '../views/ProfileViews/categoryView';
import sortView from '../views/SearchViews/sortView';
import { controlProfileRenderCategory } from './profileController';
import { controlSearchRenderSort } from './searchController';

// Renders the appropriate module by calling their respective navService (based on the URL path)
const controlNavRenderView = function (page) {
  navView.resetNav();

  switch (page) {
    case 'search':
      navView.toggleNavSearch();

      controlSearchRenderSort(getPokemonSortBy());
      break;

    case 'map':
      navView.toggleNavMap();
      break;

    case 'profile':
      navView.toggleNavProfile();

      const category = getCaughtRender() ? 'caught' : 'favorites';
      controlProfileRenderCategory(category);
      break;

    case 'profile/caught':
      navView.toggleNavProfile();

      categoryView.toggleCaughtCategory();
      break;

    case 'profile/favorites':
      navView.toggleNavProfile();

      categoryView.toggleFavoritesCategory();
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

  console.log(route);
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
