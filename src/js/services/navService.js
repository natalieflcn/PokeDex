// DOM MANIPULATION FUNCTIONS -----

// Removes all active classes and hides the current screens, prepping to instantiate a module
export const navReset = function () {
  document
    .querySelectorAll(
      '.screen__1--search, .screen__2--search, .screen__1--map, .screen__2--map, .screen__1--profile, .screen__2--profile'
    )
    .forEach(page => page.classList.add('hidden'));

  document
    .querySelectorAll(
      '.lights__inner--blue, .lights__inner--yellow, .lights__inner--green'
    )
    .forEach(light => light.classList.remove('lights__inner--active'));

  document
    .querySelectorAll(
      '.header__btn--search, .header__btn--map, .header__btn--profile'
    )
    .forEach(btn => btn.classList.remove('btn--active'));
};

// POKEDEX MAIN ROUTES (MODULES)

// Adds active classes to Search module indicators and reveals Search module screens
export const navSearch = function () {
  document
    .querySelectorAll('.screen__1--search, .screen__2--search')
    .forEach(screen => screen.classList.remove('hidden'));

  document
    .querySelector('.lights__inner--blue')
    .classList.add('lights__inner--active');

  document.querySelector('.header__btn--search').classList.add('btn--active');
};

// Adds active classes to Map module indicators and reveals Map module screens
export const navMap = function () {
  document
    .querySelectorAll('.screen__1--map, .screen__2--map')
    .forEach(screen => screen.classList.remove('hidden'));

  document
    .querySelector('.lights__inner--yellow')
    .classList.add('lights__inner--active');

  document.querySelector('.header__btn--map').classList.add('btn--active');
};

// Adds active classes to Profile module indicators and reveals Profile module screens
export const navProfile = function () {
  document
    .querySelectorAll('.screen__1--profile, .screen__2--profile')
    .forEach(screen => screen.classList.remove('hidden'));

  document
    .querySelector('.lights__inner--green')
    .classList.add('lights__inner--active');

  document.querySelector('.header__btn--profile').classList.add('btn--active');
};

// POKEDEX SUBROUTES

// Adds active classes to visually toggle the Caught Pokemon list on the Profile module
export const navCaught = function () {
  document.querySelector('.profile__btn--caught').classList.add('btn--active');
  document
    .querySelector('.profile__btn--favorites')
    .classList.remove('btn--active');
};

// Adds active classes to visually toggle the Favorites Pokemon list on the Profile module
export const navFavorites = function () {
  document
    .querySelector('.profile__btn--favorites')
    .classList.add('btn--active');
  document
    .querySelector('.profile__btn--caught')
    .classList.remove('btn--active');
};

// Adds active classes to visually toggle the Sort Name button on the Search module

// Adds active classes to visually toggle the Sort ID button on the Search module

// Adds active classes to visually toggle the Sort Name button on the Profile module
export const navProfileSortName = function () {
  document.querySelector('.profile__btn--name').classList.add('btn--active');
  document.querySelector('.profile__btn--id').classList.remove('btn--active');
};

// Adds active classes to visually toggle the Sort ID button on the Profile module
export const navProfileSortId = function () {
  document.querySelector('.profile__btn--id').classList.add('btn--active');
  document.querySelector('.profile__btn--name').classList.remove('btn--active');
};

// ROUTE MANIPULATION FUNCTIONS -----

// Resolves routes to appropriate subroutes (if necessary) to maintain URL consistency
const navResolveRoute = function (page) {
  if (page === 'profile') {
    navCaught();
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

export const navProfileSanitizeSort = function () {
  const currentURL = new URL(window.location.href);
  currentURL.searchParams.delete('sort');
  window.history.replaceState({}, '', currentURL);
  navProfileSortName();
};
