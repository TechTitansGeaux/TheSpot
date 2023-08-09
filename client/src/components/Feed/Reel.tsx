import * as React from 'react';
import fakeReels from '../../../../server/db/fakeData.json';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AddFriend from '../AddFriend';

// jackie added public_id and url instead of video
type Props = {
  reels:
  {
    id?: string;
    public_id?: number;
    url?: string;
    text?: string;
    like_count?: number;
    UserId?: number;
    EventId?: number;
  }[]
};

const Reel: React.FC<Props> = ({reels}) => {
  return (
    <div className='reel-container'>
      {reels?.map((reel) => {
        return (
          <div key={reel.id + 'reel'}>
            {/* jackie replaced reel.video here with reel.url */}
            <div className='video' id={reel.url}>
              <p className='video-text'>{reel.text}</p>
              <AddFriend />
            </div>
            <div className='video-links-container'>
              <Box sx={{ maxWidth: 400 }}>
                <BottomNavigation>
                  <BottomNavigationAction
                    label='Favorites'
                    icon={<FavoriteIcon />}
                  />
                  <BottomNavigationAction
                    label='Nearby'
                    icon={<LocationOnIcon />}
                  />
                </BottomNavigation>
              </Box>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Reel;
