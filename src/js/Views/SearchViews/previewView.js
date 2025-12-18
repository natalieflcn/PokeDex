import View from '../View.js';

class PreviewView extends View {
  _parentEl = document.querySelector('.search__preview--container');

  addHandlerActive(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const clicked = e.target.closest('.search__preview');
      if (!clicked) return;

      //If there's already an active item, remove its class
      const currentlyActive = document.querySelector(
        '.search__preview--active'
      );
      if (currentlyActive && currentlyActive !== clicked)
        currentlyActive.classList.remove('search__preview--active');

      clicked.classList.add('search__preview--active');

      handler(clicked.querySelector('.search__preview--name').textContent);
    });
  }

  addHandlerHashChange(handler) {
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
  }

  clearActive() {}
  _generateMarkup() {
    const id = window.location.hash.slice(1);
    // console.log(this._data.name, this._data.id, this._data.img);
    return `
            <div class="search__preview ${
              this._data.name === id ? 'search__preview--active' : ''
            }">
                <span class="pokemon__id search__preview--id">#${
                  this._data.id
                }</span
                ><img
                  class="search__preview--img"
                  src=${this._data.img}
                  alt=""
                />
                <p class="search__preview--name">${this._data.name}</p>
            </div>
            `;
  }
}

export default new PreviewView();
