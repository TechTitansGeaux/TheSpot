import './Map.css';
import React, { useState, useEffect, useRef } from 'react';
import MapBox, { useMap } from 'react-map-gl';
import axios from 'axios';
import UserPin from './UserPin';
import useSupercluster from 'use-supercluster';
import ClusterPin from './ClusterPin';
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
  const [ viewState, setViewState ] = useState<{zoom: number, longitude: number, latitude: number}>({
    longitude: -94.30272073458288,
    latitude: 23.592677069427353,
    zoom: 0.5068034173376552
  });
  const [ userLngLat, setUserLngLat ] = useState([])



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
      setUserLngLat([+lng, + lat]);
    }
  }, [loggedIn])

  useEffect(() => {}, [viewState])

  // function to split coordinates into array so lat and lng can easily be destructured
  const splitCoords = (coords: string) => {
    const arr = coords.split(',');
    return arr;
  }

  const mapRef = useRef();

  // clustering points for user pins
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

  const bounds = mapRef.current ? mapRef.current.getMap().getBounds().toArray().flat() : null;

  const { clusters: userClusters, supercluster: userSupercluster } = useSupercluster({
    points: userPoints,
    bounds,
    zoom: viewState.zoom,
    options: { radius: 75, maxZoom: 19, }
  })

  if (!users.length || !loggedIn) {
    // Data is not yet available, render loading ring
    return (
      <div style={{textAlign: 'center', transform: 'translateY(250px)', fontSize: '40px'}}>
        <CircularProgress
          size='8rem'
          color='secondary'/>
      </div>
    )
  }



  console.log(viewState);
  return (
    <div className='mapParent'>
      <div className='mapChild'>
        <div id='map'>
          <MapBox
            mapboxAccessToken="pk.eyJ1IjoiYmVuamFtaW5rbGVpbjk5IiwiYSI6ImNsbWUzMnZxZDFma3EzZHE2NG1hdjUxdjQifQ.-dyi2R3I4LmoAH-MWuNZPA"
            {...viewState}
            onMove={evt => {setViewState(evt.viewState)}}
            style={{width: '100%', height: '100%'}}
            mapStyle="mapbox://styles/mapbox/streets-v9"
            ref={mapRef}
            projection={{name: 'globe'}}
            onLoad={(e) => {
              const [lng, lat] = userLngLat;
              e.target.flyTo({center: [lng, lat], zoom: 15, duration: 3000});
            }}
          >
              {
                userClusters.map((cluster: any, i: number) => {
                  const [ lng, lat ] = cluster.geometry.coordinates;
                  const { cluster: isCluster, point_count: pointCount, user} = cluster.properties;

                  if (isCluster) {
                    const expansionZoom = Math.min(userSupercluster.getClusterExpansionZoom(cluster.id), 20);
                    return <ClusterPin amount={pointCount} key={'userCluster' + i} latitude={lat} longitude={lng} className='UserClusterPin' expansionZoom={expansionZoom}/>;
                  } else {
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
                  }
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