import * as React from 'react';
import GoogleMapReact from 'google-map-react';


const Map = () => {
  return (
    <div>
      <h1>Map</h1>
      <div>
        <GoogleMapReact defaultZoom={10} defaultCenter={{lat: 34.0522, lng: -118.2437}}></GoogleMapReact>
      </div>
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
