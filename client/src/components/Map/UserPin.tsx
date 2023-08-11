import React from 'react';

type Props = {
  user: {
    id: number
    username: string
    displayName: string
    type: string
    geolocation: string
    mapIcon: null
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
};

const UserPin: React.FC<Props> = (props) => {
  console.log('rendered pin');
  return (
    <div className='dot' >
      <div style={{ fontSize: '30px', textAlign: 'center' }} >
        {props.user.mapIcon}
      </div>
    </div>

  );
};



export default UserPin;