import React from 'react';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import dayjs = require('dayjs');
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
  lat: number
  lng: number
}

const BusinessPin: React.FC<Props> = ({ business }) => {
  const togglePopUp = () => {
    const box = document.getElementById('popUp' + business.username + business.id)
    if (box.style.display === 'block') {
      box.style.display = 'none';
    } else {
      box.style.display = 'block';
    }
  }

  return (
    <div>
      <div className='businessDot' id={business.username + business.id} onClick={togglePopUp} >
        <img
          src={business.mapIcon}
          alt={business.username}
          style={{ width: '40px', height: '40px', marginLeft: '1.5px', marginTop: '2.5px'}}
        />
      </div>
      <div className='businessPopUp' id={'popUp' + business.username + business.id} >
        <div style={{ textAlign: 'center', fontSize: '20px' }}>
            {business.displayName}
          </div>
          <div style={{ textAlign: 'center', fontSize: '14px' }}>
            @{business.username}
          </div>
          <div style={{ textAlign: 'center', fontSize: '15px' }}>
            <p>
              {`Member Since: ${dayjs(business.createdAt).format('ll')}`}
            </p>
          </div>
      </div>
    </div>
  )
}

export default BusinessPin;
