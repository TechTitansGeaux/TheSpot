import * as React from 'react';
import Reel from './Reel';
import axios from 'axios';
import { useState, useEffect } from 'react';



const Feed: React.FC = () => {
  const [reel, setReel] = useState([]);

  const getAllReels = () => {
    axios.get('/feed/reel')
    .then((response: any) => {
      console.log('response.data:', response.data);
      setReel(response.data);
    })
    .catch((err) => {
      console.error('Could not GET all reels:', err);
    })
  };

  useEffect(() => {
    getAllReels();
  }, []);

  return (
    <>
      <div className='container-full-w'>
        <Reel />
      </div>
    </>
  );
};

export default Feed;
