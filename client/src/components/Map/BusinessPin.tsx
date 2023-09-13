import React from 'react';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import dayjs = require('dayjs');
import { Marker, useMap } from 'react-map-gl';
dayjs.extend(localizedFormat);

type Props = {
  business: {
    id: number
    username: string
    displayName: string
    type: string
    geolocation: string
    mapIcon: string
    birthday: string
    privacy: null
    accessibility: null
    email: string
    picture: string
    googleId: string
    createdAt: string
    updatedAt: string
  }
  latitude: number
  longitude: number
  i: number
  // closeAllPopUps: () => void
  // zoom: number
}

const BusinessPin: React.FC<Props> = ({ business, latitude, longitude, i }) => {
  const togglePopUp = () => {
    const box = document.getElementById('popUp' + business.username + business.id)
    if (box.style.display === 'block') {
      box.style.animationName = 'popOff';
      setTimeout(() => {
        box.style.display = 'none';
      }, 500)
    } else {
      box.style.animationName = 'popOut';
      box.style.display = 'block';
    }
  }

  return (
    <Marker longitude={longitude} latitude={latitude} key={'userPin' + i} anchor='top' style={{zIndex: '0'}}>
      <div className='businessDot' id={business.username + business.id} onClick={ () => {
        // if (zoom < 15) {
        //   setZoom(15);
        //   setCenter({lat: lat - 0.005, lng: lng});
        // } else {
        //   setCenter({lat: lat - (0.005 / ( 2 ** (zoom - 15))), lng: lng});
        // }
        togglePopUp();
      }} >
        <img
          src={business.mapIcon}
          alt={business.username}
          style={{ width: '40px', height: '40px', marginLeft: '1.5px', marginTop: '2.5px'}}
        />
      </div>
      <div className='businessPopUp' id={'popUp' + business.username + business.id} >
        <div style={{ textAlign: 'center', fontSize:'20px', marginTop: '5px' }}>
            {business.displayName}
          </div>
          <div style={{ textAlign: 'center', fontSize: '15px' }}>
            @{business.username}
          </div>
          <div style={{ textAlign: 'center', fontSize: '15px', marginBottom: '5px' }}>
            <p>
              {`Joined: ${dayjs(business.createdAt).format('ll')}`}
            </p>
          </div>
      </div>
    </Marker>
  )
}

export default BusinessPin;
