import View from '../View.js';
import previewView from './previewView.js';
import { observeSentinel } from '../../helpers.js';

class CaughtView extends View {
  _parentEl = document.querySelector('.profile__preview--container');

  _errorMessage = 'We could not find any caught Pokémon! Please try again.';
  _sentinel = document.querySelector('.profile__sentinel');
  _observer = null;

  observe(handler) {
    this._observer = observeSentinel(this._sentinel, handler, {
      root: null,
      threshold: 0.01,
      rootMargin: '100%',
    });
    console.log('RV observe is running');
  }

  unobserve() {
    this._observer.unobserve(this._sentinel);
    console.log('RV unobserve is running');
  }

  _generateMarkup() {
    // Map each Pokémon from an array of data created with previewView markup texts and consolidate markup into one string
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new CaughtView();
