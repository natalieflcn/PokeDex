import pokemonState from './state/pokemonState';
import { extractPokemonId } from '../services/pokemonService';
import { AJAX, createPokemonPreviewObject, sortPokemonName } from '../helpers';
import { LIMIT, MAIN_API_URL, POKEMON_NAMES_API_URL } from '../config';

// To store all Pokémon names and IDs in our state (This shallow dataset will later be referenced to fetch more Pokémon details as needed)
export const storeAllPokemonReferences = async function () {
  const pokeAPIData = await AJAX(`${POKEMON_NAMES_API_URL}`);
  const { results } = pokeAPIData;

  for (const result of results) {
    const pokemonName = result.name;
    const pokemonId = extractPokemonId(result.url);

    pokemonState.allPokemonReferences.push({
      name: pokemonName,
      id: pokemonId,
    });
  }

  pokemonState.loadedReferences = true;
};

// To initiate a new request for general Pokémon
export const startPokemonRequest = function () {
  const requestId = ++pokemonState.currentRequestId;
  return requestId;
};

// To determine whether the current request for general Pokémon is the latest request, preventing race conditions
export const isStalePokemonRequest = function (requestId) {
  return pokemonState.currentRequestId !== requestId;
};

// To load general Pokémon (preview) details for the current batch rendered in Search module results
export const loadPokemonResults = async function (requestId) {
  try {
    pokemonState.loading = true;
    pokemonState.currentBatch = [];

    let pokemonBatch;

    // Parsing the URL for any sorting parameters (name/id) to organize data accordingly
    const sortParam = new URL(window.location.href).searchParams.get('sort');

    if (sortParam === 'name') {
      pokemonBatch = sortPokemonName(pokemonState.allPokemonReferences).slice(
        pokemonState.offset,
        pokemonState.offset + LIMIT
      );
    } else if (sortParam === 'id' || !sortParam) {
      pokemonBatch = pokemonState.allPokemonReferences.slice(
        pokemonState.offset,
        pokemonState.offset + LIMIT
      );
    }

    for (const pokemon of pokemonBatch) {
      try {
        if (isStalePokemonRequest(requestId)) return;

        const pokemonName = pokemon.name || pokemon;
        const pokemonDetails = await AJAX(`${MAIN_API_URL}${pokemonName}`);

        const pokemonPreview = createPokemonPreviewObject(
          pokemonName,
          pokemonDetails
        );

        if (isStalePokemonRequest(requestId)) return;

        pokemonState.currentBatch.push(pokemonPreview);
        pokemonState.results.push(pokemonPreview);
      } catch (err) {
        console.error(err);
      }
    }
    pokemonState.offset += LIMIT;
    pokemonState.loading = false;
  } catch (err) {
    throw err;
  }
};

// // To load additional Pokémon results
// export const loadAdditionalBatch = async function () {
//   // if (pokemonState.loading) return;

//   try {
//     pokemonState.loading = true;
//     pokemonState.currentBatch = [];

//     let pokemonBatch = [];

//     const sortParam = new URL(window.location.href).searchParams.get('sort');

//     if (sortParam === 'name') {
//       pokemonBatch = sortPokemonName(pokemonState.allPokemonReferences).slice(
//         pokemonState.offset,
//         pokemonState.offset + LIMIT
//       );
//     } else {
//       pokemonBatch = pokemonState.allPokemonReferences.slice(
//         pokemonState.offset,
//         pokemonState.offset + LIMIT
//       );
//     }

//     for (const pokemon of pokemonBatch) {
//       try {
//         const pokemonName = pokemon.name || pokemon;
//         const pokemonDetails = await AJAX(`${MAIN_API_URL}${pokemonName}`);
//         const pokemonPreview = createPokemonPreviewObject(
//           pokemonName,
//           pokemonDetails
//         );
//         pokemonState.currentBatch.push(pokemonPreview);
//       } catch (err) {
//         console.error(err);
//       }
//     }

//     pokemonState.results.push(...pokemonState.currentBatch);

//     pokemonState.offset += LIMIT;
//     pokemonState.loading = false;
//   } catch (err) {
//     throw err;
//   }
// };
