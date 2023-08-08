import * as React from 'react';

const Map = () => {
  return (
    <div className='flex-container'>
      <h1>MAP</h1>
      <iframe
        width="600"
        height="450"
        style={{border: 0}}
        loading="lazy"
        src="https://www.google.com/maps/embed/v1/place?key=AIzaSyAYtb7y6JZ2DxgdIESWJky8NyhWuu_YFVg&q=Tipitinas,New+Orleans+LA">
        </iframe>
    </div>

  );
};

export default Map;
