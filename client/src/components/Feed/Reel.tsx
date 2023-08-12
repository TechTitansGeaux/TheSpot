import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
// import AddFriend from '../AddFriend';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import { useState, useEffect, useRef, createRef } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { realpath } from 'fs';



type Props = {
  reels: {
    id: string;
    public_id: number;
    url: string;
    text?: string;
    like_count?: number;
    UserId: number;
    EventId?: number;
    User: User;
    Event: Event;
  }[];
  user: User;
  AddFriend?: React.ReactNode | React.ReactNode[];
  friends: {
    id: number;
    status: string;
    requester_id: number;
    accepter_id: number;
  }[];
};

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

type Event = {
  id: number;
  name: string;
  rsvp_count: number;
  date: string;
  geolocation: string;
  twenty_one: boolean;
  createdAt: string;
  updatedAt: string;
  PlaceId: 1;
};

const theme = createTheme({
  palette: {
    primary: {
      main: '#f0f465',
      dark: '#f433ab',
      contrastText: '#0b0113',
    },
    secondary: {
      main: '#f433ab',
      dark: '#f0f465',
      contrastText: '#0b0113',
    },
  },
});

const Reel: React.FC<Props> = ({ reels, user, friends }) => {
  const [friendList, setFriendList] = useState([]);

  // REFERENCE VIDEO HTML element in JSX element
  // Uses a ref to hold an array of generated refs, and assign them when mapping.
  const myRef = useRef([]);
  myRef.current = reels.map((_, i) => myRef.current[i] ?? createRef());

  // get friendship from db for currUser and create state
  /**
   * within  reels?.map // if reel.User.id is equal to friend <accepter_id>
   */

  useEffect(() => {
    axios
      .get('/feed/friendlist')
      .then(({ data }) => {
        console.log('data from friends Axios GET ==>', data);
        data.map((user: any) => {
          if (user.status === 'approved') {
            setFriendList([...friendList, user.accepter_id]);
          }
        });
      })
      .catch((err) => {
        console.error('Failed to get Friends:', err);
      });
  }, []);

  // POST friendship 'pending' status to db
  const requestFriendship = (friend: number) => {
    console.log('your friendship is requested');

    axios
      .post('/friends', {
        // accepter_id is user on reel
        accepter_id: friend,
      })
      .then((data) => {
        // console.log('Friend request POSTED', data);
      })
      .catch((err) => {
        console.error('Friend request axios FAILED', err);
      });
  };

  // const allReelsArr = reels.map((reel) => {
    //   return <video id={`video${reel.id}`} controls src={reel.url}></video>;
    // });
    // console.log('all reels array', allReelsArr);
    // const playVideos = allReelsArr.map((vid: any) => vid.props.id.play());



    // observe videos to playback on scroll in view
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      // accessibility static video
      if (window.matchMedia('(prefers-reduced-motion)').matches) {
        // replace console.log with vid.currentTime = <number of seconds>
        console.log('static video');
      } else {
        // play videos here
        console.log('video entry ==>', entries[0]);
      }
    });
    observer.observe(myRef.current[0]);
  });
  useEffect(() => {
    observer;
  }, []);
  console.log('useRef DOM myRef OUTSIDE useEFFect', myRef.current);

  return (
    <div className='reel-container'>
      {reels.map((reel, i) => {
        return (
          <div key={reel.id + 'reel'}>
            <div className='video-container'>
              {reel.url.length > 15 && (
                <video ref={myRef.current[i]} id={`video${reel.id}`} controls>
                  <source src={reel.url} type='video/ogg' />
                </video>
              )}
              <p className='video-text'>{reel.text + myRef.current[i].current}</p>
              {/**Removes addFriend button if already approved friend*/}
              <>
                {!friendList.includes(reel.User.id) && (
                  <ThemeProvider theme={theme}>
                    <div className='friend-request'>
                      <Box className='friend-box'>
                        <Fab
                          size='small'
                          color='primary'
                          aria-label='add'
                          className='friend-add-btn'
                        >
                          {/** This icon should be removed after request sent */}
                          <AddIcon
                            onClick={() => requestFriendship(reel.User.id)}
                          />
                        </Fab>
                      </Box>
                    </div>
                  </ThemeProvider>
                )}
              </>
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
