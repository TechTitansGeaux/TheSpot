import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Loading from '../../Feed/Loading';
import MyReelItem from './MyReelItem';
import './MyReels.css'

type Props = {
  user: {
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
  };
};

const MyReels: React.FC<Props> = ({ user }) => {
  const [myReels, setMyReels] = useState([]);

  const getOwnReels = () => {
    axios.get('/feed/reel/user')
      .then((response) => {
        console.log('my reels', response.data)
        setMyReels(prev => [...prev, ...response.data])

      })
      .catch((err) => {
        console.error('could not get won reels', err);
      })
  };

  useEffect(() => {
    getOwnReels();
  }, [])

  return (
    <div className='container-full-w '>
      <h1 className='profile-title'>My Reels</h1>
      <div className='reelItemContainer'>
        {myReels.length > 0 &&
          myReels.map((myReel, id) => {
            return <MyReelItem key={id} myReels={myReel} />;
          })}
      </div>
    </div>
  );
}

export default MyReels;