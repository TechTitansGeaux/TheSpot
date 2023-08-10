import * as React from 'react';
import Reel from './Reel';
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

const Feed: React.FC<Props> = ({user, AddFriend}) => {
  const [reels, setReels] = useState([]);


  const getAllReels = () => {
    axios
      .get('/feed/reel')
      .then((response) => {
        console.log('response.data:', response.data);
        setReels(response.data);
      })
      .catch((err) => {
        console.error('Could not GET all reels:', err);
      });
  };

  useEffect(() => {
    getAllReels();
  }, []);


  return (
    <>
      <div className='container-full-w'>
        <Reel reels={reels} user={user} AddFriend={AddFriend} />
      </div>
    </>
  );
};

export default Feed;
