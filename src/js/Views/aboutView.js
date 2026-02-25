import View from './View';

class AboutView extends View {
  _parentEl = document.querySelector('.screen__border');
  _errorMessage = 'There was a problem loading the About module.';
  //   _aboutHandlerAttached = false;
  /**
   * Adds handler to Pokémon panel pagination buttons ('prev'/'next')
   *
   * @param {Function} handler - Search controller callback (controlSearchPagination)
   */
  addHandlerAboutBtn(handler) {
    this._parentEl
      .querySelectorAll('.screen__1--about, .screen__2--about')
      .forEach(screen =>
        screen.addEventListener('click', function (e) {
          const btn = e.target.closest('.about__btn');

          if (!btn) return;

          const page = btn.dataset.action;
          if (!page) return;

          handler(page);
        }),
      );
  }

  scrollToTop() {
    const screenTops = [
      this._parentEl.querySelector('.screen__1--about'),
      this._parentEl.querySelector('.screen__2--about'),
    ];

    if (screenTops.length === 0) return;

    screenTops.forEach(screen =>
      screen.scrollIntoView({ behavior: 'auto', block: 'start' }),
    );

    const recalibrateScreen = document.querySelector('.header__logo');
    recalibrateScreen.scrollIntoView({ behavior: 'auto', block: 'start' });
  }
}

export default new AboutView();
