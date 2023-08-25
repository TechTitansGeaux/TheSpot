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
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { Link } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';


dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

dayjs().format('L LT');

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
  time: string;
  endTime: string;
  geolocation: string;
  twenty_one: boolean;
  private: boolean;
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
  requestFollow: any;
  requestUnfollow: any;
  user: User;
  deleteReel: any;
  disabledNow: any;
  handleAddLike: any;
  handleRemoveLike: any;
  likes: any;
  likeTotal: number;
  followed: number[];
  muted: boolean;
  handleToggleMute: () => void;
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
  requestFollow,
  requestUnfollow,
  user,
  deleteReel,
  disabledNow,
  handleAddLike,
  handleRemoveLike,
  likes,
  likeTotal,
  followed,
  muted,
  handleToggleMute
}) {
  const theme = useTheme();
  // REFERENCE VIDEO HTML element in JSX element // Uses a ref to hold an array of generated refs, and assign them when mapping.
  const myRef = useRef<HTMLVideoElement>(null);
  const [loop, setLoop] = useState(false);
  const [stayDisabled, setStayDisabled] = useState([]);
  const [likesArr, setLikesArr] = useState([]); // user's own reels that have been liked FROM likes table
  // Alert Dialog 'are you sure you want to delete this reel?'
  const [open, setOpen] = React.useState(false);
  // state of whether event is already over
  const [pastEvent, setPastEvent] = useState('');
  console.log(reel, '<---------each reel')
  // event info to display on info icon hover: name, date, time
  const eventName = reel.Event.name;
  const eventDate = dayjs(reel.Event.date + reel.Event.time).format(
    'ddd, MMM D, h:mm A'
  );

  // check if event is over
  const checkEventTime = () => {

    // declare raw event time
    const rawEventTime = reel.Event.date + 'T' + reel.Event.endTime;
    const formattedEventTime = new Date(rawEventTime);
    const timeForComparing = Date.parse(formattedEventTime.toString())

    const nowRaw = new Date();
    const now = Date.parse(nowRaw.toString());

      if (timeForComparing < now) {
        // console.log('event end time has passed')
        setPastEvent('(Event is over!)')
      }
    // }
  }

  // call check event time once on first render
  useEffect(() => {
    checkEventTime();
  }, [])

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
                likes.push(response.data[i].ReelId);
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
  }, []);

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
                  muted={muted}
                  preload='none'
                  onClick={handleToggleMute}
                ></video>
              )}
              <h5 className='video-timestamp'>
                ... {dayjs(`${reel.createdAt}`).fromNow()}
              </h5>
              <p className='video-text'>{reel.text}</p>
              <>
                <Tooltip
                  title={<div>{eventName}<br/>{eventDate}<br/>{pastEvent}</div>}
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
                <InfoIcon aria-label={eventName + eventDate} className='info-icon' />
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
                            {reel?.User.type === 'personal' && (
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
                                  aria-label='Add Friend Button'
                                  sx={{ width: 25, height: 25 }}
                                  onClick={() =>
                                    requestFriendship(reel.User.id)
                                  }
                                />
                              </Tooltip>
                            )}
                            {/**Replaces addFriend button with Follow button reel.User.type is a business*/}
                            {reel?.User.type === 'business' &&
                            !followed.includes(reel.User.id) ?
                              <Tooltip
                                title={`Follow ${reel?.User.displayName}`}
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
                                  aria-label={`Follow ${reel?.User.displayName}`}
                                  sx={{ width: 25, height: 25 }}
                                  onClick={() => requestFollow(reel.User.id)}
                                />
                              </Tooltip>
                            : (
                              (reel?.User.type === 'business' && followed.includes(reel.User.id)) &&
                                <Tooltip
                                  title={`Unfollow ${reel?.User.displayName}`}
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
                                  <ClearOutlinedIcon
                                    aria-label={`Unfollow ${reel?.User.displayName}`}
                                    sx={{ width: 25, height: 25 }}
                                    onClick={() =>
                                      requestUnfollow(reel.User.id)
                                    }
                                  />
                                </Tooltip>

                            )}
                          </Fab>
                        </Box>
                      </div>
                    </ThemeProvider>
                  )}
                {reel.UserId === user.id && (
                  <div className='friend-request'>
                    <div>
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
                          name='Delete Button'
                          aria-label='Delete Button'
                          onClick={handleClickOpen}
                        >
                          🗑️
                        </button>
                      </Tooltip>
                      <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby='alert-dialog-title'
                        aria-describedby='alert-dialog-description'
                      >
                        <DialogTitle id='alert-dialog-title'>
                          {'Delete this reel?'}
                        </DialogTitle>
                        <DialogContent>
                          <DialogContentText id='alert-dialog-description'>
                            Are you sure you want to delete this reel?
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleClose}>No</Button>
                          <Button onClick={() => deleteReel(reel.id)} autoFocus>
                            Yes
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </div>
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
                    aria-label={`Profile Avatar of ${reel.User.displayName}`}
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
                          likesBool={likesArr}
                        />
                        {reel.like_count >= 0 ? (
                          <p className='like-counter'>
                            {reel.like_count + likeTotal}
                          </p>
                        ) : (
                          <p className='like-counter'>{reel.like_count}</p>
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
                        <IconButton
                          sx={{
                            minHeight: '1rem',
                            minWidth: '1rem',
                            }}
                            component={Link}
                            to={'/Map'}
                            state={{reelEvent: reel.Event.geolocation, loggedIn: user}}
                            >
                            <LocationOnIcon
                              name='Event Location Button'
                              aria-label='Event Location Button'
                              color='primary' />
                        </IconButton>
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
                            name='RSVP Button'
                            aria-label='RSVP Button'
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
