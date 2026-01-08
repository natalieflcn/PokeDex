import { BASE_POKEDEX_URL } from '../config';
import { getCaughtRender, getCaughtSortBy } from '../models/caughtModel';
import { getFavoriteSortBy } from '../models/favoriteModel';
import { getPokemonSortBy } from '../models/pokemonModel';

// Resolves routes to appropriate subroutes (if necessary) to maintain URL consistency
const navResolveRoute = function (page) {
  if (page === 'profile') {
    const category = getCaughtRender() ? 'caught' : 'favorites';
    console.log(category);
    return `/profile/${category}`;
  }

  return `/${page}`;
};

// Checks to see if requested route matches to current route to prevent duplicate entries in the browser history stack
export const navCheckRoute = function (page) {
  const currentURL = window.location.pathname.split('/').at(1);
  console.log(window.location.pathname);

  if (currentURL === page) return null;
  return navResolveRoute(page);
};

// Sanitizes URL of sort params, restoring the pathname to its original state
export const navSanitizeSort = function (module) {
  const currentURL = new URL(window.location.href);
  currentURL.searchParams.delete('sort');
  window.history.replaceState({}, '', currentURL);
};

export const navResolveSortParams = function (route) {
  const currentURL = new URL(route.toString(), BASE_POKEDEX_URL);

  let sortBy;

  console.log(route);
  if (route === '/search') sortBy = getPokemonSortBy();
  else if (route === '/profile/caught') sortBy = getCaughtSortBy();
  else if (route === '/profile/favorites') sortBy = getFavoriteSortBy();

  console.log(sortBy);

  if (sortBy === 'name') currentURL.searchParams.set('sort', sortBy);
  if (sortBy === 'id') navSanitizeSort();

  return currentURL;
};
