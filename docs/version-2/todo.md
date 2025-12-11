# To Do List

## Week: December 4 – December 6

- [~] Review the current file system and refactor files (and folders, if necessary) to properly reflect the MVC model
  - [x] Create public folder to serve static assets (i.e. fonts, images) instead of cluttering everything inside src folder
  - [~] Refactor MVC system architecture implementation
- [x] Switch from using Parcel to Webpack & Babel to bundle code
  - [x] Uninstall Parcel, install Webpack, and configure Webpack bundler with Babel
  - [x] Adjust file structure to accomodate the change of bundler technology
  - [x] Resolve file paths of images, favicon, CSS, and font files that were shifted around the project

## Week: December 7 – December 13

- [~] Refactor MVC system architecture implementation
  - [~] Review, assess, and modify code for the overlapping responsiblities currently shared between Model and Controller layers
  - [ ] Refactor the current Model structure into domain-driven Models: pokemonModel, favoritesModel, caughtModel
  - [ ] Refactor state.js into domain-driven State files: pokemonState, favoritesStates, caughtState, searchState, routerState
  - [x] Move Profile state into config file (ENV variables)
  - [ ] Refactor the current Controllers structure into domain-driven Controllers: pokemonController, favoritesController, caughtController, searchController, routerController, appController
  - [ ] Create a services folder: pokemonService, favoritesService, caughtService, searchService
  - [ ] Offload controller functionality into the services -- follow fat models, skinny controllers guideline
  - [ ] Review the relationship between controllers and views and ensure that the publisher-subscriber pattern is being enforced
    - [ ] Clean up Views and ensure there is no application logic within them (views should only be responsible for adding event handlers)
- [ ] Implement routing with Browser History API
  - [ ] Define routes for all modules (i.e. Search, Map, Profile)
  - [ ] Centralize UI state in state.js to reflect which module the user is currently accessing
  - [ ] Use the UI state from state.js to define UI changes, instead of toggling changes (highlighted buttons, lights, currently open module) within the Views
