import * as React from 'react';
import GoogleMapReact from 'google-map-react';


const Map = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ height: '75vh', width: '80%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyAYtb7y6JZ2DxgdIESWJky8NyhWuu_YFVg" }}
          defaultZoom={15}
          defaultCenter={{lat: 29.917448559152003, lng: -90.10073471661711}}
        ></GoogleMapReact>
      </div>

    </div>

  );
};

export default Map;
