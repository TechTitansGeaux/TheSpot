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
import InfoIcon from '@mui/icons-material/Info';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState, useEffect, useRef } from 'react';
import { memo } from 'react';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

type Props = {
  reel: any;
  friendList?: any;
  requestFriendship: any;
  user: any;
  deleteReel: any;
  disabledNow: any;
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
  user,
  deleteReel,
  disabledNow,
}) {
  const theme = useTheme();
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

  console.log('reel ==>', reel);
  return (
    <div className='vid-and-stamp'>
      <div style={{ fontSize: theme.typography.fontSize }}>
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
            <>
              <Tooltip
                title={reel.Event.name}
                placement='left'
                PopperProps={{
                  sx: {
                    '& .MuiTooltip-tooltip': {
                      backgroundColor: 'transparent',
                      border: 'solid #F5FCFA 1px',
                      color: '#F5FCFA',
                    },
                  },
                }}
              >
                <InfoIcon className='info-icon' />
              </Tooltip>
              {/**Removes addFriend button if already approved friend*/}
              {!friendList.includes(reel.User.id) &&
                reel.User.id !== user?.id && (
                  <ThemeProvider theme={theme}>
                    <div className='friend-request'>
                      <Box className='friend-box'>
                        <Fab
                          style={{ transform: 'scale(0.6)' }}
                          size='small'
                          color='primary'
                          aria-label='add'
                          className='friend-add-btn'
                          disabled={
                            disabledNow.includes(reel.User.id) ||
                            stayDisabled.includes(reel.User.id)
                          }
                        >
                          <Tooltip
                            title='Add Friend'
                            TransitionComponent={Zoom}
                            placement='left'
                            PopperProps={{
                              sx: {
                                '& .MuiTooltip-tooltip': {
                                  backgroundColor: 'transparent',
                                  border: 'solid #F5FCFA 1px',
                                  color: '#F5FCFA',
                                },
                              },
                            }}
                          >
                            <AddIcon
                              sx={{ width: 20, height: 20 }}
                              onClick={() => requestFriendship(reel.User.id)}
                            />
                          </Tooltip>
                        </Fab>
                      </Box>
                    </div>
                  </ThemeProvider>
                )}
              {reel.UserId === user.id && (
                <div className='friend-request'>
                  <Tooltip
                    title='Delete Reel'
                    TransitionComponent={Zoom}
                    placement='right'
                    PopperProps={{
                      sx: {
                        '& .MuiTooltip-tooltip': {
                          backgroundColor: 'transparent',
                          border: 'solid #F5FCFA 1px',
                          color: '#F5FCFA',
                        },
                      },
                    }}
                  >
                    <button
                      className='delete-btn'
                      onClick={() => deleteReel(reel.id)}
                    >
                      🗑️
                    </button>
                  </Tooltip>
                </div>
              )}
            </>

            <div className='friend-request'>
              <Tooltip
                title={reel.User.displayName}
                TransitionComponent={Zoom}
                placement='left'
                PopperProps={{
                  sx: {
                    '& .MuiTooltip-tooltip': {
                      backgroundColor: 'transparent',
                      border: 'solid #F5FCFA 1px',
                      color: '#F5FCFA',
                    },
                  },
                }}
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
        </>
      </div>
      <h5 className='video-timestamp'>
        ... {dayjs(`${reel.createdAt}`).fromNow()}
      </h5>
    </div>
  );
});

export default ReelItem;
