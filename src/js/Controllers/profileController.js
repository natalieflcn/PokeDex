import * as profileModel from '../Models/profileModel.js';

const controlSavedResults = async function () {
  try {
    if (caughtView._observer) caughtView.unobserve();

    const requestId = ++searchModel.state.search.currentRequestId;

    await profileModel.loadPokemonResults('caught', requestId);

    caughtView.render(profileModel.state.search.results);
  } catch (err) {
    console.error(err);
  }
};

export const controlProfileInit = function () {};
