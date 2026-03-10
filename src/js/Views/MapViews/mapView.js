import View from '../View.js';

class MapView extends View {
  _parentEl = document.getElementById('map');
  _errorMessage = 'There was an error rendering the map.';

  /**
   * Adds handler to navigation light bulbs (another way to navigate across pages besides navigation menu buttons).
   *
   * @param {Function} handler - Navigation controller callback (controlNavBtn)
   */

  getMapElement() {
    return this._parentEl;
  }

  createMapMarker(latitude, longitude) {
    var marker = new google.maps.Marker({
      position: { lat: latitude, lng: longitude },
      title:
        'Location Place or Anything that you want to tooltip while hovering',
    });
  }
}

export default new MapView();
