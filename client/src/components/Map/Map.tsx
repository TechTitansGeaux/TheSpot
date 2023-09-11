import './Map.css';
import React from 'react';
import MapBox from 'react-map-gl';


type Props =  {
  loggedIn: {
    id: number;
    username: string;
    displayName: string;
    type: string;
    geolocation: string;
    mapIcon: string;
    birthday: string;
    privacy: string;
    accessibility: string;
    email: string;
    picture: string;
    googleId: string;
  }
  reelEvent: any;
}

type User = {
  id: number;
  geolocation: string;
}


const Map: React.FC<Props> = () => {
  return (
    <div className='mapParent'>
      <div className='mapChild'>
        <div id='map'>
          <MapBox
            mapboxAccessToken="pk.eyJ1IjoiYmVuamFtaW5rbGVpbjk5IiwiYSI6ImNsbWUzMnZxZDFma3EzZHE2NG1hdjUxdjQifQ.-dyi2R3I4LmoAH-MWuNZPA"
            initialViewState={{
              longitude: -122.4,
              latitude: 37.8,
              zoom: 14
            }}
            style={{width: '100%', height: '100%'}}
            mapStyle="mapbox://styles/mapbox/streets-v9"
          />
        </div>
        <div className='legend'>
          <div className='userKey'></div><div className='userKeyText'> USERS </div>
          <div className='eventKey'></div><div className='eventKeyText'> EVENTS </div>
          <div className='businessKey'></div><div className='businessKeyText'> BUSINESSES </div>
        </div>
      </div>
    </div>

  );
};

export default Map;