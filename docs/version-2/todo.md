# To Do List

## Week: December 4 – December 6

### Goals

- [~] Review the current file system and refactor files (and folders, if necessary) to properly reflect the MVC model
  - [x] Create public folder to serve static assets (i.e. fonts, images) instead of cluttering everything inside src folder
  - [~] Refactor MVC system architecture implementation
- [x] Switch from using Parcel to Webpack & Babel to bundle code
  - [x] Uninstall Parcel, install Webpack, and configure Webpack bundler with Babel
  - [x] Adjust file structure to accomodate the change of bundler technology
  - [x] Resolve file paths of images, favicon, CSS, and font files that were shifted around the project

## Week: December 7 – December 12

### Goals

- [~] Refactor MVC system architecture implementation
  - [~] Review, assess, and modify code for the overlapping responsiblities currently shared between Model and Controller layers
  - [x] Refactor state.js into domain-driven State files: pokemonState, favoritesStates, caughtState, searchState, navState
    - [x] Refactor controllers to accomodate new state files: searchController, profileController
    - [x] Refactor models to accomodate new state files: searchModel, profileModel
  - [x] Move Profile state into config file (ENV variables)
  - [x] Create a services folder: pokemonService, favoritesService, caughtService, searchService
- [x] Implement routing with Browser History API and URL API
  - [x] Define routes for all modules (i.e. Search, Map, Profile)
        ~~- [-] Centralize UI state in state.js to reflect which module the user is currently accessing~~
        ~~- [-] Use the UI state from state.js to define UI changes, instead of toggling changes (highlighted buttons, lights, currently open module) within the Views~~
  - [x] Configure Webpack to serve index.html when requested resources cannot be found
  - [x] Manipulate the DOM based on the route being requested
  - [x] Handle window's popstate and load events to allow users to navigate around their browser history

### Notes

- Need to refactor searchController to utilize History API methods instead of the hashchange event
- Need to implement /favorites and /caught subroutes into /profile route to render favorites/caught view, instead of relying on state
- Consider implementing /:name, /:id, /:date, /:type as parameters for sorting and filtering instead of maintaining the 'mode' in state to trigger sorting algorithms

## Week: December 18 – December 20

### Goals

- [x] BUG: Favorites/Caught Pokemon are not rendering respective lists

- [~] Refactor MVC system architecture implementation
  - [ ] Review, assess, and modify code for the overlapping responsiblities currently shared between Model and Controller layers
  - [ ] Refactor the current Model structure into domain-driven Models: pokemonModel, favoritesModel, caughtModel
  - [ ] Refactor the current Controllers structure into domain-driven Controllers: pokemonController, favoritesController, caughtController, searchController, navController, appController
  - [ ] Offload controller functionality into the services -- follow fat models, skinny controllers guideline
  - [ ] Review the relationship between controllers and views and ensure that the publisher-subscriber pattern is being enforced
    - [ ] Clean up Views and ensure there is no application logic within them (views should only be responsible for adding event handlers)
- [x] Implement sub-routes for filtered (Caught/Favorites) lists of Pokemon on the Profile with Browser History API

### Notes

- Need to split savedPokemonView into caughtPokemonView and favoritesPokemonView for better readability
- Need to render newly Caught/Favorite Pokémon instantly, without module reload
- TODO: Need to redirect /profile to /profile/caught for url consistency

- BUG: Caught/Favorites Pokémon are being inserted into the general AllPokemon list that is rendered in the Search module
