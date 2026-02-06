/**
 * Navigation Service
 * ---------------------
 * Responsible for resolving routes, sanitizing and applying URL search parameters, and preventing duplicate navigation entries in the browser history.
 *
 * This service does not own state, implement business logic, or perform data fetching.
 * It only interacts with URL and History Browser APIs.
 */

import { getPokemonSortBy, setPokemonSortBy } from '../models/pokemonModel';
import {
  getCaughtRender,
  getCaughtSortBy,
  setCaughtSortBy,
} from '../models/caughtModel';
import { getFavoriteSortBy, setFavoriteSortBy } from '../models/favoriteModel';
import { BASE_POKEDEX_URL } from '../config';
import { getPokemon } from '../models/panelModel';

/**
 * Resolves pages identifiers to application routes.
 * Resolves appropriate subroutes (if applicable) to maintain URL consistency
 *
 * @param {string} page - Page identifier derived from navigation button or URL
 */
const navResolveRoute = function (page) {
  if (page === 'profile') {
    // Determines if the profile is currently in 'Caught' or 'Favorites' mode to define appropriate path
    const category = getCaughtRender() ? 'caught' : 'favorites';

    return `/profile/${category}`;
  }

  if (page === 'search' && Boolean(getPokemon())) {
    console.log(getPokemon());
    return `/search/${getPokemon().name.toLowerCase()}`;
  }
  console.log(page);
  return `/${page}`;
};

/**
 * Compares the requested route against the current route to prevent duplicate entries in the browser history stack

@param {string} page - Page identifier derived from navigation button or URL
*/
export const navCheckRoute = function (page) {
  const currentURL = window.location.pathname.split('/').at(1);

  // To guard against duplicate entries
  if (currentURL === page) return null;
  return navResolveRoute(page);
};

/*
 * Sanitizes URL of sort search parameters
 */
export const navSanitizeSort = function () {
  const currentURL = new URL(window.location.href);
  currentURL.searchParams.delete('sort');
  window.history.replaceState({}, '', currentURL);
};

/**
 * Creates a new URL object with the specified route and appends any sort search parameters (if applicable) from STATE

@param {string} route - Route identifier derived from navigation button or URL
*/
export const navResolveSortParams = function (route) {
  const currentURL = new URL(route.toString(), BASE_POKEDEX_URL);

  // console.log(route);
  let sortBy;

  // console.log(route);
  if (route === '/search') sortBy = getPokemonSortBy();
  else if (route === '/profile/caught') sortBy = getCaughtSortBy();
  else if (route === '/profile/favorites') sortBy = getFavoriteSortBy();

  // console.log(sortBy);
  if (sortBy === 'name') currentURL.searchParams.set('sort', sortBy);
  if (sortBy === 'id') navSanitizeSort();

  return currentURL;
};

// Hydrates sort parameters from URL into state
export const navHydrateSortParams = function () {
  const sortParams = new URLSearchParams(window.location.search);
  const sort = sortParams.get('sort') ?? 'id';
  const currentRoute = window.location.pathname;

  if (sort !== 'name' && sort !== 'id') {
    navSanitizeSort();
    return;
  }

  // console.log(sort);
  switch (currentRoute) {
    case '/profile/caught':
    case '/profile/favorites':
      setCaughtSortBy(sort);
      setFavoriteSortBy(sort);
      break;

    case '/search':
      setPokemonSortBy(sort);
      break;
  }
  // console.log(getPokemonSortBy(), getCaughtSortBy(), getFavoriteSortBy());
};
