import * as React from 'react';
import Reel from './Reel';
// import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';

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
  const [filter, setFilter] = useState('reel');
  const [friends, setFriends] = useState([]); // friend list for current user
  const [userLat, setUserLat] = useState(0);
  const [userLong, setUserLong] = useState(0);

  // const location = useLocation();
  // const feedPath = location.pathname;
  // console.log('feedPath', feedPath)

  const filters = ['reel', 'recent', 'likes', 'friends']; // filter options
  const friendsReels: any = [];

  const filterChangeHandler = (event: any) => {
    setFilter(event.target.value);
    console.log('filter:', filter);
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
        setReels(friendsReels);
      })
      .catch((err) => {
        console.error('Could not GET all frens reels:', err);
      })
  };

  const getAllReels = () => {
    if (filter === 'friends') {
      getAllFriendReels();
    } else {
      axios
        .get(`/feed/${filter}`)
        .then((response) => {
          console.log('reels response.data:', response.data);
          setReels(response.data);
        })
        .catch((err) => {
          console.error('Could not GET all reels:', err);
        });
    }
  };

  const getFriendList = () => {
    axios
      .get(`/feed/friendlist`)
      .then((response) => {
        console.log('friends response.data:', response.data);
        setFriends(response.data);
      })
      .catch((err) => {
        console.error('Could not GET friends:', err);
      })
  };


  const userCoord = (user: any) => {
    console.log('user:', user?.geolocation);
    if (user) {
      const arr = user.geolocation.split(',');
      const lat = Number(arr[0]);
      const long = Number(arr[1]);
      setUserLat(lat);
      setUserLong(long);
      // console.log('coord:', lat, long);
      // console.log('userLat, userLong', userLat, userLong);
      // console.log('add', lat + long);
      // console.log(typeof lat);
      // console.log('add userLat userLong', userLat + userLong);
    }
  };

  useEffect(() => {
    userCoord(user);
    // console.log('user lat long', userLat, userLong);
  }, [user, userLat, userLong]);

  useEffect(() => {
    getAllReels();
  }, [filter]);

  useEffect(() => {
    getFriendList();
  }, []);

  return (
    <>
      <label>
        Filter by:
        <select onChange={filterChangeHandler}>
          {filters.map((filter, i) => {
            return <option key={i}>{filter}</option>;
          })}
        </select>
      </label>
      <div className='container-full-w'>
        <Reel
          reels={reels}
          user={user}
          friends={friends}
        />
      </div>
    </>
  );
};

export default Feed;
