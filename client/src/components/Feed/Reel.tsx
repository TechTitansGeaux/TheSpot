import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AddFriend from '../AddFriend';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import { useState, useEffect } from 'react';


type Props = {
  reels:
  {
    id: string;
    public_id: number;
    url: string;
    text?: string;
    like_count?: number;
    UserId: number;
    EventId?: number;
    User: User;
    Event: Event;
  }[],
  user: User;
};

type User = {
  id: number;
  username: string;
  displayName: string;
  type: string;
  geolocation: string; // i.e. "29.947126049254177, -90.18719199978266"
  mapIcon: string;
  birthday: string;
  privacy: string;
  accessibility: string;
  email: string;
  picture: string;
  googleId: string;
};

type Event = {
  id: number;
  name: string;
  rsvp_count: number;
  date: string;
  geolocation: string; // i.e. "29.947126049254177, -90.18719199978266"
  twenty_one: boolean;
  createdAt: string;
  updatedAt: string;
  PlaceId: 1;
};

const Reel: React.FC<Props> = ({ reels, user }) => {

  console.log('feed user', user);
  return (
    <div className='reel-container'>
      {reels?.map((reel) => {
        return (
          <div key={reel.id + 'reel'}>
            {/* jackie replaced reel.video here with reel.url */}
            <div className='video' id={reel.url}>
              <p className='video-text'>{reel.text}</p>
              <AddFriend />
              <div className='friend-request'>
                <Tooltip
                  title={reel.User.displayName}
                  TransitionComponent={Zoom}
                  describeChild
                >
                  <Avatar
                    className='friend-avatar'
                    sx={{ width: 48, height: 48 }}
                    alt={reel.User.displayName}
                    src={reel.User.picture}
                  />
                </Tooltip>
              </div>
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
