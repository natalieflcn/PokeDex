/**
 * App Controller
 * ---------------------
 * Initializes all domain-level controllers to start the application.
 *
 * This controller does not own state, implement business logic, perform data fetching, or manipulate the DOM.
 */

import { controlNavInit } from './navController';
import { controlSearchInit } from './searchController';
import { controlProfileInit } from './profileController';
import '../../css/style.css';

const init = async function () {
  // Prevents app from duplication initialization during development (HMR)
  if (window.appInitialized) return;

  controlNavInit();
  await controlSearchInit();
  controlProfileInit();

  window.appInitialized = true;
};

init();
