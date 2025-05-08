const renderSpinner = function (parentEl) {
  const markup = `
    <div class="spinner">
        <svg>
            <use href="src/imgs/pokeball.svg"></use>
        </svg>
    </div>
  `;

  parentEl.innerHTML = '';
  parentEl.insertAdjacentHTML('afterbegin', markup);
};
