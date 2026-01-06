import { MAIN_API_URL } from '../config';
import { AJAX, createPokemonPreviewObject } from '../helpers';

// To extract ID (name) of Pokémon from the URL TODO move to helpers.js
export const extractPokemonId = function (url) {
  const id = url.match(/\/(\d+)\/?$/);
  return id ? Number(id[1]) : null;
};

//
export const fetchPokemon = async function (pokemonName) {
  return await AJAX(`${MAIN_API_URL}${pokemonName}`);
};

export const loadBatch = function (pokemonBatch) {
  const pokemonRequests = pokemonBatch.map(pokemon => {
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

  return pokemonRequests;
};

export const loadPokemonPreviews = async pokemonRequests => {
  return await Promise.all(pokemonRequests);
};

export const filterPokemonPreviews = pokemonPreviews =>
  pokemonPreviews.filter(Boolean);
