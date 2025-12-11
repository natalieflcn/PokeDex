// Removes all active classes and hides the current screens, prepping to instantiate a module
export const reset = function () {
  document
    .querySelectorAll(
      '.screen__1--search, .screen__2--search, .screen__1--map, .screen__2--map, .screen__1--profile, .screen__2--profile'
    )
    .forEach(page => page.classList.add('hidden'));

  document
    .querySelectorAll(
      '.lights__inner--blue, .lights__inner--yellow, .lights__inner--green'
    )
    .forEach(light => light.classList.remove('lights__inner--active'));

  document
    .querySelectorAll(
      '.header__btn--search, .header__btn--map, .header__btn--profile'
    )
    .forEach(btn => btn.classList.remove('btn--active'));
};

// Adds active classes to Search module indicators and reveals Search module screens
export const search = function () {
  document
    .querySelectorAll('.screen__1--search, .screen__2--search')
    .forEach(screen => screen.classList.remove('hidden'));

  document
    .querySelector('.lights__inner--blue')
    .classList.add('lights__inner--active');

  document.querySelector('.header__btn--search').classList.add('btn--active');
};

// Adds active classes to Search module indicators and reveals Search module screens
export const map = function () {
  document
    .querySelectorAll('.screen__1--map, .screen__2--map')
    .forEach(screen => screen.classList.remove('hidden'));

  document
    .querySelector('.lights__inner--yellow')
    .classList.add('lights__inner--active');

  document.querySelector('.header__btn--map').classList.add('btn--active');
};

// Adds active classes to Search module indicators and reveals Search module screens
export const profile = function () {
  document
    .querySelectorAll('.screen__1--profile, .screen__2--profile')
    .forEach(screen => screen.classList.remove('hidden'));

  document
    .querySelector('.lights__inner--green')
    .classList.add('lights__inner--active');

  document.querySelector('.header__btn--profile').classList.add('btn--active');
};
