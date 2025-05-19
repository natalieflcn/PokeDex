import { LIMIT } from '../config';

export const state = {
  loading: false,
  allPokemon: {
    pokemonDB: [],
    loaded: false,
  },
  search: {
    query: '',
    queryResults: '',
    results: [],
    currentBatch: [], // For loading additional batches of Pokémon
    offset: 0,
    limit: LIMIT,
    hasMoreResults: true,
    currentRequestId: 0,
    mode: 'id',
  },
  pokemon: {},
  favorites: [],
  caught: [],
  profile: {
    name: 'Naty',
    bio: 'Grew up catching Pokémon in the Bronx, now training to catch Pokémon around Dyckman.',
    profileImg:
      'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/ce59ab1e-3349-49ea-a021-e0fc8c0dc054/dau5pmk-ff876a20-b483-4ed0-8968-29b4648e5fe1.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2NlNTlhYjFlLTMzNDktNDllYS1hMDIxLWUwZmM4YzBkYzA1NFwvZGF1NXBtay1mZjg3NmEyMC1iNDgzLTRlZDAtODk2OC0yOWI0NjQ4ZTVmZTEuZ2lmIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.vnqf14GGZS1KBdD7b8MbxK4RX957bZwVMIH6PmxCo9I',
    typesCaught: {
      Normal: 10,
      Fire: 10,
      Water: 10,
      Electric: 10,
      Grass: 10,
      Ice: 10,
      Fighting: 10,
      Poison: 10,
      Ground: 10,
      Flying: 10,
      Psychic: 10,
      Bug: 10,
      Rock: 10,
      Ghost: 10,
      Dragon: 10,
      Dark: 10,
      Steel: 10,
      Fairy: 10,
    },
    view: 'caught',
  },
};
