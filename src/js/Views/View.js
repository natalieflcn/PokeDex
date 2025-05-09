import pokeball from 'url:../../imgs/pokeball-favicon.svg';

export default class View {
  _data;

  _clear() {
    this._parentEl.innerHTML = '';
  }

  renderSpinner = function (parentEl) {
    const markup = `
    <div class="spinner__div">
        <img class="spinner__img" src="${pokeball}"/>
    </div>
  `;

    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  };

  render(data) {
    if (!data) {
      return this.renderError();
    }

    this._data = data;
    const markup = this._generateMarkup();

    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    console.log(message);
  }
}
