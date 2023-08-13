import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
// import AddFriend from '../AddFriend';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState, useEffect, useRef } from 'react';
import { memo } from 'react';
import axios from 'axios';

type Props = {
  reel: any;
  friendList?: any;
  requestFriendship: any;
  approveFriendship: any;
  user: any;
  disabled: any;
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

const ReelItem: React.FC<Props> = memo(function ReelItem({
  reel,
  friendList,
  requestFriendship,
  approveFriendship,
  user,
  disabled
}) {
  // REFERENCE VIDEO HTML element in JSX element // Uses a ref to hold an array of generated refs, and assign them when mapping.
  const myRef = useRef<HTMLVideoElement>(null);
  const [loop, setLoop] = useState(false);
  const [stayDisabled, setStayDisabled] = useState([]);

  // GET request get friendList from Friendship table in DB // set to state variable
  useEffect(() => {
    const controller = new AbortController();
    axios
      .get('/feed/friendlist/pending')
      .then(({ data }) => {
        // console.log('data from friends to DISABLE button Axios GET ==>', data);
        data.map((user: any) => {
          if (user.status === 'pending') {
            setStayDisabled((prev) => [...prev, user.accepter_id]);
          }
        });
      })
      .catch((err) => {
        console.error('Failed to get Disabled List:', err);
      });
    // aborts axios request when component unmounts
    return () => controller?.abort();
  }, []);

  useEffect(() => {
    // observe videos with IntersectionObserver API to playback on scroll in view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        // console.log('entry', entry);
        const playVideo = myRef.current.play();
        if (!entry.isIntersecting && playVideo !== undefined) {
          // if video is in view PLAY video and LOOP
          playVideo
            .then((_) => {
              myRef.current.pause();
              setLoop(false);
            })
            .catch((err) => {
              console.error('Auto-play was prevented', err);
            });
        } else {
          // else video is out of view PAUSE video and don't Loop
          myRef.current.play();
          setLoop(true);
        }
      });
    });
    observer.observe(myRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className='video-container'>
        {reel.url.length > 15 && (
          <video
            className='reel'
            ref={myRef}
            id={`video${reel.id}`}
            src={reel.url}
            loop={loop}
            muted
            preload='none'
          ></video>
        )}
        <p className='video-text'>{reel.text}</p>
        {/**Removes addFriend button if already approved friend*/}
        <>
          {!friendList.includes(reel.User.id) && reel.User.id !== user?.id && (
            <ThemeProvider theme={theme}>
              <div className='friend-request'>
                <Box className='friend-box'>
                  <Fab
                    size='small'
                    color='primary'
                    aria-label='add'
                    className='friend-add-btn'
                    disabled={disabled.includes(reel.User.id) || stayDisabled.includes(reel.User.id)}
                  >
                    <AddIcon onClick={() => requestFriendship(reel.User.id)} />
                  </Fab>
                  {/* <button
                    className='accept-friend'
                    onClick={() => approveFriendship(reel.User.id)}
                  >
                    ✓
                  </button> */}
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
            <BottomNavigationAction label='Favorites' icon={<FavoriteIcon />} />
            <BottomNavigationAction label='Nearby' icon={<LocationOnIcon />} />
          </BottomNavigation>
        </Box>
      </div>
    </>
  );
});

export default ReelItem;
