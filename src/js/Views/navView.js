import View from './View.js';

class NavView extends View {
  _parentEl = document.querySelector('.container');

  addHandlerNavigateBtn(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.header__btn');
      if (!btn) return;

      const page = btn.dataset.page;
      if (!page) return;

      handler(page);
    });
  }

  addHandlerBrowser(handler) {
    ['popstate', 'load'].forEach(e => window.addEventListener(e, handler));
  }

  addHandlerInitialLoad(handler) {
    document.addEventListener('DOMContentLoaded', handler);
  }

  // Removes all active classes and hides the current screens, prepping to instantiate a module
  resetNav() {
    this._parentEl
      .querySelectorAll(
        '.screen__1--search, .screen__2--search, .screen__1--map, .screen__2--map, .screen__1--profile, .screen__2--profile'
      )
      .forEach(page => page.classList.add('hidden'));

    this._parentEl
      .querySelectorAll(
        '.lights__inner--blue, .lights__inner--yellow, .lights__inner--green'
      )
      .forEach(light => light.classList.remove('lights__inner--active'));

    this._parentEl
      .querySelectorAll(
        '.header__btn--search, .header__btn--map, .header__btn--profile'
      )
      .forEach(btn => btn.classList.remove('btn--active'));
  }

  // Adds active classes to Search module indicators and reveals Search module screens
  toggleNavSearch() {
    this._parentEl
      .querySelectorAll('.screen__1--search, .screen__2--search')
      .forEach(screen => screen.classList.remove('hidden'));

    this._parentEl
      .querySelector('.lights__inner--blue')
      .classList.add('lights__inner--active');

    this._parentEl
      .querySelector('.header__btn--search')
      .classList.add('btn--active');
  }

  // Adds active classes to Map module indicators and reveals Map module screens
  toggleNavMap() {
    this._parentEl
      .querySelectorAll('.screen__1--map, .screen__2--map')
      .forEach(screen => screen.classList.remove('hidden'));

    this._parentEl
      .querySelector('.lights__inner--yellow')
      .classList.add('lights__inner--active');

    this._parentEl
      .querySelector('.header__btn--map')
      .classList.add('btn--active');
  }

  // Adds active classes to Profile module indicators and reveals Profile module screens
  toggleNavProfile() {
    this._parentEl
      .querySelectorAll('.screen__1--profile, .screen__2--profile')
      .forEach(screen => screen.classList.remove('hidden'));

    this._parentEl
      .querySelector('.lights__inner--green')
      .classList.add('lights__inner--active');

    this._parentEl
      .querySelector('.header__btn--profile')
      .classList.add('btn--active');
  }
}

export default new NavView();
