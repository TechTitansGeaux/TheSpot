import * as React from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useState, useEffect } from 'react';
import axios from 'axios';


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
  reel: any;
  handleAddLike: any;
  handleRemoveLike: any;
  user: User;
  likes: any[];
};

const Likes: React.FC<Props> = ({
  handleRemoveLike,
  handleAddLike,
  reel,
  likes,
  user
}) => {
  const [clicked, setClicked] = useState(false);


  const handleLikeClick = (reelId: number) => {
    if (!clicked) {
      setClicked(true);
      handleAddLike(reelId);
    } else {
      setClicked(false);
      handleRemoveLike(reelId);
    }
  };

  console.log('likes from likes.tsx', likes);
  console.log('reel from likes.tsx', reel);
  return (
    <React.Fragment>
      { (likes.includes(reel.id) || clicked) ? (
        <FavoriteIcon
          color='secondary'
          onClick={() => handleLikeClick(reel.id)}
        />
      ) : (
        <FavoriteIcon onClick={() => handleLikeClick(reel.id)} />
      )}
    </React.Fragment>
  );
};

export default Likes;
