import dayjs = require('dayjs');
import localizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(localizedFormat)
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setAuthUser } from '../../store/appSlice';
import { RootState } from '../../store/store';


type Props = {
  user: {
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
};


const UserPin: React.FC<Props> = (props) => {
  const dispatch = useDispatch();
  const authUser = useSelector((state: RootState) => state.app.authUser);
  const [geolocation, setGeolocation] = useState('');

  useEffect(() => {
    if (authUser && props.user) {
      setAuthUser(authUser);
      setGeolocation(authUser.geolocation);
    }
  }, [authUser, props.user]);

  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

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
        <img
          src={props.user.mapIcon}
          alt={props.user.username}
          style={{ width: '32px', height: '32px', marginLeft: '0.5rem' }}
        />
        </div>
      </div>
      <div className='popUpBox' id={props.user.username + props.user.id} >
        <div style={{ textAlign: 'center', fontSize:'20px' }}>{props.user.username}</div>
      </div>
    </div>
  );
};


//     <div
//       onMouseEnter={handleMouseEnter}
//       onMouseLeave={handleMouseLeave}
//       style={{ position: 'relative', cursor: 'pointer' }}
//     >
//       <img
//         src={props.user.mapIcon}
//         alt={props.user.username}
//         style={{ width: '32px', height: '32px', marginLeft: '0.5rem' }}
//       />
//       {isHovered && (
//         <div
//           style={{
//             position: 'absolute',
//             top: '-25px',
//             left: '50%',
//             transform: 'translateX(-50%)',
//             backgroundColor: 'var(--purple)',
//             padding: '2px 5px',
//             borderRadius: '4px',
//             boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
//             zIndex: 1,
//           }}
//         >
//           <p>{`@${props.user.username}`}</p>
//           <p>{`Member Since: ${dayjs(props.user.createdAt).format('ll')}`}</p>
//         </div>
//       )}

export default UserPin;
