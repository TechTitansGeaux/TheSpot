import React, { useState, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';
import axios from 'axios';
import UserPin from './UserPin';
import { useSelector, useDispatch } from 'react-redux';
import { setAuthUser } from '../../store/appSlice';
import { RootState } from '../../store/store';

type Props = {
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
};

const Map: React.FC<Props> = ({loggedIn}) => {
  const authUser = useSelector((state: RootState) => state.app.authUser);

  const [ users, setUsers ] = useState([])
  const [ loggedInLat, setLoggedInLat ] = useState(0);
  const [ loggedInLng, setLoggedInLng ] = useState(0);
  const [geolocation, setGeolocation] = React.useState('');

  useEffect(() => {
    setAuthUser(authUser)
    setGeolocation(authUser.geolocation)
  }, [authUser]);

  useEffect(() => {
    const [lat, lng] = splitCoords(loggedIn.geolocation);
    setLoggedInLat(+lat);
    setLoggedInLng(+lng)
    axios.get('/users')
      .then((res) => {
        setUsers(res.data);

      })
      .catch((err) => {
        console.log('error getting users', err);
      });
  }, [])

  const splitCoords = (coords: string) => {
    const arr = coords.split(',');
    return arr;
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ height: '75vh', width: '80%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyAYtb7y6JZ2DxgdIESWJky8NyhWuu_YFVg" }}
          defaultZoom={15}
          defaultCenter={{lat: loggedInLat, lng: loggedInLng}}
        >{
          users.map((user, i) => {
            const [lat, lng] = splitCoords(user.geolocation);
            return <UserPin user={user} key={i} lat={+lat} lng={+lng} />
          })
        }</GoogleMapReact>
      </div>

    </div>

  );
};

export default Map;
