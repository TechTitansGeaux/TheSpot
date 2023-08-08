import * as React from 'react';

const Map = () => {
  // Initialize and add the map
  let map;
  async function initMap(): Promise<void> {
    // The location of Uluru
    const position = { lat: -25.344, lng: 131.031 };

    // Request needed libraries.
    //@ts-ignore
    const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

    // The map, centered at Uluru
    map = new Map(
      document.getElementById('map') as HTMLElement,
      {
        zoom: 4,
        center: position,
        mapId: 'DEMO_MAP_ID',
      }
    );

    // The marker, positioned at Uluru
    const marker = new AdvancedMarkerElement({
      map: map,
      position: position,
      title: 'Uluru'
    });
  }

initMap();
  return (
    <div>
      <h1>Map</h1>
      <div id="map"></div>
      {/* <iframe
        width="600"
        height="450"
        style={{border: 0}}
        loading="lazy"
        src="https://www.google.com/maps/embed/v1/place?key=AIzaSyAYtb7y6JZ2DxgdIESWJky8NyhWuu_YFVg&q=Tipitinas,New+Orleans+LA">
        </iframe> */}
    </div>

  );
};

export default Map;
