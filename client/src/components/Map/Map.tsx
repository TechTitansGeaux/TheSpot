import './Map.css';
import React, { useState, useEffect, useRef } from 'react';
import GoogleMapReact from 'google-map-react';
import useSupercluster from 'use-supercluster';
import axios from 'axios';
import UserPin from './UserPin';
import EventPin from './EventPin';
import ClusterPin from './ClusterPin';
import BusinessPin from './BusinessPin';
import EventRadialMarker from './EventRadialMarker'
import { useLocation } from "react-router-dom";
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
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
  // console.log('rendered')

  const [ users, setUsers ] = useState([]);
  const [ events, setEvents ] = useState([])
  const [ friendList, setFriendList ] = useState([]);
  const [ pendingFriendList, setPendingFriendList ] = useState([]);
  const [ businesses, setBusinesses ] = useState([]);


  // function to split coordinates into array so lat and lng can easily be destructured
  const splitCoords = (coords: string) => {
    const arr = coords.split(',');
    return arr;
  }

 // sets the coords to open map to
  const location = useLocation();
  let eventLocation: string;
  if (location.state) {
    eventLocation = location.state.reelEvent;
  }

  let defaultCenter;
  if (eventLocation) {
    const [lat, lng] = splitCoords(eventLocation);
    defaultCenter = {lat: +lat, lng: +lng}
  } else if (loggedIn) {
    const [lat, lng] = splitCoords(loggedIn.geolocation);
    defaultCenter = {lat: +lat, lng: +lng}
  }

  const [ center, setCenter ] = useState(defaultCenter);

  // gets users friends
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

  // gets users pending friend requests
  const getPendingFriendList = () => {
    axios.get('/friends/pending')
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


  // gets all events
  const getEvents = () => {
    axios.get('/events/allCurrent')
      .then(({ data }) => {
        setEvents(data)
      })
      .catch((err) => {
        console.error('Failed to get Events:', err);
      });
  }

  // gets all businesses
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
    if (loggedIn) {
      getUsers();
      getFriendList();
      getPendingFriendList();
      getEvents();
      getBusinesses();
      if (!eventLocation) {
        const [lat, lng] = splitCoords(loggedIn.geolocation);
        setCenter({lat: +lat, lng: +lng})
      }
    }
  }, [loggedIn])

  // track map boundaries and zoom level
  const mapRef = useRef();
  const [ zoom, setZoom ] = useState(15); // <== must match default zoom
  const [ bounds, setBounds ] = useState(null);

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

  const { clusters: userClusters, supercluster: userSupercluster } = useSupercluster({
    points: userPoints,
    bounds,
    zoom,
    options: {
      radius: 75,
      maxZoom: 19,
    }
  })


  // clustering points for events pins
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

  const { clusters: eventClusters, supercluster: eventSupercluster } = useSupercluster({
    points: eventPoints,
    bounds,
    zoom,
    options: {
      radius: 75,
      maxZoom: 19,
    }
  })


  // clustering points for business pins
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

  const { clusters: businessClusters, supercluster: businessSupercluster } = useSupercluster({
    points: businessPoints,
    bounds,
    zoom,
    options: {
      radius: 75,
      maxZoom: 19,
    }
  })

  const options = {
    // minZoom: 11,
    // maxZoom: 19,
    disableDefaultUI: true,
    styles: [
      { stylers: [{ 'saturation': 1 }, { 'gamma': 0.5 }, { 'lightness': 4 }, { 'visibility': 'on' }] },
      { featureType: "poi", stylers: [{ visibility: 'off' }] }
    ]
  }


  const closeAllPopUps = () => {
    const userPopUps = document.getElementsByClassName('userPopUp');
    const eventPopUps = document.getElementsByClassName('eventPopUp');
    const busPopUps = document.getElementsByClassName('businessPopUp');

    Array.prototype.forEach.call( userPopUps, (popUp: any) => {
      popUp.style.display = 'none';
    })

    Array.prototype.forEach.call( eventPopUps, (popUp: any) => {
      popUp.style.display = 'none';
    })

    Array.prototype.forEach.call( busPopUps, (popUp: any) => {
      popUp.style.display = 'none';
    })
  }



  if (!users.length || !businesses.length || !loggedIn) {
    // Data is not yet available, render loading or placeholder content
    return (
      <div style={{textAlign: 'center', transform: 'translateY(250px)', fontSize: '40px'}}>
        <CircularProgress
          size='8rem'
          color='secondary'/>
      </div>
    )
  }

  return (
    <div className='mapParent' onWheel={closeAllPopUps}>
      <div className='mapChild'>
        <div className='recenterButton' onClick={ () => {
          const [lat, lng] = splitCoords(loggedIn.geolocation);
          setZoom(15);
          setCenter({ lat: +lat, lng: +lng});
        }}> <CenterFocusStrongIcon /></div>
        <div id='map'>
          <GoogleMapReact
            bootstrapURLKeys={{ key: "AIzaSyAYtb7y6JZ2DxgdIESWJky8NyhWuu_YFVg" }}
            zoom={zoom}
            center={center}
            options={options}
            onDrag={closeAllPopUps}
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({ map }) => {
              mapRef.current = map;
            }}
            onChange={({ zoom, bounds, center }) => {
              setCenter(center);
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
                return <ClusterPin amount={pointCount} key={'userCluster' + i} lat={lat} lng={lng} className='UserClusterPin' onClick={() => {
                  const expansionZoom = Math.min(userSupercluster.getClusterExpansionZoom(cluster.id), 20)
                  setZoom(expansionZoom);
                  setCenter({lat: lat, lng: lng});
                }} />;
              } else {
                return <UserPin
                  getPendingFriendList={getPendingFriendList}
                  pendingFriendList={pendingFriendList}
                  getFriendList={getFriendList}
                  friendList={friendList}
                  user={user}
                  key={user.id}
                  lat={lat}
                  lng={lng}
                  loggedIn={loggedIn}
                  setZoom={setZoom}
                  setCenter={setCenter}
                  closeAllPopUps={closeAllPopUps}
                  zoom={zoom}
                />;
              }
            })
          }
          {
            businessClusters.map((cluster: any, i: number) => {
              const [ lng, lat ] = cluster.geometry.coordinates;
              const { cluster: isCluster, point_count: pointCount, business} = cluster.properties;

              if (isCluster) {
                return <ClusterPin amount={pointCount} key={'businessCluster' + i} lat={lat} lng={lng} className='BusinessClusterPin' onClick={() => {
                  const expansionZoom = Math.min(businessSupercluster.getClusterExpansionZoom(cluster.id), 20)
                  setZoom(expansionZoom);
                  setCenter({lat: lat, lng: lng});
                }} />;
              } else {
                return <BusinessPin
                business={business}
                key={business.id}
                lat={lat}
                lng={lng}
                setZoom={setZoom}
                setCenter={setCenter}
                closeAllPopUps={closeAllPopUps}
                zoom={zoom}
              />;
              }
            })
          }
          {
            eventClusters.map((cluster: any, i: number) => {
              const [ lng, lat ] = cluster.geometry.coordinates;
              const { cluster: isCluster, point_count: pointCount, event} = cluster.properties;

              if (isCluster) {
                return <ClusterPin amount={pointCount} key={'eventCluster' + i} lat={lat} lng={lng} className='EventClusterPin' onClick={() => {
                  const expansionZoom = Math.min(eventSupercluster.getClusterExpansionZoom(cluster.id), 20)
                  setZoom(expansionZoom);
                  setCenter({lat: lat, lng: lng});
                }} />;
              } else if (!isCluster && zoom >= 17) {
                return <EventRadialMarker zoom={zoom} key={'eventRadialMarker' + i} lat={lat} lng={lng} />
              } else {
                return <EventPin
                  event={event}
                  lat={+lat}
                  lng={+lng}
                  key={event.id}
                  setZoom={setZoom}
                  setCenter={setCenter}
                  closeAllPopUps={closeAllPopUps}
                  zoom={zoom}
                />
              }
            })
          }
          </GoogleMapReact>
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
