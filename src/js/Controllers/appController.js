/**
 * App Controller
 * ---------------------
 * Initializes all domain-level controllers to start the application.
 *
 * This controller does not own state, implement business logic, perform data fetching, or manipulate the DOM.
 */

import { controlNavBtn, controlNavInit } from './navController';
import { controlSearchInit } from './searchController';
import { controlProfileInit } from './profileController';
import '../../css/style.css';
import AboutView from '../views/AboutView';

const controlAboutBtns = function (action) {
  switch (action) {
    // In-app redirects
    case 'search':
      // console.log(isEmpty(getPokemon()));

      // const pokemon = isEmpty(getPokemon())
      //   ? null
      //   : getPokemon().name.toLowerCase();

      // console.log(pokemon);
      // if (pokemon)
      //   internalURL = new URL(`/search/${pokemon}`, BASE_POKEDEX_URL);

      // window.history.pushState(
      //   { page: `search/${pokemon ?? ''}` },
      //   '',
      //   internalURL,
      // );

      // navView.resetNav();
      // navView.toggleNavSearch();

      // if (pokemon) resultsView.scrollIntoView(capitalize(pokemon));

      controlNavBtn('search');
      break;

    case 'map':
      // window.history.pushState({ page: 'map' }, '', internalURL);

      // navView.resetNav();
      // navView.toggleNavMap();

      controlNavBtn('map');
      break;

    case 'profile':
      // window.history.pushState(
      //   { page: `profile/${getCaughtRender() ? 'caught' : 'favorites'}` },
      //   '',
      //   internalURL,
      // );

      // console.log(navResolveRoute(action));
      // internalURL = new URL(`${navResolveRoute(action)}`, BASE_POKEDEX_URL);
      // navView.resetNav();
      // navView.toggleNavProfile();

      controlNavBtn('profile');
      break;

    // External redirects
    case 'source-code':
      window.open('https://github.com/natalieflcn/Natys-Pokedex', '_blank');
      break;

    case 'github':
      window.open('https://github.com/natalieflcn', '_blank');
      break;

    case 'linkedin':
      window.open('https://www.linkedin.com/in/nataliedfalcon/', '_blank');
      break;

    case 'portfolio':
      alert('Portfolio coming soon... Stay tuned!');
      break;
  }
};

const init = async function () {
  // Prevents app from duplication initialization during development (HMR)
  if (window.appInitialized) return;

  controlNavInit();
  await controlSearchInit();
  controlProfileInit();
  AboutView.addHandlerAboutBtn(controlAboutBtns);

  window.appInitialized = true;
};

init();
