import View from '../View.js';

class PreviewView extends View {
  _parentEl = document.querySelector('.profile__preview--container');

  addHandlerActive(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const clicked = e.target.closest('.profile__preview');
      if (!clicked) return;

      //If there's already an active item, remove its class
      const currentlyActive = document.querySelector(
        '.profile__preview--active'
      );
      if (currentlyActive && currentlyActive !== clicked)
        currentlyActive.classList.remove('profile__preview--active');

      clicked.classList.add('profile__preview--active');

      handler(clicked.querySelector('.profile__preview--name').textContent);
    });
  }

  addHandlerHashChange(handler) {
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
  }

  clearActive() {}
  _generateMarkup() {
    const id = window.location.hash.slice(1);
    console.log(this._data.name, this._data.id, this._data.img);
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
