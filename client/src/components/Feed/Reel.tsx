import * as React from 'react';
import fakeReels from '../../../../server/db/fakeData.json';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AddFriend from '../AddFriend'

type Reel = {
  id: number;
  video: string;
  user_id: number;
  event_id: number;
  text: string;
  like_count: number;
};



const Reel = () => {
  return (
    <div className='reel-container'>
      {fakeReels?.map((reel: Reel) => {
        return (
          <div key={reel.id + 'reel'}>
            <div className='video' id={reel.video}>
              <p className='video-text'>{reel.text}</p>
              <AddFriend/>
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
