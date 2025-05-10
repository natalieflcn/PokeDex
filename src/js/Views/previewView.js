import View from './View.js';

class PreviewView extends View {
  _parentEl = '';

  _generateMarkup(activePokemon = 0) {
    //search__preview--active TODO Need to implement active class based on active Pokemon (Pokemon in the state)

    return `
            <div class="search__preview">
                <span class="pokemon__id search__preview--id">#${this._data.id}</span
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
