import { MAIN_API_URL } from '../config';
import { AJAX, capitalize } from '../helpers';

// To find Pokémon that begin with the passed-in substring
export const possiblePokemon = function (substring, pokemonSet) {
  return pokemonSet.filter(pokemon =>
    capitalize(pokemon.name).startsWith(capitalize(substring))
  );
};

const fetchPokemon = async function (pokemonName) {
  return await AJAX(`${MAIN_API_URL}${pokemonName}`);
};

// To create a Pokémon preview object after parsing PokéAPI data
const createPokemonPreviewObject = function (name, details) {
  const {
    id,
    sprites: { front_default: img },
  } = details;

  return {
    name: capitalize(name),
    id,
    img,
  };
};

// To sort Pokémon search results by name OR id -- for queries ONLY
export const sortPokemon = function (pokemon) {
  let sortedPokemon;

  const sortParam = new URL(window.location.href).searchParams.get('sort');

  if (sortParam === 'name') {
    sortedPokemon = pokemon.toSorted((a, b) => a.name.localeCompare(b.name));
  } else {
    sortedPokemon = pokemon.toSorted((a, b) => a.id - b.id);
  }

  return sortedPokemon;
};

export const loadBatch = function (pokemonBatch) {
  const pokemonBatchDetails = pokemonBatch.map(pokemon => {
    const pokemonName = pokemon.name || pokemon;

    return fetchPokemon(pokemonName)
      .then(pokemonDetails =>
        createPokemonPreviewObject(pokemonName, pokemonDetails)
      )
      .catch(err => {
        console.error(`Failed to load Pokémon: ${pokemonName}`, err);
        return null;
      });
  });

  return pokemonBatchDetails;
};

export const loadPokemonPreviews = async pokemonRequests => {
  return await Promise.all(pokemonRequests);
};

export const filterPokemonPreviews = pokemonPreviews =>
  pokemonPreviews.filter(Boolean);
