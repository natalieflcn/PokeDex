import panelState from './state/panelState';
import caughtState from './state/caughtState';
import favoriteState from './state/favoriteState';
import { AJAX, capitalize } from '../helpers';
import { DETAILS_API_URL, MAIN_API_URL, MOVE_TYPE_URL } from '../config';

// To create a detailed Pokémon object after parsing PokéAPI data
export const createPokemonObject = async function (data) {
  // Data loaded from MAIN_API_URL (data[0])
  const {
    name,
    id,
    sprites: { front_default: img },
    height,
    weight,
  } = data[0];

  const types = data[0].types.map(entry => capitalize(entry.type.name));
  const stats = data[0].stats.map(stat => [stat.stat.name, stat.base_stat]);
  const moves = [];

  for (const move of data[0].moves.slice(13, 19)) {
    const moveType = await AJAX(`${MOVE_TYPE_URL}${move.move.name}`);

    moves.push([
      move.move.name
        .split('-')
        .map(word => capitalize(word))
        .join(' '),
      capitalize(moveType.type.name),
    ]);
  }

  // Data loaded from DETAILS_API_URL (data[1])
  const language = data[1].flavor_text_entries.find(
    entry => entry.language.name === 'en'
  );
  const flavor_text = language?.flavor_text || data[1].flavor_text;

  // Data fetched from caughtState
  const caught = caughtState.caughtPokemon.some(pokemon => pokemon.id === id)
    ? true
    : false;

  // Data fetched from favoriteState
  const favorite = favoriteState.favoritePokemon.some(
    pokemon => pokemon.id === id
  )
    ? true
    : false;

  return {
    name: capitalize(name),
    id,
    img,
    types,
    desc: flavor_text,
    height,
    weight,
    stats,
    moves,
    caught,
    favorite,
  };
};

// To load Pokémon details for the Search panel
export const loadPokemon = async function (pokemon) {
  try {
    const data = await Promise.all([
      AJAX(`${MAIN_API_URL}${pokemon}`),
      AJAX(`${DETAILS_API_URL}${pokemon}`),
    ]);

    panelState.pokemon = await createPokemonObject(data);
  } catch (err) {
    console.error(err);
  }
};
