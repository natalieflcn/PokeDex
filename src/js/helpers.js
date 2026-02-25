import { TIMEOUT_SEC } from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} seconds.`));
    }, s * 1000);
  });
};

// To consolidate fetching data and parsing the JSON response
export const AJAX = async function (url) {
  try {
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`HTTP_${res.status}`);

    // ${data.message} (${res.status})

    return data;
  } catch (err) {
    if (err instanceof TypeError) throw new Error('NETWORK_ERROR');

    throw err;
  }
};

export const isEmpty = function (obj) {
  if (obj === null || typeof obj === 'undefined') {
    return true;
  }

  return Object.keys(obj).length === 0;
};

// To capitalize a word
export const capitalize = function (word) {
  if (!word) return;
  return word[0].toUpperCase().concat(word.slice(1));
};

// To debounce a function
export const debounce = function (func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId); // Clear previous timer
    timeoutId = setTimeout(() => {
      func.apply(this, args); // Call the function after delay
    }, delay);
  };
};

// To extract ID (name) of Pokémon from the URL TODO move to helpers.js
export const extractPokemonId = function (url) {
  const id = url.match(/\/(\d+)\/?$/);
  return id ? Number(id[1]) : null;
};

// To store Caught Pokémon and Favorite Pokémon in Local Storage
export const persistData = function (type, data) {
  localStorage.setItem(type, JSON.stringify(data));
};
