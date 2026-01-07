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

  - [x] Modify code for the overlapping responsiblities currently shared between Model and Controller layers
  - [x] Refactor the current Model structure into domain-driven Models: pokemonModel, favoritesModel, caughtModel
  - [~] Offload controller functionality into the services or models -- follow fat models, skinny controllers guideline
  - [~] Improve controller orchestration: searchController, profileController

- [x] Rename all searchState.js imports into queryState.js

- [x] BUG: Caught button event handler is running twice on every click, but not saving the Pokemon into Caught state (Search View)
- [x] BUG: Sorting functionality is no longer working (name/id)
- [x] BUG: Caught/Favorites Pokémon is rendering before all Pokémon in general search query

## Week: January 6 – January 9

### Goals

- [~] Refactor MVC system architecture implementation

  - [~] Offload controller functionality into the services or models -- follow fat models, skinny controllers guideline
  - [~] Improve controller orchestration: searchController, profileController

- [x] Refine loadPokemonResults logic in pokemonModel
- [x] Refine loadQueryResults logic in queryModel
- [x] Extract duplicate logic from loadPokemonResults and loadQueryResults into a shared service (pokemonService)
- [x] Review all methods in helpers.js and distribute methods to models or services, where applicable
- [~] Refine profileController and improve orchestration within functions
- [ ] Maintain sorting mode in pokemonState (string), caughtState (boolean, string), and favoriteState (boolean, string) to reinforce url-driven UI state

  - [ ] Sorting method should be persisted across page reloads, navigating around browser history stack, and accessing modules via UI buttons
  - [ ] Default sorting method should be by ID. This should not be reflected in the url (i.e. /search, /profile/category). Only /name (and potential future sorting params) should be reflected in the url.

- [ ] BUG: Platform crashes when querying for Pokémon that does not exist
- [ ] BUG: Search module renders all Pokémon after query results
- [ ] BUG: Platform crashes when using pagination buttons to navigate to Pokémon that exist, but are not rendered in the results yet (error most likely in controlSearchPagination method)
- [ ] BUG: /profile/favorites and /profile/caught is not immediately rendering newly added Favorties/Caught Pokémon on profile -- page needs to be reloaded for new Pokémon
- [ ] BUG: When removing Caught Pokemon, the first index of the Caught array is being removed instead of the specific Pokemon selected
- [ ] BUG: Querying on Profile for Caught/Favorite Pokémon is not querying anything
- [ ] BUG: When continuing to scroll after querying for Pokémon but there's no more results, general Pokémon results are being rendered instead

### Notes

- Consider using Local Storage API to store Pokémon into a cachedPokemon list and render Pokémon results and details directly from local storage instead
