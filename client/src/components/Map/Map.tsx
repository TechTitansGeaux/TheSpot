import React, { useState, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';
import axios from 'axios';
import UserPin from './UserPin';
import { useSelector, useDispatch } from 'react-redux';
import { setAuthUser } from '../../store/appSlice';
import { RootState } from '../../store/store';



const Map = () => {
  const authUser = useSelector((state: RootState) => state.app.authUser);
  const dispatch = useDispatch();

  const [ users, setUsers ] = useState([])
  const [ loggedInLat, setLoggedInLat ] = useState(0);
  const [ loggedInLng, setLoggedInLng ] = useState(0);
  const [friendList, setFriendList] = useState([]);

  const getFriendList = () => {
    axios.get('/feed/friendlist')
      .then(({ data }) => {
        data.map((user: any) => {
          setFriendList((prev) => [...prev, user.accepter_id]);
        });
      })
      .catch((err) => {
        console.error('Failed to get Friends:', err);
      });
  }

    // get friends list
    useEffect(() => {
      getFriendList();
    }, []);

  // fetch all users
  const fetchUsers = () => {
    axios.get('/users')
      .then((res) => {
        setUsers(res.data);

      })
      .catch((err) => {
        console.log('error getting users', err);
      });
  }


  useEffect(() => {
    dispatch(setAuthUser(authUser))
  }, [authUser]);

  // set coordinates
  useEffect(() => {
    const [lat, lng] = splitCoords(authUser.geolocation);
    setLoggedInLat(+lat);
    setLoggedInLng(+lng);
    fetchUsers()
  }, [])

  // function to split coordinates into array
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
        >{users.map((user, i) => {
          if (user.privacy !== 'private' || user.id === authUser.id) {
            const [lat, lng] = splitCoords(user.geolocation);
            return <UserPin getFriendList={getFriendList} friendList={friendList} user={user} key={i} lat={+lat} lng={+lng} />;
          }
          return null;
        })}</GoogleMapReact>
      </div>

    </div>

  );
};

export default Map;
