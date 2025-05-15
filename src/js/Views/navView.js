import View from './View.js';

class NavView extends View {
  _parentEl = document.querySelector('.header__nav');

  addHandlerClick(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.header__btn');
      if (!btn) return;

      const page = btn.dataset.page;
      if (!page) return;

      document
        .querySelectorAll(
          '.screen__1--search, .screen__2--search, .screen__1--map, .screen__2--map, .screen__1--profile, .screen__2--profile'
        )
        .forEach(page => page.classList.add('hidden'));

      document
        .querySelectorAll(
          '.lights__inner--blue, .lights__inner--yellow, .lights__inner--green'
        )
        .forEach(light => light.classList.remove('lights__inner--active'));
      handler(page);
    });
  }

  search() {
    document
      .querySelectorAll('.screen__1--search, .screen__2--search')
      .forEach(screen => screen.classList.remove('hidden'));

    document
      .querySelector('.lights__inner--blue')
      .classList.add('lights__inner--active');
  }

  map() {
    document
      .querySelectorAll('.screen__1--map, .screen__2--map')
      .forEach(screen => screen.classList.remove('hidden'));

    document
      .querySelector('.lights__inner--yellow')
      .classList.add('lights__inner--active');
  }

  profile() {
    document
      .querySelectorAll('.screen__1--profile, .screen__2--profile')
      .forEach(screen => screen.classList.remove('hidden'));

    document
      .querySelector('.lights__inner--green')
      .classList.add('lights__inner--active');
  }
}

export default new NavView();
