// POKEDEX URL
export const BASE_POKEDEX_URL = 'http://localhost:8080/';

// EXTERNAL API URLS
export const MAIN_API_URL = 'https://pokeapi.co/api/v2/pokemon/';
export const DETAILS_API_URL = 'https://pokeapi.co/api/v2/pokemon-species/';
export const MOVE_TYPE_URL = 'https://pokeapi.co/api/v2/move/';
export const POKEMON_NAMES_API_URL =
  'https://pokeapi.co/api/v2/pokemon-species/?limit=1025';

// POKEMON QUERY CONSTRAINTS
export const TIMEOUT_SEC = 20;
export const LIMIT = 21;

// NATY'S PROFILE VARIABLES
export const PROFILE_NAME = 'Naty';
export const PROFILE_BIO =
  'Grew up catching Pokémon in the Bronx, now training my Pokémon and ready for battle in Dyckman.';
export const PROFILE_IMG =
  'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/ce59ab1e-3349-49ea-a021-e0fc8c0dc054/dau5pmk-ff876a20-b483-4ed0-8968-29b4648e5fe1.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2NlNTlhYjFlLTMzNDktNDllYS1hMDIxLWUwZmM4YzBkYzA1NFwvZGF1NXBtay1mZjg3NmEyMC1iNDgzLTRlZDAtODk2OC0yOWI0NjQ4ZTVmZTEuZ2lmIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.vnqf14GGZS1KBdD7b8MbxK4RX957bZwVMIH6PmxCo9I';

export const MAP_STYLES = [
  {
    elementType: 'geometry',
    stylers: [
      {
        color: '#ebe3cd',
      },
    ],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#523735',
      },
    ],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#f5f1e6',
      },
    ],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#c9b2a6',
      },
    ],
  },
  {
    featureType: 'administrative.land_parcel',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#dcd2be',
      },
    ],
  },
  {
    featureType: 'administrative.land_parcel',
    elementType: 'labels',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'administrative.land_parcel',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#ae9e90',
      },
    ],
  },
  {
    featureType: 'landscape.natural',
    elementType: 'geometry',
    stylers: [
      {
        color: '#dfd2ae',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [
      {
        color: '#dfd2ae',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#93817c',
      },
    ],
  },
  {
    featureType: 'poi.business',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'poi.medical',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#a5b076',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#447530',
      },
    ],
  },
  {
    featureType: 'poi.school',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'poi.sports_complex',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      {
        color: '#f5f1e6',
      },
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [
      {
        color: '#fdfcf8',
      },
    ],
  },
  {
    featureType: 'road.highway',
    stylers: [
      {
        visibility: 'simplified',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [
      {
        color: '#f8c967',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#e9bc62',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'road.highway.controlled_access',
    elementType: 'geometry',
    stylers: [
      {
        color: '#e98d58',
      },
    ],
  },
  {
    featureType: 'road.highway.controlled_access',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#db8555',
      },
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'labels',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#806b63',
      },
    ],
  },
  {
    featureType: 'transit',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'transit.line',
    elementType: 'geometry',
    stylers: [
      {
        color: '#dfd2ae',
      },
    ],
  },
  {
    featureType: 'transit.line',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#8f7d77',
      },
    ],
  },
  {
    featureType: 'transit.line',
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#ebe3cd',
      },
    ],
  },
  {
    featureType: 'transit.station',
    elementType: 'geometry',
    stylers: [
      {
        color: '#dfd2ae',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#b9d3c2',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#92998d',
      },
    ],
  },
];
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
