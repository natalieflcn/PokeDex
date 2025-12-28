// ROUTE MANIPULATION FUNCTIONS -----

// Resolves routes to appropriate subroutes (if necessary) to maintain URL consistency
const navResolveRoute = function (page) {
  if (page === 'profile') {
    return 'profile/caught';
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
