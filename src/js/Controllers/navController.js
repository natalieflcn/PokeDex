import { reset, search, map, profile } from '../services/navService';
import navView from '../views/navView';

const routes = {
  search: '/',
  map: '/map',
  profile: '/profile',
  about: '/about',
}; // change routes to call navServies method based on url path

// / -- Home/Search
// /map -- Map
// /profile -- Profile
// /about -- About

// Refactor navView, remove orchestration  !!
// Move orchestration details from navView to navServices !!
// When button is clicked, navController should call services
// navController should also implement hash change (pushState)
// When url is typed in, page should also be routed appropriately

// Implement hash change when button is clicked
// When page is reloaded, change UI based on url

// Implement WebAPI history

// //let contentDiv = document.getElementById('content');
// contentDiv.innerHTML = routes[window.location.pathname];

const controlNavBtn = function (page) {
  window.location.hash = '';

  reset();

  switch (page) {
    case 'search':
      search();
      break;

    case 'map':
      map();
      break;

    case 'profile':
      profile();
      break;

    default:
      search();
      break;
  }
};

export const controlNavInit = function () {
  navView.addHandlerClickNavBtn(controlNavBtn);
};
