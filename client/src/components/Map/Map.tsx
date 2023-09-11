import './Map.css';
import React, { useState, useEffect } from 'react';
import MapBox from 'react-map-gl';
import axios from 'axios';
import UserPin from './UserPin';
import CircularProgress from '@mui/material/CircularProgress';


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


const Map: React.FC<Props> = (props) => {
  const { loggedIn } = props;

  const [ users, setUsers ] = useState([]);
  const [ friendList, setFriendList ] = useState([]);
  const [ pendingFriendList, setPendingFriendList ] = useState([]);
  const [ initView, setInitView ] = useState({})


  // gets users friends
  const getFriendList = () => {
    axios.get('/feed/friendlist')
      .then(({ data }) => {
        const friendsIds = data.reduce((acc: number[], user: any) => {
          acc.push(user.accepter_id);
          return acc;
        }, []);
        setFriendList(friendsIds);
      })
      .catch((err) => {
        console.error('Failed to get Friends:', err);
      });
  }

  // gets users pending friend requests
  const getPendingFriendList = () => {
    axios.get('/friends/pending')
      .then(({ data }) => {
        const pendingFriendsIds = data.reduce((acc: number[], user: any) => {
          acc.push(user.accepter_id);
          return acc;
        }, []);
        setPendingFriendList(pendingFriendsIds);
      })
      .catch((err) => {
        console.error('Failed to get pending Friends:', err);
      });
  }

  // get all users
  const getUsers = () => {
    axios.get('/users')
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.log('error getting users', err);
      });
  }

  useEffect(() => {
    if (loggedIn) {
      getUsers();
      getFriendList();
      getPendingFriendList();
      const [lat, lng] = splitCoords(loggedIn.geolocation);
      setInitView({latitude: +lat, longitude: +lng, zoom: 10})
    }
  }, [loggedIn])

  // function to split coordinates into array so lat and lng can easily be destructured
  const splitCoords = (coords: string) => {
    const arr = coords.split(',');
    return arr;
  }

  if (!users.length || !businesses.length || !loggedIn) {
    // Data is not yet available, render loading ring
    return (
      <div style={{textAlign: 'center', transform: 'translateY(250px)', fontSize: '40px'}}>
        <CircularProgress
          size='8rem'
          color='secondary'/>
      </div>
    )
  }


  return (
    <div className='mapParent'>
      <div className='mapChild'>
        <div id='map'>
          <MapBox
            mapboxAccessToken="pk.eyJ1IjoiYmVuamFtaW5rbGVpbjk5IiwiYSI6ImNsbWUzMnZxZDFma3EzZHE2NG1hdjUxdjQifQ.-dyi2R3I4LmoAH-MWuNZPA"
            initialViewState={initView}
            style={{width: '100%', height: '100%'}}
            mapStyle="mapbox://styles/mapbox/streets-v9"
          >
            {
                users.map((user) => {
                  const [lat, lng] = splitCoords(user.geolocation);
                  return <UserPin
                    getPendingFriendList={getPendingFriendList}
                    pendingFriendList={pendingFriendList}
                    getFriendList={getFriendList}
                    friendList={friendList}
                    user={user}
                    key={user.id}
                    loggedIn={loggedIn}
                    latitude={+lat}
                    longitude={+lng}
                    />
                })
            }
          </MapBox>
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