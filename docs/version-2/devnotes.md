### Developer Notes

---

## Bugs to Fix (BROKEN FUNCTIONALITY)

- [x] Fix improper rendering of Pokémon searches (when the user types too quickly)
- [ ] Fix the number of Pokémon panels rendered during general Name/ID queries; when a Pokémon has invalid data from the PokéAPI, that panel is omitted instead of being used for the subsequent Pokémon (resulting in one or two less panels, making the visual design skewed and inconsistent)
- [x] Fix the broken pagination buttons (left, right) when navigating between Pokémon

---

## Areas of Improvement (ENHANCE USER EXPERIENCE)

- [x] Ensure the current file system properly reflects the MVC model before building off this system architecture
- [ ] Make the platform responsive for tablet and mobile users
- [ ] Make it clear that the user is intially loaded onto the Search module
- [ ] Disable buttons that are already active
- [ ] Hyperlink the Pokédex menu buttons to the Pokédex circular lights
- [x] Improve the loading speed of the Pokémon from the PokéAPI
- [ ] Render visual feedback while additional Pokémon is loading
- [x] Define the routing for pages while the user is navigating between modules
- [ ] Align the last Pokémon panels to the left, instead of the center
- [ ] If the Pokémon data is already loaded into cache, do not render loading spinner
- [ ] Implement CSS animations across Pokémon panels and menu buttons to create a smoother user experience
- [ ] Use LocalStorageAPI to cache Pokémon previews and Pokémon details into local storage
- [ ] Make input field, sort buttons, category buttons sticky at the top of the form
- [ ] If a Pokémon panel is loaded from the url, the Pokémon should automatically have its name rendered in the input search field (Search Module)

---

## Features to Implement (NEW DEVELOPMENTS)

### Minor Modifications

- [ ] Create an About module to discuss the project's purpose, objectives, functionality, technical details, challenges and solutions, and lessons learned.
- [ ] Add a "Type" sorting algorithm to the Search and Profile modules
- [ ] Create a personal Pokémon Trainer GIF to use on the Profile page
- [ ] Create "Page Not Found" page
- [ ] Create an error page for the user, redirect them to Search module
- [ ] Create "Types of Pokémon Favorited" on Profile module, that renders when accessing Favorite Pokémon

### Map Module

- [ ] Implement Google Maps library and render Caught Pokémon on a map
- [ ] Add location details to the entry panel
- [ ] When a user marks a Pokémon as "Caught" in the Search module, redirect them to the Map module to create a new entry
  - [ ] Pre-fill the entry data with Pokémon name, Pokémon ID, date, and time
  - [ ] When a user is clicking around the map, match the location details of the entry to the newly clicked location
- [ ] Keep entry panel hidden if a user is not currently logging an entry
- [ ] Sort Caught Pokémon entries
  - [ ] Sort by Name
  - [ ] Sort by ID
  - [ ] Sort by Date
- [ ] Render the number of Pokémon Caught in the Map module -- this number should match the number of Pokémon Caught indicated in the Profile module
- [ ] TBD: Should a user be allowed to manually add Caught Pokémon entries from the Map module?

---

## Technical Notes

- Try loading Pokémon into browser cache to reduce loading speed of future searches.
  - Currently, Pokémon data is initially loaded from the PokéAPI into memory... determine if it's more efficient to continue loading Pokémon like this or pivot towards leveraging browser cache to retain Pokémon data.

---

## Additional Notes
