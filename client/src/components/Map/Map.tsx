import './Map.css';
import React, { useState, useEffect, useRef } from 'react';
import GoogleMapReact from 'google-map-react';
import useSupercluster from 'use-supercluster';
import axios from 'axios';
import UserPin from './UserPin';
import socketIOClient from 'socket.io-client';
import UserClusterPin from './UserClusterPin';
import EventPin from './EventPin';
import EventClusterPin from './EventClusterPin';
import BusinessPin from './BusinessPin';
import BusinessClusterPin from './BusinessClusterPin'
import EventRadialMarker from './EventRadialMarker'

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
  const [ events, setEvents ] = useState([])
  const [ loggedInLat, setLoggedInLat ] = useState(0);
  const [ loggedInLng, setLoggedInLng ] = useState(0);
  const [ friendList, setFriendList ] = useState([]);
  const [ pendingFriendList, setPendingFriendList ] = useState([]);
  const [ businesses, setBusinesses ] = useState([]);

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

  const getEvents = () => {
    axios.get('/events/all')
      .then(({ data }) => {
        setEvents(data)
      })
      .catch((err) => {
        console.error('Failed to get Events:', err);
      });
  }

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

  const getBusinesses = () => {
    axios.get('/users/businesses')
      .then((res) => {
        setBusinesses(res.data);
      })
      .catch((err) => {
        console.log('error getting businesses for map: ', err);
      })
  }

  useEffect(() => {
    const [lat, lng] = splitCoords(loggedIn.geolocation);
    setLoggedInLat(+lat);
    setLoggedInLng(+lng);
    // ^ coords of user to make map centered on user when opened
    getUsers();
    getFriendList();
    getPendingFriendList();
    getEvents();
    getBusinesses();
  }, [])

  // function to split coordinates into array so lat and lng can easily be destructured
  const splitCoords = (coords: string) => {
    const arr = coords.split(',');
    return arr;
  }


  // watch for geolocation updates
  useEffect(() => {
    const socket = socketIOClient(`${process.env.HOST}`); // Connect to your server

    socket.on('userGeolocationUpdate', (userId, newGeolocation) => {
      // Update the user's geolocation in the users array based on userId
      setUsers((prevUsers) => {
        return prevUsers.map((user) =>
          user.id === userId ? { ...user, geolocation: newGeolocation } : user
        );
      });
    });

    return () => {
      socket.disconnect(); // Disconnect when the component unmounts
    };
  }, []);

  // track map boundaries and zoom level
  const mapRef = useRef();
  const [ zoom, setZoom ] = useState(15); // <== must match default zoom
  const [ bounds, setBounds ] = useState(null);

  const userPoints = users.filter((user) => {
    if (user.id === loggedIn.id) {
    return true;
    } else if (user.privacy === 'private') {
      return false;
    } else if (user.privacy === 'friends only' && !friendList.includes(user.id)){
     return false;
    }
    else if (user.type === 'business') {
      return false
    } else {
      return true;
    }
  }).map((user) => {
    const [lat, lng] = splitCoords(user.geolocation);
    return {
      type: 'Feature',
      properties: {
        cluster: false,
        user: user,
      },
      geometry: { type: 'Point', coordinates: [+lng, +lat]},
    }
  })

  const { clusters: userClusters } = useSupercluster({
    points: userPoints,
    bounds,
    zoom,
    options: {
      radius: 75,
      maxZoom: 19,
    }
  })

  const eventPoints = events.map((event) => {
    const [lat, lng] = splitCoords(event.geolocation);
    return {
      type: 'Feature',
      properties: {
        cluster: false,
        event: event,
      },
      geometry: { type: 'Point', coordinates: [+lng, +lat]},
    }
  })


  const { clusters: eventClusters } = useSupercluster({
    points: eventPoints,
    bounds,
    zoom,
    options: {
      radius: 75,
      maxZoom: 19,
    }
  })

  const businessPoints = businesses.map((business) => {
    const [lat, lng] = splitCoords(business.geolocation);
    return {
      type: 'Feature',
      properties: {
        cluster: false,
        business: business,
      },
      geometry: { type: 'Point', coordinates: [+lng, +lat]},
    }
  })

  const { clusters: businessClusters } = useSupercluster({
    points: businessPoints,
    bounds,
    zoom,
    options: {
      radius: 75,
      maxZoom: 19,
    }
  })

  const options = {
    minZoom: 10,
    maxZoom: 19,
  }


  return (
    <div style={{ display: 'flex', justifyContent: 'center'}}>
      <div id='map'>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyAYtb7y6JZ2DxgdIESWJky8NyhWuu_YFVg" }}
          defaultZoom={15}
          defaultCenter={{lat: loggedInLat, lng: loggedInLng}}
          options={options}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map }) => {
            mapRef.current = map;
          }}
          onChange={({ zoom, bounds }) => {
            setZoom(zoom);
            setBounds([
              bounds.nw.lng,
              bounds.se.lat,
              bounds.se.lng,
              bounds.nw.lat
            ])
          }}
        >
        {
          userClusters.map((cluster: any, i: number) => {
            const [ lng, lat ] = cluster.geometry.coordinates;
            const { cluster: isCluster, point_count: pointCount, user} = cluster.properties;

            if (isCluster) {
              return <UserClusterPin amount={pointCount} key={'userCluster' + i} lat={lat} lng={lng}/>;
            } else {
              return <UserPin
              getPendingFriendList={getPendingFriendList}
              pendingFriendList={pendingFriendList}
              getFriendList={getFriendList}
              friendList={friendList}
              user={user}
              key={'user' + i}
              lat={lat}
              lng={lng}
              loggedIn={loggedIn}
            />;
            }
          })
        }
        {
          eventClusters.map((cluster: any, i: number) => {
            const [ lng, lat ] = cluster.geometry.coordinates;
            const { cluster: isCluster, point_count: pointCount, event} = cluster.properties;

            if (isCluster) {
              return <EventClusterPin amount={pointCount} key={'eventCluster' + i} lat={lat} lng={lng} />;
            } else if (!isCluster && zoom >= 16) {
              return <EventRadialMarker zoom={zoom} key={'eventRadialMarker' + i} lat={lat} lng={lng} />
            } else {
              return <EventPin
                event={event}
                lat={+lat}
                lng={+lng}
                key={'event' + i}
              />
            }
          })
        }
        {
          businessClusters.map((cluster: any, i: number) => {
            const [ lng, lat ] = cluster.geometry.coordinates;
            const { cluster: isCluster, point_count: pointCount, business} = cluster.properties;

            if (isCluster) {
              return <BusinessClusterPin amount={pointCount} key={'eventCluster' + i} lat={lat} lng={lng} />;
            } else {
              return <BusinessPin
              business={business}
              key={'business' + i}
              lat={lat}
              lng={lng}
            />;
            }
          })
        }
        </GoogleMapReact>
      </div>
    </div>

  );
};

export default Map;




