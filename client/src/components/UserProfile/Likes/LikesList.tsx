import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import LikesEntry from './LikesEntry';

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
const LikesList: React.FC<Props> = ({user}) => {
  const [likesArr, setLikesArr] = useState([]); // user's own reels that have been liked FROM likes table

    // get reels that have been liked AND checked
    const getLikes = () => {
      if (user) {
        console.log('user', user);
        axios
          .get('/likes/likesuser')
          .then((response) => {
            console.log('likes:', response.data);
            setLikesArr(response.data);
            console.log('likes array:', likesArr);
          })
          .catch((err) => {
            console.error('Could not GET all likes:', err);
          });
      }
    };

    useEffect(() => {
      getLikes();
    }, [user]);

  return (
    <ul>
    <div className='container-likes'>
      <h1 className='title'>Likes</h1>
      {likesArr.map((like, index) => {
        return <LikesEntry key={`${index}-${like.id}`}
        like={like}
        user={user}
        />
      })}

    </div>

    </ul>
  );
};

export default LikesList;
