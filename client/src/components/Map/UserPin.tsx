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

  const togglePopUp = () => {
    const box = document.getElementById(props.user.username + props.user.id)
    if (+box.style.opacity === 0) {
      box.style.opacity = '1';
    } else if (+box.style.opacity === 1) {
      box.style.opacity = '0';
    }
  }

  return (
    <div >
      <div className='dot' onClick={togglePopUp} >
        <div >
          {props.user.mapIcon}
        </div>
      </div>
      <div className='popUpBox' id={props.user.username + props.user.id} >
        <div style={{ textAlign: 'center', fontSize:'20px' }}>{props.user.username}</div>
      </div>

    </div>

  );
};



export default UserPin;