import View from './View.js';

class PreviewView extends View {
  _parentEl = document.querySelector('.search__preview--container');
  _errorMessage = 'We could not find that Pokémon! Please try again.';

  _generateMarkup() {
    console.log('markup working');
    //Data only returns name -- this is not working because its not receiving id or img
    return `
            <div class="search__preview search__preview--active">
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
