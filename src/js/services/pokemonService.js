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
