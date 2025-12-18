import { controlProfileInit } from './profileController.js';
import { controlSearchInit } from './searchController.js';
import '../../css/style.css';
import { controlNavInit } from './navController.js';

const init = function () {
  if (window.appInitialized) return;

  controlNavInit();
  controlSearchInit();
  controlProfileInit();

  window.appInitialized = true;
};

init();
