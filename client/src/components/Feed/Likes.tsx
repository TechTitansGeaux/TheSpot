import * as React from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Fab from '@mui/material/Fab';
import { useState, useEffect } from 'react';
import useLocalStorageState from './useLocalStorageState';
import axios from 'axios';
import io from 'socket.io-client';
import { FormControlLabel } from '@mui/material';
const socket = io();

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
  likesBool: any;
};


const Likes: React.FC<Props> = ({
  handleRemoveLike,
  handleAddLike,
  reel,
  likes,
  likesBool,
  user,
}) => {

  const [clicked, setClicked] = useLocalStorageState('clicked', false); // how to make this conditional - PER REEL?

  const handleLikeClick = (reelId: number) => {
    if (clicked === false) {
      setClicked(true);
      handleAddLike(reelId);
      socket.emit('likesNotif', 'like');
    } else {
      setClicked(false);
      handleRemoveLike(reelId);
    }
  };

  return (
    <React.Fragment>
      {(!clicked && (
          <FavoriteIcon
            name='Like Button'
            aria-label='Like Button'
            onClick={() => handleLikeClick(reel.id)}
          />
        ))}
      {clicked && (
          <FavoriteIcon
            name='Like Button'
            aria-label='Like Button'
            color='secondary'
            onClick={() => handleLikeClick(reel.id)}
          />
        )}
    </React.Fragment>
  );
};

  // const [clicked, setClicked] = useState(false);
  // const [disable, setDisable] = useState(false);
  // const likeReelIdFinder = (currReel: number) => {
  //   let bool = false;
  //   likesBool.forEach((row: any) =>
  //     row?.ReelId === currReel ? (bool = true) : (bool = false)
  //   );
  //   return bool;
  // };

  // const handleLikeClick = (reelId: number) => {
  //   if (likeReelIdFinder(reelId)) {
  //     setClicked(!clicked);
  //     setDisable(true);
  //     handleAddLike(reelId);
  //     socket.emit('likesNotif', 'like');
  //   } else {
  //     setClicked(!clicked);
  //     handleRemoveLike(reelId);
  //     setDisable(true);
  //   }
  // };

  // console.log('likeReelIdFinder()', likeReelIdFinder(13));
  // console.log('likesBool', likesBool);

  // return (
  //   <div>
  //     {!clicked && !likeReelIdFinder(reel.id) ? (
  //       <Fab
  //         disabled={disable}
  //         onClick={() => handleLikeClick(reel.id)}
  //         name='Like Button'
  //         aria-label='Like Button'
  //       >
  //         <FavoriteIcon
  //         />
  //       </Fab>
  //     ) : (
  //       clicked && likeReelIdFinder(reel.id) && (
  //         <Fab
  //         disabled={disable}
  //         onClick={() => handleLikeClick(reel.id)}
  //         name='Like Button'
  //         aria-label='Like Button'
  //         >
  //           <FavoriteIcon
  //             color='secondary'
  //           />
  //         </Fab>
  //       )
  //     )}
  //   </div>
  // );

export default Likes;
