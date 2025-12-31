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
  - [~] Offload controller functionality into the services -- follow fat models, skinny controllers guideline
  - [~] Review the relationship between controllers and views and ensure that the publisher-subscriber pattern is being enforced
- [x] Implement sub-routes for filtered (Caught/Favorites) lists of Pokemon on the Profile with Browser History API
  - [x] Redirect /profile to /profile/caught for url consistency

### Notes

- Need to render newly Caught/Favorite Pokémon instantly, without module reload

- BUG: Caught/Favorites Pokémon are being inserted into the general AllPokemon list that is rendered in the Search module

## Week: December 22 – December 27

### Goals

- [~] Refactor MVC system architecture implementation

  - [~] Offload controller functionality into the services -- follow fat models, skinny controllers guideline
  - [x] Review the relationship between controllers and views and ensure that the publisher-subscriber pattern is being enforced
    - [x] Clean up Views and ensure there is no application logic within them (views should only be responsible for ADDING event handlers)
      - [x] Profile Views
      - [x] Search Views
    - [x] Move all DOM manipulation logic from Services back into Views (This is actually not the appropriate folder)
    - [x] Remove any DOM manipulation logic from the Controllers, if any
    - [x] Strengthen encapsulation within Views by using \_parentEl as the scope, instead of calling querySelector on the document multiple times

- [x] BUG: Favorites button event handler is running twice, on every other click (Search View)
- [x] BUG: Caught and Favorite buttons are not working on Profile section
- [x] BUG: '/' route redirects to 'profile/caught'

### Notes

- Removed updateCaughtPokemonTypes function call from Profile View... need to update the # of types caught in caughtState automatically when caught Pokémon are added/removed
- Need to revise all error messages for each view and create an appropriate message for each situation
- Need to decide how routes should be maintained in the history stack for profile/caught, profile/favorites, profile...?sort=name/id. Should these routes be explicitly kept in the global url state at all times?
  - [x] One history entry in the stack for the filtered /profile history entries
  - [x] A user should always be navigated to either /caught or /favorites
  - [x] Sorting will be reset to Name after leaving Profile module and params will be sanitized from url

## Week: December 28 – January 3

### Goals

- [~] Refactor MVC system architecture implementation

  - [ ] Modify code for the overlapping responsiblities currently shared between Model and Controller layers TODO 3
  - [x] Refactor the current Model structure into domain-driven Models: pokemonModel, favoritesModel, caughtModel TODO 2
  - [~] Offload controller functionality into the services -- follow fat models, skinny controllers guideline

- [x] Rename all searchState.js imports into queryState.js

- [x] BUG: Caught button event handler is running twice on every click, but not saving the Pokemon into Caught state (Search View)
- [ ] BUG: /profile/favorites and /profile/caught is not immediately rendering newly added Favorties/Caught Pokémon on profile -- page needs to be reloaded for new Pokémon
- [ ] BUG: When removing Caught Pokemon, the first index of the Caught array is being removed instead of the specific Pokemon selected
- [ ] BUG: Querying on Profile for Caught/Favorite Pokémon is not querying anything
- [ ] BUG: Sorting functionality is no longer working (name/id)
- [x] BUG: Caught/Favorites Pokémon is rendering before all Pokémon in general search query
