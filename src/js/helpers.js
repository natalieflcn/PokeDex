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

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    return data;
  } catch (err) {
    throw err;
  }
};

// To capitalize a word
export const capitalize = function (word) {
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

// To observe a sentinel with IntersectionObserverAPI
export const observeSentinel = function (sentinel, handler, options) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(
      entry => {
        if (entry.isIntersecting) handler();
      },
      {
        root: options.root,
        threshold: options.threshold,
        rootMargin: options.rootMargin,
      }
    );
  });

  observer.observe(sentinel);

  return observer;
};

// To create a Pokémon preview object after parsing PokéAPI data
export const createPokemonPreviewObject = function (name, details) {
  const {
    id,
    sprites: { front_default: img },
  } = details;

  console.log(name, id, img);

  return {
    name: capitalize(name),
    id,
    img,
  };
};
