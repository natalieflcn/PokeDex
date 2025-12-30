import { DETAILS_API_URL, MAIN_API_URL, MOVE_TYPE_URL } from '../config';
import { AJAX, capitalize } from '../helpers';

import caughtState from './state/caughtState';
import favoriteState from './state/favoriteState';
import panelState from './state/panelState';

// To create a Pokémon object after parsing PokéAPI data
export const createPokemonObject = async function (data) {
  // Loaded from MAIN_API_URL
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

  // Loaded from DETAILS_API_URL
  const eng = data[1].flavor_text_entries.find(
    entry => entry.language.name === 'en'
  );
  const flavor_text = eng?.flavor_text || data[1].flavor_text;
  // find eng flav text

  // Properties created from Caught and Favorites in state
  const caught = caughtState.caughtPokemon.some(p => p.id === id)
    ? true
    : false;
  const favorite = favoriteState.favoritePokemon.some(p => p.id === id)
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

// To load Pokémon details for the search panel [screen 2]
export const loadPokemon = async function (pokemon) {
  try {
    const data = await Promise.all([
      AJAX(`${MAIN_API_URL}${pokemon}`),
      AJAX(`${DETAILS_API_URL}${pokemon}`),
    ]);

    console.log(data);
    panelState.pokemon = await createPokemonObject(data);
    console.log(panelState.pokemon);

    console.log(panelState.pokemon);
  } catch (err) {
    console.error(err);
  }
};
