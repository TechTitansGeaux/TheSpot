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
  likesBool: number[];
};

const Likes: React.FC<Props> = ({
  handleRemoveLike,
  handleAddLike,
  reel,
  likes,
  likesBool,
  user
}) => {
  const [clicked, setClicked] = useState(false); // how to make this conditional?

  // likesBool.includes(reel.id) was default in useState line 40 // likes.length === 0
  // Likes is [UserId, ReelId] Tuple from getLikes() axios request

  const handleLikeClick = (reelId: number) => {
    if (!clicked) {
      setClicked(!clicked);
      handleAddLike(reelId);
    } else {
      setClicked(!clicked);
      handleRemoveLike(reelId);
    }
  };

    const handlePersistClick = (reelId: number) => {
      if (!clicked) {
        setClicked(!clicked);
        handleAddLike(reelId);
      } else {
        setClicked(!clicked);
        handleRemoveLike(reelId);
      }
    };

  return (
    <React.Fragment>
      {!clicked && (
        <FavoriteIcon onClick={() => handleLikeClick(reel.id)} />
      )}
      {clicked && (
        <FavoriteIcon
          color='secondary'
          onClick={() => handleLikeClick(reel.id)}
        />
      )}
    </React.Fragment>
  );
};

export default Likes;
