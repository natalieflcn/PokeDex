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
import {
  controlProfileRenderCategory,
  controlProfileSortLoad,
} from './profileController';
import navView from '../views/navView';
import categoryView from '../views/ProfileViews/categoryView';
import { getFavoriteRender } from '../models/favoriteModel';

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
      console.log(getPokemonSortBy());
      console.log('running');
      break;

    case '/map':
      navView.toggleNavMap();
      break;

    // case '/profile':
    //   navView.toggleNavProfile();

    //   // Determines if the profile is currently in 'Caught' or 'Favorites' mode for rendering
    //   const category = getCaughtRender() ? 'caught' : 'favorites';
    //   console.log(category);
    //   controlProfileRenderCategory(category);
    //   break;

    case '/profile/caught':
      navView.toggleNavProfile();
      categoryView.toggleCaughtCategory();

      if (getCaughtRender()) controlProfileRenderCategory('caught');

      break;

    case '/profile/favorites':
      navView.toggleNavProfile();
      categoryView.toggleFavoritesCategory();
      controlProfileSortLoad();

      if (getFavoriteRender()) controlProfileRenderCategory('favorites');
      controlProfileSortLoad();
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

  console.log(route);
  if (!route) return;

  const currentURL = navResolveSortParams(route);

  window.history.pushState({ page: route }, '', currentURL);
  controlNavRenderView(route);
};

// Reads the URL and navigates to appropriate module when user interacts with browser history stack
const controlNavBrowser = function () {
  const route = window.location.href;

  console.log(route);
  controlNavRenderView(route);
};

// Rewrites the root URL '/' to '/search' to maintain URL consistency across page loads
const controlNavInitialLoad = function () {
  switch (window.location.pathname) {
    case '/map':
    case '/profile/caught':
    case '/profile/favorites':
      return;

    case '/':
    default:
      const currentURL = navResolveSortParams('/search');
      window.history.replaceState({ page: 'search' }, '', currentURL);
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
