class SearchView {
  _parentEl = document.querySelector('.search__form');

  getQuery() {
    return this._parentEl.querySelector('.search__input').value;
  }

  addHandlerSearch(handler) {
    this._parentEl.addEventListener('input', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
