import { reset } from '../services/navService.js';
import View from './View.js';

class NavView extends View {
  _parentEl = document.querySelector('.header__nav');

  addHandlerClickNavBtn(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.header__btn');
      if (!btn) return;

      const page = btn.dataset.page;
      if (!page) return;

      handler(page);
    });
  }
}

export default new NavView();
