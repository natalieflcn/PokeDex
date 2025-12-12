// POKEDEX URL
export const BASE_POKEDEX_URL = 'http://localhost:8080/';

// EXTERNAL API URLS
export const MAIN_API_URL = 'https://pokeapi.co/api/v2/pokemon/';
export const DETAILS_API_URL = 'https://pokeapi.co/api/v2/pokemon-species/';
export const MOVE_TYPE_URL = 'https://pokeapi.co/api/v2/move/';
export const POKEMON_NAMES_API_URL =
  'https://pokeapi.co/api/v2/pokemon-species/?limit=1025';

// POKEMON QUERY CONSTRAINTS
export const TIMEOUT_SEC = 10;
export const LIMIT = 21;

// NATY'S PROFILE VARIABLES
export const PROFILE_NAME = 'Naty';
export const PROFILE_BIO =
  'Grew up catching Pokémon in the Bronx, now training to catch Pokémon around Dyckman.';
export const PROFILE_IMG =
  'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/ce59ab1e-3349-49ea-a021-e0fc8c0dc054/dau5pmk-ff876a20-b483-4ed0-8968-29b4648e5fe1.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2NlNTlhYjFlLTMzNDktNDllYS1hMDIxLWUwZmM4YzBkYzA1NFwvZGF1NXBtay1mZjg3NmEyMC1iNDgzLTRlZDAtODk2OC0yOWI0NjQ4ZTVmZTEuZ2lmIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.vnqf14GGZS1KBdD7b8MbxK4RX957bZwVMIH6PmxCo9I';

/**
 * Pokemon Name (https://pokeapi.co/api/v2/pokemon-form/1/ --> "name":"bulbasaur"
 *
 * Image -- Pokemon Visual (https://pokeapi.co/api/v2/pokemon-form/1/ --> "front_default":"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png")
 *
 * ID -- Number in Pokedex (https://pokeapi.co/api/v2/pokemon-form/1/ --> "id":1
 *
 * Types -- 1 or 2 (https://pokeapi.co/api/v2/pokemon-form/1/ --> "types":[{"slot":1,"type":{"name":"grass","url":"https://pokeapi.co/api/v2/type/12/"}},{"slot":2,"type":{"name":"poison","url":"https://pokeapi.co/api/v2/type/4/"}}]
 *
 * Description -- of Pokemon --> https://pokeapi.co/api/v2/pokemon-species/1 --> "flavor_text_entries":[{"flavor_text":"Obviously prefers\nhot places. When\nit rains, steam\fis said to spout\nfrom the tip of\nits tail.","language":{"name":"en","url":"https://pokeapi.co/api/v2/language/9/"}
 *
 * Height -- https://pokeapi.co/api/v2/pokemon/1/ --> "height":7
 *
 * Weight -- https://pokeapi.co/api/v2/pokemon/1/ --> "weight":69
 *
 
 *
 * Moves -- 3 moves? -- https://pokeapi.co/api/v2/pokemon/1/ --> "moves":[{"move":{"name":"razor-wind","url":"https://pokeapi.co/api/v2/move/13/"},"version_group_details":[{"level_learned_at":0,"move_learn_method":{"name":"egg","url":"https://pokeapi.co/api/v2/move-learn-method/2/"},"order":null,"version_group":{"name":"gold-silver","url":"https://pokeapi.co/api/v2/version-group/3/"}},{"level_learned_at":0,"move_learn_method":{"name":"egg","url":"https://pokeapi.co/api/v2/move-learn-method/2/"},"order":null,"version_group":{"name":"crystal","url":"https://pokeapi.co/api/v2/version-group/4/"}}]},{"move":{"name":"swords-dance","url":"https://pokeapi.co/api/v2/move/14/"},"version_group_details":[{"level_learned_at":0,"move_learn_method":{"name":"machine","url":"https://pokeapi.co/api/v2/move-learn-method/4/"},"order":null,"version_group":{"name":"red-blue","url":"https://pokeapi.co/api/v2/version-group/1/"}},{"level_learned_at":0,"move_learn_method":{"name":"machine","url":"https://pokeapi.co/api/v2/move-learn-method/4/"}
 *
 * https://pokeapi.co/api/v2/move/{id or name}/ --> Pokemon Move Type
 *
 * Base Stats -- HP, ATK, DEF, SATK, SDEF, SPO -- https://pokeapi.co/api/v2/pokemon/1/ -->  "stats":[{"base_stat":45,"effort":0,"stat":{"name":"hp","url":"https://pokeapi.co/api/v2/stat/1/"}},{"base_stat":49,"effort":0,"stat":{"name":"attack","url":"https://pokeapi.co/api/v2/stat/2/"}},{"base_stat":49,"effort":0,"stat":{"name":"defense","url":"https://pokeapi.co/api/v2/stat/3/"}},{"base_stat":65,"effort":1,"stat":{"name":"special-attack","url":"https://pokeapi.co/api/v2/stat/4/"}},{"base_stat":65,"effort":0,"stat":{"name":"special-defense","url":"https://pokeapi.co/api/v2/stat/5/"}},{"base_stat":45,"effort":0,"stat":{"name":"speed","url":"https://pokeapi.co/api/v2/stat/6/"}}]
 **/
