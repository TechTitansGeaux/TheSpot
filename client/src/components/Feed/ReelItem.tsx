import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import LocationOnIcon from '@mui/icons-material/LocationOn';
// import AddFriend from '../AddFriend';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import RsvpSharpIcon from '@mui/icons-material/RsvpSharp';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState, useEffect, useRef } from 'react';
import { memo } from 'react';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Likes from './Likes';
import './feed.css';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';

dayjs.extend(relativeTime);

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

type Props = {
  reel: any;
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
  friendList?: any;
  requestFriendship: any;
  user: User;
  deleteReel: any;
  disabledNow: any;
  handleAddLike: any;
  handleRemoveLike: any;
  likes: any;
  likeTotal: number;
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
  reels,
  friendList,
  requestFriendship,
  user,
  deleteReel,
  disabledNow,
  handleAddLike,
  handleRemoveLike,
  likes,
  likeTotal,
}) {
  const theme = useTheme();
  // REFERENCE VIDEO HTML element in JSX element // Uses a ref to hold an array of generated refs, and assign them when mapping.
  const myRef = useRef<HTMLVideoElement>(null);
  const [loop, setLoop] = useState(false);
  const [stayDisabled, setStayDisabled] = useState([]);
  const [likesArr, setLikesArr] = useState([]); // user's own reels that have been liked FROM likes table

 const getLikes = () => {
   const likes: any = []; // user's reels that have been liked
   if (user) {
     axios
       .get('/likes/likes')
       .then((response) => {
         //console.log('likes:', response.data);
         for (let i = 0; i < response.data.length; i++) {
           for (let j = 0; j < reels.length; j++) {
             if (response.data[i].ReelId === reels[j].id) {
               likes.push(
                 response.data[i].ReelId,
               );
             }
           }
         }
         setLikesArr(likes);
        //  console.log('likes array:', likesArr);

       })
       .catch((err) => {
         console.error('Could not GET all likes:', err);
       });
   }
 };

 useEffect(() => {
   getLikes();
 }, [user]);

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

  // console.log('(now likes) above return ==>', likes)
  // console.log('likesArr (now likes) above return ==>', likesArr)

  return (
    <div>
      {true && (
        <div
          className='reel-child'
          style={{ fontSize: theme.typography.fontSize }}
        >
          <>
            <div
              className={
                reel?.User.type === 'personal'
                  ? 'video-container'
                  : 'video-container video-business-container'
              }
            >
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
              <h5 className='video-timestamp'>
                ... {dayjs(`${reel.createdAt}`).fromNow()}
              </h5>
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
              <Box sx={{ width: '100%' }}>
                <BottomNavigation>
                  <BottomNavigationAction
                    className='bottom-nav-parent'
                    label='Likes'
                    showLabel={false}
                    icon={
                      <div className='count-container'>
                        <Likes
                          handleAddLike={handleAddLike}
                          handleRemoveLike={handleRemoveLike}
                          reel={reel}
                          user={user}
                          likes={likes}
                        />
                        {reel.like_count >= 0 && (
                          <p className='like-counter'>
                            {reel.like_count + likeTotal}
                          </p>
                        )}
                      </div>
                    }
                  />
                  <BottomNavigationAction
                    label='Event Location'
                    icon={
                      <Tooltip
                        title='See Event Location'
                        TransitionComponent={Zoom}
                        placement='top'
                        PopperProps={{
                          sx: {
                            '& .MuiTooltip-tooltip': {
                              backgroundColor: '#0b0113',
                              border: 'solid #F5FCFA 1px',
                              color: '#F5FCFA',
                            },
                          },
                        }}
                      >
                        <LocationOnIcon color='primary' />
                      </Tooltip>
                    }
                    showLabel={false}
                  />
                  <BottomNavigationAction
                    className='bottom-nav-parent'
                    label='Going'
                    icon={
                      <React.Fragment>
                        <div className='count-container'>
                          <RsvpSharpIcon
                            style={{ transform: 'scale(2)' }}
                            color='secondary'
                          />
                          {reel.Event.rsvp_count !== 0 && (
                            <p className='rsvp-counter'>
                              {reel.Event.rsvp_count}
                            </p>
                          )}
                        </div>
                      </React.Fragment>
                    }
                    showLabel={false}
                  />
                </BottomNavigation>
              </Box>
            </div>
          </>
        </div>
      )}
    </div>
  );
});

export default ReelItem;
