import View from '../View.js';

class PreviewView extends View {
  _parentEl = document.querySelector('.profile__preview--container');

  //TODO -- consolidate this functionality into search previewView class
  addHandlerRedirect(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const preview = e.target.closest('.profile__preview');
      if (!preview) return;

      const pokemonName = preview.querySelector(
        '.profile__preview--name'
      ).textContent;
      handler(pokemonName);
    });
  }

  addHandlerHashChange(handler) {
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
  }

  _generateMarkup() {
    return `
            <div class="profile__preview ">
                <span class="pokemon__id profile__preview--id">#${this._data.id}</span
                ><img
                  class="profile__preview--img"
                  src=${this._data.img}
                  alt=""
                />
                <p class="profile__preview--name">${this._data.name}</p>
            </div>
            `;
  }
}

export default new PreviewView();
