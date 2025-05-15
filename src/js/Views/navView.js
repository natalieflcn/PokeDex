import View from './View.js';

class NavView extends View {
  _parentEl = document.querySelector('.header__nav');

  addHandlerClick(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.header__btn');
      console.log(e.target);
      if (!btn) return;

      const page = btn.dataset.page;
      if (!page) return;

      const btns = document
        .querySelectorAll(
          '.screen__1--search, .screen__2--search, .screen__1--map, .screen__2--map, .screen__1--profile, .screen__2--profile'
        )
        .forEach(page => page.classList.add('hidden'));
      console.log('page is ' + page);
      handler(page);
    });
  }

  search() {
    console.log('search running');
    document
      .querySelectorAll('.screen__1--search, .screen__2--search')
      .forEach(screen => screen.classList.remove('hidden'));
  }

  map() {
    console.log('map running');
    document
      .querySelectorAll('.screen__1--map, .screen__2--map')
      .forEach(screen => screen.classList.remove('hidden'));
  }

  profile() {
    document
      .querySelectorAll('.screen__1--profile, .screen__2--profile')
      .forEach(screen => screen.classList.remove('hidden'));
  }
}

export default new NavView();
