import { controlProfileInit } from './profileController.js';
import { controlSearchInit } from './searchController.js';
import '../../css/style.css';
import { controlNavInit } from './navController.js';

const init = function () {
  controlNavInit();
  controlSearchInit();
  controlProfileInit();
};

init();
