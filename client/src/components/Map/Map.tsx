import './Map.css';
import React, { useState, useEffect, useRef } from 'react';
import MapBox, { useMap } from 'react-map-gl';
import axios from 'axios';
import ClusterPin from './ClusterPin';
import UserPin from './UserPin';
import BusinessPin from './BusinessPin';
import EventPin from './EventPin';
import EventRadialMarker from './EventRadialMarker';
import useSupercluster from 'use-supercluster';
import CircularProgress from '@mui/material/CircularProgress';
import { useLocation } from "react-router-dom";
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';


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
  const [ events, setEvents ] = useState([]);
  const [ businesses, setBusinesses ] = useState([]);
  const [ viewState, setViewState ] = useState<{zoom: number, longitude: number, latitude: number}>({
    longitude: -94.30272073458288,
    latitude: 23.592677069427353,
    zoom: 0.5068034173376552
  });
  const [ userLngLat, setUserLngLat ] = useState([]);

   // get event location if trying to see event loc from reel
   const location = useLocation();
   let eventLocation: string;
   if (location.state) {
     eventLocation = location.state.reelEvent;
   }



  // function to split coordinates into array so lat and lng can easily be destructured
  const splitCoords = (coords: string) => {
    const arr = coords.split(',');
    return arr;
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


  // gets all events
  const getEvents = () => {
    axios.get('/events/all')
      .then(({ data }) => {
        console.log(data);
        setEvents(data);
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
        setUserLngLat([+lng, + lat]);
      }
    }
  }, [loggedIn])

  const mapRef = useRef<any>();

  const bounds = mapRef.current ? mapRef.current.getMap().getBounds().toArray().flat() : null;

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
    zoom: viewState.zoom,
    options: { radius: 50, maxZoom: 19, }
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
    zoom: viewState.zoom,
    options: { radius: 50, maxZoom: 19, }
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
      zoom: viewState.zoom,
      options: { radius: 50, maxZoom: 19, }
    })


  // if Data is not yet available, render loading ring
  if (!users.length || !loggedIn) {
    return (
      <div style={{textAlign: 'center', transform: 'translateY(250px)', fontSize: '40px'}}>
        <CircularProgress
          size='8rem'
          color='secondary'/>
      </div>
    )
  }

  const closeAllPopUps = () => {
    const userPopUps = document.getElementsByClassName('userPopUp');
    const eventPopUps = document.getElementsByClassName('eventPopUp');
    const busPopUps = document.getElementsByClassName('businessPopUp');

    Array.prototype.forEach.call( userPopUps, (popUp: any) => {
      popUp.style.animationName = 'popOff';
      setTimeout(() => {
        popUp.style.display = 'none';
      }, 500)
    })

    Array.prototype.forEach.call( eventPopUps, (popUp: any) => {
      popUp.style.animationName = 'popOff';
      setTimeout(() => {
        popUp.style.display = 'none';
      }, 500)
    })

    Array.prototype.forEach.call( busPopUps, (popUp: any) => {
      popUp.style.animationName = 'popOff';
      setTimeout(() => {
        popUp.style.display = 'none';
      }, 500)
    })
  }


  return (
    <div className='mapParent' onWheel={closeAllPopUps}>
      <div className='mapChild'>
      <div className='recenterButton' onClick={ () => {
          // const [lat, lng] = splitCoords(loggedIn.geolocation);
        }}> <CenterFocusStrongIcon /></div>
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
              if (!eventLocation) {
                const [lng, lat] = userLngLat;
                e.target.flyTo({center: [lng, lat], zoom: 15, duration: 2500});
              } else {
                const [lat, lng] = splitCoords(eventLocation)
                e.target.flyTo({center: [+lng, +lat], zoom: 15, duration: 2500});
              }
            }}
            onDrag={closeAllPopUps}
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
                    i={i}
                    zoom={viewState.zoom}
                    />
                }
              })
            }
            {
              businessClusters.map((cluster: any, i: number) => {
                const [ lng, lat ] = cluster.geometry.coordinates;
                const { cluster: isCluster, point_count: pointCount, business} = cluster.properties;

                if (isCluster) {
                    const expansionZoom = Math.min(businessSupercluster.getClusterExpansionZoom(cluster.id), 20);
                    return <ClusterPin amount={pointCount} key={'businessCluster' + i} latitude={lat} longitude={lng} className='BusinessClusterPin' expansionZoom={expansionZoom}/>;
                } else {
                  return <BusinessPin
                  business={business}
                  key={business.id}
                  latitude={lat}
                  longitude={lng}
                  i={i}
                  zoom={viewState.zoom}
                />;
                }
              })
            }
            {
              eventClusters.map((cluster: any, i: number) => {
                const [ lng, lat ] = cluster.geometry.coordinates;
                const { cluster: isCluster, point_count: pointCount, event} = cluster.properties;

                if (isCluster) {
                  const expansionZoom = Math.min(eventSupercluster.getClusterExpansionZoom(cluster.id), 20);
                  return <ClusterPin amount={pointCount} key={'eventCluster' + i} latitude={lat} longitude={lng} className='EventClusterPin' expansionZoom={expansionZoom}/>;
                } else if (!isCluster && viewState.zoom >= 17) {
                  return <EventRadialMarker zoom={viewState.zoom} key={'eventRadialMarker' + i} latitude={lat} longitude={lng} />
                } else {
                  return <EventPin
                    event={event}
                    latitude={+lat}
                    longitude={+lng}
                    key={event.id}
                    i={i}
                    zoom={viewState.zoom}
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
