export const toggleActivePreview = function (preview) {
  const currentlyActive = document.querySelector('.search__preview--active');

  if (currentlyActive && currentlyActive !== preview)
    currentlyActive.classList.remove('search__preview--active');

  preview.classList.add('search__preview--active');
};
