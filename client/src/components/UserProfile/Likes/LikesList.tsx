import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import LikesEntry from './LikesEntry';

type User = {
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
  allUsers: [User];
};
const LikesList: React.FC<Props> = ({user, allUsers}) => {
  const [likesArr, setLikesArr] = useState([]); // user's own reels that have been liked FROM likes table
  const [userReels, setUserReels] = useState([]); // user's own reels

    // get your own reels
    const getOwnReels = () => {
      axios
        .get('/feed/reel/user')
        .then((response: any) => {
          //console.log('users own reels:', response.data);
          setUserReels(response.data);
        })
        .catch((err: any) => {
          console.error('Cannot get own reels:', err);
        })
    };

    useEffect(() => {
      getOwnReels();
    }, [user]);

    // get reels that have been liked AND checked
    const getLikes = () => {
      const likes: any = []; // user's reels that have been liked
      if (user) {
        axios
          .get('/likes/likes')
          .then((response) => {
            //console.log('likes:', response.data);
            for (let i = 0; i < response.data.length; i++) {
              for (let j = 0; j < userReels.length; j++) {
                if (response.data[i].ReelId === userReels[j].id) {
                  likes.push(response.data[i]); }
              }
            }
            setLikesArr(likes);
            console.log('likes array:', likesArr);
            console.log('user reels:', userReels);
          })
          .catch((err) => {
            console.error('Could not GET all likes:', err);
          });
      }
    };

    useEffect(() => {
      getLikes();
    }, [user, userReels]);

  return (
    <ul>
    <div className='container-full-w'>
      <h1>Likes List</h1>
      {likesArr.map((like, index) => {
        return <LikesEntry key={`${index}-${like.id}`}
        like={like}
        user={user}
        allUsers={allUsers}
        />
      })}

    </div>

    </ul>
  );
};

export default LikesList;
