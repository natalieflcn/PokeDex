/**
 * Navigation Controller
 * ---------------------
 * Orchestrates Pokémon sorting, DOM updates, and URL state.
 * Implements basic routing and enforces navigation flow.
 * Renders the appropriate views with fresh data.
 *
 * This controller does not own state or perform data fetching.
 */

import { getPokemonSortBy } from '../models/pokemonModel';
import { getCaughtRender } from '../models/caughtModel';
import { navCheckRoute, navResolveSortParams } from '../services/navService';
import { controlSearchRenderSort } from './searchController';
import { controlProfileRenderCategory } from './profileController';
import navView from '../views/navView';
import categoryView from '../views/ProfileViews/categoryView';

/**
 * Renders module with appropriate data (based on the URL path)
 *
 * @param {string} route - Route identifier derived from navigation button or URL
 */
const controlNavRenderView = function (route) {
  navView.resetNav();

  switch (route) {
    case '/search':
      navView.toggleNavSearch();
      controlSearchRenderSort(getPokemonSortBy());
      break;

    case '/map':
      navView.toggleNavMap();
      break;

    case '/profile':
      navView.toggleNavProfile();

      // Determines if the profile is currently in 'Caught' or 'Favorites' mode for rendering
      const category = getCaughtRender() ? 'caught' : 'favorites';
      controlProfileRenderCategory(category);
      break;

    case '/profile/caught':
      navView.toggleNavProfile();
      categoryView.toggleCaughtCategory();
      break;

    case '/profile/favorites':
      navView.toggleNavProfile();
      categoryView.toggleFavoritesCategory();
      break;

    default:
      navView.toggleNavSearch();
      break;
  }
};

/**
 * Handles navigation button clicks.
 * Updates the URL and triggers rendering of appropriate module.
 *
 * @param {string} page - Route identifier derived from navigation button
 */
const controlNavBtn = function (page) {
  const route = navCheckRoute(page);

  if (!route) return;

  const currentURL = navResolveSortParams(route);

  window.history.pushState({ page: route }, '', currentURL);
  controlNavRenderView(route);
};

// Reads the URL and navigates to appropriate module when user interacts with browser history stack
const controlNavBrowser = function () {
  const route = window.location.pathname;

  controlNavRenderView(route);
};

// Rewrites the root URL '/' to '/search' to maintain URL consistency across page loads
const controlNavInitialLoad = function () {
  if (window.location.pathname === '/') {
    window.history.replaceState({ page: 'search' }, '', '/search');
  }
};

/**
 * Initializes Navigation Controller event handlers
 */
export const controlNavInit = function () {
  navView.addHandlerNavigateBtn(controlNavBtn);
  navView.addHandlerBrowser(controlNavBrowser);
  navView.addHandlerInitialLoad(controlNavInitialLoad);
};
