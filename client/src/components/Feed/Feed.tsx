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
  const [friends, setFriends] = useState([]);
  // const location = useLocation();
  // const feedPath = location.pathname;
  // console.log('feedPath', feedPath)

  const filters = ['reel', 'recent', 'likes'];

  const filterChangeHandler = (event: any) => {
    setFilter(event.target.value);
    console.log('filter:', filter);
  };


  const getAllReels = () => {
    axios
      .get(`/feed/${filter}`)
      .then((response) => {
        console.log('reels response.data:', response.data);
        setReels(response.data);
      })
      .catch((err) => {
        console.error('Could not GET all reels:', err);
      });
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
