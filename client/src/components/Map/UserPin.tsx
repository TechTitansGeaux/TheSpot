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

  return (
    <div style={{ backgroundColor: 'black', width: '75px', border: '4px solid green' }} >
      {props.user.username}
    </div>

  );
};



export default UserPin;