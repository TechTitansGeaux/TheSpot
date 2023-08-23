import * as React from 'react';
import Reel from './Reel';
// import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import './feed.css';

type Props = {
  user: {
    id: number;
    username: string;
    displayName: string;
    type: string;
    geolocation: string; // i.e. "29.947126049254177, -90.18719199978266"
    mapIcon: string;
    birthday: string;
    privacy: string;
    accessibility: string;
    email: string;
    picture: string;
    googleId: string;
  };
  AddFriend?: React.ReactNode | React.ReactNode[];
};

const Feed: React.FC<Props> = ({user}) => {
  const [reels, setReels] = useState([]);
  const [filter, setFilter] = useState('recent'); // filter feed state
  const [geoF, setGeoF] = useState(15); //geo filter by miles
  const [friends, setFriends] = useState([]); // friend list for current user
  const [userLat, setUserLat] = useState(0);
  const [userLong, setUserLong] = useState(0);

  const filters = ['recent', 'likes', 'friends']; // filter options
  const geoFilters = [15, 10 ,5]; // geolocation filters by miles
  const friendsReels: any = [];
  const geoReels: any = [];

  const filterChangeHandler = (event: any) => {
    setFilter(event.target.value);
  };

  const geoFilterHandler = (event: any) => {
    setGeoF(event.target.value);
  };

  const userCoord = (user: any) => {
    // console.log('user:', user?.geolocation);
    if (user) {
      console.log('user:', user);
      const arr = user.geolocation.split(',');
      const lat = Number(arr[0]);
      const long = Number(arr[1]);
      setUserLat(lat);
      setUserLong(long);
    }
  };

  // find distance (miles) with 2 points
  const distance = (lat1: number, lat2: number, lon1: number, lon2: number) => {

    lon1 = lon1 * Math.PI / 180;
    lon2 = lon2 * Math.PI / 180;
    lat1 = lat1 * Math.PI / 180;
    lat2 = lat2 * Math.PI / 180;
    // Haversine formula
    let dlon = lon2 - lon1;
    let dlat = lat2 - lat1;
    let a = Math.pow(Math.sin(dlat / 2), 2)
              + Math.cos(lat1) * Math.cos(lat2)
              * Math.pow(Math.sin(dlon / 2),2);

    let c = 2 * Math.asin(Math.sqrt(a));

    let r = 3956;

    return(c * r);
  };

  // location filter to be used repeatedly arr is response.data
  const locFilter = (arr: any) => {
    for (let i = 0; i < arr.length; i++) {
      const geo = arr[i].User.geolocation.split(','); // User geo
      // console.log('user lat, user long:', userLat, userLong);
      // console.log('other user geo:', geo);
      const eventGeo = arr[i].Event.geolocation.split(',');
      // console.log('eventGeo:', eventGeo);
      const otherLat = Number(geo[0]);
      const otherLong = Number(geo[1]);
      const eventLat = Number(eventGeo[0]);
      const eventLong = Number(eventGeo[1]);
      const dist = distance(userLat, otherLat, userLong, otherLong);
      const eventDist = distance(userLat, eventLat, userLong, eventLong);
      console.log('distance:', dist);
      // console.log('geoF:', geoF);
      if (dist <= geoF || eventDist <= geoF) {
        geoReels.push(arr[i]);
      }
    }
  };

  // const getReelsByLoc = () => {
  //   axios
  //     .get('feed/recent')
  //     .then((response) => {
  //       for (let i = 0; i < response.data.length; i++) {
  //         let geo = response.data[i].User.geolocation.split(','); // User geo
  //         // console.log('user lat, user long:', userLat, userLong);
  //         // console.log('other user geo:', geo);
  //         let eventGeo = response.data[i].Event.geolocation.split(',');
  //         // console.log('eventGeo:', eventGeo);
  //         const otherLat = Number(geo[0]);
  //         const otherLong = Number(geo[1]);
  //         const eventLat = Number(eventGeo[0]);
  //         const eventLong = Number(eventGeo[1]);
  //         let dist = distance(userLat, otherLat, userLong, otherLong);
  //         let eventDist = distance(userLat, eventLat, userLong, eventLong);
  //         console.log('distance:', dist);
  //         // console.log('geoF:', geoF);
  //         if (dist <= geoF || eventDist <= geoF) {
  //           geoReels.push(response.data[i]);
  //         }
  //       }
  //       setReels(geoReels);
  //     })
  //     .catch((err) => {
  //       console.error('Could not GET all geo reels:', err);
  //     })
  // };

  const getAllReelsRecent = () => {
    axios
      .get('/feed/recent')
      .then((response) => {
        locFilter(response.data);
        setReels(geoReels);
      })
      .catch((err) => {
        console.error('Could not GET all recent reels:', err);
      })
  };

  const getAllReelsLikes = () => {
    axios
      .get('/feed/likes')
      .then((response) => {
        locFilter(response.data);
        setReels(geoReels);
      })
      .catch((err) => {
        console.error('Could not GET all recent reels:', err);
      })
  };


  const getAllFriendReels = () => {
    axios
      .get('/feed/recent')
      .then((response) => {
        // console.log('reels recent res.data:', response.data);
        for (let i = 0; i < friends.length; i++) {
          for (let j = 0; j < response.data.length; j++) {
            if (friends[i].accepter_id === response.data[j].UserId) {
              friendsReels.push(response.data[j]);
            }
          }
        }
        locFilter(friendsReels);
        setReels(geoReels);
      })
      .catch((err) => {
        console.error('Could not GET all frens reels:', err);
      })
  };

  const getAllReels = () => {
    if (filter === 'recent') {
      getAllReelsRecent();
    } else if (filter === 'friends') {
      getAllFriendReels();
    } else if (filter === 'likes') {
      getAllReelsLikes();
    }
  };

  const getFriendList = () => {
    axios
      .get(`/feed/frens`)
      .then((response) => {
        //console.log('friends response.data:', response.data);
        setFriends(response.data);
      })
      .catch((err) => {
        console.error('Could not GET friends:', err);
      })
  };

  useEffect(() => {
    userCoord(user);
  }, [user, reels]);

  useEffect(() => {
    getAllReels();
  }, [filter, geoF, user, userLat]);

  useEffect(() => {
    getFriendList();
  }, []);


  return (
    <>
      <div className='filter-container'>
        <div className='label'>
        <label>
          Filter by:
          <select onChange={filterChangeHandler}>
            {filters.map((filter, i) => {
              return <option key={i}>{filter}</option>;
            })}
          </select>
        </label>
        </div>
        <div className='label'>
        <label>
          Radius (miles):
          <select onChange={geoFilterHandler}>
            {geoFilters.map((geofilter, i) => {
              return <option key={i}>{geofilter}</option>;
            })}
          </select>
        </label>
        </div>
      </div>
      <div className='container-full-w'>
        <Reel
          reels={reels}
          friends={friends}
          getAllReels={getAllReels}
        />
      </div>
    </>
  );
};

export default Feed;