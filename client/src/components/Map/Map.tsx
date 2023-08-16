import React, { useState, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';
import axios from 'axios';
import UserPin from './UserPin';

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
}


const Map: React.FC<Props> = (props) => {
  const { loggedIn } = props;

  const [ users, setUsers ] = useState([]);
  // const [ events, setEvents ] = useState([])
  const [ loggedInLat, setLoggedInLat ] = useState(0);
  const [ loggedInLng, setLoggedInLng ] = useState(0);
  const [ friendList, setFriendList ] = useState([]);
  const [ pendingFriendList, setPendingFriendList ] = useState([]);

  const getFriendList = () => {
    axios.get('/feed/friendlist')
      .then(({ data }) => {
        const friendsIds = data.reduce((acc: number[], user: any) => {
          acc.push(user.accepter_id);
          return acc;
        }, []);
        setFriendList(friendsIds)
      })
      .catch((err) => {
        console.error('Failed to get Friends:', err);
      });
  }

  // const getEvents = () => {
  //   axios.get('/events/all')
  //     .then(({ data }) => {
  //       const friendsIds = data.reduce((acc: number[], user: any) => {
  //         acc.push(user.accepter_id);
  //         return acc;
  //       }, []);
  //       setEvents(friendsIds)
  //     })
  //     .catch((err) => {
  //       console.error('Failed to get Events:', err);
  //     });
  // }

  const getPendingFriendList = () => {
    axios.get('/feed/friendlist/pending')
      .then(({ data }) => {
        const pendingFriendsIds = data.reduce((acc: number[], user: any) => {
          acc.push(user.accepter_id);
          return acc;
        }, []);
        setPendingFriendList(pendingFriendsIds)
      })
      .catch((err) => {
        console.error('Failed to get pending Friends:', err);
      });
  }

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

  // set coordinates
  useEffect(() => {
    const [lat, lng] = splitCoords(loggedIn.geolocation);
    setLoggedInLat(+lat);
    setLoggedInLng(+lng);
    fetchUsers();
    getFriendList();
    getPendingFriendList();
    // getEvents();
  }, [])

  // function to split coordinates into array
  const splitCoords = (coords: string) => {
    const arr = coords.split(',');
    return arr;
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center'}}>
      <div id='userMap'>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyAYtb7y6JZ2DxgdIESWJky8NyhWuu_YFVg" }}
          defaultZoom={15}
          defaultCenter={{lat: loggedInLat, lng: loggedInLng}}
        >{users.map((user, i) => {
          if ((user.privacy !== 'private' && user.id !== loggedIn.id) || user.id === loggedIn.id) {
            const [lat, lng] = splitCoords(user.geolocation);
            return <UserPin
              getPendingFriendList={getPendingFriendList}
              pendingFriendList={pendingFriendList}
              getFriendList={getFriendList}
              friendList={friendList}
              user={user}
              key={i}
              lat={+lat}
              lng={+lng}
              loggedIn={loggedIn}
            />;
          }
          return null;
        })}</GoogleMapReact>
      </div>
      {/* <div id='eventMap'>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyAYtb7y6JZ2DxgdIESWJky8NyhWuu_YFVg" }}
          defaultZoom={15}
          defaultCenter={{lat: loggedInLat, lng: loggedInLng}}
        >{events.map((user, i) => {
            const [lat, lng] = splitCoords(user.geolocation);
            return <UserPin
              getPendingFriendList={getPendingFriendList}
              pendingFriendList={pendingFriendList}
              getFriendList={getFriendList}
              friendList={friendList}
              user={user}
              key={i}
              lat={+lat}
              lng={+lng}
            />;
        })}</GoogleMapReact>
      </div> */}

    </div>

  );
};

export default Map;
