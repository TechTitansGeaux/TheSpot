import * as React from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useState } from 'react';

type Props = {
  reel: any;
  handleAddLike: any;
  handleRemoveLike: any;
  likes: any;
  likeTotal: number;
};

const Likes: React.FC<Props> = ({
  handleRemoveLike,
  handleAddLike,
  likes,
  likeTotal,
  reel,
}) => {
  const [clicked, setClicked] = useState(false);

  const handleLikeClick = (reelId: number) => {
    if (!clicked) {
      setClicked(!clicked)
      handleAddLike(reelId);
    } else {
      setClicked(!clicked)
      handleRemoveLike(reelId);
    }
}

  return (
    <React.Fragment>
      {clicked ? (
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
