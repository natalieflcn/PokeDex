import View from '../View.js';

class GeneralErrorView extends View {
  _parentEl = document.querySelector('.error');
  _errorMessage = '';
}

export default new GeneralErrorView();
