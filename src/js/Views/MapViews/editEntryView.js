import View from '../View.js';

class EditEntryView extends View {
  _parentEl = document.querySelector('.map__entry--container');
  _errorMessage = 'There was an error deleting this entry.';

  /**
   * Adds handler to profile category buttons
   *
   * @param {Function} handler - Profile controller callback (controlProfileCategoryBtn)
   */
  addHandlerEditBtn(handler) {
    this._parentEl.addEventListener('click', function (e) {
      e.preventDefault();

      const btn = e.target.closest('.map__entry--edit');
      if (!btn) return;

      const pokemon = btn
        .closest('.map__entry--options')
        .previousElementSibling.textContent.split('#')[0]
        .trim();

      handler(pokemon);
    });
  }
}

export default new EditEntryView();
