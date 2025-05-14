import View from './View.js';
import previewView from './previewView.js';
import { observeSentinel, unobserveSentinel } from '../helpers.js';

class ResultsView extends View {
  _parentEl = document.querySelector('.search__preview--container');

  _errorMessage = 'We could not find that Pokémon! Please try again.';
  _observer = null;

  observe(sentinel, handler) {
    this._observer = observeSentinel(sentinel, handler, {
      root: null,
      threshold: 0.01,
      rootMargin: '100%',
    });
    console.log('RV observe is running');
  }

  unobserve() {
    unobserve(this._observer, sentinel);
    console.log('RV unobserve is running');
  }

  _generateMarkup() {
    // Map each Pokémon from an array of data created with previewView markup texts and consolidate markup into one string
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultsView();

// export const observeSentinel = function (sentinel, handler, options) {
//   const observer = new IntersectionObserver(entries => {
//     entries.forEach(
//       entry => {
//         if (entry.isIntersecting) handler();
//       },
//       {
//         root: options.root,
//         threshold: options.threshold,
//         rootMargin: options.rootMargin,
//       }
//     );
//   });

//   observer.observe(sentinel);
// };

// // To unobserve a sentinel
// export const unobserveSentinel = function (observer, sentinel) {
//   if (observer && sentinel) {
//     observer.unobserve(sentinel);
//   }
// };
